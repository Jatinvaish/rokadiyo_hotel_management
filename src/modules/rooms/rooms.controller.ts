import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomTypeDto, BulkCreateRoomsDto } from './dto/create-room.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('api/v1')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post('room-types/create')
  async createRoomType(@Request() req, @Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomsService.createRoomType(req.user.tenantId, createRoomTypeDto);
  }

  @Post('room-types/list')
  async getRoomTypes(@Request() req) {
    return this.roomsService.getRoomTypes(req.user.tenantId);
  }

  @Post('rooms/bulk-create')
  async bulkCreateRooms(@Request() req, @Body() bulkCreateDto: BulkCreateRoomsDto) {
    return this.roomsService.bulkCreateRooms(req.user.tenantId, bulkCreateDto);
  }

  @Post('rooms/list')
  async getRooms(@Request() req, @Body() filters?: { hotel_id?: number; status?: string }) {
    return this.roomsService.getRooms(req.user.tenantId, filters?.hotel_id, filters?.status);
  }

  @Post('rooms/update-status')
  async updateRoomStatus(@Request() req, @Body() data: { room_id: number; status: string }) {
    return this.roomsService.updateRoomStatus(req.user.tenantId, data.room_id, data.status);
  }
}