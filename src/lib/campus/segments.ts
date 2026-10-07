import type { Kit } from "./kit"
import { FLOOR_HEIGHT, HALL } from "./layout"
import { placePiece, sawtooth, segmentFrame, type Frame } from "./pieces"
import { glazing } from "./props"
import type { Segment } from "./types"

const LEVELS = [FLOOR_HEIGHT, FLOOR_HEIGHT * 2, FLOOR_HEIGHT * 3]
const TERRACE = FLOOR_HEIGHT * 3

const inRecess = (s: Segment, a: number) =>
  !!s.recess && a > s.recess[0] - 0.5 && a < s.recess[1] + 0.5

// Level 1 is a solid box to the block front, except where `recess` sets it back.
function levelOne(kit: Kit, s: Segment, side: 1 | -1, height = FLOOR_HEIGHT) {
  const depth = s.depth ?? HALL.blockDepth,
    len = s.to - s.from,
    half = HALL.width / 2
  const wall = s.wall ?? "plaster"
  const part = (a0: number, a1: number, d: number) => {
    if (a1 - a0 < 0.01 || d < 0.1) return
    kit.box(
      d,
      height,
      a1 - a0,
      side * (half - d / 2),
      height / 2,
      s.from + (a0 + a1) / 2,
      wall,
      { solid: true }
    )
  }
  if (!s.recess) return part(0, len, depth)
  const [r0, r1, back] = s.recess
  part(0, r0, depth)
  part(r0, r1, depth - back)
  part(r1, len, depth)
}

function groundFront(kit: Kit, s: Segment, f: Frame, len: number) {
  const ground = s.ground ?? "doors"
  if (ground === "plain") return
  if (ground === "glass") {
    const panes = Math.max(1, Math.round(len / 5))
    for (let i = 0; i < panes; i++) {
      const a = ((i + 0.5) * len) / panes
      if (!inRecess(s, a))
        glazing(kit, [f.x(0.05), 1.75, f.z(a)], len / panes - 0.3, 3.1, f.yaw)
    }
    return
  }
  for (let a = 2.5; a < len - 4; a += 6.5) {
    if (inRecess(s, a) || inRecess(s, a + 2.6)) continue
    kit.box(0.08, 2.4, 1.3, f.x(0.02), 1.2, f.z(a), "white")
    kit.box(0.06, 2.2, 1.05, f.x(0.05), 1.1, f.z(a), "wood")
    glazing(
      kit,
      [f.x(0.04), 1.75, f.z(a + 2.6)],
      2.6,
      1.3,
      f.yaw,
      "glass",
      3,
      2
    )
  }
}

function upperFronts(
  kit: Kit,
  s: Segment,
  f: Frame,
  len: number,
  corridor: number,
  y: number
) {
  const upper = s.upper ?? "dark"
  for (let a = 2; a < len - 3; a += 7) {
    kit.box(0.06, 2.2, 1, f.x(-corridor + 0.04), y + 1.1, f.z(a), "wood")
    if (upper !== "none")
      glazing(
        kit,
        [f.x(-corridor + 0.04), y + 1.75, f.z(a + 3)],
        3.4,
        1.4,
        f.yaw,
        upper === "dark" ? "darkGlass" : "glass",
        3,
        1
      )
  }
}

function balconies(kit: Kit, s: Segment, side: 1 | -1, f: Frame) {
  const depth = s.depth ?? HALL.blockDepth,
    len = s.to - s.from,
    half = HALL.width / 2
  const cz = (s.from + s.to) / 2,
    wall = s.wall ?? "plaster"
  levelOne(kit, s, side)
  groundFront(kit, s, f, len)
  const corridor = s.corridor ?? 2.2
  for (const y of LEVELS) {
    kit.box(depth, 0.3, len, side * (half - depth / 2), y - 0.15, cz, "white")
    kit.box(0.25, 0.5, len, f.x(-0.1), y - 0.4, cz, "beam")
    kit.rail(f.x(-0.15), f.z(0.3), f.x(-0.15), f.z(len - 0.3), y)
  }
  // Upper rooms sit back from the edge, behind an open corridor lit by tube lights.
  const room = depth - corridor
  for (const y of LEVELS.slice(0, 2)) {
    kit.box(
      room,
      FLOOR_HEIGHT - 0.3,
      len,
      side * (half - room / 2),
      y + (FLOOR_HEIGHT - 0.3) / 2,
      cz,
      wall
    )
    upperFronts(kit, s, f, len, corridor, y)
    kit.box(
      0.06,
      0.05,
      len - 1,
      f.x(-corridor / 2),
      y + FLOOR_HEIGHT - 0.36,
      cz,
      "light"
    )
  }
  kit.box(
    0.06,
    0.05,
    len - 1,
    f.x(-corridor / 2),
    FLOOR_HEIGHT - 0.36,
    cz,
    "light"
  )
}

function solidBlock(kit: Kit, s: Segment, side: 1 | -1, f: Frame) {
  const depth = s.depth ?? HALL.blockDepth,
    len = s.to - s.from
  const cx = side * (HALL.width / 2 - depth / 2),
    cz = (s.from + s.to) / 2
  const wall = s.wall ?? "plaster"
  if (s.facade === "solid") {
    levelOne(kit, s, side)
    kit.box(
      depth,
      TERRACE - FLOOR_HEIGHT,
      len,
      cx,
      (TERRACE + FLOOR_HEIGHT) / 2,
      cz,
      wall,
      { solid: true }
    )
    kit.box(0.3, 1.2, len, f.x(-0.15), TERRACE + 0.6, cz, "white")
    return
  }
  kit.box(depth, TERRACE, len, cx, TERRACE / 2, cz, wall, { solid: true })
  kit.rail(f.x(-0.15), f.z(0.3), f.x(-0.15), f.z(len - 0.3), TERRACE)
  if (s.facade === "sawtooth") {
    sawtooth(kit, f, [0, len], [0, TERRACE], 0.8)
    return
  }
  const [pw, ph] = s.pane ?? [1.6, 2.1]
  kit.box(0.08, TERRACE, len, f.x(0.05), TERRACE / 2, cz, "darkGlass")
  const n = Math.max(1, Math.round(len / pw))
  for (let i = 0; i <= n; i++)
    kit.box(
      0.1,
      TERRACE,
      0.06,
      f.x(0.1),
      TERRACE / 2,
      f.z((i * len) / n),
      "black"
    )
  for (let y = 0.1; y < TERRACE + 0.1; y += ph)
    kit.box(0.1, 0.06, len, f.x(0.1), y, cz, "black")
}

// Short posts carry each block up to the underside of the roof frame.
function roofPosts(kit: Kit, f: Frame, len: number) {
  const h = HALL.roof - 1.1 - TERRACE
  for (let a = 1; a < len - 0.5; a += 6)
    kit.box(0.3, h, 0.3, f.x(-0.35), TERRACE + h / 2, f.z(a), "beam")
}

export function buildSegment(kit: Kit, s: Segment, side: 1 | -1) {
  const f = segmentFrame(s, side)
  const depth = s.depth ?? HALL.blockDepth,
    len = s.to - s.from
  const cz = (s.from + s.to) / 2,
    half = HALL.width / 2
  if (!s.opening)
    kit.box(
      0.4,
      HALL.roof + FLOOR_HEIGHT,
      len,
      side * (half + 0.2),
      (HALL.roof - FLOOR_HEIGHT) / 2,
      cz,
      "plaster"
    )
  if (s.kind === "block") {
    if ((s.facade ?? "balconies") === "balconies") balconies(kit, s, side, f)
    else solidBlock(kit, s, side, f)
    roofPosts(kit, f, len)
    if (s.letter) {
      const at = s.letterAt ?? [0.06, FLOOR_HEIGHT - 0.45, len / 2]
      kit.letterSign(s.letter, f.x(at[0]), at[1], f.z(at[2]), 0.7, f.yaw)
      kit.label(
        s.letter,
        side * (half - depth / 2),
        HALL.roof + 3.5,
        cz,
        6,
        s.tint
      )
    }
  }
  for (const p of s.pieces) placePiece(kit, p, f)
}
