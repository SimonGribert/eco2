# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**eco2** is a personal economy/finance tracker. It authenticates a user with Google, links their bank via the **Tink** API (open banking, Sweden/SEK by default), pulls bank accounts and transactions from Tink, and lets the user review/edit them before persisting into Postgres as the app's own records. The Tink-fetched data is the "source" side; the persisted `BankAccount` / `UnprocessedTransaction` rows are the "resource" side the user curates.

## Commands

```bash
npm run dev          # Next.js dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint (next lint)
npm run dev:migrate  # prisma migrate dev --name init  (create/apply a migration locally)
npx prisma generate  # Regenerate the Prisma client after editing schema.prisma
npx prisma studio    # Inspect the database
```

There is no test suite. `vercel-build` (`prisma generate && prisma migrate deploy && next build`) runs on Vercel deploys — migrations are applied automatically there.

## Architecture

Next.js 15 App Router, React 19, TypeScript, Ant Design (antd) for all UI, TanStack Query for client data fetching, Prisma + Postgres (Neon serverless) for persistence, NextAuth v5 (beta) for auth.

### Auth & routing
- `auth.ts` configures NextAuth (Google provider + Prisma adapter) and exports `auth`, `signIn`, `signOut`, `handlers`. The `authorized` callback enforces `privateRoutes`/`publicRoutes`.
- `middleware.ts` re-exports `auth` as the middleware; its matcher excludes `/api`, static assets. Route protection runs on the edge.
- Route groups: `app/(dashboard)/` is the authed shell (sider + header layout in `(dashboard)/layout.tsx`); `app/login/` is the public sign-in.
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handlers. `app/api/tink-callback/route.ts` — Tink OAuth callback: exchanges `code` for a token and stores it via `CreateAccount` (provider `"tink"`).

### Tink access tokens live in the `Account` table
Tink OAuth tokens are stored as an `Account` row with `provider = "tink"` (alongside the NextAuth Google account). `lib/Account.ts` `FindAccount(provider, userId)` retrieves the token **and eagerly deletes it if expired** (`createdAt + expires_at`), returning `null`. Every Tink API call in `lib/Tink.ts` starts by calling `FindAccount("tink", userId)` and bailing out if there's no valid token.

### Data flow: Tink → review → Postgres
`lib/Tink.ts` is the core. It is a `"use server"` module of server actions that fetch **live** data from Tink's REST API (`api.tink.com/data/v2/...`) using the stored access token:
- `fetchBankAccounts()` and `fetchTransactions({ pageParam })` fetch from Tink, then join against existing DB rows (`GetBankAccounts` / `GetUnprocessedTransactions`) to attach a `resource` field — the already-persisted counterpart, if any.
- The join key for transactions is a heuristic match on `descriptionOriginal` + `amount` + `bookedDate` (no shared ID from Tink).
- The `FormTableType<T> = T & { resource?: T }` pattern is used everywhere: the Tink-fetched value is the top-level fields, and `resource` holds the persisted version so the sync UI can show/swap between them.

Persistence is split into sibling `"use server"` modules that **upsert** what the user submits:
- `lib/BankAccount.ts` — `UpdateBankAccounts` upserts each `BankAccount` and also writes a `BankAccountHistory` snapshot keyed by `(id, refreshedAt)`.
- `lib/UnprocessedTransactions.ts` — `UpdateUnprocessedTransactions` upserts `UnprocessedTransaction` rows.
- Every persistence/read action re-derives `userId` from `auth()` server-side and scopes queries by it — do not trust a client-passed userId.

### Money handling
Prisma stores balances/amounts as `Decimal(65,2)`. In DB-read helpers they are converted with `.toNumber()` for the client, and on write wrapped in `new Prisma.Decimal(...)`. Tink returns amounts as `{ unscaledValue, scale }`; `formatBalance()` in `lib/Tink.ts` converts these to a rounded number. Keep this conversion at the boundary — don't pass raw Tink amount objects deeper.

### The sync UI
`app/(dashboard)/tink-sync/` is a multi-step wizard (`SyncAccounts` → `SyncTransactions` → `ProcessTransactions`). Each step uses TanStack Query (`useQuery` to fetch the Tink server action, `useMutation` to call the persist server action) rendered inside an antd `Form` + `Table`, with `EditableCell` allowing the user to edit values or swap in the `resource` value before saving. `page.tsx` orchestrates the steps.

Other dashboard pages: `tink-bank-accounts/` and `tink-transactions/` (the latter uses infinite pagination via `fetchTransactions`'s `nextPageToken`).

### Shared pieces
- `prisma/prisma.ts` — the singleton `PrismaClient` using the Neon serverless adapter (`@prisma/adapter-neon`), cached on `globalThis` outside production.
- `components/ui/` — antd layout chrome (`EcoSider`, `EcoHeader`, `EcoBreadcrumb`) and `TinkTokenTime`/`EcoCountdown` which display remaining Tink token lifetime.
- `types/tink.ts` — TypeScript types mirroring Tink API responses.

## Conventions
- Server actions and DB helpers use `PascalCase` exports (`CreateAccount`, `GetBankAccounts`, `UpdateTransaction`); mark files `"use server"` when they contain actions callable from the client.
- Path alias `@/*` maps to the repo root.
- Ant Design is used with the React 19 patch (`@ant-design/v5-patch-for-react-19`) and the Next.js registry (`@ant-design/nextjs-registry`); the React Compiler babel plugin is enabled.

## Environment
Required env vars (see `.env`): `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`; Postgres URLs (`POSTGRES_PRISMA_URL` pooled for the app, `POSTGRES_URL_NON_POOLING` for migrations, `POSTGRES_URL` for the Neon pool); `TINK_CLIENT_ID`, `TINK_SECRET`, `TINK_REDIRECT_URL`.

⚠️ Prisma's `directUrl` must stay pointed at `POSTGRES_URL_NON_POOLING` — using the pooled URL for migrations leaves dangling databases.
