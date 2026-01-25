import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CheckAvailabilityDto, CreateBookingDto, RecordPaymentDto } from './dto/booking.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('api/v1/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('check-availability')
  async checkAvailability(@Request() req, @Body() checkAvailabilityDto: CheckAvailabilityDto) {
    return this.bookingsService.checkAvailability(req.user.tenantId, checkAvailabilityDto);
  }

  @Post('create')
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.tenantId, createBookingDto);
  }

  @Post('list')
  async findAll(@Request() req, @Body() filters?: { hotel_id?: number; status?: string }) {
    return this.bookingsService.findAll(req.user.tenantId, filters?.hotel_id, filters?.status);
  }

  @Post('payment/record')
  async recordPayment(@Request() req, @Body() recordPaymentDto: RecordPaymentDto) {
    return this.bookingsService.recordPayment(req.user.tenantId, recordPaymentDto);
  }
}