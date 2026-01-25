// lib/services/bookings.service.ts
import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CheckAvailabilityDto, CreateBookingDto, RecordPaymentDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private sql: SqlServerService) { }

  async checkAvailability(tenantId: number, checkAvailabilityDto: CheckAvailabilityDto) {
    let query = `
      SELECT r.id, r.room_number, f.firm_name, rt.type_name as room_type_name
      FROM rooms r
      JOIN firms f ON r.firm_id = f.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.room_type_id = @roomTypeId
        AND f.tenant_id = @tenantId
        AND r.status = 'available'
        AND r.id NOT IN (
          SELECT assigned_to FROM bookings 
          WHERE status IN ('confirmed', 'checked_in')
            AND assigned_to IS NOT NULL
            AND NOT (check_out <= @checkIn OR check_in >= @checkOut)
        )
    `;

    const params: any = {
      tenantId,
      roomTypeId: checkAvailabilityDto.room_type_id,
      checkIn: checkAvailabilityDto.check_in,
      checkOut: checkAvailabilityDto.check_out
    };

    // Use hotel_ids as firm_ids for backward compatibility if needed, or ignore
    if (checkAvailabilityDto.hotel_ids?.length) {
      const firmIds = checkAvailabilityDto.hotel_ids.join(',');
      query += ` AND r.firm_id IN (${firmIds})`;
    }

    query += ' ORDER BY f.firm_name, r.room_number';
    return this.sql.query(query, params);
  }

  async create(tenantId: number, firmId: number, branchId: number, createBookingDto: any) {
    // Fallback if firm/branch missing
    if (!firmId || !branchId) {
      const defaults = await this.sql.query(`
         SELECT TOP 1 f.id as firm_id, b.id as branch_id
         FROM firms f
         LEFT JOIN branches b ON b.firm_id = f.id
         WHERE f.tenant_id = @tenantId AND f.is_active = 1
         ORDER BY f.created_at ASC
       `, { tenantId });

      if (defaults.length) {
        firmId = firmId || defaults[0].firm_id;
        branchId = branchId || defaults[0].branch_id;
      }
    }

    // Generate booking code
    const bookingCode = `B${Date.now().toString().slice(-8)}`;

    // If guest info provided, create guest first
    let guestId = createBookingDto.guest_id;
    if (!guestId && createBookingDto.guest) {
      const guestCode = `G${Date.now().toString().slice(-6)}`;
      const guestResult = await this.sql.query(`
        INSERT INTO guests (tenant_id, firm_id, branch_id, guest_code, first_name, last_name, email, phone, id_proof_type, id_proof_number, created_at)
        OUTPUT INSERTED.*
        VALUES (@tenantId, @firmId, @branchId, @guestCode, @firstName, @lastName, @email, @phone, @idProofType, @idProofNumber, GETUTCDATE())
      `, {
        tenantId,
        firmId: firmId || null,
        branchId: branchId || null,
        guestCode,
        firstName: createBookingDto.guest.first_name,
        lastName: createBookingDto.guest.last_name,
        email: createBookingDto.guest.email,
        phone: createBookingDto.guest.phone,
        idProofType: createBookingDto.guest.id_type || 'passport',
        idProofNumber: createBookingDto.guest.id_number || 'N/A'
      });
      guestId = guestResult[0].id;
    }

    // Handle alias dates
    const checkInRaw = createBookingDto.check_in || createBookingDto.check_in_date;
    const checkOutRaw = createBookingDto.check_out || createBookingDto.check_out_date;

    const checkIn = new Date(checkInRaw);
    const checkOut = new Date(checkOutRaw);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new Error('Invalid check-in or check-out date format');
    }

    if (!firmId) {
      throw new Error('No active firm found for this tenant. Please create a firm first (e.g. via onboarding or settings).');
    }

    console.log('--- Debug Booking Insert ---');
    console.log('Tenant:', tenantId);
    console.log('Firm:', firmId, 'Branch:', branchId);
    console.log('CheckIn (Obj):', checkIn);
    console.log('CheckOut (Obj):', checkOut);

    const result = await this.sql.query(`
      INSERT INTO bookings (
        tenant_id, firm_id, branch_id,
        booking_code, guest_id, assigned_to,
        check_in, check_out, total_hours, total_nights,
        adults, children, room_charges, total_amount,
        booking_type, booking_status, special_requests, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @firmId, @branchId,
        @bookingCode, @guestId, @roomId,
        @checkIn, @checkOut, @totalHours, @totalNights,
        @adults, @children, @roomCharges, @totalAmount,
        @bookingType, 'confirmed', @specialRequests, GETUTCDATE()
      )
    `, {
      tenantId,
      firmId: firmId || null,
      branchId: branchId || null,
      bookingCode,
      guestId,
      roomId: createBookingDto.room_id, // Mapping room_id to assigned_to
      checkIn: checkIn,
      checkOut: checkOut,
      totalHours: createBookingDto.total_hours,
      totalNights: createBookingDto.total_nights,
      adults: createBookingDto.adults,
      children: createBookingDto.children || 0,
      roomCharges: createBookingDto.total_amount || 0,
      totalAmount: createBookingDto.total_amount || 0,
      bookingType: createBookingDto.booking_type,
      specialRequests: createBookingDto.special_requests
    });

    // Update room status
    if (createBookingDto.booking_type !== 'advance') {
      await this.sql.query(`
        UPDATE rooms SET status = 'occupied', updated_at = GETUTCDATE()
        WHERE id = @roomId
      `, { roomId: createBookingDto.room_id });
    } else {
      await this.sql.query(`
        UPDATE rooms SET status = 'advance', updated_at = GETUTCDATE()
        WHERE id = @roomId
      `, { roomId: createBookingDto.room_id });
    }

    return result[0];
  }

  async findAll(tenantId: number, firmId?: number, status?: string) {
    let query = `
      SELECT b.*, g.first_name, g.last_name, g.email, g.phone,
             f.firm_name, r.room_number, rt.type_name as room_type_name
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      LEFT JOIN firms f ON b.firm_id = f.id
      LEFT JOIN rooms r ON b.assigned_to = r.id 
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.tenant_id = @tenantId
    `;

    const params: any = { tenantId };

    if (firmId) {
      query += ' AND b.firm_id = @firmId';
      params.firmId = firmId;
    }
    if (status) {
      query += ' AND b.booking_status = @status';
      params.status = status;
    }

    query += ' ORDER BY b.check_in DESC';
    return this.sql.query(query, params);
  }

  async recordPayment(tenantId: number, recordPaymentDto: RecordPaymentDto) {
    const { booking_id, amount, payment_method, reference_number } = recordPaymentDto;

    // Verify booking
    const bookingCheck = await this.sql.query(`
      SELECT b.id FROM bookings b
      WHERE b.id = @bookingId AND b.tenant_id = @tenantId
    `, { bookingId: booking_id, tenantId });

    if (!bookingCheck.length) {
      throw new Error('Invalid booking or unauthorized access');
    }

    // Update booking
    await this.sql.query(`
      UPDATE bookings
      SET paid_amount = COALESCE(paid_amount, 0) + @amount,
          payment_status = CASE 
            WHEN COALESCE(paid_amount, 0) + @amount >= total_amount THEN 'paid'
            WHEN COALESCE(paid_amount, 0) + @amount > 0 THEN 'partial'
            ELSE 'pending'
          END,
          updated_at = GETUTCDATE()
      WHERE id = @bookingId
    `, { bookingId: booking_id, amount });

    return { success: true, message: 'Payment recorded' };
  }
}