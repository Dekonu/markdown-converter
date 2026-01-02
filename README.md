# Document Converter

A full-stack document conversion application demonstrating modern web development practices with Next.js and NestJS. Convert between Markdown, HTML, PDF, and DOCX formats with a clean, responsive interface.

## 🚀 Features

- **Markdown to HTML**: Real-time conversion with live preview
- **PDF to HTML**: Extract and convert PDF text content to HTML
- **PDF to DOCX**: Convert PDF files to Microsoft Word documents
- **File Upload**: Drag-and-drop or click to upload files
- **Real-time Preview**: See conversions instantly as you type
- **Dark Mode**: Built-in dark mode support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and validation

## 🏗️ Architecture

This project demonstrates a modern full-stack architecture:

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: NestJS REST API with modular architecture
- **Type Safety**: End-to-end TypeScript for both frontend and backend
- **Separation of Concerns**: Clean separation between UI and business logic

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## 🚦 Getting Started

### Quick Start (Run Both Services)

From the root directory:

```bash
# Install dependencies for both frontend and backend
npm install
cd backend && npm install && cd ..

# Run both services concurrently
npm run dev:all
```

This starts:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

### Run Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

## 📚 API Documentation

### Markdown to HTML

**Endpoint:** `POST /api/markdown/convert`

**Request:**
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

**Endpoint:** `POST /api/pdf/convert`

**Request:** Multipart form data with `file` field (PDF file)

**Response:**
```json
{
  "html": "<p>Extracted text from PDF...</p>"
}
```

**Limitations:**
- Maximum file size: 10MB
- Text-based PDFs only (scanned PDFs may not work)

### PDF to DOCX

**Endpoint:** `POST /api/pdf/convert-to-docx`

**Request:** Multipart form data with `file` field (PDF file)

**Response:** DOCX file download

**Limitations:**
- Maximum file size: 10MB
- Text-based PDFs only (scanned PDFs may not work)

## 📁 Project Structure

```
markdown-converter/
├── app/                    # Next.js frontend (App Router)
│   ├── page.tsx           # Main converter UI
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── backend/               # NestJS backend API
│   ├── src/
│   │   ├── markdown/      # Markdown conversion module
│   │   │   ├── dto/       # Data Transfer Objects
│   │   │   ├── markdown.controller.ts
│   │   │   ├── markdown.service.ts
│   │   │   └── markdown.module.ts
│   │   ├── pdf/          # PDF conversion module
│   │   │   ├── dto/      # Data Transfer Objects
│   │   │   ├── pdf.controller.ts
│   │   │   ├── pdf.service.ts
│   │   │   └── pdf.module.ts
│   │   ├── app.module.ts # Root module
│   │   └── main.ts       # Application entry point
│   └── test/             # E2E tests
├── public/               # Static assets
└── package.json         # Frontend dependencies
```

## 🛠️ Development

### Frontend Development

```bash
npm run dev          # Development server with hot reload
npm run build        # Production build
npm run start        # Run production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
```

## ⚙️ Environment Variables

### Frontend

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend

Create `.env` in the `backend/` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run test:cov     # Test coverage
```

## 🎨 Technologies Used

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **marked** - Markdown parser
- **pdf-parse** - PDF text extraction
- **docx** - DOCX document generation

## 📝 Code Quality

- **TypeScript**: Full type safety across the stack
- **Modular Architecture**: Clean separation of concerns
- **DTOs**: Data Transfer Objects for API contracts
- **Error Handling**: Comprehensive error handling with meaningful messages
- **File Validation**: Size limits and type checking

## 🔒 Security Considerations

- File size limits (10MB)
- File type validation
- CORS configuration
- Input validation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development skills. Feel free to fork and use as a reference!

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
