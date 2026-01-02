interface HtmlPreviewProps {
  html: string;
  isLoading: boolean;
  error: string | null;
}

export function HtmlPreview({ html, isLoading, error }: HtmlPreviewProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="html-output"
        className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
      >
        HTML Output
        {isLoading && (
          <span className="ml-2 text-xs text-zinc-500">
            <span className="inline-block animate-spin mr-1">⏳</span>
            Converting...
          </span>
        )}
      </label>
      <div className="flex-1 w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 overflow-auto">
        {error ? (
          <div className="text-red-600 dark:text-red-400" role="alert">
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
  );
}

