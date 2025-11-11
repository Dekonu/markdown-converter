import { MarkdownService } from './markdown.service';
interface ConvertMarkdownDto {
    markdown: string;
}
interface ConvertMarkdownResponse {
    html: string;
}
export declare class MarkdownController {
    private readonly markdownService;
    constructor(markdownService: MarkdownService);
    convert(convertMarkdownDto: ConvertMarkdownDto): ConvertMarkdownResponse;
}
export {};
