import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@Injectable()
export class GuestsService {
  constructor(private sql: SqlServerService) {}

  async create(tenantId: number, createGuestDto: CreateGuestDto) {
    // Check if guest exists by email or ID number
    const existing = await this.sql.query(`
      SELECT id FROM guests 
      WHERE tenant_id = @tenant_id AND (email = @email OR id_number = @id_number)
    `, { 
      tenant_id: tenantId, 
      email: createGuestDto.email, 
      id_number: createGuestDto.id_number 
    });

    if (existing.length > 0) {
      return { guest_id: existing[0].id, message: 'Guest already exists' };
    }

    const result = await this.sql.query(`
      INSERT INTO guests (tenant_id, first_name, last_name, email, phone, id_type, id_number, id_document_url, date_of_birth, nationality, address, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenant_id, @first_name, @last_name, @email, @phone, @id_type, @id_number, @id_document_url, @date_of_birth, @nationality, @address, GETUTCDATE())
    `, {
      tenant_id: tenantId,
      ...createGuestDto
    });

    return result[0];
  }

  async findByEmail(tenantId: number, email: string) {
    return this.sql.query(`
      SELECT * FROM guests WHERE tenant_id = @tenant_id AND email = @email
    `, { tenant_id: tenantId, email });
  }

  async getGuestHistory(tenantId: number, guestId: number) {
    return this.sql.query(`
      SELECT b.*, h.name as hotel_name, rt.name as room_type_name, r.room_number
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.tenant_id = @tenant_id AND b.guest_id = @guest_id
      ORDER BY b.check_in_date DESC
    `, { tenant_id: tenantId, guest_id: guestId });
  }
}