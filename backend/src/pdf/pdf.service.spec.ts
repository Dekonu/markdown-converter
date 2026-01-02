import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertToHtml', () => {
    it('should handle empty buffer', async () => {
      const buffer = Buffer.from('');
      await expect(service.convertToHtml(buffer)).rejects.toThrow();
    });

    it('should handle invalid PDF buffer', async () => {
      const buffer = Buffer.from('not a pdf');
      await expect(service.convertToHtml(buffer)).rejects.toThrow();
    });
  });

  describe('convertToDocx', () => {
    it('should handle empty buffer', async () => {
      const buffer = Buffer.from('');
      await expect(service.convertToDocx(buffer)).rejects.toThrow();
    });

    it('should handle invalid PDF buffer', async () => {
      const buffer = Buffer.from('not a pdf');
      await expect(service.convertToDocx(buffer)).rejects.toThrow();
    });
  });
});

