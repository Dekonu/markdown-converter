"use client";

import { useState, useEffect } from "react";
import { ConversionTypeSelector } from "./components/ConversionTypeSelector";
import { FileUpload } from "./components/FileUpload";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { HtmlPreview } from "./components/HtmlPreview";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useToastContext } from "./contexts/ToastContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ConversionType = "markdown" | "pdf" | "pdf-to-docx";

const DEFAULT_MARKDOWN = `# Welcome to Markdown Converter

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
- Item 3`;

export default function Home() {
  const { showToast } = useToastContext();
  const [conversionType, setConversionType] = useState<ConversionType>("markdown");
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to convert markdown");
        }

        const data = await response.json();
        setHtml(data.html);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setHtml("");
        showToast(errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      convertMarkdown();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [markdown, conversionType, showToast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = '';
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setError(null);
    setIsLoading(true);

    try {
      if (conversionType === "markdown") {
        if (!file.name.match(/\.(md|markdown|txt)$/i)) {
          setError("Please upload a .md, .markdown, or .txt file");
          setFileName(null);
          setFileSize(undefined);
          setIsLoading(false);
          showToast("Invalid file type. Please upload a .md, .markdown, or .txt file", "error");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setMarkdown(content);
          setIsLoading(false);
          showToast("Markdown file loaded successfully", "success");
        };
        reader.onerror = () => {
          setError("Failed to read file");
          setFileName(null);
          setFileSize(undefined);
          setIsLoading(false);
          showToast("Failed to read file", "error");
        };
        reader.readAsText(file);
      } else if (conversionType === "pdf") {
        if (!file.name.match(/\.pdf$/i)) {
          setError("Please upload a .pdf file");
          setFileName(null);
          setFileSize(undefined);
          setIsLoading(false);
          showToast("Please upload a .pdf file", "error");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/api/pdf/convert`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to convert PDF");
        }

        const data = await response.json();
        setHtml(data.html);
        setDocxBlob(null);
        setIsLoading(false);
        showToast("PDF converted to HTML successfully", "success");
      } else if (conversionType === "pdf-to-docx") {
        if (!file.name.match(/\.pdf$/i)) {
          setError("Please upload a .pdf file");
          setFileName(null);
          setFileSize(undefined);
          setIsLoading(false);
          showToast("Please upload a .pdf file", "error");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/api/pdf/convert-to-docx`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to convert PDF to DOCX");
        }

        const blob = await response.blob();
        setDocxBlob(blob);
        setHtml("");
        setIsLoading(false);
        showToast("PDF converted to DOCX successfully", "success");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setFileName(null);
      setFileSize(undefined);
      setIsLoading(false);
      showToast(errorMessage, "error");
    } finally {
      if (event.target) {
        event.target.value = '';
      }
      setFileInputKey(prev => prev + 1);
    }
  };

  const handleClearFile = () => {
    setFileName(null);
    setFileSize(undefined);
    setMarkdown(DEFAULT_MARKDOWN);
    setHtml("");
    setDocxBlob(null);
    setFileInputKey(prev => prev + 1);
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
    showToast("DOCX file downloaded", "success");
  };

  const handleConversionTypeChange = (type: ConversionType) => {
    setConversionType(type);
    setMarkdown(DEFAULT_MARKDOWN);
    setHtml("");
    setFileName(null);
    setFileSize(undefined);
    setError(null);
    setDocxBlob(null);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
    showToast("HTML copied to clipboard!", "success");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Document Converter
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Convert Markdown or PDF files to HTML, or convert PDF to DOCX
          </p>
          
          <ConversionTypeSelector
            conversionType={conversionType}
            onChange={handleConversionTypeChange}
          />

          <FileUpload
            conversionType={conversionType}
            fileName={fileName}
            fileSize={fileSize}
            onFileSelect={handleFileUpload}
            onClear={handleClearFile}
            fileInputKey={fileInputKey}
          />
        </header>

        <div className={`grid gap-6 h-[calc(100vh-200px)] ${conversionType === "markdown" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          {conversionType === "markdown" && (
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          )}
          
          {(conversionType === "pdf" || conversionType === "pdf-to-docx") && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-8">
              {isLoading ? (
                <LoadingSpinner />
              ) : fileName ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
                    aria-hidden="true"
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

          {(conversionType === "markdown" || conversionType === "pdf") && (
            <HtmlPreview html={html} isLoading={isLoading} error={error} />
          )}

          {conversionType === "pdf-to-docx" && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-8">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="text-red-600 dark:text-red-400 text-center" role="alert">
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
                    aria-hidden="true"
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
                    aria-label="Download DOCX file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
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
                  Upload a PDF file to convert it to DOCX
                </p>
              )}
            </div>
          )}
        </div>

        {(conversionType === "markdown" || conversionType === "pdf") && html && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCopyHtml}
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              aria-label="Copy HTML to clipboard"
            >
              Copy HTML to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
