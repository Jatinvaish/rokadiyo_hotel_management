import { Controller, Post, Body, UseGuards, Request, UploadedFile, UseInterceptors, Param, Logger } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { R2Service } from 'src/core/r2/r2.service';
import { parseMultipartRequest } from 'src/core/utils/multipart.util';

@ApiTags('Guests')
@Controller({ path: 'guests', version: '1' })
@UseGuards(JwtAuthGuard)
export class GuestsController {
  private readonly logger = new Logger(GuestsController.name);

  constructor(
    private guestsService: GuestsService,
    private r2Service: R2Service
  ) { }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  async create(@Request() req) {
    const isMultipart = req.isMultipart();

    if (isMultipart) {
      const { fields, files } = await parseMultipartRequest<CreateGuestDto>(req);
      this.logger.debug(`Received multipart create request. Fields: ${JSON.stringify(fields)}, Files: ${files.length}`);

      // Upload files
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const results = await this.r2Service.uploadMultiple(
          files.map(f => ({ buffer: f.buffer, filename: f.filename, mimetype: f.mimetype })),
          `guests/docs/${req.user.tenantId}`
        );
        uploadedUrls = results.map(r => r.url);
      }

      // Combine existing and new URLs
      const existingUrls = Array.isArray(fields.id_document_urls) ? fields.id_document_urls : [];
      const totalUrls = [...existingUrls, ...uploadedUrls];

      const payload = {
        ...fields,
        id_document_url: JSON.stringify(totalUrls)
      };

      return this.guestsService.create(req.user.tenantId, req.user.firmId, req.user.branchId, payload as any);
    } else {
      return this.guestsService.create(req.user.tenantId, req.user.firmId, req.user.branchId, req.body);
    }
  }

  @Post('update')
  @ApiConsumes('multipart/form-data')
  async update(@Request() req) {
    const isMultipart = req.isMultipart();

    if (isMultipart) {
      const { fields, files } = await parseMultipartRequest<Partial<CreateGuestDto> & { id: number }>(req);
      this.logger.debug(`Received multipart update request. Fields: ${JSON.stringify(fields)}, Files: ${files.length}`);

      // Upload new files
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const results = await this.r2Service.uploadMultiple(
          files.map(f => ({ buffer: f.buffer, filename: f.filename, mimetype: f.mimetype })),
          `guests/docs/${req.user.tenantId}`
        );
        uploadedUrls = results.map(r => r.url);
      }

      // Combine existing and new URLs
      // fields.id_document_urls should contain the list of URLs the user kept
      const existingUrls = Array.isArray(fields.id_document_urls) ? fields.id_document_urls : [];
      const totalUrls = [...existingUrls, ...uploadedUrls];

      const payload = {
        ...fields,
        id_proof_url: JSON.stringify(totalUrls)
      };

      return this.guestsService.update(req.user.tenantId, fields.id, payload as any);
    } else {
      const body = req.body;
      if (body.id_document_urls) {
        body.id_proof_url = JSON.stringify(body.id_document_urls);
      }
      return this.guestsService.update(req.user.tenantId, body.id, body);
    }
  }

  @Post('search')
  async findByEmail(@Request() req, @Body('email') email: string) {
    return this.guestsService.findByEmail(req.user.tenantId, email);
  }

  @Post('history/:id')
  async getGuestHistory(@Request() req, @Param('id') guestId: number) {
    return this.guestsService.getGuestHistory(req.user.tenantId, guestId);
  }

  @Post('list')
  async list(@Request() req, @Body() filters?: { page?: number; limit?: number; search?: string }) {
    return this.guestsService.list(req.user.tenantId, {
      page: filters?.page,
      limit: filters?.limit,
      search: filters?.search
    });
  }

  @Post('upload-document')
  @ApiConsumes('multipart/form-data')
  async uploadDocument(@Request() req) {
    const data = await req.file();
    if (!data) {
      return { success: false, message: 'No file uploaded' };
    }

    const buffer = await data.toBuffer();
    const result = await this.r2Service.uploadFile(
      buffer,
      data.filename,
      data.mimetype,
      `guests/docs/${req.user.tenantId}`
    );

    return {
      success: true,
      url: result.url,
      key: result.key
    };
  }
}