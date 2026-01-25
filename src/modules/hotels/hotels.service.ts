import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private sql: SqlServerService) { }

  async create(tenantId: number, createHotelDto: CreateHotelDto) {
    // Generate hotel code
    const hotelCode = `H${Date.now().toString().slice(-8)}`;

    const result = await this.sql.query(`
      INSERT INTO hotels (tenant_id, hotel_code, hotel_name, address, city, state, country, postal_code, phone, email, website, status, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @hotelCode, @hotelName, @address, @city, @state, @country, @postalCode, @phone, @email, @website, 'active', GETUTCDATE())
    `, {
      tenantId,
      hotelCode,
      hotelName: createHotelDto.name,
      address: createHotelDto.address,
      city: createHotelDto.city,
      state: createHotelDto.state || '',
      country: createHotelDto.country || 'India',
      postalCode: createHotelDto.zip_code || '',
      phone: createHotelDto.phone,
      email: createHotelDto.email,
      website: createHotelDto.website || ''
    });
    return result[0];
  }

  async findAll(tenantId: number) {
    return this.sql.query(`
      SELECT h.*, 
        (SELECT COUNT(*) FROM hotels WHERE parent_hotel_id = h.id) as branch_count,
        CASE WHEN h.parent_hotel_id IS NULL THEN 1 ELSE 0 END as is_headquarters
      FROM hotels h
      WHERE h.tenant_id = @tenantId 
      ORDER BY h.created_at DESC
    `, { tenantId });
  }

  async findBranches(tenantId: number, hotelId: number) {
    return this.sql.query(`
      SELECT * FROM hotels 
      WHERE tenant_id = @tenantId AND parent_hotel_id = @hotelId
      ORDER BY hotel_name
    `, { tenantId, hotelId });
  }

  async update(tenantId: number, hotelId: number, updateData: Partial<CreateHotelDto>) {
    const result = await this.sql.query(`
      UPDATE hotels
      SET hotel_name = @hotelName,
          address = @address,
          city = @city,
          phone = @phone,
          email = @email,
          updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @hotelId AND tenant_id = @tenantId
    `, {
      hotelId,
      tenantId,
      hotelName: updateData.name,
      address: updateData.address,
      city: updateData.city,
      phone: updateData.phone,
      email: updateData.email
    });
    return result[0];
  }
}