'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SqlDisplayProps {
  sql: string;
}

export default function SqlDisplay({ sql }: SqlDisplayProps) {
  return (
    <div className="rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Generated SQL</span>
      </div>
      <SyntaxHighlighter
        language="sql"
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#0f172a',
          fontSize: '0.8rem',
          lineHeight: '1.6',
        }}
      >
        {sql}
      </SyntaxHighlighter>
    </div>
  );
}
