// Positions are local to this entry; layout.ts explains the coordinates.
import type { Piece, Segment } from "../types"

// C's stair to Level 2 takes the first 1.6 m; the seating court starts at the orange wall.
const W = 1.6

// The orange wall steps up toward the back, following the stair behind it.
const step = (i: number): Piece => ({
  kind: "box",
  at: [-1.875 - 1.75 * i, [1.4, 1.95, 2.5, 3.1][i], W + 0.15],
  size: [1.75, [2.8, 3.9, 5, 6.2][i], 0.3],
  mat: "orange",
})

const coping = (i: number): Piece => ({
  kind: "box",
  at: [-1.875 - 1.75 * i, [2.8, 3.9, 5, 6.2][i] + 0.04, W + 0.15],
  size: [1.75, 0.08, 0.4],
  mat: "white",
})

const menu = (a: number, bg: string): Piece => ({
  kind: "board",
  at: [-6.96, 1.9, W + a],
  width: 0.4,
  height: 0.6,
  bg,
})

export const NESCAFE: Segment = {
  id: "nescafe",
  name: "Nescafe",
  kind: "court",
  from: 20.4,
  to: 27,
  tint: "#c4622c",
  notes:
    "A seating court off the hall with the Nescafe kiosk at the back, a stepped orange wall on its west side and a mural on D's end wall. C's stair to Level 2 runs up beside it.",
  pieces: [
    {
      name: "Stair to C's Level 2",
      kind: "flight",
      from: [-0.2, 0.85],
      to: [-4.6, 0.85],
      y: [1.3, 4],
      width: 1.3,
      look: "steel",
    },
    {
      kind: "box",
      at: [-5.3, 3.9, 0.85],
      size: [1.4, 0.2, 1.6],
      mat: "chequer",
    },
    {
      name: "Orange wall on C's end",
      kind: "box",
      at: [-4.5, 2, 0.05],
      size: [9, 4, 0.1],
      mat: "orange",
    },
    ...[0, 1, 2, 3].map(step),
    ...[0, 1, 2, 3].map(coping),
    {
      kind: "board",
      at: [-2.6, 1.1, W + 0.32],
      width: 0.9,
      height: 2.1,
      bg: "#5a3b2a",
      face: "east",
    },
    {
      kind: "board",
      at: [-4.4, 2.4, W + 0.32],
      width: 0.5,
      height: 0.5,
      bg: "#2a2f33",
      face: "east",
    },
    {
      kind: "board",
      at: [-6.4, 2.8, W + 0.32],
      width: 0.25,
      height: 1.8,
      bg: "#2a2f33",
      face: "east",
    },
    {
      name: "Nescafe kiosk",
      kind: "box",
      at: [-8, 1.3, W + 3.15],
      size: [2, 2.6, 3.7],
      mat: "black",
      solid: true,
    },
    {
      kind: "sign",
      text: "NESCAFÉ",
      at: [-6.97, 2.35, W + 3.15],
      height: 0.3,
      bg: "#1a1a1a",
    },
    {
      name: "Red swoosh",
      kind: "box",
      at: [-6.97, 1.05, W + 3.15],
      size: [0.05, 0.12, 1.8],
      mat: "red",
    },
    menu(2.1, "#e8b923"),
    menu(2.6, "#c0392b"),
    menu(3.1, "#2b55a8"),
    {
      name: "Black plastic on bamboo",
      kind: "scaffold",
      from: [-8.95, W],
      to: [-8.95, W + 5],
      y: [4.2, 10.5],
      sheet: "plastic",
    },
    { kind: "table", at: [-3.5, W + 2] },
    { kind: "table", at: [-5.4, W + 1.6] },
    { kind: "table", at: [-4.2, W + 3.8] },
    { kind: "plant", at: [0.5, W + 3] },
    {
      name: "Red bin",
      kind: "box",
      at: [-7.6, 0.4, W + 0.7],
      size: [0.45, 0.8, 0.45],
      mat: "red",
    },
    {
      name: "Mural",
      kind: "board",
      at: [-4.5, 4.3, W + 4.95],
      width: 5,
      height: 5,
      bg: "#c9b48a",
      face: "west",
    },
    {
      kind: "board",
      at: [-4.5, 1.15, W + 4.95],
      width: 1,
      height: 1.3,
      bg: "#3b3f44",
      face: "west",
    },
    {
      name: "Court floor",
      kind: "decal",
      at: [-4.5, W + 2.5],
      size: [9, 5],
      mat: "paver",
    },
    { kind: "label", text: "Nescafe", at: [-4, 5.5, W + 2.5] },
  ],
}
