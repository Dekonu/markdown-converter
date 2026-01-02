interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="markdown-input"
        className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
      >
        Markdown Input
      </label>
      <textarea
        id="markdown-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
        placeholder="Enter your markdown here..."
        aria-label="Markdown input"
      />
    </div>
  );
}

