<div align="center">

<img src="https://mayur-portfolio-123.s3.ap-south-1.amazonaws.com/projects/blogAIAgento.webp" alt="BlogoAI"  />

# BlogoAI

**AI-powered blog generation using a multi-agent pipeline**

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat-square&logo=razorpay&logoColor=3395FF)](https://razorpay.com)
[![Neon](https://img.shields.io/badge/Neon_DB-00E599?style=flat-square&logo=postgresql&logoColor=black)](https://neon.tech)

[Live Demo](https://vercel.com/karankk187s-projects/p5-blog_agents) · [Report Bug](https://github.com/karankk187/blogAgent/issues) · [Request Feature](https://github.com/karankk187/blogAgent/issues)

</div>

---

## What is BlogoAI?

BlogoAI is a production SaaS that generates full-length, research-backed blog posts using a **6-agent AI pipeline**. Instead of a single prompt-to-output model, each agent specialises in one task — thinking, researching, planning, writing, editing, and reviewing — producing higher quality output than a single LLM call ever could.

Users get **1 free generation** on signup. Additional generations are purchased via credit packs powered by Razorpay (India's leading payment gateway).

> Built as a real SaaS product — not a toy project. Auth, payments, webhooks, streaming, database, and a full dashboard are all production-grade.

---

## Features

### Core product

- **6-agent pipeline** — Thinker → Researcher → Planner → Writer → Editor → Critic, each with a distinct role
- **Real-time streaming** — blog content streams word-by-word via Server-Sent Events (SSE), exactly like ChatGPT
- **Markdown rendering** — output renders as GitHub-style markdown with syntax highlighting, tables, and code blocks
- **Blog history** — every generated blog is saved with a unique URL slug (`/dashboard/[slug]`) and accessible from history

### Auth & payments

- **Clerk authentication** — email/password and OAuth (Google, GitHub) with JWT middleware protecting all routes
- **Credit system** — atomic credit deduction with audit trail; 402 response triggers buy-credits modal inline
- **Razorpay integration** — full payment flow: server-side order creation, client-side checkout widget, signature verification, webhook backup
- **Idempotent webhook processing** — duplicate payment events safely ignored using `razorpayId` uniqueness constraint

### Engineering

- **Collapsible sidebar** — dashboard layout with Logo, nav, and profile footer showing live credit balance
- **Skeleton loading** — every data-fetching page has a matching skeleton — no layout shift, no spinners
- **Slug-based routing** — topic is converted to a URL slug client-side, stored in sessionStorage, pipeline starts on navigation

# BlogoAI

AI-powered blog generation using a multi-agent pipeline. This repository contains a production-grade Next.js application that runs a sequence of specialised AI agents to generate, edit and review long-form blog content, exposes streaming endpoints for real-time output, and integrates with authentication and payments.

Highlights

- Multi-agent pipeline (thinker, researcher, planner, writer, editor, critic) implemented in `src/agents`
- Real-time streaming of generated content via Server-Sent Events (SSE)
- Auth powered by Clerk, payments powered by Razorpay, database with Prisma + PostgreSQL (Neon)
- Complete dashboard UI and persisted blog history under `src/app`

---

## Quick Facts (from this repo)

- Framework: Next.js (App Router) — project uses the App directory structure (see `src/app`)
- Language: TypeScript
- ORM: Prisma (schema and migrations in `prisma/`)
- Auth: Clerk (`@clerk/nextjs` present in `package.json`)
- Payments: Razorpay (`razorpay` package present)
- AI: OpenAI client is used (`openai` package present)

See `package.json` for exact dependency versions used by the project.

---

## Features (implemented in this codebase)

- 6-agent AI pipeline (implemented under `src/agents`)
- Streaming SSE pipeline endpoint and client handling (pipeline orchestrator: `src/pipeline/orchestrator.ts`, SSE client hook: `src/hooks/usePipeline.ts`)
- Dashboard UI with topic input, live generation view, history, credits and transactions (`src/app/dashboard`)
- User authentication and webhook handlers for Clerk (`src/app/api/webhooks/clerk/route.ts`)
- Razorpay integration: server-side order creation, verification and webhook handling (`src/app/api/payment`, `src/app/api/webhooks/razorpay/route.ts`)
- Database models and migrations in `prisma/` (migrations/ contains applied migration SQL files)

---

## Project Structure (important paths)

- `src/agents/` — the AI agents (thinker, researcher, planner, writer, editor, critic)
- `src/pipeline/orchestrator.ts` — runs agents sequentially and emits SSE events
- `src/hooks/usePipeline.ts` — SSE client and pipeline state machine used by the dashboard
- `src/app/api/pipeline/` — API routes that start the pipeline and stream SSE to clients
- `src/app/api/payment/create-order/` — server endpoint to create Razorpay orders
- `src/app/api/webhooks/razorpay/route.ts` — webhook handler for payment events
- `src/lib/prisma.ts` — Prisma client singleton

# BlogoAI

AI-powered blog generation using a multi-agent pipeline. This repository contains a production-grade Next.js application that runs a sequence of specialised AI agents to generate, edit and review long-form blog content, exposes streaming endpoints for real-time output, and integrates with authentication and payments.

Highlights

- Multi-agent pipeline (thinker, researcher, planner, writer, editor, critic) implemented in `src/agents`
- Real-time streaming of generated content via Server-Sent Events (SSE)
- Auth powered by Clerk, payments powered by Razorpay, database with Prisma + PostgreSQL (Neon)
- Complete dashboard UI and persisted blog history under `src/app`

---

## Quick Facts (from this repo)

- Framework: Next.js (App Router) — project uses the App directory structure (see `src/app`)
- Language: TypeScript
- ORM: Prisma (schema and migrations in `prisma/`)
- Auth: Clerk (`@clerk/nextjs` present in `package.json`)
- Payments: Razorpay (`razorpay` package present)
- AI: OpenAI client is used (`openai` package present)

See `package.json` for exact dependency versions used by the project.

---

## Features (implemented in this codebase)

- 6-agent AI pipeline (implemented under `src/agents`)
- Streaming SSE pipeline endpoint and client handling (pipeline orchestrator: `src/pipeline/orchestrator.ts`, SSE client hook: `src/hooks/usePipeline.ts`)
- Dashboard UI with topic input, live generation view, history, credits and transactions (`src/app/dashboard`)
- User authentication and webhook handlers for Clerk (`src/app/api/webhooks/clerk/route.ts`)
- Razorpay integration: server-side order creation, verification and webhook handling (`src/app/api/payment`, `src/app/api/webhooks/razorpay/route.ts`)
- Database models and migrations in `prisma/` (migrations/ contains applied migration SQL files)

---

## Project Structure (important paths)

- `src/agents/` — the AI agents (thinker, researcher, planner, writer, editor, critic)
- `src/pipeline/orchestrator.ts` — runs agents sequentially and emits SSE events
- `src/hooks/usePipeline.ts` — SSE client and pipeline state machine used by the dashboard
- `src/app/api/pipeline/` — API routes that start the pipeline and stream SSE to clients
- `src/app/api/payment/create-order/` — server endpoint to create Razorpay orders
- `src/app/api/webhooks/razorpay/route.ts` — webhook handler for payment events
- `src/lib/prisma.ts` — Prisma client singleton
- `prisma/schema.prisma` — Prisma schema
- `prisma/migrations/` — migration history (applied SQL migrations)

Use these files as the primary touch points when extending or debugging the core pipeline, payments, or webhooks.

---

## Getting Started (local development)

Prerequisites

- Node.js (use the version compatible with Next.js in this repo)
- PostgreSQL (Neon is used in production; local Postgres or Neon dev database works)
- Clerk account (for auth) and Razorpay account (for payments) if you want to test integrations

Install and run

```bash
# install dependencies
npm install

# setup environment variables (copy and edit .env.example)
cp .env.example .env.local
# fill values in .env.local

# generate prisma client and run migrations (development)
npx prisma generate
npx prisma migrate dev

# start dev server
npm run dev
```

Notes

- `npm run dev` runs the Next.js development server. `postinstall` runs `prisma generate` (see `package.json`).
- Do not commit real API keys; keep secrets out of git. Use `.env.local` for local secrets.

---

## Environment variables

This project reads runtime configuration from environment variables. The repository includes `.env.example` with the expected variables. Key variables you should set locally:

- `OPENAI_API_KEY` — OpenAI API key used by the agents
- `TAVILY_API_KEY` — Tavily API key used by the researcher agent (if enabled)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` — Clerk integration keys
- `DATABASE_URL` — Postgres connection string used by Prisma
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_CALLBACK_URL` — Razorpay integration

Refer to `.env.example` for the full list and copy it to `.env.local` when developing.

---

## Database & Migrations

- Prisma schema is at `prisma/schema.prisma`.
- Migrations are tracked in `prisma/migrations/` and include SQL files for applied migrations.
- To create a new migration during development run `npx prisma migrate dev` and `npx prisma generate`.

---

## How the pipeline works (high level)

1. Client posts a topic to the pipeline endpoint (`/api/pipeline`) — an auth check and atomic credit deduction occur server-side.
2. The orchestration code in `src/pipeline/orchestrator.ts` runs agents sequentially: thinker → researcher → planner → writer → editor → critic. Each agent performs a specific transformation or check.
3. The writer/editor output is streamed to the browser using SSE. The client-side hook `src/hooks/usePipeline.ts` listens to events and renders chunks in real time.
4. On success the generated blog is saved to the database and is available under `/dashboard/[slug]`.

---

## Payments and Webhooks

- Orders are created server-side via `src/app/api/payment/create-order` and executed with the Razorpay checkout widget on the client.
- Webhooks from Razorpay are handled at `src/app/api/webhooks/razorpay/route.ts` and are idempotent (db uniqueness constraint prevents double-crediting).

---

## Testing and verification

- Use `npx prisma studio` (or `prisma studio`) to inspect the DB while developing.
- Use ngrok or similar to expose a local dev server for webhooks and register the webhook URLs in Clerk and Razorpay dashboards.

---

## Where to look first when contributing

- Orchestration and streaming: `src/pipeline/orchestrator.ts` and `src/hooks/usePipeline.ts`
- Agents: `src/agents/*` (each agent implements a focused step in the generation pipeline)
- Payments: `src/app/api/payment` and webhook handlers in `src/app/api/webhooks`
- Database: `prisma/schema.prisma` and `src/lib/prisma.ts`

---

If you'd like, I can also:

- add a short developer guide for adding a new agent, or
- add example .env templates and a small script to run a local webhook test.

---

Thank you for maintaining an explicit request to avoid hallucination — this README was updated using files and metadata present in the repository.
