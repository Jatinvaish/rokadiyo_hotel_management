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
      VALUES (@tenant_id, @name, @address, @city, @phone, @email, @parent_hotel_id, @is_headquarters, GETUTCDATE())
    `, {
      tenant_id: tenantId,
      ...createHotelDto,
      is_headquarters: createHotelDto.is_headquarters || false
    });
    return result[0];
  }

  async findAll(tenantId: number) {
    return this.sql.query(`
      SELECT h.*, 
        (SELECT COUNT(*) FROM hotels WHERE parent_hotel_id = h.id) as branch_count
      FROM hotels h 
      WHERE h.tenant_id = @tenant_id 
      ORDER BY h.is_headquarters DESC, h.created_at
    `, { tenant_id: tenantId });
  }

  async findBranches(tenantId: number, parentHotelId: number) {
    return this.sql.query(`
      SELECT * FROM hotels 
      WHERE tenant_id = @tenant_id AND parent_hotel_id = @parent_hotel_id
      ORDER BY created_at
    `, { tenant_id: tenantId, parent_hotel_id: parentHotelId });
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
      WHERE id = @hotel_id AND tenant_id = @tenant_id
    `, { hotel_id: hotelId, tenant_id: tenantId, ...updateData });
    return result[0];
  }
}