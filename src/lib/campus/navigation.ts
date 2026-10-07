import { FLOOR_HEIGHT, HALL } from "./layout"
import type { Obstacle } from "./types"

const EDGE = 0.45

/** Only Level 1 is walkable in this draft. */
export function surfaceHeight(
  x: number,
  z: number,
  current: number
): number | null {
  if (
    Math.abs(x) > HALL.width / 2 - EDGE ||
    Math.abs(z) > HALL.length / 2 - EDGE
  )
    return null
  return Math.abs(current) < 0.43 ? 0 : null
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

export function levelName(y: number) {
  if (y < -FLOOR_HEIGHT / 2) return "Ground floor"
  const level = Math.min(4, Math.floor(y / FLOOR_HEIGHT + 0.5) + 1)
  return `Level ${level}`
}
