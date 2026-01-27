import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class R2Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(R2Service.name);
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('r2.region')!,
      endpoint: this.configService.get<string>('r2.endpoint')!,
      credentials: {
        accessKeyId: this.configService.get<string>('r2.accessKeyId')!,
        secretAccessKey: this.configService.get<string>('r2.secretAccessKey')!,
      },
    });

    this.bucketName = this.configService.get<string>('r2.bucketName')!;
    this.publicUrl = this.configService.get<string>('r2.publicUrl')!;
  }

  async uploadFile(
    file: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    const fileExtension = path.extname(originalName);
    const key = `${folder}/${uuidv4()}${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: mimeType,
        }),
      );

      const url = `${this.publicUrl}/${key}`;
      return { url, key };
    } catch (error) {
      this.logger.error(`Error uploading file to R2: ${error.message}`);
      throw error;
    }
  }

  async uploadMultiple(
    files: Array<{ buffer: Buffer, filename: string, mimetype: string }>,
    folder: string = 'uploads'
  ): Promise<Array<{ url: string, key: string }>> {
    const uploadPromises = files.map(file =>
      this.uploadFile(file.buffer, file.filename, file.mimetype, folder)
    );
    return Promise.all(uploadPromises);
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Error deleting file from R2: ${error.message}`);
      throw error;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}
