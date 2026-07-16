# AGENTS.md

Instructions for AI agents working in this repository.

## Project overview

A web application
## Tech stack

### Frontend (`frontend/`)

| Concern        | Tool                         | Notes |
| -------------- | ---------------------------- | ----- |
| Package manager| **pnpm**                     | Never use `npm` or `yarn`. Use `pnpm add <pkg>` / `pnpm add -D <pkg>`. |
| Build/dev tool | **Vite** 8                   | Config in `frontend/vite.config.ts`. |
| UI library     | **React** 19                 | Function components + hooks only. |
| Routing        | **React Router** 8 (data mode)| Import from `react-router` (not `react-router-dom`). |
| Server state   | **TanStack Query** 5         | `@tanstack/react-query` for fetching/caching remote data. |
| Styling        | **Tailwind CSS** 4           | Utility-first; via `@tailwindcss/vite` plugin. |
| Language       | **TypeScript** (~6)          | Strict; prefer explicit types on APIs. |
| Linter         | **oxlint**                   | Config in `frontend/.oxlintrc.json`. |


## Commands

### Frontend

Run from `frontend/`:

- `pnpm install` — install dependencies
- `pnpm dev` — start the Vite dev server
- `pnpm build` — type-check (`tsc -b`) then build for production
- `pnpm lint` — run oxlint
- `pnpm preview` — preview the production build

## Conventions

### Routing (React Router — data mode)

- The router is defined as a config object with `createBrowserRouter` in `frontend/src/router.tsx` and provided via `<RouterProvider>` in `frontend/src/main.tsx`. Do **not** switch to JSX `<Routes>`/`<BrowserRouter>` (component mode).
- Import everything from `react-router` (e.g. `Link`, `NavLink`, `Outlet`, `useLoaderData`, `createBrowserRouter`).
- Page components live in `frontend/src/routes/`. `root.tsx` is the layout (renders `<Outlet />`); `error-page.tsx` is the shared `errorElement`. When adding a route, register it in `router.tsx` and add a `NavLink` in `root.tsx`.


### Styling (Tailwind)

- Style with Tailwind utility classes in JSX `className`. Avoid separate `.css` files and inline `style` objects unless a value can't be expressed with utilities.
- Global styles / Tailwind entry: `frontend/src/index.css` (`@import "tailwindcss";`).
- The accent color is **sky**; slate is the neutral palette. Reuse these for visual consistency.

### Dark / light mode

- Dark mode is **class-based**: `frontend/src/index.css` defines `@custom-variant dark (&:where(.dark, .dark *))`, activated by a `dark` class on `<html>`.
- Theme state lives in `frontend/src/theme.tsx` (`ThemeProvider` + `useTheme`). It persists the choice to `localStorage` (key `theme`), falls back to the OS `prefers-color-scheme`, and toggles the `dark` class on `document.documentElement`. `ThemeProvider` wraps the app in `frontend/src/main.tsx`.
- An inline script in `frontend/index.html` `<head>` applies the stored/preferred theme before React mounts to avoid a flash of the wrong theme. Keep it in sync with `theme.tsx` (storage key and logic).
- Write **light styles as the base and dark styles with the `dark:` variant** (e.g. `bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100`). Every color utility that matters visually should have a `dark:` counterpart.


### General

- TypeScript everywhere in the frontend (`.tsx` for components). No new `.js`/`.jsx` source files.
- Keep components small and composable; one route/page per file.
- Do not add narrating comments; comment only non-obvious intent.
- After edits, ensure `pnpm lint` and `pnpm build` pass.

## Static assets

- Files in `frontend/public/` are served at the site root (`/favicon.ico`, `/manifest.webmanifest`, etc.). The favicon set and web app manifest live here.
