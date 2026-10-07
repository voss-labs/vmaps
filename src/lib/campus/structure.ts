import type { Kit } from "./kit"
import { FLOOR_HEIGHT, GLASS_BOX, HALL } from "./layout"
import { steps } from "./structures"
import type { Vec2 } from "./types"

/*
  The structure between D and E: a glass box on two rows of slim columns, standing on a
  platform whose front is a low deck with timber steps up to Level 2. A straight stair runs
  under it from the hall up to Level 2, and the east wall opens to M block's canteen and lounge.
*/

const mid = (r: Vec2) => (r[0] + r[1]) / 2
const size = (r: Vec2) => r[1] - r[0]
const P = GLASS_BOX.platform,
  B = GLASS_BOX.box

/** Top of the platform deck at a point along the hall. */
function deckAt(z: number) {
  const [z0, z1] = P.front.z
  if (z <= z0 + 0.8) return P.front.y
  if (z >= z1) return P.y
  const k = Math.ceil(((z - z0 - 0.8) / (z1 - z0 - 0.8)) * P.front.steps)
  return (
    P.front.y + ((P.y - P.front.y) * Math.min(k, P.front.steps)) / P.front.steps
  )
}

function platform(kit: Kit) {
  const [f0, f1] = P.front.z
  const main: Vec2 = [f1, P.z[1]]
  kit.box(
    size(P.x),
    0.55,
    size(main),
    mid(P.x),
    P.y - 0.275,
    mid(main),
    "cream"
  )
  kit.box(
    size(P.wing.x),
    0.55,
    size(P.wing.z),
    mid(P.wing.x),
    P.y - 0.275,
    mid(P.wing.z),
    "cream"
  )
  // Cream beam grid under the Level 2 deck.
  for (let x = P.x[0] + 2.5; x < P.x[1]; x += 2.5)
    kit.box(0.35, 0.35, size(main), x, P.y - 0.72, mid(main), "cream")
  for (const z of [main[0] + 0.3, mid(main), main[1] - 0.3])
    kit.box(size(P.x), 0.55, 0.35, mid(P.x), P.y - 0.82, z, "cream")
  kit.box(
    size(P.x),
    0.3,
    f1 - f0,
    mid(P.x),
    P.front.y - 0.15,
    mid([f0, f1]),
    "cream"
  )
  steps(
    kit,
    [mid(P.x), f0 + 0.8],
    [mid(P.x), f1],
    size(P.x),
    P.front.steps,
    P.y - P.front.y,
    P.front.y,
    "wood"
  )
  kit.box(size(P.x), 0.9, 0.12, mid(P.x), P.front.y - 0.45, f0 + 0.06, "panel")
  kit.box(
    0.12,
    0.9,
    P.wing.z[0] - f0,
    P.x[1] - 0.06,
    P.y - 0.45,
    mid([f0, P.wing.z[0]]),
    "panel"
  )
  kit.box(
    0.12,
    0.9,
    size(P.wing.z),
    P.wing.x[1] - 0.06,
    P.y - 0.45,
    mid(P.wing.z),
    "panel"
  )
  kit.railPath(
    [
      [P.x[0] + 0.1, f0 + 0.12],
      [P.x[1] - 0.12, f0 + 0.12],
    ],
    P.front.y
  )
  kit.railPath(
    [
      [P.x[1] - 0.12, f1],
      [P.x[1] - 0.12, P.wing.z[0]],
      [P.wing.x[1] - 0.12, P.wing.z[0]],
      [P.wing.x[1] - 0.12, P.wing.z[1] - 0.2],
    ],
    P.y
  )
}

function glassBox(kit: Kit) {
  const [y0, y1] = B.y
  const band = 0.8,
    g0 = y0 + band,
    g1 = y1 - band,
    gy = (g0 + g1) / 2
  kit.box(
    size(B.x),
    band,
    size(B.z),
    mid(B.x),
    y0 + band / 2,
    mid(B.z),
    "white"
  )
  kit.box(
    size(B.x),
    band,
    size(B.z),
    mid(B.x),
    y1 - band / 2,
    mid(B.z),
    "white"
  )
  for (const z of B.z)
    kit.box(size(B.x), g1 - g0, 0.06, mid(B.x), gy, z, "glass")
  kit.box(0.06, g1 - g0, size(B.z), B.x[1], gy, mid(B.z), "glass")
  kit.box(0.1, g1 - g0, size(B.z), B.x[0] + 0.05, gy, mid(B.z), "plaster")
  for (let i = 0; i <= 9; i++) {
    const x = B.x[0] + (i * size(B.x)) / 9
    for (const z of B.z) kit.box(0.07, g1 - g0, 0.1, x, gy, z, "black")
  }
  for (let i = 0; i <= 9; i++)
    kit.box(
      0.1,
      g1 - g0,
      0.07,
      B.x[1],
      gy,
      B.z[0] + (i * size(B.z)) / 9,
      "black"
    )
  for (const z of B.z) kit.box(size(B.x), 0.07, 0.1, mid(B.x), gy, z, "black")
  kit.box(0.1, 0.07, size(B.z), B.x[1], gy, mid(B.z), "black")
  // Ribbed walnut soffit under the box.
  kit.box(size(B.x), 0.08, size(B.z), mid(B.x), y0 - 0.04, mid(B.z), "wood")
  for (let z = B.z[0] + 0.5; z < B.z[1]; z += 0.9)
    kit.box(size(B.x), 0.25, 0.12, mid(B.x), y0 - 0.2, z, "wood")
  kit.railPath(
    [
      [B.x[0], B.z[0] + 0.1],
      [B.x[1] - 0.1, B.z[0] + 0.1],
      [B.x[1] - 0.1, B.z[1]],
    ],
    y1
  )
  for (const [x, z] of [
    [B.x[0] + 1, B.z[0]],
    [B.x[1], B.z[0]],
    [B.x[1], B.z[1]],
  ])
    kit.rod([x, y1, z], [x, HALL.roof - 1.1, z], 0.025, "steel")
  const C = GLASS_BOX.columns
  for (const x of C.x)
    for (let i = 0; i < C.count; i++) {
      const z = C.z + i * C.step
      kit.rod([x, deckAt(z), z], [x, y0 - 0.3, z], 0.1, "black")
    }
}

function underneath(kit: Kit) {
  const S = GLASS_BOX.stairs
  kit.stairs(S.from, S.to, 0, P.y, S.width, { look: "steel" })
  for (const dz of [-0.9, 0.9]) {
    const z = S.from[1] + dz
    kit.rod([-4.7, 0, z], [-4.7, 3, z], 0.075, "black")
  }
  kit.rod(
    [-4.7, 0.2, S.from[1] - 0.9],
    [-4.7, 2.9, S.from[1] + 0.9],
    0.03,
    "black"
  )
  kit.rod(
    [-4.7, 0.2, S.from[1] + 0.9],
    [-4.7, 2.9, S.from[1] - 0.9],
    0.03,
    "black"
  )
  const sc = GLASS_BOX.screen
  kit.board(
    sc.at[0],
    sc.at[1],
    sc.at[2],
    sc.size[0],
    sc.size[1],
    Math.PI,
    "#2d3fae",
    sc.text
  )
  kit.box(1, 5, 2.4, P.x[0] + 0.5, P.y + 2.5, 53.8, "maroon")
}

// East wall with two openings: steps down to the M block canteen (south) and to the lounge (north).
function eastEnd(kit: Kit) {
  const hl = HALL.length / 2,
    top = HALL.roof
  const walls: Vec2[] = [
    [-HALL.width / 2, -8.6],
    [1.6, 2],
    [6, HALL.width / 2],
  ]
  for (const [x0, x1] of walls)
    kit.box(
      x1 - x0,
      top + FLOOR_HEIGHT,
      0.4,
      (x0 + x1) / 2,
      (top - FLOOR_HEIGHT) / 2,
      hl + 0.2,
      "plaster"
    )
  for (const [x0, x1] of [
    [-8.6, -5.1],
    [2, 6],
  ]) {
    kit.box(
      x1 - x0,
      top - 3,
      0.4,
      (x0 + x1) / 2,
      (top + 3) / 2,
      hl + 0.2,
      "plaster"
    )
    kit.stairs(
      [(x0 + x1) / 2, hl - 1.7],
      [(x0 + x1) / 2, hl + 0.3],
      0,
      -1.1,
      x1 - x0,
      {
        look: "concrete",
        rails: false,
        solid: false,
      }
    )
    kit.box(x1 - x0, 0.02, 0.12, (x0 + x1) / 2, 0.01, hl - 1.75, "mustard")
  }
  kit.railPath(
    [
      [-5.25, hl - 1.7],
      [-5.25, hl + 0.3],
    ],
    0,
    -1.1
  )
  // Under the platform the canteen's servery bay runs back into the building, so the wall only closes above it.
  kit.box(6.7, top - 3.1, 0.4, -1.75, (top + 3.1) / 2, hl + 0.2, "plaster")
  kit.box(6.7, 2.9, 0.4, -1.75, -2.55, hl + 0.2, "plaster")
  // The lounge is not modelled yet, so its steps are closed off.
  kit.solid(4, hl - 0.6, 4, 2.4, -1.1, 3)
}

export function buildStructure(kit: Kit) {
  platform(kit)
  glassBox(kit)
  underneath(kit)
  eastEnd(kit)
}
