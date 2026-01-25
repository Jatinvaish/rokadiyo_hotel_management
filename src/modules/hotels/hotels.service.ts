import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private sql: SqlServerService) {}

  async create(tenantId: number, createHotelDto: CreateHotelDto) {
    const result = await this.sql.query(`
      INSERT INTO hotels (tenant_id, name, address, city, phone, email, parent_hotel_id, is_headquarters, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @name, @address, @city, @phone, @email, @parentHotelId, @isHeadquarters, GETUTCDATE())
    `, {
      tenantId: tenantId,
      name: createHotelDto.name,
      address: createHotelDto.address,
      city: createHotelDto.city,
      phone: createHotelDto.phone,
      email: createHotelDto.email,
      parentHotelId: createHotelDto.parent_hotel_id || null,
      isHeadquarters: createHotelDto.is_headquarters || false
    });
    return result[0];
  }

  async findAll(tenantId: number) {
    return this.sql.query(`
      SELECT h.*, 
        (SELECT COUNT(*) FROM hotels WHERE parent_hotel_id = h.id) as branch_count
      FROM hotels h 
      WHERE h.tenant_id = @tenantId 
      ORDER BY h.is_headquarters DESC, h.created_at
    `, { tenantId: tenantId });
  }

  async findBranches(tenantId: number, parentHotelId: number) {
    return this.sql.query(`
      SELECT * FROM hotels 
      WHERE tenant_id = @tenantId AND parent_hotel_id = @parentHotelId
      ORDER BY created_at
    `, { tenantId: tenantId, parentHotelId: parentHotelId });
  }

  async update(tenantId: number, hotelId: number, updateData: Partial<CreateHotelDto>) {
    const result = await this.sql.query(`
      UPDATE hotels 
      SET name = COALESCE(@name, name),
          address = COALESCE(@address, address),
          city = COALESCE(@city, city),
          phone = COALESCE(@phone, phone),
          email = COALESCE(@email, email),
          updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @hotelId AND tenant_id = @tenantId
    `, { hotelId: hotelId, tenantId: tenantId, name: updateData.name, address: updateData.address, city: updateData.city, phone: updateData.phone, email: updateData.email });
    return result[0];
  }
}