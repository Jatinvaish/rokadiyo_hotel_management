import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('api/v1/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post('overview')
  async getOverview(@Request() req, @Body() filters?: { hotel_id?: number }) {
    return this.dashboardService.getOverview(req.user.tenantId, filters?.hotel_id);
  }

  @Post('rooms-grid')
  async getRoomsGrid(@Request() req, @Body() filters?: { hotel_id?: number }) {
    return this.dashboardService.getRoomsGrid(req.user.tenantId, filters?.hotel_id);
  }

  @Post('branches-summary')
  async getBranchesSummary(@Request() req) {
    return this.dashboardService.getBranchesSummary(req.user.tenantId);
  }

  @Post('branch-comparison')
  async getBranchComparison(@Request() req, @Body() filters?: { days?: number }) {
    return this.dashboardService.getBranchComparison(req.user.tenantId, filters?.days || 30);
  }
}