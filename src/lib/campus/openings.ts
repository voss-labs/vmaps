import * as THREE from "three"
import type { Kit } from "./kit"
import { FLOOR_HEIGHT, HALL, VOIDS } from "./layout"
import { bench } from "./props"
import type { Vec2, Void } from "./types"

const WALL = 0.3

/** World (x, z) outline of an opening. */
export function outline(v: Void): Vec2[] {
  if (v.points) return v.points
  const x0 = v.x - v.w / 2,
    x1 = v.x + v.w / 2,
    z0 = v.z - v.d / 2,
    z1 = v.z + v.d / 2
  return [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ]
}

export function floorSlab(kit: Kit) {
  const hw = HALL.width / 2,
    hl = HALL.length / 2
  const v2 = ([x, z]: Vec2) => new THREE.Vector2(x, -z)
  const corners: Vec2[] = [
    [-hw, -hl],
    [hw, -hl],
    [hw, hl],
    [-hw, hl],
  ]
  const shape = new THREE.Shape(corners.map(v2))
  for (const v of VOIDS) shape.holes.push(new THREE.Path(outline(v).map(v2)))
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35,
    bevelEnabled: false,
  })
  geo.rotateX(-Math.PI / 2)
  kit.put(geo, "floor", 0, -0.35, 0)
}

// Where an opening's stairs start at floor level, so the guard leaves a gap there.
function entryOf(v: Void): [Vec2, Vec2] | undefined {
  if (v.entry) return v.entry
  if (!v.stairs || v.points) return undefined
  const half = Math.min(2.4, v.w - 0.6) / 2
  const z = v.stairs === "west" ? v.z + v.d / 2 : v.z - v.d / 2
  return [
    [v.x - half, z],
    [v.x + half, z],
  ]
}

function onSegment(p: Vec2, a: Vec2, b: Vec2) {
  const [dx, dz] = [b[0] - a[0], b[1] - a[1]]
  const len2 = dx * dx + dz * dz
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / len2
  const [cx, cz] = [a[0] + dx * t, a[1] + dz * t]
  return t > -0.01 && t < 1.01 && Math.hypot(p[0] - cx, p[1] - cz) < 0.05
    ? t
    : null
}

const sideOf = (nx: number, nz: number) =>
  Math.abs(nx) > Math.abs(nz)
    ? nx > 0
      ? "north"
      : "south"
    : nz > 0
      ? "east"
      : "west"

function opening(kit: Kit, v: Void) {
  if (v.bare) return
  const LABS = -(v.depth ?? FLOOR_HEIGHT)
  const pts = outline(v)
  const xs = pts.map((p) => p[0]),
    zs = pts.map((p) => p[1])
  const [cx, cz] = [
    (Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...zs) + Math.max(...zs)) / 2,
  ]
  const [w, d] = [
    Math.max(...xs) - Math.min(...xs),
    Math.max(...zs) - Math.min(...zs),
  ]
  kit.box(w + 0.4, 0.3, d + 0.4, cx, LABS - 0.15, cz, "labFloor")
  const entry = entryOf(v)
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i],
      b = pts[(i + 1) % pts.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (len < 0.05) continue
    // Push each edge outwards (away from the middle) for the guard, inwards for the shaft wall.
    let [nx, nz] = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len]
    const [mx, mz] = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cz]
    if (nx * mx + nz * mz < 0) [nx, nz] = [-nx, -nz]
    if (v.open?.includes(sideOf(nx, nz))) continue
    const shift = (p: Vec2, s: number): Vec2 => [p[0] + nx * s, p[1] + nz * s]
    kit.panel(shift(a, -0.12), shift(b, -0.12), LABS, 0, 0.2, "concrete")
    const guard = (p: Vec2, q: Vec2) => {
      if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.2) return
      const [gp, gq] = [shift(p, WALL / 2), shift(q, WALL / 2)]
      kit.guard(gp, gq)
      kit.bounds([gp, gq], LABS, 1)
    }
    const t0 = entry && onSegment(entry[0], a, b),
      t1 = entry && onSegment(entry[1], a, b)
    if (
      entry &&
      t0 !== null &&
      t1 !== null &&
      t0 !== undefined &&
      t1 !== undefined
    ) {
      const [near, far] = t0 < t1 ? [entry[0], entry[1]] : [entry[1], entry[0]]
      guard(a, near)
      guard(far, b)
      kit.bounds([near, far], LABS, 1)
    } else guard(a, b)
  }
  if (!v.points) kit.solid(v.x, v.z, v.w + WALL * 2, v.d + WALL * 2, LABS, 1)
  stairsFor(kit, v)
  benchesFor(kit, v)
}

function stairsFor(kit: Kit, v: Void) {
  const LABS = -(v.depth ?? FLOOR_HEIGHT)
  if (v.flights) {
    for (const [a, b, y0, y1] of v.flights) {
      kit.stairs(a, b, y0, y1, 1.6, { solid: false })
      if (y1 > LABS + 0.01)
        kit.box(
          1.6,
          0.2,
          1.4,
          b[0],
          y1 - 0.1,
          b[1] + Math.sign(b[1] - a[1]) * 0.7,
          "chequer"
        )
    }
    return
  }
  if (!v.stairs) return
  const width = Math.min(2.4, v.w - 0.6)
  const run = Math.min(v.d - 0.4, 7)
  const top = v.stairs === "west" ? v.z + v.d / 2 - 0.05 : v.z - v.d / 2 + 0.05
  const bottom = v.stairs === "west" ? top - run : top + run
  kit.stairs([v.x, top], [v.x, bottom], 0, LABS, width, { solid: false })
}

function benchesFor(kit: Kit, v: Void) {
  if (!v.benches || v.points) return
  const alongZ = v.d >= v.w
  const len = Math.min(2.6, (alongZ ? v.d : v.w) - 1.2)
  const sides =
    v.benches === true
      ? [-1, 1]
      : [v.benches === "north" || v.benches === "east" ? 1 : -1]
  for (const s of sides)
    if (alongZ) bench(kit, [v.x + s * (v.w / 2 + WALL + 0.25), v.z], len, true)
    else bench(kit, [v.x, v.z + s * (v.d / 2 + WALL + 0.25)], len, false)
}

export function openings(kit: Kit) {
  for (const v of VOIDS) opening(kit, v)
}
