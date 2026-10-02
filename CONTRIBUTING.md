# Contributing to vmaps

vmaps is a VOSS Labs project. Contributions are welcome from all Vidyalankar students.

New to open source? Start with [voss-labs/first-contributions](https://github.com/voss-labs/first-contributions), then come back.

## Setup

1. Fork the repo and clone your fork
2. `npm install`
3. `npm run dev`, then open http://localhost:5173

Node 22.13 or newer. No database, API keys or accounts are needed. The whole app runs in the browser.

## Making changes

1. Create a branch from `main`: `git checkout -b your-branch-name`
2. Make your changes
3. Run checks before committing:

```bash
npm run check
```

This runs TypeScript, ESLint and the Prettier format check. `npm run fix` autofixes lint and formatting.

4. Push and open a pull request against `main`

## Guidelines

- Read `AGENTS.md` first. It is short and carries the parts of the model that are easy to break by accident.
- Rendered geometry, walkable surfaces and obstacles in `src/lib/campus.ts` change together. `docs/DEVELOPMENT.md` explains how.
- Test in a browser before opening a pull request: both stair directions, every viewpoint, balcony edges, reset, overview mode and touch controls. A green `npm run check` is the floor, not the verdict.
- Keep files under 400 lines; split when they grow.
- Import with the `@/` alias.
- No emojis in code, commits, or docs.

## Issue labels

- `good-first-issue` -- scoped for first-time contributors
- `intermediate` -- requires familiarity with the codebase
- `advanced` -- complex changes across the scene, movement and UI
- `bug` -- something is broken
- `feature` -- new functionality
- `docs` -- documentation improvements

## Questions

Open an issue.
