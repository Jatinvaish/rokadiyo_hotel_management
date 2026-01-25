import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hotels')  
@Controller({ path: 'hotels', version: '1' })
@UseGuards(JwtAuthGuard)
export class HotelsController {
  constructor(private hotelsService: HotelsService) { }

  @Post('create')
  async create(@Request() req, @Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(req.user.tenantId, createHotelDto);
  }

  @Post('list')
  async findAll(@Request() req) {
    return this.hotelsService.findAll(req.user.tenantId);
  }

  @Post('branches')
  async findBranches(@Request() req, @Body('hotel_id') hotelId: number) {
    return this.hotelsService.findBranches(req.user.tenantId, hotelId);
  }

  @Post('update')
  async update(@Request() req, @Body() updateData: { hotel_id: number } & Partial<CreateHotelDto>) {
    const { hotel_id, ...data } = updateData;
    return this.hotelsService.update(req.user.tenantId, hotel_id, data);
  }
}