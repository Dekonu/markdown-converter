import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarkdownService],
    }).compile();

    service = module.get<MarkdownService>(MarkdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertToHtml', () => {
    it('should convert simple markdown to HTML', () => {
      const markdown = '# Hello World';
      const html = service.convertToHtml(markdown);
      expect(html).toContain('<h1>Hello World</h1>');
    });

    it('should convert bold text', () => {
      const markdown = 'This is **bold** text';
      const html = service.convertToHtml(markdown);
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should convert italic text', () => {
      const markdown = 'This is *italic* text';
      const html = service.convertToHtml(markdown);
      expect(html).toContain('<em>italic</em>');
    });

    it('should convert code blocks', () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      const html = service.convertToHtml(markdown);
      expect(html).toContain('<code');
    });

    it('should convert links', () => {
      const markdown = '[Next.js](https://nextjs.org)';
      const html = service.convertToHtml(markdown);
      expect(html).toContain('<a');
      expect(html).toContain('href="https://nextjs.org"');
    });

    it('should handle empty string', () => {
      const html = service.convertToHtml('');
      expect(typeof html).toBe('string');
    });

    it('should handle multiline markdown', () => {
      const markdown = '# Title\n\nParagraph text';
      const html = service.convertToHtml(markdown);
      expect(html).toContain('<h1>Title</h1>');
      expect(html).toContain('<p>Paragraph text</p>');
    });
  });
});

