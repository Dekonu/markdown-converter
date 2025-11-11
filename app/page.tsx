"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ConversionType = "markdown" | "pdf" | "pdf-to-docx";

export default function Home() {
  const [conversionType, setConversionType] = useState<ConversionType>("markdown");
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Converter

This is a simple markdown to HTML converter.

## Features

- **Bold** and *italic* text
- Lists (ordered and unordered)
- Code blocks
- Links and images

## Example Code

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Links

Visit [Next.js](https://nextjs.org) for more information.

> This is a blockquote example.

- Item 1
- Item 2
- Item 3`);

  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    const convertMarkdown = async () => {
      if (conversionType !== "markdown" || !markdown.trim()) {
        setHtml("");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/markdown/convert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markdown }),
        });

        if (!response.ok) {
          throw new Error("Failed to convert markdown");
        }

        const data = await response.json();
        setHtml(data.html);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setHtml("");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      convertMarkdown();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [markdown, conversionType]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      // Reset input if no file selected
      event.target.value = '';
      return;
    }

    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    setFileName(file.name);
    setError(null);
    setIsLoading(true);

    try {
      if (conversionType === "markdown") {
        // Handle markdown files
        if (!file.name.match(/\.(md|markdown|txt)$/i)) {
          setError("Please upload a .md, .markdown, or .txt file");
          setFileName(null);
          setIsLoading(false);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setMarkdown(content);
          setIsLoading(false);
        };
        reader.onerror = () => {
          setError("Failed to read file");
          setFileName(null);
          setIsLoading(false);
        };
        reader.readAsText(file);
      } else if (conversionType === "pdf") {
        // Handle PDF to HTML conversion
        if (!file.name.match(/\.pdf$/i)) {
          setError("Please upload a .pdf file");
          setFileName(null);
          setIsLoading(false);
          return;
        }

        // Convert PDF to HTML via API
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/api/pdf/convert`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to convert PDF");
        }

        const data = await response.json();
        setHtml(data.html);
        setDocxBlob(null);
        setIsLoading(false);
      } else if (conversionType === "pdf-to-docx") {
        // Handle PDF to DOCX conversion
        if (!file.name.match(/\.pdf$/i)) {
          setError("Please upload a .pdf file");
          setFileName(null);
          setIsLoading(false);
          return;
        }

        // Convert PDF to DOCX via API
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/api/pdf/convert-to-docx`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to convert PDF to DOCX");
        }

        const blob = await response.blob();
        setDocxBlob(blob);
        setHtml("");
        setIsLoading(false);
      }
    } catch (err) {
      console.error('File upload error:', err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setFileName(null);
      setIsLoading(false);
    } finally {
      // Reset file input to allow selecting the same file again
      if (event.target) {
        event.target.value = '';
      }
      setFileInputKey(prev => prev + 1);
    }
  };

  const handleClearFile = () => {
    setFileName(null);
    setMarkdown("");
    setHtml("");
    setDocxBlob(null);
    setFileInputKey(prev => prev + 1);
    // Clear the file input
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleDownloadDocx = () => {
    if (!docxBlob || !fileName) return;
    
    const url = window.URL.createObjectURL(docxBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.pdf$/i, ".docx");
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleConversionTypeChange = (type: ConversionType) => {
    setConversionType(type);
    setMarkdown("");
    setHtml("");
    setFileName(null);
    setError(null);
    setDocxBlob(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Document to HTML Converter
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Convert Markdown or PDF files to HTML, or convert PDF to DOCX
          </p>
          
          {/* Conversion Type Selector */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <label htmlFor="conversion-type" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Conversion Type:
            </label>
            <select
              id="conversion-type"
              value={conversionType}
              onChange={(e) => handleConversionTypeChange(e.target.value as ConversionType)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
            >
              <option value="markdown">Markdown to HTML</option>
              <option value="pdf">PDF to HTML</option>
              <option value="pdf-to-docx">PDF to DOCX</option>
            </select>
          </div>

          {/* File Upload Section */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <label 
              htmlFor="file-upload-input"
              className="cursor-pointer px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload {conversionType === "markdown" ? "Markdown" : "PDF"} File
            </label>
            <input
              key={fileInputKey}
              type="file"
              accept={conversionType === "markdown" ? ".md,.markdown,.txt" : ".pdf"}
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload-input"
            />
            {fileName && (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {fileName}
                </span>
                <button
                  onClick={handleClearFile}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                  aria-label="Clear file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className={`grid gap-6 h-[calc(100vh-200px)] ${conversionType === "markdown" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          {/* Markdown Input - Only shown for markdown conversion */}
          {conversionType === "markdown" && (
            <div className="flex flex-col">
              <label
                htmlFor="markdown-input"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Markdown Input
              </label>
              <textarea
                id="markdown-input"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                placeholder="Enter your markdown here..."
              />
            </div>
          )}
          
          {/* PDF Upload Info - Shown when PDF conversion is selected */}
          {(conversionType === "pdf" || conversionType === "pdf-to-docx") && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-8">
              {fileName ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-zinc-700 dark:text-zinc-300 font-semibold mb-2">
                    {fileName}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-center text-sm">
                    PDF uploaded successfully. {conversionType === "pdf" ? "HTML conversion is shown on the right." : "Click the download button to get your DOCX file."}
                  </p>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-zinc-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-zinc-600 dark:text-zinc-400 text-center px-4">
                    Upload a PDF file to convert it to {conversionType === "pdf" ? "HTML" : "DOCX"}
                  </p>
                </>
              )}
            </div>
          )}

          {/* HTML Output - Only shown for markdown and PDF to HTML */}
          {(conversionType === "markdown" || conversionType === "pdf") && (
            <div className="flex flex-col">
              <label
                htmlFor="html-output"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
              >
                HTML Output
                {isLoading && (
                  <span className="ml-2 text-xs text-zinc-500">Converting...</span>
                )}
              </label>
              <div className="flex-1 w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 overflow-auto">
                {error ? (
                  <div className="text-red-600 dark:text-red-400">
                    Error: {error}. Make sure the backend API is running on port 3001.
                  </div>
                ) : (
                  <div
                    className="prose prose-zinc dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                )}
              </div>
            </div>
          )}

          {/* DOCX Download Section - Shown for PDF to DOCX */}
          {conversionType === "pdf-to-docx" && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-8">
              {error ? (
                <div className="text-red-600 dark:text-red-400 text-center">
                  Error: {error}. Make sure the backend API is running on port 3001.
                </div>
              ) : docxBlob ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-zinc-700 dark:text-zinc-300 font-semibold mb-4">
                    Conversion Complete!
                  </p>
                  <button
                    onClick={handleDownloadDocx}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download DOCX
                  </button>
                </>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400 text-center">
                  {isLoading ? "Converting PDF to DOCX..." : "Upload a PDF file to convert it to DOCX"}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Copy HTML Button - Only shown for markdown and PDF to HTML */}
        {(conversionType === "markdown" || conversionType === "pdf") && html && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(html);
                alert("HTML copied to clipboard!");
              }}
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Copy HTML to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
