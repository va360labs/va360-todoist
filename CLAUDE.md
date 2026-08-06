# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (HMR).
- `npm run build` — type-check (`tsc -b`) then production-build with Vite. Always run this (or at least `tsc -b`) after non-trivial changes; there is no separate typecheck script.
- `npm run lint` — run oxlint (config in `.oxlintrc.json`, plugins: react/typescript/oxc).
- `npm run preview` — serve the production build locally.
- No test runner is configured in this project.

## Architecture

This is a fully client-side, offline to-do app — no backend/API layer. React + TypeScript + Vite, styled with Tailwind CSS v4 wired through the `@tailwindcss/vite` plugin in `vite.config.ts` (there is intentionally no `tailwind.config.js`/`postcss.config.js`; the only setup is the `@import 'tailwindcss'` in `src/index.css`).

**State lives in one Zustand store** (`src/store.ts`), which is the single source of truth for projects, tasks, the currently selected project, and UI toggles. The entire store is persisted to `localStorage` via `zustand/middleware`'s `persist` (key: `todo-app-storage`), so any state shape change is a de facto storage migration for existing users.

Data model (`src/types.ts`):
- `Project { id, name, color, createdAt }`
- `Task { id, projectId, title, notes?, done, deadline?, priority, createdAt, completedAt? }`
- `Priority = 'low' | 'medium' | 'high'`

**Inbox is a special, permanent project.** `INBOX_ID` (`'inbox'`) is seeded into the store's initial `projects` state and is exported from `store.ts`. It cannot be deleted, renamed, or recolored (UI components explicitly hide those controls when `project.id === INBOX_ID`), and `deleteProject` reassigns any orphaned tasks to `INBOX_ID` instead of deleting them — so tasks are never silently lost when a project is removed.

**"All tasks" vs. single-project view** is driven by `selectedProjectId` being `null` vs. a project id. This one flag fans out to several components: `Sidebar` (highlighting the active entry), `NewTaskForm` (shows a project picker only in the "All" view, since a single-project view already implies the target project), `TaskList` (scopes which tasks are shown and whether to render each task's project color dot), and `App.tsx` (header title/color/edit controls).

**Deadline bucketing is centralized in `src/lib/deadline.ts`.** `classifyDeadline()` maps a task's `deadline` to `'overdue' | 'today' | 'soon' | 'later' | 'none'`, and `TaskList.tsx` groups open tasks into sections (Vencidas / Hoy / Próximos 3 días / Más adelante / Sin fecha) using that single function — bucket boundaries and labels only need to change in one place. Styling/labels for each status live alongside it in `DEADLINE_STYLES` / `DEADLINE_LABEL`.

Component layout under `src/components/`: `Sidebar` (project list + create project), `NewTaskForm` (quick-add row), `TaskItem` (row with inline edit, checkbox, delete), `TaskList` (filtering + deadline grouping + completed section). `App.tsx` composes these and owns the project-header rename/recolor UI.

UI copy is in Spanish (this project is a class example from a Claude Code course), so keep new user-facing strings in Spanish for consistency.
