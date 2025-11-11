import { Body, Controller, Post } from '@nestjs/common';
import { MarkdownService } from './markdown.service';

interface ConvertMarkdownDto {
  markdown: string;
}

interface ConvertMarkdownResponse {
  html: string;
}

@Controller('api/markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Post('convert')
  convert(@Body() convertMarkdownDto: ConvertMarkdownDto): ConvertMarkdownResponse {
    const html = this.markdownService.convertToHtml(convertMarkdownDto.markdown);
    return { html };
  }
}

