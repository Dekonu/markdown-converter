import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { PdfService } from './pdf.service';
import { ConvertPdfResponse } from './dto/convert-pdf.dto';

@ApiTags('pdf')
@Controller('api/pdf')
export class PdfController {
  private readonly logger = new Logger(PdfController.name);

  constructor(private readonly pdfService: PdfService) {}

  @Post('convert')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Convert PDF to HTML', description: 'Extracts text from PDF and converts to HTML' })
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
  @ApiResponse({ status: 200, description: 'Successfully converted PDF to HTML', type: ConvertPdfResponse })
  @ApiResponse({ status: 400, description: 'Invalid file or validation error' })
  async convert(
    @UploadedFile() file: Express.Multer.File | undefined,
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

    this.logger.log(`Converting PDF to HTML: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
    try {
      const html = await this.pdfService.convertToHtml(file.buffer);
      this.logger.log(`PDF conversion successful (HTML length: ${html.length})`);
      return { html };
    } catch (error) {
      this.logger.error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException(
        `Failed to convert PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post('convert-to-docx')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Convert PDF to DOCX', description: 'Converts PDF file to Microsoft Word document format' })
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
  @ApiResponse({ status: 200, description: 'Successfully converted PDF to DOCX', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  @ApiResponse({ status: 400, description: 'Invalid file or validation error' })
  async convertToDocx(
    @UploadedFile() file: Express.Multer.File | undefined,
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

    this.logger.log(`Converting PDF to DOCX: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
    try {
      const docxBuffer = await this.pdfService.convertToDocx(file.buffer);
      
      // Set response headers for file download
      const fileName = file.originalname.replace(/\.pdf$/i, '.docx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', docxBuffer.length.toString());
      
      this.logger.log(`PDF to DOCX conversion successful (DOCX size: ${(docxBuffer.length / 1024).toFixed(2)} KB)`);
      res.send(docxBuffer);
    } catch (error) {
      this.logger.error(`PDF to DOCX conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException(
        `Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

