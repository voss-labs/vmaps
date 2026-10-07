import { HALL } from "./layout"
import type { Face, Segment, Vec2 } from "./types"

/** Maps local (out, along) to world (x, z); yaw is the direction that faces the main hall. */
export type Frame = {
  x: (out: number) => number
  z: (along: number) => number
  yaw: number
}

export const WORLD: Frame = { x: (o) => o, z: (a) => a, yaw: Math.PI }

export function segmentFrame(s: Segment, side: 1 | -1): Frame {
  const front = HALL.width / 2 - (s.depth ?? HALL.blockDepth)
  return {
    x: (o) => side * (front - o),
    z: (a) => s.from + a,
    yaw: side > 0 ? -Math.PI / 2 : Math.PI / 2,
  }
}

const FACES: Record<Exclude<Face, "out">, number> = {
  west: Math.PI,
  east: 0,
  north: Math.PI / 2,
  south: -Math.PI / 2,
}

export const faceYaw = (f: Frame, face: Face = "out") =>
  face === "out" ? f.yaw : FACES[face]

export const toWorld = (f: Frame, [out, along]: Vec2): Vec2 => [
  f.x(out),
  f.z(along),
]

/** World (x, z) direction along a surface that faces `yaw`. */
export const across = (yaw: number): Vec2 => [Math.cos(yaw), -Math.sin(yaw)]

/** Plan outline of a volume whose front bows out by `depth` between along[0] and along[1]. */
export function bulgePoints(
  along: Vec2,
  out: number,
  depth: number,
  back: number
): Vec2[] {
  const points: Vec2[] = [[out - back, along[0]]]
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    points.push([
      out + depth * 4 * t * (1 - t),
      along[0] + (along[1] - along[0]) * t,
    ])
  }
  points.push([out - back, along[1]])
  return points
}
