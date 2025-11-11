import { Injectable } from '@nestjs/common';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Use require for pdf-parse as it's a CommonJS module
// pdf-parse v2.x exports PDFParse as a class, but we can use it as a function
// by instantiating the class and calling getText() after loading
const pdfParseModule = require('pdf-parse');

// Create a wrapper function that uses the PDFParse class correctly
const pdfParse = async (buffer: Buffer, options?: any) => {
  // PDFParse expects Uint8Array, not Buffer
  const uint8Array = new Uint8Array(buffer);
  const parser = new pdfParseModule.PDFParse(uint8Array, options);
  await parser.load();
  // getText() is an async method, so we need to await it
  const textResult = await parser.getText();
  
  // getText() should return a string, but handle edge cases
  let textStr: string;
  if (typeof textResult === 'string') {
    textStr = textResult;
  } else if (textResult && typeof textResult === 'object' && 'text' in textResult) {
    textStr = String(textResult.text || '');
  } else {
    textStr = String(textResult || '');
  }
  
  return { text: textStr };
};

@Injectable()
export class PdfService {
  async convertToHtml(pdfBuffer: Buffer): Promise<string> {
    try {
      // Ensure pdfParse is a function
      if (typeof pdfParse !== 'function') {
        throw new Error('pdf-parse module is not a function. Module type: ' + typeof pdfParse);
      }
      const data = await pdfParse(pdfBuffer);
      const text = data.text;
      
      // Convert plain text to HTML with basic formatting
      // Split by paragraphs (double newlines)
      const paragraphs = text
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0)
        .map((p) => p.trim().replace(/\n/g, '<br>'));
      
      // Wrap each paragraph in <p> tags
      const html = paragraphs.map((p) => `<p>${p}</p>`).join('\n');
      
      return html || '<p>No text content found in PDF.</p>';
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async convertToDocx(pdfBuffer: Buffer): Promise<Buffer> {
    try {
      // Ensure pdfParse is a function
      if (typeof pdfParse !== 'function') {
        throw new Error('pdf-parse module is not a function. Module type: ' + typeof pdfParse);
      }
      const data = await pdfParse(pdfBuffer);
      const text = typeof data.text === 'string' ? data.text : String(data.text || '');
      
      if (!text || (typeof text === 'string' && text.trim().length === 0)) {
        throw new Error('No text content found in PDF');
      }

      // Split text into paragraphs
      const textStr = typeof text === 'string' ? text : String(text);
      const paragraphs = textStr
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0)
        .map((p) => p.trim());

      // Create DOCX document with paragraphs
      const docParagraphs = paragraphs.map((para) => {
        // Split paragraph into lines and create text runs
        const lines = para.split('\n');
        const textRuns = lines.flatMap((line, index) => {
          const runs: TextRun[] = [
            new TextRun({
              text: line,
              break: index < lines.length - 1 ? 1 : 0,
            }),
          ];
          return runs;
        });

        return new Paragraph({
          children: textRuns.length > 0 ? textRuns : [new TextRun({ text: para })],
        });
      });

      // If no paragraphs, create at least one with the full text
      if (docParagraphs.length === 0) {
        docParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: text.trim() })],
          }),
        );
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docParagraphs,
          },
        ],
      });

      // Generate DOCX buffer
      const buffer = await Packer.toBuffer(doc);
      return buffer;
    } catch (error) {
      throw new Error(`Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

