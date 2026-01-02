"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PdfController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const pdf_service_1 = require("./pdf.service");
const convert_pdf_dto_1 = require("./dto/convert-pdf.dto");
let PdfController = PdfController_1 = class PdfController {
    pdfService;
    logger = new common_1.Logger(PdfController_1.name);
    constructor(pdfService) {
        this.pdfService = pdfService;
    }
    async convert(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (file.mimetype !== 'application/pdf') {
            throw new common_1.BadRequestException('File must be a PDF');
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size exceeds 10MB limit');
        }
        this.logger.log(`Converting PDF to HTML: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
        try {
            const html = await this.pdfService.convertToHtml(file.buffer);
            this.logger.log(`PDF conversion successful (HTML length: ${html.length})`);
            return { html };
        }
        catch (error) {
            this.logger.error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new common_1.BadRequestException(`Failed to convert PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async convertToDocx(file, res) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (file.mimetype !== 'application/pdf') {
            throw new common_1.BadRequestException('File must be a PDF');
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size exceeds 10MB limit');
        }
        this.logger.log(`Converting PDF to DOCX: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
        try {
            const docxBuffer = await this.pdfService.convertToDocx(file.buffer);
            const fileName = file.originalname.replace(/\.pdf$/i, '.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', docxBuffer.length.toString());
            this.logger.log(`PDF to DOCX conversion successful (DOCX size: ${(docxBuffer.length / 1024).toFixed(2)} KB)`);
            res.send(docxBuffer);
        }
        catch (error) {
            this.logger.error(`PDF to DOCX conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new common_1.BadRequestException(`Failed to convert PDF to DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Post)('convert'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Convert PDF to HTML', description: 'Extracts text from PDF and converts to HTML' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully converted PDF to HTML', type: convert_pdf_dto_1.ConvertPdfResponse }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or validation error' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "convert", null);
__decorate([
    (0, common_1.Post)('convert-to-docx'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Convert PDF to DOCX', description: 'Converts PDF file to Microsoft Word document format' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully converted PDF to DOCX', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file or validation error' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "convertToDocx", null);
exports.PdfController = PdfController = PdfController_1 = __decorate([
    (0, swagger_1.ApiTags)('pdf'),
    (0, common_1.Controller)('api/pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map