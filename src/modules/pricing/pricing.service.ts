import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateHourlyRuleDto, CreateSeasonalRateDto, CalculatePriceDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private sql: SqlServerService) {}

  async createHourlyRule(tenantId: number, createHourlyRuleDto: CreateHourlyRuleDto) {
    const result = await this.sql.query(`
      INSERT INTO pricing_hourly_rules (tenant_id, room_type_id, hotel_id, start_time, end_time, rate_multiplier, days_of_week, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenant_id, @room_type_id, @hotel_id, @start_time, @end_time, @rate_multiplier, @days_of_week, GETUTCDATE())
    `, {
      tenant_id: tenantId,
      ...createHourlyRuleDto,
      days_of_week: createHourlyRuleDto.days_of_week || '1,2,3,4,5,6,7'
    });
    return result[0];
  }

  async createSeasonalRate(tenantId: number, createSeasonalRateDto: CreateSeasonalRateDto) {
    const result = await this.sql.query(`
      INSERT INTO pricing_seasonal_rates (tenant_id, room_type_id, hotel_id, start_date, end_date, rate_multiplier, season_name, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenant_id, @room_type_id, @hotel_id, @start_date, @end_date, @rate_multiplier, @season_name, GETUTCDATE())
    `, {
      tenant_id: tenantId,
      ...createSeasonalRateDto
    });
    return result[0];
  }

  async calculatePrice(tenantId: number, calculatePriceDto: CalculatePriceDto) {
    // Get base rates
    const roomType = await this.sql.query(`
      SELECT base_rate_hourly, base_rate_daily FROM room_types 
      WHERE id = @room_type_id AND tenant_id = @tenant_id
    `, { room_type_id: calculatePriceDto.room_type_id, tenant_id: tenantId });

    if (!roomType.length) {
      throw new Error('Room type not found');
    }

    const checkIn = new Date(calculatePriceDto.check_in);
    const checkOut = new Date(calculatePriceDto.check_out);
    const hoursDiff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
    
    let baseRate = calculatePriceDto.booking_type === 'hourly' 
      ? roomType[0].base_rate_hourly * hoursDiff
      : roomType[0].base_rate_daily * Math.ceil(hoursDiff / 24);

    // Apply seasonal multiplier
    const seasonalRate = await this.sql.query(`
      SELECT rate_multiplier FROM pricing_seasonal_rates
      WHERE tenant_id = @tenant_id 
        AND room_type_id = @room_type_id 
        AND hotel_id = @hotel_id
        AND @check_in >= start_date 
        AND @check_out <= end_date
      ORDER BY created_at DESC
    `, {
      tenant_id: tenantId,
      room_type_id: calculatePriceDto.room_type_id,
      hotel_id: calculatePriceDto.hotel_id,
      check_in: checkIn,
      check_out: checkOut
    });

    if (seasonalRate.length) {
      baseRate *= seasonalRate[0].rate_multiplier;
    }

    // Apply hourly multiplier if applicable
    if (calculatePriceDto.booking_type === 'hourly') {
      const dayOfWeek = checkIn.getDay() + 1; // 1=Sunday, 7=Saturday
      const timeStr = checkIn.toTimeString().substring(0, 5);
      
      const hourlyRule = await this.sql.query(`
        SELECT rate_multiplier FROM pricing_hourly_rules
        WHERE tenant_id = @tenant_id 
          AND room_type_id = @room_type_id 
          AND hotel_id = @hotel_id
          AND @time >= start_time 
          AND @time <= end_time
          AND (days_of_week LIKE '%' + @day_of_week + '%' OR days_of_week IS NULL)
        ORDER BY created_at DESC
      `, {
        tenant_id: tenantId,
        room_type_id: calculatePriceDto.room_type_id,
        hotel_id: calculatePriceDto.hotel_id,
        time: timeStr,
        day_of_week: dayOfWeek.toString()
      });

      if (hourlyRule.length) {
        baseRate *= hourlyRule[0].rate_multiplier;
      }
    }

    return {
      base_rate: roomType[0].base_rate_hourly,
      calculated_rate: Math.round(baseRate * 100) / 100,
      hours: hoursDiff,
      booking_type: calculatePriceDto.booking_type || 'daily'
    };
  }
}