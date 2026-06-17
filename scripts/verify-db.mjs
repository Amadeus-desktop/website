#!/usr/bin/env node
/**
 * Verify Supabase connectivity and core tables.
 * Usage: node scripts/verify-db.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

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
      // optional
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = [
  "profiles",
  "personas",
  "cloud_conversations",
  "cloud_conversation_messages",
  "persona_states",
  "jam_balances",
];

console.log(`Checking Supabase at ${url}...`);

for (const table of tables) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`  ${table}: FAILED — ${error.message}`);
    process.exit(1);
  }

  console.log(`  ${table}: OK (${count ?? 0} rows)`);
}

const { data: personas, error: personaError } = await supabase
  .from("personas")
  .select("name, slug")
  .in("slug", ["seoyeon-modern-senior", "eiren-fantasy-guardian", "makise-kurisu"])
  .is("deleted_at", null);

if (personaError) {
  console.error("Catalog personas:", personaError.message);
  process.exit(1);
}

console.log(`  catalog personas: ${personas?.map((p) => p.name).join(", ") || "none"}`);
console.log("Database connection verified.");
