import type * as THREE from "three"
import { buildHall } from "./hall"
import { createKit } from "./kit"
import { HALL, NORTH_ROW, SOUTH_ROW } from "./layout"
import { isBlocked, surfaceHeight } from "./navigation"
import { PLACES } from "./places"
import { buildSegment } from "./segments"
import type { Obstacle, Segment } from "./types"

// Hand edits to the layout can leave gaps between blocks or bury a viewpoint, so say so in dev.
function checkLayout(obstacles: Obstacle[]) {
  for (const [name, row] of [
    ["north", NORTH_ROW],
    ["south", SOUTH_ROW],
  ] as [string, Segment[]][]) {
    let z = -HALL.length / 2
    for (const s of row) {
      if (Math.abs(s.from - z) > 0.01)
        console.warn(
          `[vmaps] ${name} row: ${s.id} starts at ${s.from}, expected ${z}`
        )
      z = s.to
    }
    if (Math.abs(z - HALL.length / 2) > 0.01)
      console.warn(
        `[vmaps] ${name} row ends at ${z}, expected ${HALL.length / 2}`
      )
  }
  for (const p of PLACES) {
    const [x, eye, z] = p.pos
    const ground = eye - 1.65
    if (
      surfaceHeight(x, z, ground) === null ||
      isBlocked(x, z, ground, obstacles)
    )
      console.warn(
        `[vmaps] viewpoint "${p.id}" starts inside something; move it in places.ts`
      )
  }
}

export function buildCampus(scene: THREE.Scene) {
  const kit = createKit(scene)
  buildHall(kit)
  for (const s of NORTH_ROW) buildSegment(kit, s, 1)
  for (const s of SOUTH_ROW) buildSegment(kit, s, -1)
  kit.finish()
  if (import.meta.env.DEV) checkLayout(kit.obstacles)
  return {
    main: kit.main,
    roof: kit.roof,
    labels: kit.labels,
    obstacles: kit.obstacles,
  }
}
