# VIT Campus Explorer — VOSS Labs

A standalone, interactive Three.js walkthrough of the central atrium at **Vidyalankar Institute of Technology, Mumbai**, prepared for **VOSS Labs**.

## Quick start

Install Node.js 24 LTS and pnpm 11.25.0, then run these commands inside this folder:

```bash
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed in the terminal (normally `http://localhost:5173`). No API keys, database, account, or external service is required.

## Build and preview

```bash
pnpm build
pnpm preview
```

The production website is generated in `dist/`. Serve that directory with a static web server or deploy it to your preferred static host. Opening `index.html` directly from the filesystem is not supported because the application uses JavaScript modules.

The project uses relative asset paths, so it can also be deployed under a subdirectory. The included `dist/` is the verified production build; regenerate it after editing source.

## Features

- First-person keyboard navigation and mouse look, with drag-to-look fallback.
- Shift to move faster; Escape to release mouse control.
- Walkable stairs, three modeled elevations, obstacle collisions and balcony boundaries.
- Rotatable 3D overview and live position on the estimated floor plan.
- Five viewpoint shortcuts and four source-video reference images.
- Touch direction buttons and drag-to-look for mobile devices.
- Optional, feature-detected WebMCP viewpoint navigation.

## Controls

| Action | Control |
| --- | --- |
| Begin walking | **Start walking** |
| Move | W, A, S, D or arrow keys |
| Move faster | Hold Shift |
| Look | Mouse after starting, or drag the scene |
| Release mouse / pause | Escape |
| Switch walk / overview | M or the bottom toolbar |
| Orbit / zoom in overview | Drag / scroll or pinch |
| Jump to a viewpoint | Place list or numbered map point |
| Reset | Reset button in the bottom toolbar |

## Project structure

```text
voss-vit-campus-explorer/
├── src/
│   ├── App.tsx                   # Explorer interface, place list and reference gallery
│   ├── main.tsx                  # React entry point
│   ├── styles.css                # Responsive styling
│   ├── components/
│   │   ├── campus-viewer.tsx      # Three.js rendering, movement and inputs
│   │   └── ui/                   # Dialog, tabs and button primitives
│   └── lib/
│       ├── campus.ts             # Geometry, viewpoints and collision surfaces
│       └── utils.ts              # Class-name helper
├── public/
│   ├── favicon.svg
│   └── reference/                # Four extracted images used by the website
├── docs/
│   ├── MODEL_NOTES.md            # Source coverage and geometric assumptions
│   └── DEVELOPMENT.md            # Extending the map and checking changes
├── dist/                         # Ready-to-host production build
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
└── vite.config.ts
```

## Stack

React, TypeScript, Three.js, Vite, Tailwind CSS, Radix UI and Lucide icons. Dependencies are pinned by `pnpm-lock.yaml`.

This export preserves the original explorer and assets, adapts the website to a standard Vite entry point, and adds VOSS Labs attribution. The original hosting framework is not required to run it. No source video is required at runtime; the four extracted images used by the website are included.

## Model accuracy

This MVP reconstructs the central atrium visible in the supplied 44.5-second video. It is not a measured scan or a complete college model. Dimensions, upper-level connections and unseen surfaces are estimates. See `docs/MODEL_NOTES.md` before expanding or presenting it as an accurate map.

## Checks

```bash
pnpm typecheck
pnpm build
```

The standalone export passes TypeScript and the production build. The original model also passed geometry-construction, spawn-point, stair-transition, obstacle and boundary checks. Live browser playtesting and optional WebMCP execution remain unverified.

## Team handoff

1. Create the VOSS Labs repository and commit this folder, excluding `node_modules` and generated `dist`.
2. Use the notes in `docs/DEVELOPMENT.md` to calibrate the model from a floor plan and additional walkthroughs.
3. Choose a repository license before making an open-source release. Third-party packages retain their own licenses.
