import type { Response } from 'express';
import { PdfService } from './pdf.service';
interface ConvertPdfResponse {
    html: string;
}
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    convert(file: Express.Multer.File): Promise<ConvertPdfResponse>;
    convertToDocx(file: Express.Multer.File, res: Response): Promise<void>;
}
export {};
