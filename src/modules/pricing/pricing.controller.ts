import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreateHourlyRuleDto, CreateSeasonalRateDto, CalculatePriceDto } from './dto/pricing.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('api/v1/pricing')
@UseGuards(JwtAuthGuard)
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Post('hourly-rules/create')
  async createHourlyRule(@Request() req, @Body() createHourlyRuleDto: CreateHourlyRuleDto) {
    return this.pricingService.createHourlyRule(req.user.tenantId, createHourlyRuleDto);
  }

  @Post('seasonal/create')
  async createSeasonalRate(@Request() req, @Body() createSeasonalRateDto: CreateSeasonalRateDto) {
    return this.pricingService.createSeasonalRate(req.user.tenantId, createSeasonalRateDto);
  }

  @Post('calculate')
  async calculatePrice(@Request() req, @Body() calculatePriceDto: CalculatePriceDto) {
    return this.pricingService.calculatePrice(req.user.tenantId, calculatePriceDto);
  }
}