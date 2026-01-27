import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateRoomTypeDto, CreateRoomDto, BulkCreateRoomsDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private sql: SqlServerService) { }

  async createRoomType(tenantId: number, firmId: number, branchId: number, dto: CreateRoomTypeDto) {
    const typeCode = `RT${Date.now().toString().slice(-6)}`;

    const result = await this.sql.query(`
      INSERT INTO room_types (
        tenant_id, firm_id, branch_id,
        type_code, type_name, description, 
        max_adults, max_children, max_occupancy, max_extra_beds,
        base_rate_hourly, base_rate_daily, base_rate_weekly, base_rate_monthly,
        extra_bed_rate, extra_person_rate, child_rate,
        size_sqft, bed_type, bed_count, view_type,
        images, is_active, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @firmId, @branchId,
        @typeCode, @typeName, @description, 
        @maxAdults, @maxChildren, @maxOccupancy, @maxExtraBeds,
        @baseRateHourly, @baseRateDaily, @baseRateWeekly, @baseRateMonthly,
        @extraBed_rate, @extraPerson_rate, @childRate,
        @sizeSqft, @bedType, @bedCount, @viewType,
        @images, 1, GETUTCDATE()
      )
    `, {
      tenantId, firmId, branchId: branchId || null,
      typeCode,
      typeName: dto.type_name || dto.name,
      description: dto.description || null,
      maxAdults: dto.max_adults || 2,
      maxChildren: dto.max_children || 0,
      maxOccupancy: dto.max_occupancy,
      maxExtraBeds: dto.max_extra_beds || 0,
      baseRateHourly: dto.base_rate_hourly || null,
      baseRateDaily: dto.base_rate_daily,
      images: dto.images || null,
      baseRateWeekly: dto.base_rate_weekly || null,
      baseRateMonthly: dto.base_rate_monthly || null,
      extraBed_rate: dto.extra_bed_rate || null,
      extraPerson_rate: dto.extra_person_rate || null,
      childRate: dto.child_rate || null,
      sizeSqft: dto.size_sqft || null,
      bedType: dto.bed_type || null,
      bedCount: dto.bed_count || null,
      viewType: dto.view_type || null
    });
    return result[0];
  }

  async getRoomTypes(tenantId: number, firmId?: number) {
    let query = `SELECT * FROM room_types WHERE tenant_id = @tenantId AND is_active = 1`;
    const params: any = { tenantId };

    if (firmId) {
      query += ` AND firm_id = @firmId`;
      params.firmId = firmId;
    }

    query += ` ORDER BY created_at`;
    return this.sql.query(query, params);
  }

  async bulkCreateRooms(tenantId: number, dto: BulkCreateRoomsDto) {
    const rooms: any[] = [];
    for (let i = dto.start_number; i <= dto.end_number; i++) {
      const roomNumber = `${dto.room_number_prefix}${i.toString().padStart(2, '0')}`;
      rooms.push({
        tenant_id: tenantId,
        firm_id: dto.firm_id,
        branch_id: dto.branch_id,
        room_type_id: dto.room_type_id,
        room_number: roomNumber,
        floor_number: dto.floor || 1,
        status: 'available',
        is_active: 1,
        created_at: new Date()
      });
    }

    await this.sql.bulkInsert('rooms', rooms);
    return { created_count: rooms.length, rooms };
  }

  async getRooms(tenantId: number, options: {
    page?: number;
    limit?: number;
    firm_id?: number;
    branch_id?: number;
    status?: string;
    search?: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, rt.type_name as room_type_name, rt.base_rate_hourly, rt.base_rate_daily, f.firm_name, b.branch_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN firms f ON r.firm_id = f.id
      LEFT JOIN branches b ON r.branch_id = b.id
      WHERE r.is_active = 1 AND r.tenant_id = @tenantId
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.is_active = 1 AND r.tenant_id = @tenantId
    `;

    const params: any = { tenantId };

    let filterClause = '';
    if (options.firm_id) {
      filterClause += ' AND r.firm_id = @firmId';
      params.firmId = options.firm_id;
    }
    if (options.branch_id) {
      filterClause += ' AND r.branch_id = @branchId';
      params.branchId = options.branch_id;
    }
    if (options.status) {
      filterClause += ' AND r.status = @status';
      params.status = options.status;
    }
    if (options.search) {
      filterClause += ' AND (r.room_number LIKE @search OR rt.type_name LIKE @search OR r.block_name LIKE @search)';
      params.search = `%${options.search}%`;
    }

    const sortField = options.sortField || 'r.room_number';
    const sortOrder = options.sortOrder || 'ASC';

    const fullQuery = query + filterClause + ` ORDER BY ${sortField} ${sortOrder} OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
    const fullCountQuery = countQuery + filterClause;

    params.offset = offset;
    params.limit = limit;

    const [data, countResult] = await Promise.all([
      this.sql.query(fullQuery, params),
      this.sql.query(fullCountQuery, params)
    ]);

    const total = countResult[0]?.total || 0;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateStatus(roomId: number, status: string) {
    const result = await this.sql.query(`
      UPDATE rooms 
      SET status = @status, updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomId
    `, { roomId, status });
    return result[0];
  }

  async createRoom(tenantId: number, dto: CreateRoomDto) {
    const result = await this.sql.query(`
      INSERT INTO rooms (
        tenant_id, firm_id, branch_id,
        room_type_id, room_number, floor_number, block_name,
        status, condition, is_accessible, notes,
        is_active, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @firmId, @branchId,
        @roomTypeId, @roomNumber, @floorNumber, @blockName,
        @status, @condition, @isAccessible, @notes,
        1, GETUTCDATE()
      )
    `, {
      tenantId,
      firmId: dto.firm_id,
      branchId: dto.branch_id,
      roomTypeId: dto.room_type_id,
      roomNumber: dto.room_number,
      floorNumber: dto.floor_number || 1,
      blockName: dto.block_name || null,
      status: dto.status || 'available',
      condition: dto.condition || 'good',
      isAccessible: dto.is_accessible ? 1 : 0,
      notes: dto.notes || null
    });
    return result[0];
  }

  async updateRoom(roomId: number, dto: any) {
    const result = await this.sql.query(`
      UPDATE rooms
      SET 
        room_type_id = ISNULL(@roomTypeId, room_type_id),
        room_number = ISNULL(@roomNumber, room_number),
        floor_number = ISNULL(@floorNumber, floor_number),
        block_name = ISNULL(@blockName, block_name),
        status = ISNULL(@status, status),
        condition = ISNULL(@condition, condition),
        is_accessible = ISNULL(@isAccessible, is_accessible),
        notes = ISNULL(@notes, notes),
        updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomId
    `, {
      roomId,
      roomTypeId: dto.room_type_id || null,
      roomNumber: dto.room_number || null,
      floorNumber: dto.floor_number || null,
      blockName: dto.block_name || null,
      status: dto.status || null,
      condition: dto.condition || null,
      isAccessible: dto.is_accessible !== undefined ? (dto.is_accessible ? 1 : 0) : null,
      notes: dto.notes || null
    });
    return result[0];
  }

  async updateRoomType(roomTypeId: number, dto: any) {
    const result = await this.sql.query(`
      UPDATE room_types
      SET 
        type_name = ISNULL(@typeName, type_name),
        description = ISNULL(@description, description),
        max_adults = ISNULL(@maxAdults, max_adults),
        max_children = ISNULL(@maxChildren, max_children),
        max_occupancy = ISNULL(@maxOccupancy, max_occupancy),
        max_extra_beds = ISNULL(@maxExtraBeds, max_extra_beds),
        base_rate_hourly = ISNULL(@baseRateHourly, base_rate_hourly),
        base_rate_daily = ISNULL(@baseRateDaily, base_rate_daily),
        base_rate_weekly = ISNULL(@baseRateWeekly, base_rate_weekly),
        base_rate_monthly = ISNULL(@baseRateMonthly, base_rate_monthly),
        extra_bed_rate = ISNULL(@extraBedRate, extra_bed_rate),
        extra_person_rate = ISNULL(@extraPersonRate, extra_person_rate),
        child_rate = ISNULL(@childRate, child_rate),
        size_sqft = ISNULL(@sizeSqft, size_sqft),
        bed_type = ISNULL(@bedType, bed_type),
        bed_count = ISNULL(@bedCount, bed_count),
        view_type = ISNULL(@viewType, view_type),
        images = ISNULL(@images, images),
        updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomTypeId
    `, {
      roomTypeId,
      typeName: dto.type_name || dto.name || null,
      description: dto.description || null,
      maxAdults: dto.max_adults || null,
      maxChildren: dto.max_children || null,
      maxOccupancy: dto.max_occupancy || null,
      maxExtraBeds: dto.max_extra_beds || null,
      baseRateHourly: dto.base_rate_hourly || null,
      baseRateDaily: dto.base_rate_daily || null,
      baseRateWeekly: dto.base_rate_weekly || null,
      baseRateMonthly: dto.base_rate_monthly || null,
      extraBedRate: dto.extra_bed_rate || null,
      extraPersonRate: dto.extra_person_rate || null,
      childRate: dto.child_rate || null,
      sizeSqft: dto.size_sqft || null,
      bedType: dto.bed_type || null,
      bedCount: dto.bed_count || null,
      viewType: dto.view_type || null,
      images: dto.images || null
    });
    return result[0];
  }
}