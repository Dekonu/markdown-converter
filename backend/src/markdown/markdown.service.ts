import { Injectable } from '@nestjs/common';
import { marked } from 'marked';

@Injectable()
export class MarkdownService {
  convertToHtml(markdown: string): string {
    // Configure marked for synchronous parsing
    return marked.parse(markdown) as string;
  }
}

