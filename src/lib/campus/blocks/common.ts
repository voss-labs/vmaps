// Positions are local to this entry; layout.ts explains the coordinates.
import type { Segment } from "../types"

export const COMMON: Segment = {
  id: "common",
  name: "Common area",
  kind: "court",
  from: -7,
  to: -3,
  tint: "#cfc8b8",
  notes:
    "A passage between B and C to the HP World kiosk, under a Level 2 bridge. Black plastic on bamboo covers the tall opening above.",
  pieces: [
    {
      name: "HP World kiosk",
      kind: "box",
      at: [-7.7, 1.7, 2],
      size: [2.6, 3.4, 3.8],
      mat: "white",
      solid: true,
    },
    {
      kind: "board",
      at: [-6.37, 3, 2],
      width: 3.8,
      height: 0.8,
      bg: "#1f4fa0",
      text: "hp WORLD  |  Tech Care @ Campus",
    },
    {
      kind: "glazing",
      at: [-6.37, 1.3, 2],
      width: 3.4,
      height: 2.2,
      cols: 3,
      rows: 1,
    },
    {
      kind: "standee",
      at: [-4.5, 0.9],
      color: "#1f4fa0",
      text: "HP World\nnow at your\ncampus",
    },
    { kind: "plant", at: [-5.8, 3.6] },
    {
      name: "Dustbin",
      kind: "box",
      at: [-0.4, 0.42, 3.6],
      size: [0.5, 0.85, 0.5],
      mat: "blue",
    },
    {
      name: "Level 2 bridge",
      kind: "box",
      at: [-1.5, 3.55, 2],
      size: [3, 0.9, 4],
      mat: "cream",
    },
    {
      kind: "railPath",
      points: [
        [0.05, 0],
        [0.05, 4],
      ],
      y: 4,
    },
    { kind: "lights", from: [-1.5, 0.3], to: [-1.5, 3.7], y: 3.05 },
    {
      name: "Black plastic on bamboo",
      kind: "scaffold",
      from: [-8.95, 0.1],
      to: [-8.95, 3.9],
      y: [4.5, 10],
      sheet: "plastic",
    },
  ],
}
