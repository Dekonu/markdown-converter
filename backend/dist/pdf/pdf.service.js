"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const docx_1 = require("docx");
const pdfParseModule = require('pdf-parse');
const pdfParse = async (buffer, options) => {
    const uint8Array = new Uint8Array(buffer);
    const parser = new pdfParseModule.PDFParse(uint8Array, options);
    await parser.load();
    const textResult = await parser.getText();
    let textStr;
    if (typeof textResult === 'string') {
        textStr = textResult;
    }
    else if (textResult && typeof textResult === 'object' && 'text' in textResult) {
        textStr = String(textResult.text || '');
    }
    else {
        textStr = String(textResult || '');
    }
    return { text: textStr };
};
let PdfService = class PdfService {
    async convertToHtml(pdfBuffer) {
        try {
            if (typeof pdfParse !== 'function') {
                throw new Error('pdf-parse module is not a function. Module type: ' + typeof pdfParse);
            }
            const data = await pdfParse(pdfBuffer);
            const text = data.text;
            const paragraphs = text
                .split(/\n\s*\n/)
                .filter((p) => p.trim().length > 0)
                .map((p) => p.trim().replace(/\n/g, '<br>'));
            const html = paragraphs.map((p) => `<p>${p}</p>`).join('\n');
            return html || '<p>No text content found in PDF.</p>';
        }
        catch (error) {
            throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async convertToDocx(pdfBuffer) {
        try {
            if (typeof pdfParse !== 'function') {
                throw new Error('pdf-parse module is not a function. Module type: ' + typeof pdfParse);
            }
            const data = await pdfParse(pdfBuffer);
            const text = typeof data.text === 'string' ? data.text : String(data.text || '');
            if (!text || (typeof text === 'string' && text.trim().length === 0)) {
                throw new Error('No text content found in PDF');
            }
            const textStr = typeof text === 'string' ? text : String(text);
            const paragraphs = textStr
                .split(/\n\s*\n/)
                .filter((p) => p.trim().length > 0)
                .map((p) => p.trim());
            const docParagraphs = paragraphs.map((para) => {
                const lines = para.split('\n');
                const textRuns = lines.flatMap((line, index) => {
                    const runs = [
                        new docx_1.TextRun({
                            text: line,
                            break: index < lines.length - 1 ? 1 : 0,
                        }),
                    ];
                    return runs;
                });
                return new docx_1.Paragraph({
                    children: textRuns.length > 0 ? textRuns : [new docx_1.TextRun({ text: para })],
                });
            });
            if (docParagraphs.length === 0) {
                docParagraphs.push(new docx_1.Paragraph({
                    children: [new docx_1.TextRun({ text: text.trim() })],
                }));
            }
            const doc = new docx_1.Document({
                sections: [
                    {
                        properties: {},
                        children: docParagraphs,
                    },
                ],
            });
            const buffer = await docx_1.Packer.toBuffer(doc);
            return buffer;
        }
        catch (error) {
            throw new Error(`Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map