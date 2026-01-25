import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateRoomTypeDto, BulkCreateRoomsDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private sql: SqlServerService) {}

  async createRoomType(tenantId: number, createRoomTypeDto: CreateRoomTypeDto) {
    const result = await this.sql.query(`
      INSERT INTO room_types (tenant_id, name, description, base_rate_hourly, base_rate_daily, max_occupancy, amenities, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @name, @description, @baseRateHourly, @baseRateDaily, @maxOccupancy, @amenities, GETUTCDATE())
    `, {
      tenantId: tenantId,
      name: createRoomTypeDto.name,
      description: createRoomTypeDto.description,
      baseRateHourly: createRoomTypeDto.base_rate_hourly,
      baseRateDaily: createRoomTypeDto.base_rate_daily,
      maxOccupancy: createRoomTypeDto.max_occupancy,
      amenities: JSON.stringify(createRoomTypeDto.amenities || [])
    });
    return result[0];
  }

  async getRoomTypes(tenantId: number) {
    return this.sql.query(`
      SELECT * FROM room_types WHERE tenant_id = @tenantId ORDER BY created_at
    `, { tenantId: tenantId });
  }

  async bulkCreateRooms(tenantId: number, bulkCreateDto: BulkCreateRoomsDto) {
    const rooms: any[] = [];
    for (let i = bulkCreateDto.start_number; i <= bulkCreateDto.end_number; i++) {
      const roomNumber = `${bulkCreateDto.room_number_prefix}${i.toString().padStart(2, '0')}`;
      rooms.push({
        tenant_id: tenantId,
        hotel_id: bulkCreateDto.hotel_id,
        room_type_id: bulkCreateDto.room_type_id,
        room_number: roomNumber,
        floor: bulkCreateDto.floor || Math.floor(i / 100).toString(),
        status: 'available'
      });
    }

    await this.sql.bulkInsert('rooms', rooms);
    return { created_count: rooms.length, rooms };
  }

  async getRooms(tenantId: number, hotelId?: number, status?: string) {
    let query = `
      SELECT r.*, rt.name as room_type_name, rt.base_rate_hourly, rt.base_rate_daily
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.tenant_id = @tenantId
    `;
    const params: any = { tenantId: tenantId };

    if (hotelId) {
      query += ' AND r.hotel_id = @hotelId';
      params.hotelId = hotelId;
    }
    if (status) {
      query += ' AND r.status = @status';
      params.status = status;
    }

    query += ' ORDER BY r.room_number';
    return this.sql.query(query, params);
  }

  async updateRoomStatus(tenantId: number, roomId: number, status: string) {
    const result = await this.sql.query(`
      UPDATE rooms 
      SET status = @status, updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomId AND tenant_id = @tenantId
    `, { roomId: roomId, tenantId: tenantId, status });
    return result[0];
  }
}