import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';

@Injectable()
export class FirmsService {
  constructor(private sql: SqlServerService) { }

  async create(tenantId: number, data: any) {
    const firmCode = `F${Date.now().toString().slice(-8)}`;

    const result = await this.sql.query(`
      INSERT INTO firms (
        tenant_id, firm_code, firm_name, address, city, state, country, 
        postal_code, phone, email, website, is_active, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @firmCode, @firmName, @address, @city, @state, @country, 
        @postalCode, @phone, @email, @website, 1, GETUTCDATE()
      )
    `, {
      tenantId,
      firmCode,
      firmName: data.name,
      address: data.address,
      city: data.city,
      state: data.state || '',
      country: data.country || 'India',
      postalCode: data.zip_code || '',
      phone: data.phone,
      email: data.email,
      website: data.website || ''
    });

    // Auto-create a default branch for this firm
    const firmId = result[0].id;
    const branchCode = `B${Date.now().toString().slice(-8)}`;
    await this.sql.query(`
      INSERT INTO branches (
        firm_id, branch_code, branch_name, address, city, state, is_active, created_at
      )
      VALUES (
        @firmId, @branchCode, @branchName, @address, @city, @state, 1, GETUTCDATE()
      )
    `, {
      firmId,
      branchCode,
      branchName: 'Main Branch',
      address: data.address,
      city: data.city,
      state: data.state || ''
    });

    return result[0];
  }

  async findAll(tenantId: number) {
    return this.sql.query(`
      SELECT f.*, 
        (SELECT COUNT(*) FROM branches WHERE firm_id = f.id) as branch_count
      FROM firms f
      WHERE f.tenant_id = @tenantId 
      ORDER BY f.created_at DESC
    `, { tenantId });
  }

  async findBranches(firmId: number) {
    return this.sql.query(`
      SELECT * FROM branches 
      WHERE firm_id = @firmId
      ORDER BY branch_name
    `, { firmId });
  }

  async update(tenantId: number, firmId: number, data: any) {
    const result = await this.sql.query(`
      UPDATE firms
      SET firm_name = @firmName,
          address = @address,
          city = @city,
          phone = @phone,
          email = @email,
          updated_at = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @firmId AND tenant_id = @tenantId
    `, {
      firmId,
      tenantId,
      firmName: data.name,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email
    });
    return result[0];
  }
}
