# vmaps

An interactive 3D map of VIT (Vidyalankar Institute of Technology, Mumbai), by [voss-labs](https://github.com/voss-labs).

Walk the central atrium in first person, climb the stairs, switch to a rotatable overview and jump between viewpoints. It runs entirely in the browser: no accounts, no backend, no API keys.

## Stack

| Layer     | Choice                                      |
| --------- | ------------------------------------------- |
| Framework | Vite 8, React 19                            |
| Language  | TypeScript (strict)                         |
| 3D        | Three.js                                    |
| Styling   | Tailwind CSS 4, Radix UI primitives, Lucide |
| Quality   | ESLint, Prettier                            |
| CI        | GitHub Actions                              |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and press Start walking. Node 22.13 or newer.

## Scripts

| Script            | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Dev server on port 5173                     |
| `npm run build`   | Typecheck and production build into `dist/` |
| `npm run preview` | Serve the production build on port 4173     |
| `npm run check`   | Typecheck, lint and format check            |
| `npm run fix`     | Autofix lint and formatting                 |

## Controls

| Action                   | Control                                 |
| ------------------------ | --------------------------------------- |
| Begin walking            | Start walking                           |
| Move                     | W, A, S, D or arrow keys                |
| Move faster              | Hold Shift                              |
| Look                     | Mouse after starting, or drag the scene |
| Release mouse / pause    | Escape                                  |
| Switch walk / overview   | M or the bottom toolbar                 |
| Orbit / zoom in overview | Drag / scroll or pinch                  |
| Jump to a viewpoint      | Place list or numbered map point        |
| Reset                    | Reset button in the bottom toolbar      |

## What is in the MVP

- First-person keyboard navigation and mouse look, with drag-to-look as the fallback
- Walkable stairs, three modeled elevations, obstacle collisions and balcony boundaries
- Rotatable 3D overview and a live position marker on the estimated floor plan
- Five viewpoint shortcuts and four reference frames from the source video
- Touch direction buttons and drag-to-look on mobile
- Optional, feature-detected WebMCP viewpoint navigation

## Project structure

```text
src/
  App.tsx                explorer interface, place list, floor plan, reference gallery
  main.tsx               React entry point
  styles.css             theme tokens and app styling
  components/
    campus-viewer.tsx    Three.js rendering, movement and inputs
    ui/                  button, dialog and tabs primitives
  lib/
    campus.ts            geometry, viewpoints, walkable surfaces and obstacles
    utils.ts             class-name helper
public/reference/        four frames from the source video
docs/                    model notes and the development guide
```

## Deploying

`npm run build` writes a static site to `dist/`. Serve it from any static host; asset paths are relative, so it also works under a subdirectory. Opening `index.html` straight from the filesystem does not work because the app uses JavaScript modules.

## Model accuracy

This MVP reconstructs the central atrium visible in a 44-second video. It is not a measured scan or a complete campus model: dimensions, upper-level connections and unseen surfaces are estimates. Read [docs/MODEL_NOTES.md](./docs/MODEL_NOTES.md) before expanding it or presenting it as an accurate map.

## Docs

- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) — editing the campus, adding viewpoints, validating changes
- [docs/MODEL_NOTES.md](./docs/MODEL_NOTES.md) — source coverage and geometric assumptions
- [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](./LICENSE)
