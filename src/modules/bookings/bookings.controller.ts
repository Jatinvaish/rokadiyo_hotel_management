import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CheckAvailabilityDto, CreateBookingDto, RecordPaymentDto } from './dto/booking.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller({ path: 'bookings', version: '1' })
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) { }

  @Post('check-availability')
  async checkAvailability(@Request() req, @Body() checkAvailabilityDto: CheckAvailabilityDto) {
    return this.bookingsService.checkAvailability(req.user.tenantId, checkAvailabilityDto);
  }

  @Post('create')
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.tenantId, req.user.firmId, req.user.branchId, createBookingDto);
  }

  @Post('list')
  async findAll(@Request() req, @Body() filters?: {
    page?: number;
    limit?: number;
    firm_id?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    return this.bookingsService.findAll(req.user.tenantId, {
      page: filters?.page,
      limit: filters?.limit,
      firm_id: filters?.firm_id || req.user.firmId,
      status: filters?.status,
      fromDate: filters?.fromDate,
      toDate: filters?.toDate
    });
  }

  @Post('payment/record')
  async recordPayment(@Request() req, @Body() recordPaymentDto: RecordPaymentDto) {
    return this.bookingsService.recordPayment(req.user.tenantId, recordPaymentDto);
  }

  // ==================== ANALYTICS ====================

  @Post('analytics/status-breakdown')
  async getStatusBreakdown(@Request() req, @Body() filters?: { fromDate?: string; toDate?: string }) {
    return this.bookingsService.getBookingStatusBreakdown(req.user.tenantId, filters?.fromDate, filters?.toDate);
  }

  @Post('analytics/source-breakdown')
  async getSourceBreakdown(@Request() req, @Body() filters?: { fromDate?: string; toDate?: string }) {
    return this.bookingsService.getBookingSourceBreakdown(req.user.tenantId, filters?.fromDate, filters?.toDate);
  }

  @Post('analytics/revenue-stats')
  async getRevenueStats(@Request() req, @Body() filters?: { fromDate?: string; toDate?: string }) {
    return this.bookingsService.getRevenueStats(req.user.tenantId, filters?.fromDate, filters?.toDate);
  }

  @Post('analytics/occupancy-stats')
  async getOccupancyStats(@Request() req, @Body() filters?: { fromDate?: string; toDate?: string }) {
    return this.bookingsService.getOccupancyStats(req.user.tenantId, filters?.fromDate, filters?.toDate);
  }

  @Post('analytics/full')
  async getFullAnalytics(@Request() req, @Body() filters?: { fromDate?: string; toDate?: string }) {
    return this.bookingsService.getFullReportAnalytics(req.user.tenantId, filters?.fromDate, filters?.toDate);
  }
}