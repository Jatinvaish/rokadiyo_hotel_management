import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CheckAvailabilityDto, CreateBookingDto, RecordPaymentDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private sql: SqlServerService) {}

  async checkAvailability(tenantId: number, checkAvailabilityDto: CheckAvailabilityDto) {
    let query = `
      SELECT r.id, r.room_number, r.hotel_id, h.name as hotel_name, rt.name as room_type_name
      FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.tenant_id = @tenantId 
        AND r.room_type_id = @roomTypeId
        AND r.status = 'available'
        AND r.id NOT IN (
          SELECT room_id FROM bookings 
          WHERE tenant_id = @tenantId 
            AND status IN ('confirmed', 'checked_in')
            AND NOT (check_out_date <= @checkIn OR check_in_date >= @checkOut)
        )
    `;

    const params: any = {
      tenantId: tenantId,
      roomTypeId: checkAvailabilityDto.room_type_id,
      checkIn: checkAvailabilityDto.check_in,
      checkOut: checkAvailabilityDto.check_out
    };

    if (checkAvailabilityDto.hotel_ids?.length) {
      const hotelIds = checkAvailabilityDto.hotel_ids.join(',');
      query += ` AND r.hotel_id IN (${hotelIds})`;
    }

    query += ' ORDER BY h.name, r.room_number';
    return this.sql.query(query, params);
  }

  async create(tenantId: number, createBookingDto: CreateBookingDto) {
    // Check room availability first
    const availability = await this.sql.query(`
      SELECT id FROM rooms 
      WHERE id = @roomId AND tenant_id = @tenantId AND status = 'available'
        AND id NOT IN (
          SELECT room_id FROM bookings 
          WHERE tenant_id = @tenantId 
            AND status IN ('confirmed', 'checked_in')
            AND NOT (check_out_date <= @checkIn OR check_in_date >= @checkOut)
        )
    `, {
      roomId: createBookingDto.room_id,
      tenantId: tenantId,
      checkIn: createBookingDto.check_in_date,
      checkOut: createBookingDto.check_out_date
    });

    if (!availability.length) {
      throw new Error('Room not available for selected dates');
    }

    const result = await this.sql.query(`
      INSERT INTO bookings (tenant_id, guest_id, hotel_id, room_id, check_in_date, check_out_date, total_amount, booking_type, special_requests, booking_source, status, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @guestId, @hotelId, @roomId, @checkInDate, @checkOutDate, @totalAmount, @bookingType, @specialRequests, @bookingSource, 'confirmed', GETUTCDATE())
    `, {
      tenantId: tenantId,
      guestId: createBookingDto.guest_id,
      hotelId: createBookingDto.hotel_id,
      roomId: createBookingDto.room_id,
      checkInDate: createBookingDto.check_in_date,
      checkOutDate: createBookingDto.check_out_date,
      totalAmount: createBookingDto.total_amount,
      bookingType: createBookingDto.booking_type || 'daily',
      specialRequests: createBookingDto.special_requests,
      bookingSource: createBookingDto.booking_source || 'walk_in'
    });

    // Update room status to booked
    await this.sql.query(`
      UPDATE rooms SET status = 'booked', updated_at = GETUTCDATE()
      WHERE id = @roomId AND tenant_id = @tenantId
    `, { roomId: createBookingDto.room_id, tenantId: tenantId });

    return result[0];
  }

  async findAll(tenantId: number, hotelId?: number, status?: string) {
    let query = `
      SELECT b.*, g.first_name, g.last_name, g.email, g.phone,
             h.name as hotel_name, r.room_number, rt.name as room_type_name
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN hotels h ON b.hotel_id = h.id
      JOIN rooms r ON b.room_id = r.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.tenant_id = @tenant_id
    `;

    const params: any = { tenant_id: tenantId };

    if (hotelId) {
      query += ' AND b.hotel_id = @hotel_id';
      params.hotel_id = hotelId;
    }
    if (status) {
      query += ' AND b.status = @status';
      params.status = status;
    }

    query += ' ORDER BY b.check_in_date DESC';
    return this.sql.query(query, params);
  }

  async recordPayment(tenantId: number, recordPaymentDto: RecordPaymentDto) {
    const result = await this.sql.query(`
      INSERT INTO payments (tenant_id, booking_id, amount, payment_method, reference_number, payment_date, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenant_id, @booking_id, @amount, @payment_method, @reference_number, GETUTCDATE(), GETUTCDATE())
    `, {
      tenant_id: tenantId,
      ...recordPaymentDto
    });

    // Update booking payment status
    await this.sql.query(`
      UPDATE bookings 
      SET paid_amount = COALESCE(paid_amount, 0) + @amount,
          payment_status = CASE 
            WHEN COALESCE(paid_amount, 0) + @amount >= total_amount THEN 'paid'
            WHEN COALESCE(paid_amount, 0) + @amount > 0 THEN 'partial'
            ELSE 'pending'
          END,
          updated_at = GETUTCDATE()
      WHERE id = @booking_id AND tenant_id = @tenant_id
    `, {
      booking_id: recordPaymentDto.booking_id,
      amount: recordPaymentDto.amount,
      tenant_id: tenantId
    });

    return result[0];
  }
}