// Positions are local to this entry; layout.ts explains the coordinates.
import type { Piece, Segment } from "../types"

// Level 1 east of the stone base sits 2.3 m back, behind the glass box platform.
const BACK = -2.27

const slit = (a: number): Piece => ({
  kind: "box",
  at: [0.15, 1.85, a],
  size: [0.05, 2.4, 0.4],
  mat: "darkGlass",
})

const strip = (y: number): Piece => ({
  kind: "box",
  at: [0.32, y, 3.15],
  size: [0.05, 0.5, 3.7],
  mat: "darkGlass",
})

const beam = (a: number): Piece => ({
  kind: "box",
  at: [0.85, 3.45, a],
  size: [1.7, 0.5, 0.3],
  mat: "white",
})

export const D: Segment = {
  id: "D",
  name: "D block",
  kind: "block",
  letter: "D",
  from: 27,
  to: 55,
  facade: "solid",
  recess: [10.5, 28, 2.3],
  tint: "#efc31b",
  letterAt: [0.33, 7.3, 3.1],
  notes:
    "The yellow wall above a Level 2 walkway, over a stone base with a navy door and three slit windows. The Department of First Year Engineering is at Level 1 further east, behind the platform.",
  pieces: [
    {
      name: "Yellow wall",
      kind: "profileWall",
      out: 0,
      thick: 0.3,
      base: 4,
      points: [
        [0, 4],
        [-1.5, 11.7],
        [7, 11.7],
        [9, 11.2],
        [11, 10.3],
        [13, 9.6],
        [14.5, 9.5],
        [18, 9.5],
      ],
      mat: "yellow",
    },
    strip(5.25),
    strip(6),
    strip(6.7),
    {
      kind: "glazing",
      at: [0.33, 5.9, 16.3],
      width: 2.7,
      height: 1.2,
      cols: 3,
      rows: 1,
    },
    { kind: "box", at: [0.33, 5.05, 13.4], size: [0.06, 2.1, 1], mat: "wood" },
    {
      name: "Walkway",
      kind: "box",
      at: [0.85, 3.875, 9.5],
      size: [1.7, 0.25, 19],
      mat: "white",
    },
    beam(0.15),
    beam(3.2),
    beam(10.2),
    beam(18.8),
    {
      kind: "railPath",
      points: [
        [1.65, 0],
        [1.65, 19],
      ],
      y: 4,
    },
    { kind: "lights", from: [0.85, 0.5], to: [0.85, 18.5], y: 3.6 },
    {
      name: "Stone base",
      kind: "box",
      at: [0.06, 1.65, 5],
      size: [0.12, 3.3, 10],
      mat: "sandstone",
    },
    {
      name: "Navy door",
      kind: "box",
      at: [0.15, 1.05, 4.5],
      size: [0.06, 2.1, 2.4],
      mat: "navy",
    },
    slit(7.2),
    slit(8.05),
    slit(8.9),
    {
      kind: "standee",
      at: [0.5, 9.3],
      color: "#1b1b1b",
      text: "PROFESSIONAL\nBODIES\nAT VIT",
    },
    { kind: "box", at: [BACK, 1.1, 17], size: [0.06, 2.2, 1.1], mat: "wood" },
    {
      kind: "board",
      at: [BACK + 0.02, 2.6, 17],
      width: 1.2,
      height: 0.35,
      bg: "#1f3a8a",
      text: "Department of First Year Engineering",
    },
    {
      kind: "board",
      at: [BACK + 0.01, 1.5, 18.3],
      width: 1,
      height: 1.2,
      bg: "#1f2f6b",
      text: "Learning without\nBOUNDARIES",
    },
    {
      kind: "board",
      at: [BACK + 0.01, 1.5, 15.6],
      width: 0.6,
      height: 0.9,
      bg: "#6a3d9a",
      text: "VIT",
    },
    {
      kind: "board",
      at: [BACK + 0.01, 1.5, 19.4],
      width: 0.9,
      height: 0.7,
      bg: "#b08a5a",
    },
    {
      kind: "board",
      at: [BACK + 0.01, 1.5, 20.5],
      width: 0.9,
      height: 0.7,
      bg: "#b08a5a",
    },
    { kind: "lights", from: [-1.2, 11], to: [-1.2, 27], y: 3.65 },
  ],
}
