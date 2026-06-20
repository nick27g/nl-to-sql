'use client';

interface QueryInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function QueryInput({ onSubmit, loading, value, onChange }: QueryInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Show all critical incidents reported in 2024..."
        rows={3}
        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 resize-none focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="self-end rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Generating…' : 'Generate & Run'}
      </button>
    </form>
  );
}
