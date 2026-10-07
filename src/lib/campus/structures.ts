import * as THREE from "three"
import { across, bulgePoints, faceYaw, toWorld, type Frame } from "./frame"
import type { Kit } from "./kit"
import { FLOOR_HEIGHT } from "./layout"
import type { MatName, Vec2, Vec3 } from "./types"

export function sawtooth(
  kit: Kit,
  f: Frame,
  along: Vec2,
  y: Vec2,
  depth: number
) {
  const n = Math.max(2, Math.round((along[1] - along[0]) / 1.2))
  const step = (along[1] - along[0]) / n
  const folds: Vec2[] = []
  for (let i = 0; i <= n; i++)
    folds.push(toWorld(f, [i % 2 ? depth : 0.05, along[0] + i * step]))
  for (let i = 0; i < n; i++) {
    const a = folds[i],
      b = folds[i + 1]
    kit.panel(a, b, y[0], y[1], 0.06, "glass")
    for (const level of [1, 2, 3].map((k) => k * FLOOR_HEIGHT))
      if (level > y[0] && level <= y[1])
        kit.panel(a, b, level - 0.3, level, 0.12, "white")
    kit.rod([a[0], y[0], a[1]], [a[0], y[1], a[1]], 0.04, "black")
  }
}

export function awning(
  kit: Kit,
  f: Frame,
  out: number,
  along: Vec2,
  y: number,
  depth: number
) {
  const n = Math.max(1, Math.round((along[1] - along[0]) / 0.32))
  const w = (along[1] - along[0]) / n
  for (let i = 0; i < n; i++) {
    const z = f.z(along[0] + (i + 0.5) * w)
    const mat = i % 2 ? "linen" : "red"
    kit.beam([f.x(out), y, z], [f.x(out + depth), y - 0.35, z], w, 0.05, mat)
    kit.box(0.04, 0.28, w, f.x(out + depth), y - 0.48, z, mat)
  }
}

export function frame(kit: Kit, f: Frame, at: Vec3, size: Vec3) {
  const [o, y, a] = at,
    [so, h, sa] = size
  const outs = [o - so / 2, o + so / 2],
    alongs = [a - sa / 2, a + sa / 2]
  for (const oo of outs)
    for (const aa of alongs) kit.box(0.35, h, 0.35, f.x(oo), y, f.z(aa), "beam")
  for (const yy of [y, y + h / 2 - 0.2]) {
    for (const oo of outs) kit.box(0.3, 0.4, sa, f.x(oo), yy, f.z(a), "beam")
    for (const aa of alongs) kit.box(so, 0.4, 0.3, f.x(o), yy, f.z(aa), "beam")
  }
}

export function column(
  kit: Kit,
  [x, z]: Vec2,
  y: Vec2 = [0, 4.2],
  r = 0.15,
  mat: MatName = "beam"
) {
  kit.rod([x, y[0], z], [x, y[1], z], r, mat)
  if (y[0] < 1.8) kit.solid(x, z, r * 2, r * 2, y[0], y[1])
}

export function curvedBalcony(
  kit: Kit,
  f: Frame,
  along: Vec2,
  out: number,
  depth: number,
  y: number,
  mat: MatName = "white"
) {
  const outline = bulgePoints(along, out, depth, 0.6).map((q) => toWorld(f, q))
  kit.prism(outline, y - 0.3, y, mat)
  const front = outline.slice(1, -1)
  for (let i = 1; i < front.length; i++)
    kit.panel(front[i - 1], front[i], y - 0.6, y - 0.05, 0.12, "white")
  kit.railPath(front, y)
}

export function bridge(kit: Kit, a: Vec2, b: Vec2, y: number, width: number) {
  kit.beam([a[0], y - 0.2, a[1]], [b[0], y - 0.2, b[1]], width, 0.4, "navy")
  const yaw = Math.atan2(b[0] - a[0], b[1] - a[1])
  const [ox, oz] = across(yaw).map((v) => (v * (width - 0.1)) / 2)
  for (const s of [-1, 1])
    kit.railPath(
      [
        [a[0] + s * ox, a[1] + s * oz],
        [b[0] + s * ox, b[1] + s * oz],
      ],
      y
    )
}

export function steps(
  kit: Kit,
  a: Vec2,
  b: Vec2,
  width: number,
  count: number,
  height: number,
  base = 0,
  mat: MatName = "concrete"
) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1]
  const run = Math.hypot(dx, dz) / count
  const yaw = Math.atan2(dx, dz)
  for (let i = 0; i < count; i++) {
    const h = (height * (i + 1)) / count,
      t = (i + 0.5) / count
    kit.box(width, h, run, a[0] + dx * t, base + h / 2, a[1] + dz * t, mat, {
      yaw,
    })
  }
  const [ox, oz] = across(yaw).map((v) => (v * width) / 2)
  kit.bounds(
    [
      [a[0] + ox, a[1] + oz],
      [a[0] - ox, a[1] - oz],
      [b[0] + ox, b[1] + oz],
      [b[0] - ox, b[1] - oz],
    ],
    base,
    base + height
  )
}

export function scaffold(
  kit: Kit,
  f: Frame,
  from: Vec2,
  to: Vec2,
  y: Vec2,
  sheet: MatName = "plastic"
) {
  const a = toWorld(f, from),
    b = toWorld(f, to)
  kit.panel(a, b, y[0], y[1], 0.06, sheet, y[0] < 1.8)
  const yaw = faceYaw(f)
  const [nx, nz] = [Math.sin(yaw) * 0.2, Math.cos(yaw) * 0.2]
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const cols = Math.max(1, Math.round(len / 2))
  const at = (t: number): Vec2 => [
    a[0] + (b[0] - a[0]) * t + nx,
    a[1] + (b[1] - a[1]) * t + nz,
  ]
  for (let i = 0; i <= cols; i++) {
    const [x, z] = at(i / cols)
    kit.rod([x, y[0], z], [x, y[1], z], 0.05, "bamboo")
  }
  for (let h = y[0] + 1.6; h < y[1]; h += 1.8) {
    const [x0, z0] = at(0),
      [x1, z1] = at(1)
    kit.rod([x0, h, z0], [x1, h, z1], 0.045, "bamboo")
  }
  for (let i = 0; i < cols; i += 2) {
    const [x0, z0] = at(i / cols),
      [x1, z1] = at((i + 1) / cols)
    kit.rod([x0, y[0], z0], [x1, y[1], z1], 0.04, "bamboo")
  }
}

/** White concrete stairs zig-zagging up `levels` storeys in two half-flights each. */
export function stairTower(
  kit: Kit,
  f: Frame,
  [out, along]: Vec2,
  levels: number,
  width: number,
  run: number
) {
  const half = FLOOR_HEIGHT / 2
  for (let k = 0; k < levels; k++) {
    const y = k * FLOOR_HEIGHT
    const p = (o: number, a: number) => toWorld(f, [o, a])
    const left = out - width / 2 - 0.1,
      right = out + width / 2 + 0.1
    kit.stairs(
      p(left, along - run / 2),
      p(left, along + run / 2),
      y,
      y + half,
      width,
      { look: "concrete" }
    )
    kit.stairs(
      p(right, along + run / 2),
      p(right, along - run / 2),
      y + half,
      y + FLOOR_HEIGHT,
      width,
      { look: "concrete" }
    )
    const landing = (a: number, ly: number) =>
      kit.box(
        width * 2 + 0.2,
        0.25,
        1.4,
        f.x(out),
        ly - 0.125,
        f.z(a),
        "plaster"
      )
    landing(along + run / 2 + 0.7, y + half)
    landing(along - run / 2 - 0.7, y + FLOOR_HEIGHT)
  }
}

/** Flat bamboo lattice canopy between two corners, on poles along the edge at `to`. */
export function canopy(kit: Kit, f: Frame, from: Vec2, to: Vec2, y: number) {
  const o0 = Math.min(from[0], to[0]),
    o1 = Math.max(from[0], to[0])
  const a0 = Math.min(from[1], to[1]),
    a1 = Math.max(from[1], to[1])
  const p = (o: number, a: number, h = y): Vec3 => [f.x(o), h, f.z(a)]
  for (let a = a0; a <= a1 + 0.01; a += 0.7)
    kit.rod(p(o0, a), p(o1, a), 0.04, "bamboo")
  for (let o = o0; o <= o1 + 0.01; o += 0.9)
    kit.rod(p(o, a0), p(o, a1), 0.05, "bamboo")
  for (let a = a0; a <= a1 + 0.01; a += 2.5) {
    kit.rod(p(to[0], a, 0), p(to[0], a), 0.06, "bamboo")
    kit.solid(f.x(to[0]), f.z(a), 0.15, 0.15, 0, y)
  }
}

/** A vertical wall whose outline in elevation is (along, y) points above `base`; it is `thick` deep from `out` toward the hall. */
export function profileWall(
  kit: Kit,
  f: Frame,
  out: number,
  thick: number,
  base: number,
  points: Vec2[],
  mat: MatName
) {
  const first = points[0][0],
    last = points[points.length - 1][0]
  const outline: Vec2[] =
    points[0][1] === base
      ? [...points, [last, base]]
      : [[first, base], ...points, [last, base]]
  const shape = new THREE.Shape(
    outline.map(([a, y]) => new THREE.Vector2(a, y))
  )
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thick,
    bevelEnabled: false,
  })
  geo.rotateY(-Math.PI / 2)
  // After the turn the wall runs along z from 0 and is extruded toward -x.
  const front = f.x(out)
  const towardHall = f.x(out + 1) - front
  kit.put(geo, mat, towardHall < 0 ? front : front + thick, 0, f.z(0))
}

/** A shopfront of framed panels; listed bays get a clear window band or a glass door. */
export function bays(
  kit: Kit,
  f: Frame,
  out: number,
  along: Vec2,
  height: number,
  count: number,
  clear: number[] = [],
  door?: number,
  mat: MatName = "polycarb"
) {
  const w = (along[1] - along[0]) / count
  const x = f.x(out)
  for (let i = 1; i <= count; i++) {
    const z = f.z(along[0] + (i - 0.5) * w)
    const panel = (y0: number, y1: number, m: MatName) =>
      kit.box(0.05, y1 - y0, w - 0.06, x, (y0 + y1) / 2, z, m)
    if (i === door) {
      panel(0, 2.1, "glass")
      panel(2.1, height, mat)
    } else if (clear.includes(i)) {
      panel(0, 1.25, mat)
      panel(1.25, 2.3, "glass")
      panel(2.3, height, mat)
    } else panel(0, height, mat)
  }
  for (let i = 0; i <= count; i++)
    kit.box(
      0.09,
      height,
      0.07,
      f.x(out + 0.02),
      height / 2,
      f.z(along[0] + i * w),
      "white"
    )
  for (const y of [1.25, 2.3, 2.9, height - 0.04])
    kit.box(
      0.09,
      0.07,
      along[1] - along[0],
      f.x(out + 0.02),
      y,
      f.z((along[0] + along[1]) / 2),
      "white"
    )
}
