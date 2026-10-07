import { FLOOR_HEIGHT, FLOORS, HALL } from "./layout"
import type { Floor, Obstacle } from "./types"

// Stairs rise less than this between two movement steps; a bigger change is a wall or a drop.
const STEP = 0.45

function floorY(f: Floor, x: number, z: number) {
  if (typeof f.y === "number") return f.y
  const t =
    f.axis === "x"
      ? (x - f.x[0]) / (f.x[1] - f.x[0])
      : (z - f.z[0]) / (f.z[1] - f.z[0])
  return f.y[0] + (f.y[1] - f.y[0]) * t
}

/** Height of the walkable floor at (x, z) that can be reached from `current`; later floors win where they overlap. */
export function surfaceHeight(
  x: number,
  z: number,
  current: number
): number | null {
  let found: number | null = null
  for (const f of FLOORS) {
    if (x < f.x[0] || x > f.x[1] || z < f.z[0] || z > f.z[1]) continue
    const y = floorY(f, x, z)
    if (Math.abs(y - current) < STEP) found = y
  }
  return found
}

export function isBlocked(
  x: number,
  z: number,
  y: number,
  obstacles: Obstacle[]
) {
  return obstacles.some(
    (o) =>
      y + 0.15 < o.top &&
      y + 1.55 > o.bottom &&
      Math.abs(x - o.x) < o.w / 2 + 0.26 &&
      Math.abs(z - o.z) < o.d / 2 + 0.26
  )
}

export function levelName(y: number, z = 0) {
  if (z > HALL.length / 2) return "M block ground floor"
  if (y < -FLOOR_HEIGHT / 2) return "Ground floor"
  const level = Math.min(4, Math.floor(y / FLOOR_HEIGHT + 0.5) + 1)
  return `Level ${level}`
}
