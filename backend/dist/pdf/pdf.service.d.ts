export declare class PdfService {
    convertToHtml(pdfBuffer: Buffer): Promise<string>;
    convertToDocx(pdfBuffer: Buffer): Promise<Buffer>;
}
