# Changelog

## Unreleased

- Rebuilt Level 1 at a corrected scale after a second pass over the photos. Storeys are 4 m, the roof is lower and lighter, light is softer, and the field of view is narrower. The main gate is now in the south side. There are four floor openings, each with a low parapet and one handrail. Every block was rebuilt with its feature volumes, signs and fittings: G's sawtooth glass and brick box, the stair tower and blue recess, F's prow, timber box, stair and orange box, B's landing and OSB box, the canteen's frame, Nescafe's stepped wall, D's walkway, E's wavy red wall and maroon wall, and the glass box on its platform. Each block now lives in its own file in `src/lib/campus/blocks/`.
- Replaced the single-atrium model with a first draft of Level 1 of the main building, built from photos and a satellite view: blocks A to G at an estimated scale, the exam department, the C block canteen, Nescafe, the glass box, the main gate, Gate 2 and openings down to the labs. The layout is plain data in `src/lib/campus/`, so positions can be corrected by editing numbers.
- Seven new viewpoints, a floor plan drawn from the layout data, and place labels in the 3D overview. In dev, the camera stays in place when the scene rebuilds and the floor plan shows your coordinates.
- Fixed the floor plan card's layers icon rendering at full card size.
- Imported the VIT campus explorer export: a first-person Three.js walkthrough of the central atrium with stairs, three elevations, collisions, an orbit overview, a live floor plan, five viewpoints and four reference frames from the source video.
- Set the repo up like the other VOSS Labs projects: npm instead of pnpm, Prettier and ESLint behind `npm run check`, MIT license, contributing guide, issue and pull request templates, and CI running typecheck, lint, format check and build on Node 24.
- Formatted the generated single-line source with Prettier. No behaviour change.
