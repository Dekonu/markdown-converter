# Backend API - Document Converter

NestJS backend API for converting documents between different formats.

## Features

- **Markdown to HTML**: Convert markdown text to HTML
- **PDF to HTML**: Extract text from PDF files and convert to HTML
- **PDF to DOCX**: Convert PDF files to Microsoft Word documents

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **marked** - Markdown parser
- **pdf-parse** - PDF text extraction
- **docx** - DOCX document generation

## Project Structure

```
backend/
├── src/
│   ├── markdown/          # Markdown conversion module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── markdown.controller.ts
│   │   ├── markdown.service.ts
│   │   └── markdown.module.ts
│   ├── pdf/               # PDF conversion module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── pdf.controller.ts
│   │   ├── pdf.service.ts
│   │   └── pdf.module.ts
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
└── test/                  # E2E tests
```

## API Endpoints

### Markdown Conversion

**POST** `/api/markdown/convert`

Convert markdown text to HTML.

**Request Body:**
```json
{
  "markdown": "# Hello World\n\nThis is **bold** text."
}
```

**Response:**
```json
{
  "html": "<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>"
}
```

### PDF to HTML

**POST** `/api/pdf/convert`

Convert PDF file to HTML (extracts text content).

**Request:** Multipart form data with `file` field containing PDF file

**Response:**
```json
{
  "html": "<p>Extracted text from PDF...</p>"
}
```

**Limitations:**
- Maximum file size: 10MB
- Only text-based PDFs are supported (scanned PDFs may not work)

### PDF to DOCX

**POST** `/api/pdf/convert-to-docx`

Convert PDF file to Microsoft Word document.

**Request:** Multipart form data with `file` field containing PDF file

**Response:** DOCX file download

**Limitations:**
- Maximum file size: 10MB
- Only text-based PDFs are supported (scanned PDFs may not work)

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Architecture Notes

- **Modular Design**: Each conversion type (markdown, PDF) is organized in its own module
- **DTOs**: Data Transfer Objects for type safety and API contracts
- **Error Handling**: Comprehensive error handling with meaningful messages
- **File Size Validation**: 10MB limit on file uploads
- **CORS**: Configured for Next.js frontend integration
