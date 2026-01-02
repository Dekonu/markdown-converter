type ConversionType = "markdown" | "pdf" | "pdf-to-docx";

interface FileUploadProps {
  conversionType: ConversionType;
  fileName: string | null;
  fileSize?: number;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  fileInputKey: number;
}

export function FileUpload({
  conversionType,
  fileName,
  fileSize,
  onFileSelect,
  onClear,
  fileInputKey,
}: FileUploadProps) {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
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
          aria-hidden="true"
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
        onChange={onFileSelect}
        className="hidden"
        id="file-upload-input"
        aria-label="Upload file"
      />
      {fileName && (
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {fileName}
            {fileSize && <span className="ml-2 text-zinc-500 dark:text-zinc-400">({formatFileSize(fileSize)})</span>}
          </span>
          <button
            onClick={onClear}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
            aria-label="Clear file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
  );
}

