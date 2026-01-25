// lib/services/rooms.service.ts
import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateRoomTypeDto, BulkCreateRoomsDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private sql: SqlServerService) { }

  async createRoomType(tenantId: number, firmId: number, branchId: number, createRoomTypeDto: CreateRoomTypeDto) {
    // Fallback if firm/branch missing
    if (!firmId || !branchId) {
      const defaults = await this.sql.query(`
        SELECT TOP 1 f.id as firm_id, b.id as branch_id
        FROM firms f
        LEFT JOIN branches b ON b.firm_id = f.id
        WHERE f.tenant_id = @tenantId AND f.is_active = 1
        ORDER BY f.created_at ASC
      `, { tenantId });

      if (defaults.length > 0) {
        firmId = firmId || defaults[0].firm_id;
        branchId = branchId || defaults[0].branch_id;
      }
    }

    const typeCode = `RT${Date.now().toString().slice(-6)}`;

    const result = await this.sql.query(`
      INSERT INTO room_types (
        tenant_id, firm_id, branch_id,
        type_code, type_name, description, 
        base_rate_hourly, base_rate_daily, max_occupancy, 
        max_adults, max_children, is_active, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @firmId, @branchId,
        @typeCode, @typeName, @description, 
        @baseRateHourly, @baseRateDaily, @maxOccupancy, 
        @maxAdults, @maxChildren, 1, GETUTCDATE()
      )
    `, {
      tenantId, firmId, branchId,
      typeCode,
      typeName: createRoomTypeDto.name,
      description: createRoomTypeDto.description,
      baseRateHourly: createRoomTypeDto.base_rate_hourly,
      baseRateDaily: createRoomTypeDto.base_rate_daily,
      maxOccupancy: createRoomTypeDto.max_occupancy,
      maxAdults: createRoomTypeDto.max_occupancy - 1,
      maxChildren: 2
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

  async bulkCreateRooms(tenantId: number, firmId: number, branchId: number, bulkCreateDto: BulkCreateRoomsDto) {
    // Fallback logic
    if (!firmId || !branchId) {
      const defaults = await this.sql.query(`
        SELECT TOP 1 f.id as firm_id, b.id as branch_id
        FROM firms f
        LEFT JOIN branches b ON b.firm_id = f.id
        WHERE f.tenant_id = @tenantId AND f.is_active = 1
        ORDER BY f.created_at ASC
      `, { tenantId });

      if (defaults.length > 0) {
        firmId = firmId || defaults[0].firm_id;
        branchId = branchId || defaults[0].branch_id;
      }
    }

    const rooms: any[] = [];
    for (let i = bulkCreateDto.start_number; i <= bulkCreateDto.end_number; i++) {
      const roomNumber = `${bulkCreateDto.room_number_prefix}${i.toString().padStart(2, '0')}`;
      rooms.push({
        tenant_id: tenantId,
        firm_id: firmId,
        branch_id: branchId,
        room_type_id: bulkCreateDto.room_type_id,
        room_number: roomNumber,
        floor_number: bulkCreateDto.floor ? parseInt(bulkCreateDto.floor) : Math.floor(i / 100),
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
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, rt.type_name as room_type_name, rt.base_rate_hourly, rt.base_rate_daily, f.firm_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN firms f ON r.firm_id = f.id
      WHERE r.is_active = 1 AND r.tenant_id = @tenantId
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM rooms r
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
      filterClause += ' AND (r.room_number LIKE @search OR rt.type_name LIKE @search)';
      params.search = `%${options.search}%`;
    }

    const fullQuery = query + filterClause + ` ORDER BY r.room_number OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
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

  async createRoom(tenantId: number, firmId: number, branchId: number, createRoomDto: any) {
    // Fallback if firm/branch missing
    if (!firmId || !branchId) {
      const defaults = await this.sql.query(`
        SELECT TOP 1 f.id as firm_id, b.id as branch_id
        FROM firms f
        LEFT JOIN branches b ON b.firm_id = f.id
        WHERE f.tenant_id = @tenantId AND f.is_active = 1
        ORDER BY f.created_at ASC
      `, { tenantId });

      if (defaults.length > 0) {
        firmId = firmId || defaults[0].firm_id;
        branchId = branchId || defaults[0].branch_id;
      }
    }

    const result = await this.sql.query(`
      INSERT INTO rooms (
        tenant_id, firm_id, branch_id,
        room_type_id, room_number, floor_number, status, notes, is_active, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @firmId, @branchId,
        @roomTypeId, @roomNumber, @floorNumber, @status, @notes, 1, GETUTCDATE()
      )
    `, {
      tenantId, firmId, branchId,
      roomTypeId: createRoomDto.room_type_id,
      roomNumber: createRoomDto.room_number,
      floorNumber: createRoomDto.floor || 1,
      status: createRoomDto.status || 'available',
      notes: createRoomDto.description || null
    });
    return result[0];
  }

  async updateRoom(roomId: number, updateRoomDto: any) {
    const result = await this.sql.query(`
      UPDATE rooms
      SET 
        room_type_id = @roomTypeId,
        room_number = @roomNumber,
        floor_number = @floorNumber,
        status = @status,
        notes = @notes,
        updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomId
    `, {
      roomId,
      roomTypeId: updateRoomDto.room_type_id,
      roomNumber: updateRoomDto.room_number,
      floorNumber: updateRoomDto.floor,
      status: updateRoomDto.status,
      notes: updateRoomDto.description
    });
    return result[0];
  }

  async updateRoomType(roomTypeId: number, updateRoomTypeDto: CreateRoomTypeDto) {
    const result = await this.sql.query(`
      UPDATE room_types
      SET 
        type_name = @typeName,
        description = @description,
        base_rate_hourly = @baseRateHourly,
        base_rate_daily = @baseRateDaily,
        max_occupancy = @maxOccupancy,
        max_adults = @maxAdults,
        updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomTypeId
    `, {
      roomTypeId,
      typeName: updateRoomTypeDto.name,
      description: updateRoomTypeDto.description,
      baseRateHourly: updateRoomTypeDto.base_rate_hourly,
      baseRateDaily: updateRoomTypeDto.base_rate_daily,
      maxOccupancy: updateRoomTypeDto.max_occupancy,
      maxAdults: updateRoomTypeDto.max_occupancy - 1
    });
    return result[0];
  }
}