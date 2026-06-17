#!/usr/bin/env node
/**
 * Verify OpenAI / Gemini API keys from .env
 * Usage: node scripts/verify-llm.mjs [openai|gemini|all]
 */
import { readFileSync } from "fs";
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
      // optional
    }
  }
}

loadEnv();

const target = process.argv[2] ?? process.env.LLM_PROVIDER ?? "all";

async function verifyOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    console.error("OPENAI: missing OPENAI_API_KEY");
    return false;
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: "Reply with exactly: ok" }],
      max_tokens: 5,
    }),
  });

  if (!res.ok) {
    console.error(`OPENAI: FAILED (${res.status})`, await res.text());
    return false;
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content ?? "";
  console.log(`OPENAI: OK (${model}) → ${text.trim()}`);
  return true;
}

async function verifyGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

  if (!apiKey) {
    console.error("GEMINI: missing GEMINI_API_KEY");
    return false;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Reply with exactly: ok" }] }],
    }),
  });

  if (!res.ok) {
    console.error(`GEMINI: FAILED (${res.status})`, await res.text());
    return false;
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  console.log(`GEMINI: OK (${model}) → ${text.trim()}`);
  return true;
}

let ok = true;

if (target === "openai" || target === "all") {
  ok = (await verifyOpenAI()) && ok;
}

if (target === "gemini" || target === "all") {
  ok = (await verifyGemini()) && ok;
}

process.exit(ok ? 0 : 1);
