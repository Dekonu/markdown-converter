import type { Response } from 'express';
import { PdfService } from './pdf.service';
import { ConvertPdfResponse } from './dto/convert-pdf.dto';
export declare class PdfController {
    private readonly pdfService;
    private readonly logger;
    constructor(pdfService: PdfService);
    convert(file: Express.Multer.File | undefined): Promise<ConvertPdfResponse>;
    convertToDocx(file: Express.Multer.File | undefined, res: Response): Promise<void>;
}
