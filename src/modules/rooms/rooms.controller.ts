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
    return this.roomsService.createRoomType(req.user.tenantId, req.user.firmId, req.user.branchId, body);
  }

  @Post('room-types/list')
  async getRoomTypes(@Request() req, @Body() body?: { firm_id?: number }) {
    return this.roomsService.getRoomTypes(req.user.tenantId, body?.firm_id || req.user.firmId);
  }

  @Post('rooms/bulk-create')
  async bulkCreateRooms(@Request() req, @Body() bulkCreateDto: BulkCreateRoomsDto) {
    return this.roomsService.bulkCreateRooms(req.user.tenantId, req.user.firmId, req.user.branchId, bulkCreateDto);
  }

  @Post('list')
  async getRooms(@Request() req, @Body() filters?: {
    page?: number;
    limit?: number;
    firm_id?: number;
    branch_id?: number;
    status?: string;
    search?: string;
  }) {
    return this.roomsService.getRooms(req.user.tenantId, {
      page: filters?.page,
      limit: filters?.limit,
      firm_id: filters?.firm_id || req.user.firmId,
      branch_id: filters?.branch_id || req.user.branchId,
      status: filters?.status,
      search: filters?.search
    });
  }

  @Post('update-status')
  async updateRoomStatus(@Request() req, @Body() data: { room_id: number; status: string }) {
    return this.roomsService.updateStatus(data.room_id, data.status);
  }

  @Post('create')
  async createRoom(@Request() req, @Body() createRoomDto: any) {
    return this.roomsService.createRoom(req.user.tenantId, req.user.firmId, req.user.branchId, createRoomDto);
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