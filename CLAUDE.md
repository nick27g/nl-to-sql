@AGENTS.md

# NL to SQL Query Builder

**Status: Complete and deployed.**
**Live URL:** https://nl-to-sql-navy.vercel.app
**Model:** claude-sonnet-4-6

## MVP Features (all complete)

- [x] Next.js App Router project with TypeScript and Tailwind CSS
- [x] better-sqlite3 database with 4-table SOC schema (personnel, incidents, assets, access_logs)
- [x] Seed script populating 50 rows per table with realistic security operations data
- [x] `/api/query` POST route that calls Claude (claude-sonnet-4-6) and returns generated SQL + results
- [x] SELECT-only safety constraint enforced in both the system prompt and the API route
- [x] Schema injected into Claude system prompt at request time
- [x] `QueryInput` component with textarea and Generate & Run button (⌘+Enter shortcut)
- [x] `SchemaPanel` collapsible sidebar showing all 4 tables and columns
- [x] `SqlDisplay` component with syntax highlighting (atomDark theme)
- [x] `ResultsTable` component with auto-generated column headers and row count
- [x] Three example prompt chips on the main page
- [x] Dark theme throughout (#0f172a background, #1e293b panels, #38bdf8 accent)
- [x] Error display for failed queries and Claude errors

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- better-sqlite3
- @anthropic-ai/sdk
- react-syntax-highlighter
- Deployed on Vercel

## Key Files

- `app/api/query/route.ts` — the AI integration and query execution endpoint
- `lib/schema.ts` — the SCHEMA_STRING injected into Claude's system prompt
- `lib/db.ts` — SQLite singleton and runQuery helper
- `scripts/seed.ts` — database seed script (run once locally)
- `components/` — all UI components
