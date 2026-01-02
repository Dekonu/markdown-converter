import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PdfService } from './pdf.service';
import { ConvertPdfResponse } from './dto/convert-pdf.dto';

@Controller('api/pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convert(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ConvertPdfResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('File must be a PDF');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    try {
      const html = await this.pdfService.convertToHtml(file.buffer);
      return { html };
    } catch (error) {
      throw new BadRequestException(
        `Failed to convert PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post('convert-to-docx')
  @UseInterceptors(FileInterceptor('file'))
  async convertToDocx(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('File must be a PDF');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    try {
      const docxBuffer = await this.pdfService.convertToDocx(file.buffer);
      
      // Set response headers for file download
      const fileName = file.originalname.replace(/\.pdf$/i, '.docx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', docxBuffer.length.toString());
      
      res.send(docxBuffer);
    } catch (error) {
      throw new BadRequestException(
        `Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

