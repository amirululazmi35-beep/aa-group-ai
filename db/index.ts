// ============================================================
// AA AI GROUP — Database Connection
// ============================================================
// Initializes Drizzle ORM with postgres-js driver.
// Safe to import during build — only connects when DATABASE_URL exists.
// ============================================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL;

// Create a lazy-initialized singleton so we don't crash during
// build or in environments without a live database.
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env.local file.\n" +
      "Example: DATABASE_URL=postgresql://user:password@host:5432/dbname"
    );
  }

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  _db = drizzle(client, { schema });
  return _db;
}

// For convenience — direct import (will throw if DATABASE_URL is missing at call time)
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

// Re-export schema for convenience
export * from "./schema";
