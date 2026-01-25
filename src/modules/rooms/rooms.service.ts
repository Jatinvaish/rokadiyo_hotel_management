// lib/services/rooms.service.ts
import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateRoomTypeDto, BulkCreateRoomsDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private sql: SqlServerService) { }

  async createRoomType(hotelId: number, createRoomTypeDto: CreateRoomTypeDto) {
    const typeCode = `RT${Date.now().toString().slice(-6)}`;

    const result = await this.sql.query(`
      INSERT INTO room_types (hotel_id, type_code, type_name, description, base_rate_hourly, base_rate_daily, max_occupancy, max_adults, max_children, is_active, created_at)
      OUTPUT INSERTED.*
      VALUES (@hotelId, @typeCode, @typeName, @description, @baseRateHourly, @baseRateDaily, @maxOccupancy, @maxAdults, @maxChildren, 1, GETUTCDATE())
    `, {
      hotelId,
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

  async getRoomTypes(hotelId: number) {
    return this.sql.query(`
      SELECT * FROM room_types WHERE hotel_id = @hotelId AND is_active = 1 ORDER BY created_at
    `, { hotelId });
  }

  async bulkCreateRooms(tenantId: number, bulkCreateDto: BulkCreateRoomsDto) {
    const rooms: any[] = [];
    for (let i = bulkCreateDto.start_number; i <= bulkCreateDto.end_number; i++) {
      const roomNumber = `${bulkCreateDto.room_number_prefix}${i.toString().padStart(2, '0')}`;
      rooms.push({
        hotel_id: bulkCreateDto.hotel_id,
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

  async getRooms(hotelId?: number, status?: string) {
    let query = `
      SELECT r.*, rt.type_name as room_type_name, rt.base_rate_hourly, rt.base_rate_daily, h.hotel_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      WHERE r.is_active = 1
    `;
    const params: any = {};

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

  async updateStatus(roomId: number, status: string) {
    const result = await this.sql.query(`
      UPDATE rooms 
      SET status = @status, updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @roomId
    `, { roomId, status });
    return result[0];
  }

  async createRoom(createRoomDto: any) {
    const result = await this.sql.query(`
      INSERT INTO rooms (hotel_id, room_type_id, room_number, floor_number, status, notes, is_active, created_at)
      OUTPUT INSERTED.*
      VALUES (@hotelId, @roomTypeId, @roomNumber, @floorNumber, @status, @notes, 1, GETUTCDATE())
    `, {
      hotelId: createRoomDto.hotel_id,
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
        hotel_id = @hotelId,
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
      hotelId: updateRoomDto.hotel_id,
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