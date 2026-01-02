import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

describe('PdfController', () => {
  let controller: PdfController;
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PdfService],
    }).compile();

    controller = module.get<PdfController>(PdfController);
    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

