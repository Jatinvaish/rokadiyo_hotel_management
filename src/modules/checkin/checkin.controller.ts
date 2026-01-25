import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CompleteCheckInDto, CalculateBillDto, CompleteCheckOutDto } from './dto/checkin.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Checkin') 
@Controller({ path: 'checkin', version: '1' })
@UseGuards(JwtAuthGuard)
export class CheckinController {
  constructor(private checkinService: CheckinService) { }

  @Post('checkin/complete')
  async completeCheckIn(@Request() req, @Body() completeCheckInDto: CompleteCheckInDto) {
    return this.checkinService.completeCheckIn(req.user.tenantId, completeCheckInDto);
  }

  @Post('checkout/calculate-bill')
  async calculateBill(@Request() req, @Body() calculateBillDto: CalculateBillDto) {
    return this.checkinService.calculateBill(req.user.tenantId, calculateBillDto);
  }

  @Post('checkout/complete')
  async completeCheckOut(@Request() req, @Body() completeCheckOutDto: CompleteCheckOutDto) {
    return this.checkinService.completeCheckOut(req.user.tenantId, completeCheckOutDto);
  }
}