import type { Kit } from "./kit"
import { ATRIUM, FLOOR_HEIGHT, HALL, VOIDS } from "./layout"
import { CANTEEN_FLOOR, M_CANTEEN } from "./m-canteen"
import { floorSlab, openings, outline } from "./openings"
import { placePiece, WORLD } from "./pieces"
import { buildStructure } from "./structure"
import type { Vec2 } from "./types"

function endWalls(kit: Kit) {
  const hl = HALL.length / 2,
    top = HALL.roof
  // The west end is a plain wall; the main gate is in the south side (blocks/gate1.ts).
  kit.box(
    HALL.width,
    top + FLOOR_HEIGHT,
    0.4,
    0,
    (top - FLOOR_HEIGHT) / 2,
    -hl - 0.2,
    "plaster"
  )
}

// A double-layer space frame on a 4.5 m grid under ribbed roof sheets.
function roof(kit: Kit) {
  const hw = HALL.width / 2,
    hl = HALL.length / 2
  const low = HALL.roof - 1.1,
    high = HALL.roof - 0.1
  const nx = 8,
    nz = 24
  const sx = HALL.width / nx,
    sz = HALL.length / nz
  const beam = (
    a: [number, number, number],
    b: [number, number, number],
    r: number
  ) => kit.rod(a, b, r, "beam", kit.roof, true)
  for (let i = 0; i <= nx; i++)
    beam([-hw + i * sx, low, -hl], [-hw + i * sx, low, hl], 0.07)
  for (let j = 0; j <= nz; j++)
    beam([-hw, low, -hl + j * sz], [hw, low, -hl + j * sz], 0.07)
  for (let i = 0; i < nx; i++)
    beam(
      [-hw + (i + 0.5) * sx, high, -hl],
      [-hw + (i + 0.5) * sx, high, hl],
      0.06
    )
  for (let j = 0; j < nz; j++)
    beam(
      [-hw, high, -hl + (j + 0.5) * sz],
      [hw, high, -hl + (j + 0.5) * sz],
      0.06
    )
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < nz; j++) {
      const tx = -hw + (i + 0.5) * sx,
        tz = -hl + (j + 0.5) * sz
      for (const [dx, dz] of [
        [-0.5, -0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
      ])
        beam([tx + dx * sx, low, tz + dz * sz], [tx, high, tz], 0.045)
    }
  kit.box(
    HALL.width + 0.4,
    0.08,
    HALL.length + 0.4,
    0,
    HALL.roof + 0.05,
    0,
    "roofSheet",
    {
      group: kit.roof,
    }
  )
}

// Single dark tiles scattered through the beige floor, about one per 3.5 square metres.
function floorSpecks(kit: Kit) {
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const boxes = VOIDS.map((v) => {
    const pts = outline(v)
    const xs = pts.map((p) => p[0]),
      zs = pts.map((p) => p[1])
    return [
      Math.min(...xs) - 0.6,
      Math.max(...xs) + 0.6,
      Math.min(...zs) - 0.6,
      Math.max(...zs) + 0.6,
    ]
  })
  const tile = 0.11
  for (let i = 0; i < 520; i++) {
    const p: Vec2 = [
      Math.round(((rand() - 0.5) * 17.4) / tile) * tile,
      Math.round(((rand() - 0.5) * (HALL.length - 2)) / tile) * tile,
    ]
    if (
      boxes.some(
        ([x0, x1, z0, z1]) => p[0] > x0 && p[0] < x1 && p[1] > z0 && p[1] < z1
      )
    )
      continue
    kit.box(tile - 0.01, 0.01, tile - 0.01, p[0], 0.006, p[1], "darkTile")
  }
}

export function buildHall(kit: Kit) {
  floorSlab(kit)
  floorSpecks(kit)
  endWalls(kit)
  roof(kit)
  openings(kit)
  buildStructure(kit)
  for (const p of ATRIUM) placePiece(kit, p, WORLD)
  kit.setBase(CANTEEN_FLOOR)
  for (const p of M_CANTEEN) placePiece(kit, p, WORLD)
  kit.setBase(0)
}
