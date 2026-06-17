#!/usr/bin/env node
/**
 * Apply all Supabase migrations in order.
 * Usage: node scripts/apply-migrations.mjs
 * Requires: SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF in .env
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const env = readFileSync(join(root, file), "utf8");
      for (const line of env.split("\n")) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    } catch {
      // optional if vars set in shell
    }
  }
}

loadEnv();

const token =
  process.env.SUPABASE_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN;
const projectRef =
  process.env.SUPABASE_PROJECT_REF ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/,
  )?.[1];

if (!token || !projectRef) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN or project ref. Set in .env or run:\n" +
      "  SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=herhnnjcplmubggwochq node scripts/apply-migrations.mjs",
  );
  process.exit(1);
}

const migrationsDir = join(root, "supabase/migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

console.log(`Applying ${files.length} migrations to ${projectRef}...`);

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  console.log(`→ ${file}`);

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  const body = await res.text();
  if (!res.ok) {
    console.error(`  FAILED (${res.status}):`, body);
    process.exit(1);
  }
  console.log(`  OK`);
}

console.log("All migrations applied.");
