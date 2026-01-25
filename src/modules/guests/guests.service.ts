// lib/services/guests.service.ts
import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@Injectable()
export class GuestsService {
  constructor(private sql: SqlServerService) { }

  async create(tenantId: number, firmId: number, branchId: number, createGuestDto: CreateGuestDto) {
    // Generate guest code
    const guestCode = `G${Date.now().toString().slice(-8)}`;

    // Check if guest exists
    const existing = await this.sql.query(`
      SELECT id FROM guests 
      WHERE tenant_id = @tenantId AND (email = @email OR id_proof_number = @idProofNumber)
    `, {
      tenantId,
      email: createGuestDto.email,
      idProofNumber: createGuestDto.id_number
    });

    // Fallback: If firmId/branchId are missing, fetch defaults from Tenant
    let finalFirmId = firmId;
    let finalBranchId = branchId;

    if (!finalFirmId || !finalBranchId) {
      const defaults = await this.sql.query(`
        SELECT TOP 1 f.id as firm_id, b.id as branch_id
        FROM firms f
        LEFT JOIN branches b ON b.firm_id = f.id
        WHERE f.tenant_id = @tenantId AND f.is_active = 1
        ORDER BY f.created_at ASC
      `, { tenantId });

      if (defaults.length > 0) {
        finalFirmId = finalFirmId || defaults[0].firm_id;
        finalBranchId = finalBranchId || defaults[0].branch_id;
      }
    }

    const result = await this.sql.query(`
      INSERT INTO guests (tenant_id, firm_id, branch_id, guest_code, first_name, last_name, email, phone, id_proof_type, id_proof_number, date_of_birth, nationality, notes, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @firmId, @branchId, @guestCode, @firstName, @lastName, @email, @phone, @idProofType, @idProofNumber, @dateOfBirth, @nationality, @notes, GETUTCDATE())
    `, {
      tenantId,
      firmId: finalFirmId || null,
      branchId: finalBranchId || null,
      guestCode,
      firstName: createGuestDto.first_name,
      lastName: createGuestDto.last_name,
      email: createGuestDto.email,
      phone: createGuestDto.phone,
      idProofType: createGuestDto.id_type,
      idProofNumber: createGuestDto.id_number,
      dateOfBirth: createGuestDto.date_of_birth || null,
      nationality: createGuestDto.nationality || null,
      notes: createGuestDto.address || null
    });

    return result[0];
  }

  async findByEmail(tenantId: number, email: string) {
    return this.sql.query(`
      SELECT * FROM guests WHERE tenant_id = @tenantId AND email = @email
    `, { tenantId, email });
  }

  async getGuestHistory(tenantId: number, guestId: number) {
    return this.sql.query(`
      SELECT b.*, h.hotel_name, rt.type_name as room_type_name, r.room_number
      FROM bookings b
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id  
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.tenant_id = @tenantId AND b.guest_id = @guestId
      ORDER BY b.check_in DESC
    `, { tenantId, guestId });
  }

  async list(tenantId: number, options: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM guests WHERE tenant_id = @tenantId`;
    const countQuery = `SELECT COUNT(*) as total FROM guests WHERE tenant_id = @tenantId`;
    const params: any = { tenantId };

    let filterClause = '';
    if (options.search) {
      filterClause += ` AND (
        first_name LIKE @search OR 
        last_name LIKE @search OR 
        email LIKE @search OR 
        phone LIKE @search OR
        guest_code LIKE @search
      )`;
      params.search = `%${options.search}%`;
    }

    const fullQuery = query + filterClause + ` ORDER BY created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
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

  async update(tenantId: number, guestId: number, updateGuestDto: Partial<CreateGuestDto>) {
    const result = await this.sql.query(`
      UPDATE guests
      SET 
        first_name = @firstName,
        last_name = @lastName,
        email = @email,
        phone = @phone,
        id_proof_type = @idProofType,
        id_proof_number = @idProofNumber,
        date_of_birth = @dateOfBirth,
        nationality = @nationality,
        notes = @notes,
        updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @guestId AND tenant_id = @tenantId
    `, {
      guestId,
      tenantId,
      firstName: updateGuestDto.first_name,
      lastName: updateGuestDto.last_name,
      email: updateGuestDto.email,
      phone: updateGuestDto.phone,
      idProofType: updateGuestDto.id_type,
      idProofNumber: updateGuestDto.id_number,
      dateOfBirth: updateGuestDto.date_of_birth,
      nationality: updateGuestDto.nationality,
      notes: updateGuestDto.address
    });
    return result[0];
  }
}