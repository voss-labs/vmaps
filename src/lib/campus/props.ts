import { across } from "./frame"
import type { Kit } from "./kit"
import type { MatName, Vec2, Vec3 } from "./types"

export function table(kit: Kit, [x, z]: Vec2) {
  kit.cylinder(0.5, 0.06, x, 0.76, z, "linen")
  kit.rod([x, 0, z], [x, 0.74, z], 0.05, "black")
  for (const dz of [-0.75, 0.75]) {
    kit.cylinder(0.22, 0.07, x, 0.46, z + dz, "red")
    kit.rod([x, 0, z + dz], [x, 0.43, z + dz], 0.04, "black")
  }
  kit.solid(x, z, 1.1, 2, 0, 0.8)
}

export function bench(kit: Kit, [x, z]: Vec2, length: number, alongZ: boolean) {
  const w = alongZ ? 0.45 : length,
    d = alongZ ? length : 0.45
  for (let i = 0; i < 4; i++) {
    const o = -0.16 + i * 0.105
    kit.box(
      alongZ ? 0.09 : length,
      0.05,
      alongZ ? length : 0.09,
      alongZ ? x + o : x,
      0.45,
      alongZ ? z : z + o,
      "wood"
    )
  }
  for (const s of [-1, 1]) {
    const o = s * (length / 2 - 0.25)
    kit.box(
      alongZ ? 0.4 : 0.12,
      0.42,
      alongZ ? 0.12 : 0.4,
      alongZ ? x : x + o,
      0.21,
      alongZ ? z + o : z,
      "black"
    )
  }
  kit.solid(x, z, w, d, 0, 0.5)
}

/** A glazed panel with mullions, centred at `at`, facing `yaw`. */
export function glazing(
  kit: Kit,
  [x, y, z]: Vec3,
  width: number,
  height: number,
  yaw: number,
  mat: MatName = "glass",
  cols = Math.max(1, Math.round(width / 1.2)),
  rows = Math.max(1, Math.round(height / 1.4))
) {
  const [ax, az] = across(yaw)
  kit.box(width, height, 0.05, x, y, z, mat, { yaw })
  for (let i = 0; i <= cols; i++) {
    const o = -width / 2 + (i * width) / cols
    kit.box(0.06, height + 0.06, 0.09, x + ax * o, y, z + az * o, "white", {
      yaw,
    })
  }
  for (let j = 0; j <= rows; j++)
    kit.box(
      width + 0.06,
      0.06,
      0.09,
      x,
      y - height / 2 + (j * height) / rows,
      z,
      "white",
      { yaw }
    )
}

export function stand(
  kit: Kit,
  [x, z]: Vec2,
  yaw: number,
  bg: string,
  text = ""
) {
  const [ax, az] = across(yaw)
  for (const s of [-0.55, 0.55])
    kit.rod(
      [x + ax * s, 0, z + az * s],
      [x + ax * s, 1.9, z + az * s],
      0.03,
      "black"
    )
  kit.board(x, 1.3, z, 1.2, 0.95, yaw, bg, text)
  kit.solid(x, z, 1.3, 1.3, 0, 1.9)
}

export function flag(
  kit: Kit,
  [x, z]: Vec2,
  yaw: number,
  color: string,
  height = 3
) {
  const [ax, az] = across(yaw)
  kit.rod([x, 0, z], [x, height, z], 0.035, "steel")
  kit.box(1.3, 0.05, 1.3, x, 0.03, z, "black")
  kit.board(
    x + ax * 0.33,
    height * 0.55,
    z + az * 0.33,
    0.6,
    height * 0.75,
    yaw,
    color
  )
  kit.solid(x, z, 0.8, 0.8, 0, height)
}

export function plant(kit: Kit, [x, z]: Vec2, y = 0, size = 1) {
  kit.cylinder(
    0.32 * size,
    0.55 * size,
    x,
    y + 0.275 * size,
    z,
    "pot",
    0.4 * size
  )
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3,
      r = 0.22 * size
    kit.sphere(
      0.3 * size,
      x + Math.cos(a) * r,
      y + (0.95 + (i % 2) * 0.35) * size,
      z + Math.sin(a) * r,
      "leaf"
    )
  }
  kit.sphere(0.32 * size, x, y + 1.45 * size, z, "leaf")
  kit.solid(x, z, 0.8 * size, 0.8 * size, y, y + 1.6 * size)
}

export function lights(kit: Kit, a: Vec2, b: Vec2, y: number) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  const n = Math.max(1, Math.round(len / 2.4))
  const yaw = Math.atan2(b[0] - a[0], b[1] - a[1])
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n
    kit.box(
      0.09,
      0.05,
      1.2,
      a[0] + (b[0] - a[0]) * t,
      y,
      a[1] + (b[1] - a[1]) * t,
      "light",
      { yaw }
    )
  }
}

export function decal(
  kit: Kit,
  [x, z]: Vec2,
  mat: MatName,
  r?: number,
  size?: Vec2
) {
  if (r) kit.cylinder(r, 0.012, x, 0.006, z, mat)
  else if (size) kit.box(size[0], 0.012, size[1], x, 0.006, z, mat)
}

export function chess(kit: Kit, [x, z]: Vec2, size = 3.2) {
  const s = size / 8
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++)
      kit.box(
        s,
        0.014,
        s,
        x - size / 2 + (i + 0.5) * s,
        0.007,
        z - size / 2 + (j + 0.5) * s,
        (i + j) % 2 ? "darkTile" : "linen"
      )
  const pieces: [number, number, number, MatName][] = [
    [1, 1, 0.75, "linen"],
    [2, 1, 0.55, "linen"],
    [5, 2, 0.95, "linen"],
    [6, 6, 0.75, "black"],
    [3, 6, 0.55, "black"],
    [4, 5, 1.05, "black"],
  ]
  for (const [i, j, h, mat] of pieces) {
    const px = x - size / 2 + (i + 0.5) * s,
      pz = z - size / 2 + (j + 0.5) * s
    kit.cylinder(s * 0.36, 0.1, px, 0.06, pz, mat)
    kit.cylinder(
      s * 0.22,
      h - 0.25,
      px,
      (h - 0.25) / 2 + 0.1,
      pz,
      mat,
      s * 0.14
    )
    kit.sphere(s * 0.2, px, h - 0.05, pz, mat)
  }
}

export function phonebox(kit: Kit, [x, z]: Vec2, yaw: number) {
  kit.box(1, 2.4, 1, x, 1.2, z, "red", { yaw, solid: true })
  kit.box(1.12, 0.22, 1.12, x, 2.5, z, "red", { yaw })
  for (const turn of [0, Math.PI / 2, -Math.PI / 2]) {
    const y2 = yaw + turn
    const [nx, nz] = [Math.sin(y2) * 0.51, Math.cos(y2) * 0.51]
    glazing(kit, [x + nx, 1.35, z + nz], 0.7, 1.5, y2, "glass", 3, 6)
  }
  const [nx, nz] = [Math.sin(yaw) * 0.52, Math.cos(yaw) * 0.52]
  kit.sign("TELEPHONE", x + nx, 2.28, z + nz, 0.13, yaw, "#151515")
}

export function vending(
  kit: Kit,
  [x, z]: Vec2,
  yaw: number,
  color = "#1d5fa8",
  text = "SNACKS\n& DRINKS"
) {
  kit.box(1, 1.9, 0.85, x, 0.95, z, "slate", { yaw, solid: true })
  const [nx, nz] = [Math.sin(yaw) * 0.43, Math.cos(yaw) * 0.43]
  kit.board(x + nx, 1.15, z + nz, 0.86, 1.4, yaw, color, text)
}

export function stools(
  kit: Kit,
  a: Vec2,
  b: Vec2,
  count: number,
  mat: MatName = "white"
) {
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5
    const x = a[0] + (b[0] - a[0]) * t,
      z = a[1] + (b[1] - a[1]) * t
    kit.cylinder(0.18, 0.06, x, 0.74, z, mat)
    kit.rod([x, 0, z], [x, 0.72, z], 0.03, "steel")
    kit.cylinder(0.16, 0.03, x, 0.015, z, "steel")
    kit.solid(x, z, 0.36, 0.36, 0, 0.77)
  }
}

/** A roll-up banner standing on the floor. */
export function standee(
  kit: Kit,
  [x, z]: Vec2,
  yaw: number,
  color: string,
  text = ""
) {
  kit.box(0.82, 0.08, 0.3, x, 0.04, z, "steel", { yaw })
  kit.board(x, 1.08, z, 0.8, 2, yaw, color, text)
  kit.board(x, 1.08, z, 0.8, 2, yaw + Math.PI, "#30363a")
  kit.solid(x, z, 0.8, 0.8, 0, 2.1)
}

/** A flat strip on the floor following a line of points. */
export function band(kit: Kit, points: Vec2[], width: number, mat: MatName) {
  for (let i = 1; i < points.length; i++) {
    const [ax, az] = points[i - 1],
      [bx, bz] = points[i]
    const len = Math.hypot(bx - ax, bz - az) + width * 0.3
    kit.box(width, 0.012, len, (ax + bx) / 2, 0.007, (az + bz) / 2, mat, {
      yaw: Math.atan2(bx - ax, bz - az),
    })
  }
}
