import { Controller, Post, UseGuards, Request, UploadedFiles, UseInterceptors, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { R2Service } from './r2.service';

@ApiTags('Upload')
@Controller({ path: 'upload', version: '1' })
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private r2Service: R2Service) { }

  @Post('files')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadFiles(@Request() req, @Query('folder') folder: string = 'general') {
    const parts = req.files();
    const results: any[] = [];

    for await (const part of parts) {
      const buffer = await part.toBuffer();
      const result = await this.r2Service.uploadFile(
        buffer,
        part.filename,
        part.mimetype,
        `${folder}/${req.user.tenantId}`
      );
      results.push({
        url: result.url,
        key: result.key,
        originalName: part.filename,
        mimetype: part.mimetype,
        size: buffer.length
      });
    }

    return {
      success: true,
      files: results
    };
  }

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@Request() req, @Query('folder') folder: string = 'general') {
    const data = await req.file();
    if (!data) {
      return { success: false, message: 'No file uploaded' };
    }

    const buffer = await data.toBuffer();
    const result = await this.r2Service.uploadFile(
      buffer,
      data.filename,
      data.mimetype,
      `${folder}/${req.user.tenantId}`
    );

    return {
      success: true,
      url: result.url,
      key: result.key,
      originalName: data.filename,
      mimetype: data.mimetype,
      size: buffer.length
    };
  }
}
