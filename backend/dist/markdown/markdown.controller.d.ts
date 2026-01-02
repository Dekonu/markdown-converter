import { MarkdownService } from './markdown.service';
import { ConvertMarkdownDto, ConvertMarkdownResponse } from './dto/convert-markdown.dto';
export declare class MarkdownController {
    private readonly markdownService;
    private readonly logger;
    constructor(markdownService: MarkdownService);
    convert(convertMarkdownDto: ConvertMarkdownDto): ConvertMarkdownResponse;
}
