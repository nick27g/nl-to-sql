'use client';

import { useState } from 'react';
import SchemaPanel from '@/components/SchemaPanel';
import QueryInput from '@/components/QueryInput';
import SqlDisplay from '@/components/SqlDisplay';
import ResultsTable from '@/components/ResultsTable';

const EXAMPLE_PROMPTS = [
  'Show all critical incidents',
  'List personnel hired after 2022',
  'Show all failed login attempts',
];

interface QueryResult {
  sql?: string;
  results?: Record<string, unknown>[];
  error?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);

  const handleSubmit = async (value: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: value }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
      {/* Header */}
      <header className="border-b border-slate-700/60" style={{ backgroundColor: '#1e293b' }}>
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              NL <span style={{ color: '#38bdf8' }}>→</span> SQL
            </h1>
            <span className="text-sm text-slate-400">Security Ops Query Builder</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Schema panel */}
          <aside className="w-full shrink-0 lg:w-64 xl:w-72">
            <SchemaPanel />
          </aside>

          {/* Main content */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Example chips */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-sky-500 hover:text-sky-400"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: '#1e293b' }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Natural Language Query</p>
              <QueryInput
                onSubmit={handleSubmit}
                loading={loading}
                value={prompt}
                onChange={setPrompt}
              />
              <p className="mt-2 text-xs text-slate-600">Tip: ⌘ + Enter to submit</p>
            </div>

            {/* Error */}
            {result?.error && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3">
                <p className="text-sm font-medium text-red-400">Error</p>
                <p className="mt-1 font-mono text-xs text-red-300">{result.error}</p>
              </div>
            )}

            {/* SQL */}
            {result?.sql && <SqlDisplay sql={result.sql} />}

            {/* Results */}
            {result?.results && <ResultsTable results={result.results} />}
          </div>
        </div>
      </main>
    </div>
  );
}
