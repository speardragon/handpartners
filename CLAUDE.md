# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

스타트업 파트너스 심사 시스템 (Startup Partners Evaluation System) — a judging/grading platform where evaluators (judges) score companies across programs and judging rounds. Built with Next.js 14 App Router + Supabase + Vercel.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run generate-types  # Regenerate Supabase types → types_db.ts
```

No test framework is configured.

## Architecture

### Route Groups

- `(home)` — Judge-facing pages: login, home dashboard, grading interface, evaluation reports
- `(admin)` — Admin pages: manage programs, companies, users, judging rounds

### Data Flow Pattern

**Server actions** (`src/actions/`) handle Supabase mutations (CRUD for each entity).
**API routes** (`src/app/api/`) serve data to the client via REST endpoints.
**React Query hooks** (co-located `_hooks/` dirs) fetch from API routes and cache client-side, using `@tanstack/react-query`.

Each feature page follows this co-location pattern:
```
page.tsx
_components/   # Page-specific UI components
_hooks/        # React Query hooks for this page
_lib/          # Zod schemas, helpers
```

### Supabase Setup

- **Client**: `src/utils/supabase/client.ts` — browser client via `@supabase/ssr`
- **Server**: `src/utils/supabase/server.ts` — server client with cookie handling; also exports `createServerSupabaseAdminClient` using service role key
- **Types**: `types_db.ts` (auto-generated) — use `Tables<"table_name">` for row types
- **Migrations**: `supabase/migrations/`
- **Cron**: Vercel cron at `/api/cron` (daily at 14:50 UTC) to keep Supabase active

### Database Schema (key tables)

`program` → `judging_round` → `evaluation_criteria`
`company` ← `program_company` → `program`
`company` ← `judging_round_company` → `judging_round`
`user` ← `judging_round_user` → `judging_round`
`evaluation` links user + company + criterion + judging_round with grade/feedback

### State Management

- **Zustand** stores in `src/store/`: auth state (`useAuthStore`), dialog state, PDF page tracking
- **Auth**: Supabase Auth with custom `useAuth` hook (`src/app/_hooks/useAuth.ts`) listening to `onAuthStateChange`

### UI Stack

- **shadcn/ui** (new-york style, non-CSS-variables) — components in `src/components/ui/`
- **Tailwind CSS** with Pretendard font (Korean)
- **@tanstack/react-table** for data tables
- **react-pdf** + **@react-pdf/renderer** for PDF viewing/generation
- **sonner** for toast notifications
- **react-hook-form** + **zod** for forms

### Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Conventions

- Korean language for UI text and comments
- Import alias: `@/` maps to `src/`
- Form validation schemas use Zod, located in `_lib/` directories
- Server actions are in `src/actions/` with the naming pattern `{entity}-action.ts`
