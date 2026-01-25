import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Guests')
@Controller({ path: 'guests', version: '1' })
@UseGuards(JwtAuthGuard)
export class GuestsController {
  constructor(private guestsService: GuestsService) { }

  @Post('create')
  async create(@Request() req, @Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(req.user.tenantId, createGuestDto);
  }

  @Post('search')
  async findByEmail(@Request() req, @Body('email') email: string) {
    return this.guestsService.findByEmail(req.user.tenantId, email);
  }

  @Post('history')
  async getGuestHistory(@Request() req, @Body('guest_id') guestId: number) {
    return this.guestsService.getGuestHistory(req.user.tenantId, guestId);
  }

  @Post('list')
  async list(@Request() req) {
    return this.guestsService.list(req.user.tenantId);
  }

  @Post('update')
  async update(@Request() req, @Body() data: any) {
    return this.guestsService.update(req.user.tenantId, data.id, data);
  }
}