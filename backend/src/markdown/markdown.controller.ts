import { Body, Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MarkdownService } from './markdown.service';
import { ConvertMarkdownDto, ConvertMarkdownResponse } from './dto/convert-markdown.dto';

@ApiTags('markdown')
@Controller('api/markdown')
export class MarkdownController {
  private readonly logger = new Logger(MarkdownController.name);

  constructor(private readonly markdownService: MarkdownService) {}

  @Post('convert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert Markdown to HTML', description: 'Converts markdown text to HTML format' })
  @ApiBody({ type: ConvertMarkdownDto })
  @ApiResponse({ status: 200, description: 'Successfully converted markdown to HTML', type: ConvertMarkdownResponse })
  @ApiResponse({ status: 400, description: 'Invalid input or validation error' })
  convert(@Body() convertMarkdownDto: ConvertMarkdownDto): ConvertMarkdownResponse {
    this.logger.log(`Converting markdown (length: ${convertMarkdownDto.markdown.length})`);
    const html = this.markdownService.convertToHtml(convertMarkdownDto.markdown);
    this.logger.log(`Conversion successful (HTML length: ${html.length})`);
    return { html };
  }
}

