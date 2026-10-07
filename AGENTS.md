# vmaps — Project Instructions

vmaps is the interactive 3D map of VIT (Vidyalankar Institute of Technology, Mumbai), under voss-labs. Sister project to [vboard](https://github.com/voss-labs/vboard), [verp](https://github.com/voss-labs/verp) and [vroom](https://github.com/voss-labs/vroom), set up with the same repo structure.

Today it is a first-person Three.js walkthrough of Level 1 of the main building, blocks A to G around the main hall, modelled by hand from photos and a satellite view. It is a draft, not a measured model. Read `docs/MODEL_NOTES.md` before presenting it as an accurate map and `docs/DEVELOPMENT.md` before touching geometry.

CLAUDE.md is symlinked to this file — same content applies to all coding agents.

## Process

This repo is worked through the preset MCP server. `.preset/` is local process state and stays out of git; `state.json` holds only `project_id` and `repo_key`, and the live phase comes from `preset.get_state`, never from a file. Record findings and decisions with `record()` as the work happens.

## Stack

- Vite 8 + React 19, TypeScript strict, a single-page app with no backend
- Three.js for the scene, OrbitControls for the overview mode
- Tailwind 4 with shadcn-style primitives (Radix UI) in `src/components/ui/`, Lucide icons
- ESLint (typescript-eslint, react-hooks, react-refresh) + Prettier (with the Tailwind plugin)
- GitHub Actions for CI
- npm

## Commands

- `npm run dev` — dev server on port 5173
- `npm run check` — typecheck, lint, format check (run before commit)
- `npm run fix` — autofix lint and formatting
- `npm run build` — typecheck, then production build into `dist/`
- `npm run preview` — serve the production build on port 4173

## Layout

- `src/App.tsx` — the explorer interface: toolbar, place list, overlays
- `src/components/campus-viewer.tsx` — Three.js renderer, movement, pointer lock, touch input
- `src/components/floor-plan.tsx`, `src/components/info-dialogs.tsx` — floor plan card, reference and help dialogs
- `src/lib/campus/` — the model. `layout.ts` holds the hall, the floor openings and the glass box; `blocks/` one file per block or court; `north-row.ts` and `south-row.ts` their order; `places.ts` the viewpoints; `navigation.ts` the walkable area and obstacle checks; the other files turn the data into meshes
- `src/components/ui/` — button, dialog and tabs primitives
- `src/styles.css` — Tailwind theme tokens and app styling
- `public/reference/` — the four frames from the source video shown in the app
- `docs/` — model notes and the development guide

## Conventions

- Imports: `@/` alias (mapped to `src/`)
- Formatting: Prettier (2 spaces, double quotes, no semicolons)
- File size: 200–400 lines max per file; split when bigger. Known debt from the import: `styles.css` is over the limit. Split it before adding to it
- Coordinates: Z runs along the main hall from the west wall (-55) to the M block end (+55), X across it (A to D on +x), Y is height above Level 1; floors are 4 m apart and eye height is the floor plus 1.65. `layout.ts` explains the local coordinates used inside each block
- Obstacles come from the layout: a piece blocks the visitor only when it is marked `solid`. Keep `solid` on anything people cannot walk through at Level 1
- Assets load through `import.meta.env.BASE_URL`, and `base: "./"` in `vite.config.ts` keeps subdirectory hosting working
- Every WebGL or pointer-lock failure has a visible fallback: an error message, or drag-to-look

## When adding code

- Follow the sibling repos' patterns for structure, scripts and docs
- The app is static with no backend, accounts or external services. Keep it that way unless a plan says otherwise
- Prefer calibrating the model from a floor plan and more footage over adding unverified rooms
- No emojis anywhere — code, comments, commits, docs
- One-line comments only when the WHY is non-obvious; never narrate the WHAT
