import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertMarkdownDto {
  @ApiProperty({
    description: 'Markdown text to convert to HTML',
    example: '# Hello World\n\nThis is **bold** text.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Markdown content is required' })
  markdown: string;
}

export class ConvertMarkdownResponse {
  @ApiProperty({
    description: 'Converted HTML output',
    example: '<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>',
  })
  html: string;
}

