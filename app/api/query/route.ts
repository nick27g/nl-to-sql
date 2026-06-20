import Anthropic from '@anthropic-ai/sdk';
import { runQuery } from '@/lib/db';
import { SCHEMA_STRING } from '@/lib/schema';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: 'Prompt is required.' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: `You are a SQL query generator for a SQLite database used in a security operations center.
Output ONLY valid SQLite SQL. No explanation, no markdown, no fences, no preamble.
Only generate SELECT queries. If the request requires INSERT, UPDATE, DELETE, or DROP, return: SELECT 'Read-only database. Only SELECT queries are permitted.' AS message;

Schema:
${SCHEMA_STRING}`,
    messages: [{ role: 'user', content: prompt }],
  });

  const sql = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

  if (!sql.toUpperCase().startsWith('SELECT')) {
    return Response.json({ error: 'Only SELECT queries are allowed.' }, { status: 400 });
  }

  try {
    const results = runQuery(sql);
    return Response.json({ sql, results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Query execution failed.';
    return Response.json({ sql, error: message }, { status: 400 });
  }
}
