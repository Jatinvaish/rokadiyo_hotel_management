import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomTypeDto, CreateRoomDto, BulkCreateRoomsDto } from './dto/create-room.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { parseMultipartRequest } from 'src/core/utils/multipart.util';
import { R2Service } from 'src/core/r2/r2.service';

@ApiTags('Rooms')
@Controller({ path: 'rooms', version: '1' })
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private r2Service: R2Service
  ) { }

  @Post('room-types/create')
  @ApiConsumes('multipart/form-data')
  async createRoomType(@Request() req) {
    const isMultipart = req.isMultipart();

    if (isMultipart) {
      const { fields, files } = await parseMultipartRequest<any>(req);

      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const results = await this.r2Service.uploadMultiple(
          files.map(f => ({ buffer: f.buffer, filename: f.filename, mimetype: f.mimetype })),
          `rooms/types/${req.user.tenantId}`
        );
        uploadedUrls = results.map(r => r.url);
      }

      const existingUrls = Array.isArray(fields.image_urls) ? fields.image_urls : [];
      const totalUrls = [...existingUrls, ...uploadedUrls];

      const payload = {
        ...fields,
        images: JSON.stringify(totalUrls)
      };

      return this.roomsService.createRoomType(req.user.tenantId, req.user.firmId, req.user.branchId, payload);
    } else {
      return this.roomsService.createRoomType(req.user.tenantId, req.user.firmId, req.user.branchId, req.body);
    }
  }

  @Post('room-types/list')
  async getRoomTypes(@Request() req, @Body() body?: { firm_id?: number }) {
    return this.roomsService.getRoomTypes(req.user.tenantId, body?.firm_id || req.user.firmId);
  }

  @Post('rooms/bulk-create')
  async bulkCreateRooms(@Request() req, @Body() bulkCreateDto: BulkCreateRoomsDto) {
    return this.roomsService.bulkCreateRooms(req.user.tenantId, bulkCreateDto);
  }

  @Post('list')
  async getRooms(@Request() req, @Body() filters?: {
    page?: number;
    limit?: number;
    firm_id?: number;
    branch_id?: number;
    status?: string;
    search?: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    return this.roomsService.getRooms(req.user.tenantId, {
      page: filters?.page,
      limit: filters?.limit,
      firm_id: filters?.firm_id || req.user.firmId,
      branch_id: filters?.branch_id || req.user.branchId,
      status: filters?.status,
      search: filters?.search,
      sortField: filters?.sortField,
      sortOrder: filters?.sortOrder
    });
  }

  @Post('update-status')
  async updateRoomStatus(@Request() req, @Body() data: { room_id: number; status: string }) {
    return this.roomsService.updateStatus(data.room_id, data.status);
  }

  @Post('create')
  async createRoom(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(req.user.tenantId, createRoomDto);
  }

  @Post('update')
  async updateRoom(@Request() req, @Body() data: any) {
    return this.roomsService.updateRoom(data.id, data);
  }

  @Post('room-types/update')
  @ApiConsumes('multipart/form-data')
  async updateRoomType(@Request() req) {
    const isMultipart = req.isMultipart();

    if (isMultipart) {
      const { fields, files } = await parseMultipartRequest<any>(req);

      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const results = await this.r2Service.uploadMultiple(
          files.map(f => ({ buffer: f.buffer, filename: f.filename, mimetype: f.mimetype })),
          `rooms/types/${req.user.tenantId}`
        );
        uploadedUrls = results.map(r => r.url);
      }

      const existingUrls = Array.isArray(fields.image_urls) ? fields.image_urls : [];
      const totalUrls = [...existingUrls, ...uploadedUrls];

      const payload = {
        ...fields,
        images: JSON.stringify(totalUrls)
      };

      return this.roomsService.updateRoomType(fields.id || payload.id, payload);
    } else {
      const body = req.body;
      if (body.image_urls) {
        body.images = JSON.stringify(body.image_urls);
      }
      return this.roomsService.updateRoomType(body.id, body);
    }
  }
}