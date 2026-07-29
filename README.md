# Workify

A multi-tenant workforce management platform — projects, people, payroll, approvals, and an AI assistant in one workspace. Built as a production-shaped Next.js application: a real App Router frontend backed by real Route Handlers, with a server-side cache layer and React Query on the client.

The backing datastore right now is a deterministic in-memory demo dataset (see [Demo data](#demo-data)), which makes the whole app explorable out of the box. The API boundary is real, so swapping the demo data for a database is a backend change, not a rewrite.

## Highlights

- **18 fully built modules** — Dashboard, Employees, Departments, Teams, Projects, Tasks (Kanban), Attendance, Leave, Payroll, Expenses, Billing, Reports, Approvals, Files, Automation, Roles & Permissions, Settings, and an AI Assistant.
- **Real API layer, not mocked function calls.** Every module is served by a Next.js Route Handler under `src/app/api/*`. Client components fetch over HTTP like they would against any backend.
- **Server-side caching tuned per entity.** Reads go through `unstable_cache` with tags and a revalidation window sized to how often that data actually changes (seconds for task boards and approvals, minutes for departments and billing). Writes call targeted, immediate cache invalidation so a create/update is visible on the very next read.
- **React Query on the client** for request de-duplication, background refetching, optimistic UI, and mutation state — layered on top of the server cache rather than replacing it.
- **Working CRUD, not static mockups.** Inviting an employee, creating a project or task, submitting an expense or leave request, approving/rejecting, uploading or deleting a file — all validated, all wired through real mutations with toasts and cache invalidation.
- **Consistent design system.** Tailwind v4 + a Base UI component layer (shadcn-style), a shared `PageHeader`/`StatusBadge`/`EntityAvatar`/`EmptyState` set, dark mode, and route-level error/not-found/loading boundaries.
- **Deployable today.** Dockerfile (multistep, standalone output) + a GitHub Actions workflow that builds and redeploys to a VPS behind Traefik on every push to `main`.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Route Handlers, Turbopack) |
| Language | TypeScript |
| UI | Tailwind CSS v4, Base UI primitives, Lucide icons, Framer Motion |
| Data fetching | TanStack React Query (client) + `unstable_cache` (server) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| State | Zustand (workspace/company selection, command palette) |
| Demo data | `@faker-js/faker`, seeded for reproducibility |
| Tooling | ESLint, TypeScript strict mode |

## Architecture

```
src/
  app/
    (app)/            route group for the authenticated app shell (sidebar + navbar)
      dashboard/  employees/  projects/  tasks/  ...   one folder per module
      error.tsx        in-shell error boundary (keeps sidebar/navbar on a crash)
    api/               Route Handlers — the real backend boundary
      employees/       GET (cached, tagged) + POST
        [id]/          PATCH
      dashboard/       stats / charts / activity / deadlines
      ...              one folder per entity, mirroring the pages above
    error.tsx  not-found.tsx  loading.tsx     top-level boundaries
  components/
    ui/                Base UI-driven primitives (button, dialog, table, ...)
    shared/            EntityAvatar, StatusBadge, EmptyState, PageHeader
    dashboard/         stat cards, charts, activity feed
    layout/            sidebar, navbar, command palette, notifications
  lib/
    mock-api/          client-side data layer — thin fetch() wrappers per entity
    server/            cache.ts (unstable_cache + tag revalidation), query-utils.ts
    mock/seed.ts        the in-memory demo dataset (see below)
    store/             Zustand stores
```

**Why the extra hop through `/api/*` instead of just calling functions from the client?** Because every page already talks to the data layer the same way it would talk to a real backend — an HTTP boundary with server-side caching and revalidation. When a real database replaces the seed data, only the Route Handlers change; no page component does.

## Demo data

There's no database yet. `src/lib/mock/seed.ts` generates a realistic, internally-consistent dataset once per server process — companies, departments, teams, employees, projects, tasks, payroll runs, expenses, leave requests, attendance, invoices, files, and activity — all cross-referenced (an employee belongs to a real department, a task belongs to a real project and a real assignee, etc.). The seed is generated with a fixed Faker seed, so the data is stable across restarts.

Route Handlers read and mutate these in-memory arrays directly, so creates/updates/deletes made in the UI persist for the life of the server process and are visible to every request — but reset on redeploy or restart, since it's not backed by real storage.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The marketing page links straight into `/dashboard` — there's no login step in this phase.

```bash
npm run build   # production build
npm run start   # run the production build (see note below on standalone output)
npm run lint    # ESLint
```

> `next.config.ts` sets `output: "standalone"`, which `next start` doesn't fully support. For a production-accurate local run, build then execute `node .next/standalone/server.js` (after copying `public/` and `.next/static/` into `.next/standalone/`, exactly as the Dockerfile does).

## Deployment

- **`Dockerfile`** — multi-stage build (pnpm install → Next build → minimal standalone runtime image).
- **`docker-compose.yml`** — runs the container behind a Traefik reverse proxy on an external `proxy` network, with health checks.
- **`.github/workflows/deploy.yml`** — on every push to `main`, SSHes into the target VPS, pulls the latest commit, rebuilds, and restarts the container via `docker compose`.

## Roadmap

- Replace the in-memory seed with a real database and auth.
- Wire the Route Handlers to that database — the client, caching strategy, and every page stay as they are.
- Add authentication/authorization and real multi-tenant isolation.
