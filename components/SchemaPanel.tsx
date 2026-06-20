'use client';

import { useState } from 'react';

const SCHEMA = [
  {
    table: 'personnel',
    columns: ['id INTEGER PK', 'name TEXT', 'department TEXT', 'rank TEXT', 'clearance_level TEXT', 'hire_date TEXT'],
  },
  {
    table: 'incidents',
    columns: ['id INTEGER PK', 'reported_by INTEGER FK', 'type TEXT', 'severity TEXT', 'status TEXT', 'reported_at TEXT', 'resolved_at TEXT'],
  },
  {
    table: 'assets',
    columns: ['id INTEGER PK', 'name TEXT', 'category TEXT', 'assigned_to INTEGER FK', 'location TEXT', 'last_audit TEXT'],
  },
  {
    table: 'access_logs',
    columns: ['id INTEGER PK', 'user_id INTEGER FK', 'asset_id INTEGER FK', 'action TEXT', 'timestamp TEXT', 'success INTEGER'],
  },
];

export default function SchemaPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h7" />
          </svg>
          Database Schema
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-3">
          {SCHEMA.map(({ table, columns }) => (
            <div key={table} className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
              <p className="mb-2 font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">{table}</p>
              <ul className="flex flex-col gap-0.5">
                {columns.map((col) => (
                  <li key={col} className="font-mono text-xs text-slate-400">{col}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
