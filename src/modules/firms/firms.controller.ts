import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Firms')
@Controller({ path: 'firms', version: '1' })
@UseGuards(JwtAuthGuard)
export class FirmsController {
  constructor(private firmsService: FirmsService) { }

  @Post('create')
  async create(@Request() req, @Body() createFirmDto: any) {
    return this.firmsService.create(req.user.tenantId, createFirmDto);
  }

  @Post('list')
  async findAll(@Request() req) {
    return this.firmsService.findAll(req.user.tenantId);
  }

  @Post('branches')
  async findBranches(@Request() req, @Body('firm_id') firmId: number) {
    return this.firmsService.findBranches(firmId);
  }

  @Post('update')
  async update(@Request() req, @Body() updateData: any) {
    const { id, ...data } = updateData;
    return this.firmsService.update(req.user.tenantId, id, data);
  }
}
