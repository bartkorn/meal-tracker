# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs come first

Before writing or modifying any code, always check the `/docs` directory for a relevant doc file and follow it. For example, `docs/ui.md` defines the UI coding standards (shadcn/ui only) and must be consulted before making any UI-related change. If a `/docs/ui.md` file covers the area you're touching, its rules take precedence over general defaults.

`docs/data-fetching.md` is a must-read reference point before implementing any database or data-fetching interaction — Server Components only (no route handlers, no client-side fetching), all queries via Drizzle helpers in `/data` (no raw SQL), and strict per-user data isolation. Its rules take precedence over general defaults for anything touching data.

## Project state

This is a freshly scaffolded Next.js app (via `create-next-app`) with no custom application code yet — `src/app/page.tsx` still holds the default starter page. There are no tests configured.

## Commands

- `npm run dev` — start the dev server (Next.js, App Router)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

## Architecture

- Next.js App Router: pages/layouts live under `src/app/`.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Styling via Tailwind CSS v4 (`@tailwindcss/postcss` plugin, `src/app/globals.css`).
- TypeScript strict mode is enabled.
