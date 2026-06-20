import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'database.sqlite');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
  }
  return db;
}

export function runQuery(sql: string): unknown[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  return stmt.all();
}
