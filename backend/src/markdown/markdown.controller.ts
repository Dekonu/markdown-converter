import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { ConvertMarkdownDto, ConvertMarkdownResponse } from './dto/convert-markdown.dto';

@Controller('api/markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Post('convert')
  convert(@Body() convertMarkdownDto: ConvertMarkdownDto): ConvertMarkdownResponse {
    if (!convertMarkdownDto?.markdown || typeof convertMarkdownDto.markdown !== 'string') {
      throw new BadRequestException('Markdown content is required and must be a string');
    }

    try {
      const html = this.markdownService.convertToHtml(convertMarkdownDto.markdown);
      return { html };
    } catch (error) {
      throw new BadRequestException(
        `Failed to convert markdown: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

