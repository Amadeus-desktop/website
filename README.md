# Amadeus

AI 캐릭터 채팅 웹앱. 별도 백엔드 없이 **Next.js App Router** (Server Actions, Route Handlers, Middleware) + **Supabase** 로 구성됩니다.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Supabase (Auth, Postgres, RLS)
- Zustand, Zod

## Setup

```bash
pnpm install
cp .env.local.example .env
# .env 에 Supabase URL / anon key / access token 입력
pnpm db:migrate
pnpm db:verify
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (client + server) |
| `SUPABASE_ACCESS_TOKEN` | Management API token for `pnpm db:migrate` |
| `LLM_PROVIDER` | AI provider (`mock` default) |

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm db:migrate` | Apply SQL migrations to Supabase |
| `pnpm db:verify` | Check DB connectivity and core tables |

## Architecture

```
app/          Routes (pages, API)
features/     Domain logic (auth, chat, characters, ai, …)
shared/       UI, i18n, Supabase clients, config
supabase/     SQL migrations
```
