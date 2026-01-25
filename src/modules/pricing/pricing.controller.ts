import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreateHourlyRuleDto, CreateSeasonalRateDto, CalculatePriceDto } from './dto/pricing.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pricing')
@Controller({ path: 'pricing', version: '1' })
@UseGuards(JwtAuthGuard)
export class PricingController {
  constructor(private pricingService: PricingService) { }

  @Post('hourly-rules/create')
  async createHourlyRule(@Request() req, @Body() createHourlyRuleDto: CreateHourlyRuleDto) {
    return this.pricingService.createHourlyRule(req.user.tenantId, req.user.firmId, req.user.branchId, createHourlyRuleDto);
  }

  @Post('seasonal/create')
  async createSeasonalRate(@Request() req, @Body() createSeasonalRateDto: CreateSeasonalRateDto) {
    return this.pricingService.createSeasonalRate(req.user.tenantId, req.user.firmId, req.user.branchId, createSeasonalRateDto);
  }

  @Post('calculate')
  async calculatePrice(@Request() req, @Body() calculatePriceDto: CalculatePriceDto) {
    return this.pricingService.calculatePrice(req.user.tenantId, req.user.firmId, req.user.branchId, calculatePriceDto);
  }
}