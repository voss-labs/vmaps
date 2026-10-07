// Positions are local to this entry; layout.ts explains the coordinates.
import type { Piece, Segment } from "../types"

// One storey: up toward the hall on the east side, a half-landing, then back on the west side.
const storey = (y: number): Piece[] => [
  {
    kind: "flight",
    from: [-2.1, 2.95],
    to: [1.5, 2.95],
    y: [y, y + 2],
    width: 1.5,
    look: "concrete",
  },
  {
    name: "Half-landing",
    kind: "box",
    at: [2.2, y + 1.9, 2],
    size: [1.4, 0.2, 3.8],
    mat: "plaster",
  },
  {
    kind: "railPath",
    points: [
      [2.85, 0.15],
      [2.85, 3.05],
    ],
    y: y + 2,
  },
  { kind: "lights", from: [2.2, 0.4], to: [2.2, 2.9], y: y + 1.74 },
  {
    kind: "flight",
    from: [1.5, 1.05],
    to: [-2.1, 1.05],
    y: [y + 2, y + 4],
    width: 1.5,
    look: "concrete",
  },
  {
    name: "Floor landing",
    kind: "box",
    at: [-2.8, y + 3.9, 2],
    size: [1.4, 0.2, 3.8],
    mat: "plaster",
  },
]

export const STAIRS: Segment = {
  id: "stairs",
  name: "Stair tower",
  kind: "court",
  from: -24,
  to: -20,
  tint: "#e3e0d8",
  notes:
    "White concrete stairs with orange walls between G and the blue recess, up to the roof. The owner's photos call them the stairs to the library.",
  pieces: [
    ...[0, 4, 8].flatMap((y) => storey(y)),
    {
      name: "Orange back wall",
      kind: "box",
      at: [-3.65, 6.5, 2],
      size: [0.1, 13, 4],
      mat: "orange",
    },
    {
      name: "Orange wall on G's end",
      kind: "box",
      at: [-1.8, 6.5, 0.06],
      size: [3.6, 13, 0.1],
      mat: "orange",
    },
    {
      name: "Rooms behind the stairs",
      kind: "box",
      at: [-6.4, 6.5, 2],
      size: [5.4, 13, 4],
      mat: "plaster",
      solid: true,
    },
    {
      kind: "board",
      at: [-5, 1.05, 4.02],
      width: 1,
      height: 2.1,
      bg: "#e6e4dc",
      face: "east",
    },
    {
      kind: "board",
      at: [-7.2, 1.05, 4.02],
      width: 1,
      height: 2.1,
      bg: "#e6e4dc",
      face: "east",
    },
    {
      name: "Big column",
      kind: "box",
      at: [2.9, 8, 3.55],
      size: [0.9, 16, 0.9],
      mat: "white",
      solid: true,
    },
    {
      kind: "board",
      at: [3.37, 1.7, 3.55],
      width: 0.7,
      height: 0.9,
      bg: "#2d2f33",
    },
    {
      name: "Wall under the half-landing",
      kind: "box",
      at: [2.75, 0.95, 1.6],
      size: [0.3, 1.9, 3],
      mat: "plaster",
      solid: true,
    },
    {
      kind: "board",
      at: [2.92, 1.1, 1.6],
      width: 2.6,
      height: 1.8,
      bg: "#26324a",
      text: "THE BEST\nCHOICE\nALWAYS",
    },
    {
      name: "Dustbin",
      kind: "box",
      at: [3.3, 0.42, 4.3],
      size: [0.5, 0.85, 0.5],
      mat: "blue",
    },
  ],
}
