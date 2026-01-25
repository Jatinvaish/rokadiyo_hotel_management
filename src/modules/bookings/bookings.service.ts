import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CheckAvailabilityDto, CreateBookingDto, RecordPaymentDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private sql: SqlServerService) { }

  async checkAvailability(tenantId: number, checkAvailabilityDto: CheckAvailabilityDto) {
    let query = `
      SELECT r.id, r.room_number, r.hotel_id, h.hotel_name, rt.type_name as room_type_name
      FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.room_type_id = @roomTypeId
        AND r.status = 'available'
        AND r.id NOT IN (
          SELECT room_id FROM bookings 
          WHERE status IN ('confirmed', 'checked_in')
            AND NOT (check_out <= @checkIn OR check_in >= @checkOut)
        )
    `;

    const params: any = {
      roomTypeId: checkAvailabilityDto.room_type_id,
      checkIn: checkAvailabilityDto.check_in,
      checkOut: checkAvailabilityDto.check_out
    };

    if (checkAvailabilityDto.hotel_ids?.length) {
      const hotelIds = checkAvailabilityDto.hotel_ids.join(',');
      query += ` AND r.hotel_id IN (${hotelIds})`;
    }

    query += ' ORDER BY h.hotel_name, r.room_number';
    return this.sql.query(query, params);
  }

  async create(tenantId: number, createBookingDto: any) {
    // Generate booking code
    const bookingCode = `B${Date.now().toString().slice(-8)}`;

    // If guest info provided, create guest first
    let guestId = createBookingDto.guest_id;
    if (!guestId && createBookingDto.guest) {
      const guestCode = `G${Date.now().toString().slice(-6)}`;
      const guestResult = await this.sql.query(`
        INSERT INTO guests (tenant_id, guest_code, first_name, last_name, email, phone, id_proof_type, id_proof_number, created_at)
        OUTPUT INSERTED.*
        VALUES (@tenantId, @guestCode, @firstName, @lastName, @email, @phone, @idProofType, @idProofNumber, GETUTCDATE())
      `, {
        tenantId,
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

    const result = await this.sql.query(`
      INSERT INTO bookings (
        tenant_id, booking_code, guest_id, hotel_id, room_id,
        check_in, check_out, total_hours, total_nights,
        adults, children, room_charges, total_amount,
        booking_type, booking_status, special_requests, created_at
      )
      OUTPUT INSERTED.*
      VALUES (
        @tenantId, @bookingCode, @guestId, @hotelId, @roomId,
        @checkIn, @checkOut, @totalHours, @totalNights,
        @adults, @children, @roomCharges, @totalAmount,
        @bookingType, 'confirmed', @specialRequests, GETUTCDATE()
      )
    `, {
      tenantId,
      bookingCode,
      guestId,
      hotelId: createBookingDto.hotel_id,
      roomId: createBookingDto.room_id,
      checkIn: createBookingDto.check_in,
      checkOut: createBookingDto.check_out,
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

  async findAll(tenantId: number, hotelId?: number, status?: string) {
    let query = `
      SELECT b.*, g.first_name, g.last_name, g.email, g.phone,
             h.hotel_name, r.room_number, rt.type_name as room_type_name
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.tenant_id = @tenantId
    `;

    const params: any = { tenantId };

    if (hotelId) {
      query += ' AND b.hotel_id = @hotelId';
      params.hotelId = hotelId;
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
      WHERE id = @bookingId AND tenant_id = @tenantId
    `, { bookingId: booking_id, amount, tenantId });

    return { success: true, message: 'Payment recorded' };
  }
}