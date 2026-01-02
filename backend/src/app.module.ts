import { Module } from '@nestjs/common';
import { MarkdownModule } from './markdown/markdown.module';
import { PdfModule } from './pdf/pdf.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [MarkdownModule, PdfModule],
  controllers: [HealthController],
})
export class AppModule {}
