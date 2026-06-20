# NL to SQL Query Builder

A natural language interface for a SQLite security operations database. Users type plain English questions and the application generates valid SQL, executes it against a live database, and renders the results in a structured table. The system is read-only by design, making it safe to demo with realistic operational data.

**Live demo:** https://nl-to-sql-navy.vercel.app

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components and API routes in a single project; no separate backend service needed |
| Language | TypeScript | Type safety across the API boundary between the Claude response, SQL execution, and the React components |
| Styling | Tailwind CSS | Utility-first approach keeps the dark theme consistent without a component library dependency |
| Database | better-sqlite3 | Synchronous SQLite driver; no connection pooling overhead for a single-user demo. Schema is fixed, so migrations are not a concern |
| AI | Anthropic SDK (claude-sonnet-4-6) | Strong instruction-following for constrained SQL generation; reliably respects the SELECT-only system prompt |
| Syntax highlighting | react-syntax-highlighter | Zero-config SQL highlighting with the atomDark theme, which matches the dark UI |
| Deployment | Vercel | Zero-config Next.js hosting; environment variables managed through the Vercel dashboard |

---

## AI Integration

The `/api/query` route (`app/api/query/route.ts`) handles all AI interaction. The flow is:

1. The client POSTs a natural language prompt to `/api/query`.
2. The server constructs a Claude `messages.create` call with a system prompt that contains the full database schema (`lib/schema.ts`) and a hard constraint: output only valid SQLite SELECT statements, no markdown, no explanation, no fences.
3. Claude returns a raw SQL string.
4. The server validates that the string starts with `SELECT` before passing it to `better-sqlite3`. This is a defense-in-depth check; the system prompt alone is not treated as a sufficient security boundary.
5. The query result rows and the generated SQL are returned to the client as JSON.

The schema injection looks like this in the system prompt:

```
You are a SQL query generator for a SQLite database used in a security operations center.
Output ONLY valid SQLite SQL. No explanation, no markdown, no fences, no preamble.
Only generate SELECT queries. If the request requires INSERT, UPDATE, DELETE, or DROP,
return: SELECT 'Read-only database. Only SELECT queries are permitted.' AS message;

Schema:
CREATE TABLE personnel ( ... );
CREATE TABLE incidents ( ... );
CREATE TABLE assets ( ... );
CREATE TABLE access_logs ( ... );
```

Injecting the schema at request time (rather than fine-tuning or RAG) is intentional: the schema is small enough to fit comfortably in the context window, and it keeps the system stateless with no vector database dependency.

---

## Database Schema

Four tables model a simplified security operations center:

- **personnel** -- staff records with department, rank, and clearance level (UNCLASSIFIED / SECRET / TOP SECRET)
- **incidents** -- security incidents with type, severity, status, and timestamps
- **assets** -- servers, workstations, network devices, and mobile devices with location and audit dates
- **access_logs** -- login, logout, file access, and config change events with a success flag

The seed script (`scripts/seed.ts`) populates 50 rows per table with realistic but synthetic data.

---

## Running Locally

**Prerequisites:** Node.js 20+, an Anthropic API key.

```bash
# 1. Clone and install
git clone https://github.com/nick27g/nl-to-sql.git
cd nl-to-sql
npm install

# 2. Set the API key
cp .env.example .env
# Edit .env and replace your_key_here with your actual ANTHROPIC_API_KEY

# 3. Seed the database
npx ts-node --project tsconfig.json scripts/seed.ts

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000.

---

## Known Limitations

**Complex subqueries.** Claude handles common aggregations and joins well but occasionally produces invalid SQL for multi-level subqueries or window functions in SQLite. The error is surfaced to the user with the generated SQL visible, which makes debugging straightforward.

**SQLite dialect differences.** The system prompt specifies SQLite, but Claude's training data skews toward PostgreSQL idioms. Functions like `DATE_TRUNC`, `ILIKE`, or `INTERVAL` syntax will produce errors. Claude generally handles this correctly when the schema and dialect are explicit in the system prompt, but edge cases exist.

**No query history.** Each request is stateless. There is no session, no history panel, and no way to iterate on a previous query without retyping it. This is a deliberate scope decision for the MVP.

**Vercel read-only filesystem.** The SQLite database file is bundled with the deployment. Vercel's filesystem is read-only at runtime, so the seed data is static. The database cannot be modified through the UI or API, which is consistent with the read-only design, but it also means the dataset cannot be updated without a redeployment.

**Single-user.** better-sqlite3 is synchronous and not designed for concurrent writes. For a production SOC tool this would be replaced with a hosted database (Postgres, Turso) and a proper connection pool.

---

## What I Would Do With More Time

- **Persistent query history** stored in a second SQLite table (locally) or a serverless database on Vercel, with the ability to name and replay saved queries.
- **Multi-turn refinement** -- expose a "fix this query" button that sends the original prompt, the generated SQL, and the error back to Claude for a corrected attempt.
- **Schema introspection at startup** -- read the live schema from `PRAGMA table_info` instead of maintaining a hardcoded string, so the prompt stays accurate if the schema evolves.
- **Streaming SQL generation** -- stream the Claude response token by token so users see the SQL being constructed rather than waiting for the full round trip.
- **Role-based query filtering** -- add a clearance level header and have Claude enforce column-level restrictions in the generated SQL based on the caller's role, which is a natural fit for the SOC domain.
- **Production database** -- migrate from SQLite to Turso (libSQL) or a managed Postgres instance to support concurrent users and a mutable dataset.
