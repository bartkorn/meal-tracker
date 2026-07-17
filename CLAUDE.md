# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
