# Development guide

## Edit the campus

`src/lib/campus.ts` contains `buildCampus`, `PLACES`, `surfaceHeight` and `isBlocked`.

- `buildCampus`: meshes, materials, lights-independent geometry and obstacles.
- `PLACES`: named spawn positions, camera targets and descriptions.
- `surfaceHeight`: valid walkable elevations and stairs.
- `isBlocked`: obstacle checks for the visitor.

Coordinates use X for width, Y for elevation and Z for depth. Keep rendered geometry, walkable surfaces and obstacles synchronized when editing dimensions. Add new geometry to the material batches where practical to preserve performance.

## Add a viewpoint

Add a `PlaceId` and entry to `PLACES`. Set the eye height to the ground elevation plus 1.65. Choose a position clear of obstacles and a camera target inside the space. Update the approximate SVG floor plan in `src/App.tsx` if the floor layout changes.

## Change branding

Update the header and footer in `src/App.tsx`, document metadata in `index.html`, the favicon in `public/favicon.svg`, and palette tokens in `src/styles.css`.

## Add reference images

Put images in `public/reference/`, then update `sourceFrames` in `src/App.tsx`. Keep source timestamps and coverage notes accurate. Runtime asset references use `import.meta.env.BASE_URL` for subdirectory hosting.

## Validate a change

Run `npm run check` and `npm run build`. In the browser, check both stair directions, all five spawn positions, balcony edges, obstacles, reset, overview switching, mouse release, reference dialogs, and touch controls. Check desktop and mobile layouts.

If WebGL fails, enable hardware acceleration or test another browser. Pointer lock may be restricted by embedded previews; dragging the scene remains available as a fallback.

## Deployment

The export has no backend or private runtime bindings. Deploy the contents of `dist/` to any static HTTPS host. The model and reference images are bundled with the website. No credentials belong in the repository.
