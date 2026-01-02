type ConversionType = "markdown" | "pdf" | "pdf-to-docx";

interface ConversionTypeSelectorProps {
  conversionType: ConversionType;
  onChange: (type: ConversionType) => void;
}

export function ConversionTypeSelector({ conversionType, onChange }: ConversionTypeSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <label htmlFor="conversion-type" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Conversion Type:
      </label>
      <select
        id="conversion-type"
        value={conversionType}
        onChange={(e) => onChange(e.target.value as ConversionType)}
        className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
        aria-label="Select conversion type"
      >
        <option value="markdown">Markdown to HTML</option>
        <option value="pdf">PDF to HTML</option>
        <option value="pdf-to-docx">PDF to DOCX</option>
      </select>
    </div>
  );
}

