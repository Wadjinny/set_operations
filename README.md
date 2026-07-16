# Set Operations

Paste up to six sets and compute differences, intersections, and unions. Includes stats and simple visualization tabs.

**Live:** [set-op.w-ilyas.site](https://set-op.w-ilyas.site)

## Features

- Multi-set input with flexible separators (newline, comma, …)
- Pairwise / all-set union, intersection, and difference results with copy
- Examples, frequency view, and smart stats / visualization tabs
- Client-side only

## Stack

pnpm, Vite 8, React 19, React Router 8, Tailwind CSS 4, TypeScript, oxlint.

## Run locally

```bash
cd frontend
pnpm install
pnpm dev
```

## Deploy

Push to `main` builds the Vite app and deploys over SSH, then reloads the Caddy site config.
