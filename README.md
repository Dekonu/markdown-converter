# Markdown to HTML Converter

A full-stack application for converting Markdown to HTML, built with Next.js (frontend) and NestJS (backend API).

## Architecture

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: NestJS API running on port 3001
- **API Endpoint**: `POST /api/markdown/convert`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Running the Application

You can run both the frontend and backend services together or separately:

#### Option 1: Run both together (Easiest)

**From the root directory:**
```bash
npm run dev
```

**Or from the `mdconverter` directory:**
```bash
cd mdconverter
npm run dev:all
```

This will start both:
- Frontend on [http://localhost:3000](http://localhost:3000)
- Backend API on [http://localhost:3001](http://localhost:3001)

#### Option 2: Run separately (Recommended for debugging)

**Terminal 1 - Backend API:**
```bash
cd mdconverter/backend
npm install
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd mdconverter
npm install
npm run dev
```

## API Documentation

### Convert Markdown to HTML

**Endpoint:** `POST /api/markdown/convert`

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

## Features

- Real-time markdown to HTML conversion
- Debounced API calls for better performance
- Loading states and error handling
- Copy HTML to clipboard
- Dark mode support
- Responsive design

## Project Structure

```
mdconverter/
├── app/              # Next.js frontend
│   ├── page.tsx      # Main converter UI
│   └── ...
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── markdown/ # Markdown conversion module
│   │   └── ...
│   └── ...
└── ...
```

## Development

### Backend Development

```bash
cd backend
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Frontend Development

```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Run production build
```

## Environment Variables

You can configure the API URL using environment variables:

Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Technologies Used

- **Next.js 16** - React framework
- **NestJS** - Node.js framework for building APIs
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **marked** - Markdown parser (used in backend)
