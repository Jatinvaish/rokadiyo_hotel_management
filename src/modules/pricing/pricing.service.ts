import { Injectable } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { CreateHourlyRuleDto, CreateSeasonalRateDto, CalculatePriceDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private sql: SqlServerService) { }

  async createHourlyRule(tenantId: number, firmId: number, branchId: number, createHourlyRuleDto: CreateHourlyRuleDto) {
    if (!firmId || !branchId) {
      const defaults = await this.getDefaults(tenantId);
      firmId = firmId || defaults.firmId;
      branchId = branchId || defaults.branchId;
    }

    const result = await this.sql.query(`
      INSERT INTO pricing_hourly_rules (tenant_id, firm_id, branch_id, room_type_id, start_time, end_time, rate_multiplier, days_of_week, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @firmId, @branchId, @roomTypeId, @startTime, @endTime, @rateMultiplier, @daysOfWeek, GETUTCDATE())
    `, {
      tenantId,
      firmId,
      branchId,
      roomTypeId: createHourlyRuleDto.room_type_id,
      startTime: createHourlyRuleDto.start_time,
      endTime: createHourlyRuleDto.end_time,
      rateMultiplier: createHourlyRuleDto.rate_multiplier,
      daysOfWeek: createHourlyRuleDto.days_of_week || '1,2,3,4,5,6,7'
    });
    return result[0];
  }

  async createSeasonalRate(tenantId: number, firmId: number, branchId: number, createSeasonalRateDto: CreateSeasonalRateDto) {
    if (!firmId || !branchId) {
      const defaults = await this.getDefaults(tenantId);
      firmId = firmId || defaults.firmId;
      branchId = branchId || defaults.branchId;
    }

    const result = await this.sql.query(`
      INSERT INTO pricing_seasonal_rates (tenant_id, firm_id, branch_id, room_type_id, start_date, end_date, rate_multiplier, season_name, created_at)
      OUTPUT INSERTED.*
      VALUES (@tenantId, @firmId, @branchId, @roomTypeId, @startDate, @endDate, @rateMultiplier, @seasonName, GETUTCDATE())
    `, {
      tenantId,
      firmId,
      branchId,
      roomTypeId: createSeasonalRateDto.room_type_id,
      startDate: createSeasonalRateDto.start_date,
      endDate: createSeasonalRateDto.end_date,
      rateMultiplier: createSeasonalRateDto.rate_multiplier,
      seasonName: createSeasonalRateDto.season_name
    });
    return result[0];
  }

  async calculatePrice(tenantId: number, firmId: number, branchId: number, calculatePriceDto: CalculatePriceDto) {
    if (!firmId) {
      const defaults = await this.getDefaults(tenantId);
      firmId = defaults.firmId;
    }

    // Get base rates
    const roomType = await this.sql.query(`
      SELECT base_rate_hourly, base_rate_daily FROM room_types 
      WHERE id = @roomTypeId AND tenant_id = @tenantId
    `, { roomTypeId: calculatePriceDto.room_type_id, tenantId: tenantId });

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
        AND firm_id = @firm_id
        AND @check_in >= start_date 
        AND @check_out <= end_date
      ORDER BY created_at DESC
    `, {
      tenant_id: tenantId,
      room_type_id: calculatePriceDto.room_type_id,
      firm_id: firmId,
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
          AND firm_id = @firm_id
          AND @time >= start_time 
          AND @time <= end_time
          AND (days_of_week LIKE '%' + @day_of_week + '%' OR days_of_week IS NULL)
        ORDER BY created_at DESC
      `, {
        tenant_id: tenantId,
        room_type_id: calculatePriceDto.room_type_id,
        firm_id: firmId,
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

  private async getDefaults(tenantId: number) {
    const defaults = await this.sql.query(`
        SELECT TOP 1 f.id as firm_id, b.id as branch_id
        FROM firms f
        LEFT JOIN branches b ON b.firm_id = f.id
        WHERE f.tenant_id = @tenantId AND f.is_active = 1
        ORDER BY f.created_at ASC
      `, { tenantId });
    return { firmId: defaults[0]?.firm_id, branchId: defaults[0]?.branch_id };
  }
}