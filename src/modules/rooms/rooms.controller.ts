import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { BulkCreateRoomsDto } from './dto/create-room.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller({ path: 'rooms', version: '1' })
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) { }

  @Post('room-types/create')
  async createRoomType(@Request() req, @Body() body: any) {
    const hotelId = body.hotel_id || 1;
    return this.roomsService.createRoomType(hotelId, body);
  }

  @Post('room-types/list')
  async getRoomTypes(@Request() req, @Body() body: { hotel_id?: number }) {
    const hotelId = body.hotel_id || 1;
    return this.roomsService.getRoomTypes(hotelId);
  }

  @Post('rooms/bulk-create')
  async bulkCreateRooms(@Request() req, @Body() bulkCreateDto: BulkCreateRoomsDto) {
    return this.roomsService.bulkCreateRooms(req.user.tenantId, bulkCreateDto);
  }

  @Post('list')
  async getRooms(@Request() req, @Body() filters?: { hotel_id?: number; status?: string }) {
    return this.roomsService.getRooms(filters?.hotel_id, filters?.status);
  }

  @Post('update-status')
  async updateRoomStatus(@Request() req, @Body() data: { room_id: number; status: string }) {
    return this.roomsService.updateStatus(data.room_id, data.status);
  }

  @Post('create')
  async createRoom(@Request() req, @Body() createRoomDto: any) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Post('update')
  async updateRoom(@Request() req, @Body() data: any) {
    return this.roomsService.updateRoom(data.id, data);
  }

  @Post('room-types/update')
  async updateRoomType(@Request() req, @Body() data: any) {
    return this.roomsService.updateRoomType(data.id, data);
  }
}