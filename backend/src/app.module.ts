import { Module } from '@nestjs/common';
import { MarkdownModule } from './markdown/markdown.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [MarkdownModule, PdfModule],
})
export class AppModule {}
