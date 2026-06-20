'use client';

interface ResultsTableProps {
  results: Record<string, unknown>[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-6 text-center">
        <p className="text-sm text-slate-400">No rows returned.</p>
      </div>
    );
  }

  const columns = Object.keys(results[0]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-slate-400">
        <span className="font-semibold text-sky-400">{results.length}</span> row{results.length !== 1 ? 's' : ''} returned
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-xs font-semibold uppercase tracking-wider text-sky-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-slate-700/50 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/40'} hover:bg-slate-700/40 transition-colors`}
              >
                {columns.map((col) => (
                  <td key={col} className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-300">
                    {row[col] === null || row[col] === undefined ? (
                      <span className="text-slate-600">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
