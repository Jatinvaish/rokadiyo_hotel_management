import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CompleteCheckInDto, CalculateBillDto, CompleteCheckOutDto } from './dto/checkin.dto';

@Injectable()
export class CheckinService {
  constructor(private sql: SqlServerService) {}

  async completeCheckIn(tenantId: number, completeCheckInDto: CompleteCheckInDto) {
    return this.sql.transaction(async (transaction) => {
      // Update booking status
      const bookingRequest = transaction.request();
      bookingRequest.input('bookingId', completeCheckInDto.booking_id);
      bookingRequest.input('tenantId', tenantId);
      bookingRequest.input('notes', completeCheckInDto.notes);

      const bookingResult = await bookingRequest.query(`
        UPDATE bookings 
        SET status = 'checked_in', 
            actual_check_in = GETUTCDATE(),
            check_in_notes = @notes,
            updated_at = GETUTCDATE()
        OUTPUT INSERTED.room_id
        WHERE id = @bookingId AND tenant_id = @tenantId AND status = 'confirmed'
      `);

      if (!bookingResult.recordset.length) {
        throw new Error('Booking not found or already checked in');
      }

      const roomId = bookingResult.recordset[0].room_id;

      // Update room status to occupied
      const roomRequest = transaction.request();
      roomRequest.input('roomId', roomId);
      roomRequest.input('tenantId', tenantId);

      await roomRequest.query(`
        UPDATE rooms 
        SET status = 'occupied', updated_at = GETUTCDATE()
        WHERE id = @roomId AND tenant_id = @tenantId
      `);

      return { booking_id: completeCheckInDto.booking_id, room_id: roomId, status: 'checked_in' };
    });
  }

  async calculateBill(tenantId: number, calculateBillDto: CalculateBillDto) {
    const booking = await this.sql.query(`
      SELECT b.*, rt.base_rate_hourly, rt.base_rate_daily,
             DATEDIFF(hour, b.check_in_date, COALESCE(b.actual_check_out, GETUTCDATE())) as actual_hours
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE b.id = @bookingId AND b.tenant_id = @tenantId
    `, { bookingId: calculateBillDto.booking_id, tenantId: tenantId });

    if (!booking.length) {
      throw new Error('Booking not found');
    }

    const bookingData = booking[0];
    let finalAmount = bookingData.total_amount;

    // Add additional charges if any
    if (calculateBillDto.additional_charges) {
      finalAmount += calculateBillDto.additional_charges;

      // Record additional charge
      await this.sql.query(`
        INSERT INTO booking_charges (tenant_id, booking_id, charge_type, amount, description, created_at)
        VALUES (@tenantId, @bookingId, 'additional', @amount, @description, GETUTCDATE())
      `, {
        tenantId: tenantId,
        bookingId: calculateBillDto.booking_id,
        amount: calculateBillDto.additional_charges,
        description: calculateBillDto.charge_description || 'Additional charges'
      });
    }

    // Calculate taxes (assuming 10% tax)
    const taxAmount = finalAmount * 0.10;
    const totalWithTax = finalAmount + taxAmount;

    return {
      booking_id: calculateBillDto.booking_id,
      base_amount: bookingData.total_amount,
      additional_charges: calculateBillDto.additional_charges || 0,
      tax_amount: taxAmount,
      final_amount: totalWithTax,
      paid_amount: bookingData.paid_amount || 0,
      balance_due: totalWithTax - (bookingData.paid_amount || 0),
      actual_hours: bookingData.actual_hours
    };
  }

  async completeCheckOut(tenantId: number, completeCheckOutDto: CompleteCheckOutDto) {
    return this.sql.transaction(async (transaction) => {
      // Update booking
      const bookingRequest = transaction.request();
      bookingRequest.input('bookingId', completeCheckOutDto.booking_id);
      bookingRequest.input('tenantId', tenantId);
      bookingRequest.input('finalAmount', completeCheckOutDto.final_amount);
      bookingRequest.input('checkoutNotes', completeCheckOutDto.checkout_notes);

      const bookingResult = await bookingRequest.query(`
        UPDATE bookings 
        SET status = 'checked_out',
            actual_check_out = GETUTCDATE(),
            final_amount = @finalAmount,
            checkout_notes = @checkoutNotes,
            updated_at = GETUTCDATE()
        OUTPUT INSERTED.room_id, INSERTED.hotel_id
        WHERE id = @bookingId AND tenant_id = @tenantId AND status = 'checked_in'
      `);

      if (!bookingResult.recordset.length) {
        throw new Error('Booking not found or not checked in');
      }

      const { room_id: roomId, hotel_id: hotelId } = bookingResult.recordset[0];

      // Update room status to dirty (needs housekeeping)
      const roomRequest = transaction.request();
      roomRequest.input('roomId', roomId);
      roomRequest.input('tenantId', tenantId);

      await roomRequest.query(`
        UPDATE rooms 
        SET status = 'dirty', updated_at = GETUTCDATE()
        WHERE id = @roomId AND tenant_id = @tenantId
      `);

      // Auto-create housekeeping task
      const housekeepingRequest = transaction.request();
      housekeepingRequest.input('tenantId', tenantId);
      housekeepingRequest.input('hotelId', hotelId);
      housekeepingRequest.input('roomId', roomId);

      await housekeepingRequest.query(`
        INSERT INTO housekeeping_tasks (tenant_id, hotel_id, room_id, task_type, status, priority, created_at)
        VALUES (@tenant_id, @hotel_id, @room_id, 'checkout_cleaning', 'pending', 'high', GETUTCDATE())
      `);

      return { 
        booking_id: completeCheckOutDto.booking_id, 
        room_id: roomId, 
        status: 'checked_out',
        housekeeping_triggered: true
      };
    });
  }
}