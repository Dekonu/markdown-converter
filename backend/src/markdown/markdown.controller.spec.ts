import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownController } from './markdown.controller';
import { MarkdownService } from './markdown.service';

describe('MarkdownController', () => {
  let controller: MarkdownController;
  let service: MarkdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkdownController],
      providers: [MarkdownService],
    }).compile();

    controller = module.get<MarkdownController>(MarkdownController);
    service = module.get<MarkdownService>(MarkdownService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('convert', () => {
    it('should convert markdown to HTML', () => {
      const dto = { markdown: '# Hello' };
      const result = controller.convert(dto);
      
      expect(result).toHaveProperty('html');
      expect(result.html).toContain('<h1>Hello</h1>');
    });

    it('should handle empty markdown', () => {
      const dto = { markdown: '' };
      const result = controller.convert(dto);
      
      expect(result).toHaveProperty('html');
      expect(typeof result.html).toBe('string');
    });
  });
});

