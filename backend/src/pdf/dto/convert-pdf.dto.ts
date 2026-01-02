import { ApiProperty } from '@nestjs/swagger';

export class ConvertPdfResponse {
  @ApiProperty({
    description: 'Converted HTML output from PDF',
    example: '<p>Extracted text from PDF...</p>',
  })
  html: string;
}

