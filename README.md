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

[Live Demo](https://blogagent.thissidemayur.me) · [Report Bug](https://github.com/thissidemayur/blogagent/issues) · [Request Feature](https://github.com/thissidemayur/blogagent/issues)

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
- **Dark glassmorphism UI** — custom dark theme with frosted glass cards, built with Tailwind CSS v4 + shadcn/ui

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components, API routes, SSE streaming |
| Language | TypeScript | End-to-end type safety |
| Auth | Clerk | JWT, OAuth, webhook sync to DB |
| Database | PostgreSQL (Neon) | Serverless, scales to zero, Prisma-compatible |
| ORM | Prisma | Type-safe queries, migrations, audit trail |
| Payments | Razorpay | India-first, UPI + cards + netbanking |
| AI | OpenAI GPT-5.4 Nano | Cost-efficient for multi-agent pipelines |
| Web Search | Tavily API | RAG-ready search for researcher agent |
| UI | Tailwind CSS v4 + shadcn/ui | Dark theme, glassmorphism, accessible components |
| Streaming | Server-Sent Events (SSE) | Real-time token streaming without WebSockets |

---

## Architecture

```
User submits topic
       │
       ▼
POST /api/pipeline          ← auth check + atomic credit deduction
       │
       ▼
Orchestrator (server)       ← runs 6 agents sequentially
       │
       ├─ Thinker           ← analyses topic, defines angle & audience
       ├─ Researcher         ← Tavily web search, gathers sources
       ├─ Planner            ← structures outline (human approval gate)
       ├─ Writer             ← drafts full blog, streams via SSE
       ├─ Editor             ← polishes tone, flow, grammar
       └─ Critic             ← QA scores: relevance, accuracy, uniqueness
       │
       ▼
SSE stream → browser        ← text_chunk events render word-by-word
       │
       ▼
POST /api/user/blogs        ← saves to DB with slug + summary
       │
       ▼
/dashboard/[slug]           ← permanent URL for this blog
```

### Payment flow

```
User clicks Buy → POST /api/payment/create-order (server creates Razorpay order)
                → Razorpay checkout widget opens in browser
                → User pays via UPI / card / netbanking
                → handler() fires → POST /api/payment/verify
                → HMAC signature verified → credits added to DB
                → Razorpay webhook fires (backup for dropped connections)
                → Idempotency check prevents double credit addition
```

---


## Getting Started

### Prerequisites

- Node.js 24
- PostgreSQL database ([Neon](https://neon.tech) free tier works)
- [Clerk](https://clerk.com) account
- [Razorpay](https://razorpay.com) account (test mode)
- [OpenAI](https://platform.openai.com) API key
- [Tavily](https://tavily.com) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/thissidemayur/blogagent.git
cd blogagent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in all values — see Environment Variables section below

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables

```bash
# Clerk — dashboard.clerk.com → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Clerk webhook — register endpoint: /api/webhooks/clerk
# Events: user.created
CLERK_WEBHOOK_SECRET=whsec_xxx

# Neon PostgreSQL — neon.tech → Connection Details → Prisma
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-xxx

# Tavily
TAVILY_API_KEY=tvly-xxx

# Razorpay — dashboard.razorpay.com → Settings → API Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Razorpay webhook — register endpoint: /api/webhooks/razorpay
# Events: payment.captured
RAZORPAY_WEBHOOK_SECRET=xxx
```

### Webhook setup (local development)

```bash
# Start ngrok tunnel
ngrok http 3000

# Register in Clerk Dashboard → Webhooks:
# https://YOUR-NGROK-URL/api/webhooks/clerk  →  user.created

# Register in Razorpay Dashboard → Settings → Webhooks:
# https://YOUR-NGROK-URL/api/webhooks/razorpay  →  payment.captured
```

---

## Credit Pricing

| Pack | Credits | Price | Per blog |
|---|---|---|---|
| Free trial | 1 | ₹0 | — |
| Starter | 5 | ₹99 | ₹19.80 |
| Pro | 15 | ₹249 | ₹16.60 |
| Power | 35 | ₹499 | ₹14.26 |

Each credit = 1 blog generation. Credits never expire.

---

## Project Structure

```
src/
├── agents/                    # 6 AI agents (thinker, researcher, planner...)
├── app/
│   ├── api/
│   │   ├── pipeline/          # POST (credit gate) + GET stream (SSE)
│   │   ├── payment/           # create-order, verify
│   │   ├── webhooks/          # clerk, razorpay
│   │   └── user/              # credits, blogs
│   └── dashboard/
│       ├── [slug]/            # live pipeline + saved blog view
│       ├── new/               # topic input
│       ├── history/           # all generated blogs
│       ├── credits/           # balance + purchase packs
│       └── transactions/      # full credit history
├── components/
│   ├── dashboard/
│   │   ├── core/              # PipelineShell, AgentThinking, BlogOutput, TopicInput
│   │   └── layout/            # Sidebar, TopBar
│   ├── payment/               # RazorpayPaymentButton, BuyCreditsModal
│   └── ui/                    # shadcn components
├── hooks/
│   └── usePipeline.ts         # SSE client, pipeline state machine
├── lib/
│   ├── prisma.ts              # singleton client
│   ├── credits.ts             # deductCredits, addCredits (atomic)
│   ├── packs.ts               # credit pack config (single source of truth)
│   └── slug.ts                # generateSlug, extractMarkdown, extractSummary
└── pipeline/
    └── orchestrator.ts        # runs agents sequentially, emits SSE events
```

---

## Key Engineering Decisions

**Why SSE over WebSockets?**
SSE is unidirectional (server → client), which is all streaming needs. It works over HTTP/1.1, requires zero extra infrastructure, and Next.js App Router supports it natively via `ReadableStream`. WebSockets would add complexity with no benefit here.

**Why deduct credits before running agents?**
If you run agents first and deduct after, a server crash between the two gives the user a free generation. Deduct first, run second — if agents fail, refund in the catch block. This is the standard pattern for metered billing.

**Why a separate `Razorpayorder` table?**
Razorpay's webhook `notes` field (where you store `clerkId` and `packId`) can be unreliable across payment methods. Storing the order in your own DB means the webhook can always look up exactly who to credit and what pack they bought — no dependency on third-party data.

**Why `razorpayId @unique` for idempotency?**
Razorpay retries webhooks on non-200 responses. Without idempotency, a retry after a slow DB write would add credits twice. The unique constraint on `razorpayId` means the second attempt fails at the DB level — not the application level — which is safer.

**Why sessionStorage for slug routing?**
The slug is generated client-side so the URL is immediately available for navigation. `sessionStorage` bridges the gap between `/new` (where the topic is entered) and `/[slug]` (where the pipeline runs), surviving the navigation without a round-trip API call.

---



---

## What I Learned Building This

- **Multi-agent orchestration** — coordinating 6 LLMs with shared state, approval gates, and retry logic
- **Production webhook patterns** — signature verification, idempotency, retry handling, race conditions
- **Atomic database operations** — using Prisma transactions to prevent race conditions in credit deduction
- **Real-time streaming** — SSE architecture, backpressure, client reconnection logic
- **SaaS payment integration** — full Razorpay flow from order creation to webhook verification
- **Next.js App Router** — server components, route handlers, middleware, dynamic routes

---

## Roadmap

- [ ] Markdown export (PDF, DOCX)
- [ ] Custom agent prompts per user
- [ ] Team workspaces with shared credits
- [ ] Blog scheduling and publishing to WordPress / Ghost
- [ ] Analytics dashboard (word count trends, topic history)
- [ ] API access for developers

---

## Author

**Mayur** — 3rd year CS student, indie developer

Building real products to learn real engineering.

[![Portfolio](https://img.shields.io/badge/Portfolio-thissidemayur.me-black?style=flat-square)](https://thissidemayur.me)
[![GitHub](https://img.shields.io/badge/GitHub-thissidemayur-181717?style=flat-square&logo=github)](https://github.com/thissidemayur)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/thissiemayur)

> Open to internships, freelance projects, and full-time roles after graduation.
> If you're building something interesting, let's talk.

---

## License

MIT — use it, learn from it, build on it.

---

<div align="center">
<sub>Built with Next.js, TypeScript, Prisma, Clerk, and Razorpay</sub>
</div>
