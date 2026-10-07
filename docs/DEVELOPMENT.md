# Development guide

## Edit the campus

The model is data. Every block, landmark, floor opening and viewpoint is a plain entry in `src/lib/campus/`:

- `layout.ts`: the hall size, the openings down to the labs (`VOIDS`), the glass box between D and E, and loose items in the main hall. Its header explains the coordinates.
- `blocks/`: one file per block or court, holding everything that belongs to it.
- `north-row.ts`: the order of the north side from the west wall: A, the chess court, the exam department, B, the common area, C, Nescafe and D.
- `south-row.ts`: the order of the south side: the main gate, G, the stair tower, the blue recess, F, the east end of F, Gate 2 and E.
- `places.ts`: the viewpoints in the place list.

World coordinates are metres: Z runs along the main hall from the west wall (-55) to the M block end (+55), X runs across it with A to D on the +x side, and Y is height above Level 1. Floors are 4 m apart and the underside of the roof frame is at about 15 m.

Each row entry spans `from` to `to` along Z, and the entries in a row must meet end to end from -55 to +55. Pieces inside an entry use local coordinates, `at: [out, y, along]`, so they move with the block: `out` is metres from the block front into the main hall (negative goes back into the block) and `along` is metres from the entry's west end. A plan point is `[out, along]`.

Common corrections:

- Move or resize a block: change its `from` and `to`, and shift the neighbouring entry so the row still meets end to end. Change `depth` to move its front: the default is 9 m from the outer wall.
- Set part of Level 1 back, for example under a platform: `recess: [along from, along to, metres]`.
- Change how a block faces the hall: `facade` (open balconies, a glass curtain wall, sawtooth glass or a solid upper body), `ground` (doors, glass or plain at Level 1) and `upper` (window style on the upper rooms).
- Move a landmark: change the numbers in its `at`, or the plan points of a `shape`.
- Move an opening in the floor: change `x`, `z`, `w` and `d` in `VOIDS`, or its `points` outline, `entry` and stair `flights` when it is drawn as an outline.
- Add something: copy a similar piece. Piece kinds are listed in `types.ts`.

A piece blocks the visitor only when it has `solid: true`. Blocks, openings, stairs, tables and benches are solid already.

## Live correction in dev

`npm run dev` rebuilds the scene on every save. In dev only:

- the camera stays where it was across rebuilds, so a correction can be checked in place
- the floor plan card shows your position as `x` and `z`, so you can stand at a spot and read its coordinates
- the console warns when a row has a gap or overlap, or a viewpoint starts inside something

## Add a viewpoint

Add a `PlaceId` and an entry to `PLACES` in `places.ts`. Set the eye height to 1.65, choose a position clear of obstacles and a camera target inside the space. The floor plan picks it up automatically.

## Change branding

Update the header and footer in `src/App.tsx`, document metadata in `index.html`, the favicon in `public/favicon.svg`, and palette tokens in `src/styles.css`.

## Add reference images

Put images in `public/reference/`, then update `sourceFrames` in `src/components/info-dialogs.tsx`. Keep source timestamps and coverage notes accurate. Runtime asset references use `import.meta.env.BASE_URL` for subdirectory hosting. Do not commit photos that show students' faces.

## Validate a change

Run `npm run check` and `npm run build`. In the browser, check every viewpoint, walking into blocks and openings, reset, overview switching, mouse release, reference dialogs, and touch controls. Check desktop and mobile layouts.

If WebGL fails, enable hardware acceleration or test another browser. Pointer lock may be restricted by embedded previews; dragging the scene remains available as a fallback.

## Deployment

The export has no backend or private runtime bindings. Deploy the contents of `dist/` to any static HTTPS host. The model and reference images are bundled with the website. No credentials belong in the repository.
