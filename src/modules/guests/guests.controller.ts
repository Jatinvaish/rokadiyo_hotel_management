import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('api/v1/guests')
@UseGuards(JwtAuthGuard)
export class GuestsController {
  constructor(private guestsService: GuestsService) {}

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
}