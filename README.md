# Modern Snorefare 2 — Pre-game Lobby Simulator

A recreation of the **Modern Warfare 2 pre-game lobby** screen, built with React + Vite + TypeScript + pnpm and styled with Tailwind CSS.

## Features

- **Left pane** — TEAM DEATHMATCH title, selectable menu items (CREATE A CLASS, CALLSIGN & KILLSTREAKS, BARRACKS, INVITE, VOTE TO SKIP), item description, map preview with Overgrown / Team Deathmatch overlay labels, and controller button glyphs (Y / B)
- **Right pane** — Transparent player list populated from a WebSocket (future), with a player-count footer (`X/Y PLAYERS`)
- **Name prompt** — Asks for your callsign on first visit; name is persisted in `localStorage`
- **Too-narrow guard** — If the viewport is taller than it is wide, users are asked to rotate or switch devices

## Tech stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [ShadCN / Radix UI](https://ui.shadcn.com/) primitives

## Getting started

```bash
pnpm install
pnpm dev
```

