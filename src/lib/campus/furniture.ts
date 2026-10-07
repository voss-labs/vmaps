import { across } from "./frame"
import type { Kit } from "./kit"
import type { MatName, Vec2 } from "./types"

type Place = { x: number; z: number; yaw: number }

// World offset of a local [across, forward] point for something facing `yaw`.
const offset = ({ x, z, yaw }: Place, a: number, f: number): Vec2 => {
  const [ax, az] = across(yaw)
  return [x + ax * a + Math.sin(yaw) * f, z + az * a + Math.cos(yaw) * f]
}

/** A plastic canteen chair; `yaw` is the way a seated person faces. */
export function chair(kit: Kit, p: Place, mat: MatName) {
  kit.box(0.42, 0.04, 0.42, p.x, 0.45, p.z, mat, { yaw: p.yaw })
  const [bx, bz] = offset(p, 0, -0.2)
  kit.box(0.42, 0.42, 0.04, bx, 0.68, bz, mat, { yaw: p.yaw })
  for (const [a, f] of [
    [-0.18, -0.18],
    [0.18, -0.18],
    [-0.18, 0.18],
    [0.18, 0.18],
  ]) {
    const [lx, lz] = offset(p, a, f)
    kit.box(0.03, 0.44, 0.03, lx, 0.22, lz, mat)
  }
}

/** A table with chairs: long tables seat `seats` a side, round ones `seats` in all, bar tables stand alone. */
export function dining(
  kit: Kit,
  [x, z]: Vec2,
  alongZ: boolean,
  size: Vec2,
  seats: number,
  style: "square" | "round" | "bar",
  top: MatName
) {
  const mats: MatName[] = ["chair", "white"]
  if (style !== "square") {
    const high = style === "bar"
    const h = high ? 1.05 : 0.75
    kit.cylinder(size[0] / 2, 0.04, x, h, z, top)
    kit.rod([x, 0, z], [x, h, z], 0.035, "steel")
    kit.cylinder(0.25, 0.02, x, 0.01, z, "steel")
    if (!high)
      for (let i = 0; i < seats; i++) {
        const a = (i / seats) * Math.PI * 2
        const r = size[0] / 2 + 0.3
        chair(
          kit,
          { x: x + Math.sin(a) * r, z: z + Math.cos(a) * r, yaw: a + Math.PI },
          mats[i % 2]
        )
      }
    const reach = high ? size[0] * 0.75 : size[0] + 1
    kit.solid(x, z, reach, reach, 0, h)
    return
  }
  const [len, wid] = size
  const yaw = alongZ ? Math.PI / 2 : 0
  kit.box(len, 0.04, wid, x, 0.75, z, top, { yaw })
  const t: Place = { x, z, yaw }
  for (const s of [-1, 1]) {
    const [lx, lz] = offset(t, s * (len / 2 - 0.1), 0)
    kit.box(0.05, 0.73, wid - 0.1, lx, 0.365, lz, "black", { yaw })
  }
  for (let i = 0; i < seats; i++) {
    const a = -len / 2 + ((i + 0.5) * len) / seats
    for (const s of [-1, 1]) {
      const [cx, cz] = offset(t, a, s * (wid / 2 + 0.25))
      chair(
        kit,
        { x: cx, z: cz, yaw: yaw + (s > 0 ? Math.PI : 0) },
        mats[(i + (s > 0 ? 1 : 0)) % 2]
      )
    }
  }
  const [w, d] = alongZ ? [wid + 1.1, len + 0.1] : [len + 0.1, wid + 1.1]
  kit.solid(x, z, w, d, 0, 0.9)
}

/** A booth back with cushioned seats on both sides. */
export function booth(kit: Kit, [x, z]: Vec2, length: number, alongZ: boolean) {
  const [w, d] = alongZ ? [0.12, length] : [length, 0.12]
  kit.box(w, 1.1, d, x, 0.55, z, "laminate")
  for (const s of [-1, 1]) {
    const [sx, sz] = alongZ ? [x + s * 0.3, z] : [x, z + s * 0.3]
    const [sw, sd] = alongZ ? [0.5, length] : [length, 0.5]
    kit.box(sw, 0.4, sd, sx, 0.2, sz, "laminate")
    kit.box(sw - 0.04, 0.08, sd - 0.04, sx, 0.44, sz, "linen")
    const [bx, bz] = alongZ ? [x + s * 0.09, z] : [x, z + s * 0.09]
    kit.box(
      alongZ ? 0.06 : length - 0.1,
      0.5,
      alongZ ? length - 0.1 : 0.06,
      bx,
      0.78,
      bz,
      "linen"
    )
  }
  const [sw, sd] = alongZ ? [1.12, length] : [length, 1.12]
  kit.solid(x, z, sw, sd, 0, 1.1)
}

/** Glass-shaded lamps hanging from the ceiling at `top` down to `y`, evenly along a line. */
export function pendants(
  kit: Kit,
  a: Vec2,
  b: Vec2,
  count: number,
  y: number,
  top: number
) {
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5
    const x = a[0] + (b[0] - a[0]) * t,
      z = a[1] + (b[1] - a[1]) * t
    kit.rod([x, y + 0.2, z], [x, top, z], 0.01, "black")
    kit.cylinder(0.2, 0.26, x, y, z, "light", 0.07)
  }
}

/** A ceiling fan, or a caged wall fan facing `yaw`. */
export function fan(
  kit: Kit,
  x: number,
  y: number,
  z: number,
  wall: boolean,
  yaw: number
) {
  if (wall) {
    const [fx, fz] = [Math.sin(yaw), Math.cos(yaw)]
    kit.box(0.12, 0.12, 0.3, x - fx * 0.05, y, z - fz * 0.05, "slate", { yaw })
    kit.rod(
      [x + fx * 0.15, y - 0.1, z + fz * 0.15],
      [x + fx * 0.3, y - 0.1, z + fz * 0.3],
      0.3,
      "steel"
    )
    return
  }
  kit.rod([x, y, z], [x, y + 0.4, z], 0.02, "white")
  kit.cylinder(0.1, 0.08, x, y, z, "white")
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3
    kit.box(
      0.12,
      0.012,
      0.6,
      x + Math.sin(a) * 0.38,
      y,
      z + Math.cos(a) * 0.38,
      "white",
      { yaw: a }
    )
  }
}

/** A steel serving counter with food wells, and an optional glass sneeze guard. */
export function counter(
  kit: Kit,
  [x, z]: Vec2,
  length: number,
  alongZ: boolean,
  guard: boolean
) {
  const [w, d] = alongZ ? [0.75, length] : [length, 0.75]
  kit.box(w, 0.88, d, x, 0.44, z, "steel", { solid: true })
  kit.box(w + 0.04, 0.03, d + 0.04, x, 0.895, z, "steel")
  const n = Math.max(1, Math.round(length / 0.65))
  for (let i = 0; i < n; i++) {
    const t = -length / 2 + ((i + 0.5) * length) / n
    const [cx, cz] = alongZ ? [x, z + t] : [x + t, z]
    kit.box(
      alongZ ? 0.45 : 0.5,
      0.012,
      alongZ ? 0.5 : 0.45,
      cx,
      0.915,
      cz,
      "black"
    )
  }
  if (guard) {
    const [gw, gd] = alongZ ? [0.03, length] : [length, 0.03]
    kit.box(gw, 0.4, gd, x, 1.15, z, "glass")
    kit.box(
      alongZ ? 0.4 : length,
      0.02,
      alongZ ? length : 0.4,
      x,
      1.36,
      z,
      "glass"
    )
  }
}

/** A wall between two points, solid in short steps so an angled wall does not block a whole box around it. */
export function wall(
  kit: Kit,
  a: Vec2,
  b: Vec2,
  y: Vec2,
  thick: number,
  mat: MatName,
  isSolid: boolean
) {
  kit.panel(a, b, y[0], y[1], thick, mat)
  if (!isSolid || y[0] > 1.8) return
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.ceil(len / 0.5))
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n
    const step = len / n
    const [dx, dz] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
    const w = Math.abs(dx) * step + Math.abs(dz) * thick,
      d = Math.abs(dz) * step + Math.abs(dx) * thick
    kit.solid(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      w,
      d,
      y[0],
      y[1]
    )
  }
}
