// Positions are local to this entry; layout.ts explains the coordinates.
import type { Piece, Segment } from "../types"

const coffers: Piece[] = [
  ...[0.9, 2.75, 4.6].map((a): Piece => ({
    kind: "box",
    at: [-3.25, 11.78, a],
    size: [11.5, 0.45, 0.25],
    mat: "white",
  })),
  ...[-6, -3, 0].map((o): Piece => ({
    kind: "box",
    at: [o, 11.78, 2.75],
    size: [0.25, 0.45, 5.5],
    mat: "white",
  })),
]

export const RECESS: Segment = {
  id: "recess",
  name: "Blue recess",
  kind: "court",
  from: -20,
  to: -14.5,
  tint: "#2f9bd6",
  opening: true,
  notes:
    "An open slot between the stair tower and F, under F's white prow, running back to blue sheeting on bamboo in the outer wall.",
  pieces: [
    {
      name: "Blue sheeting on bamboo",
      kind: "scaffold",
      from: [-8.95, 0.3],
      to: [-8.95, 5.2],
      y: [1, 12],
      sheet: "tarp",
    },
    {
      name: "Sill wall",
      kind: "box",
      at: [-9.1, 0.5, 2.75],
      size: [0.5, 1, 4.9],
      mat: "plaster",
      solid: true,
    },
    {
      name: "Outer wall above",
      kind: "box",
      at: [-9.2, 14, 2.75],
      size: [0.4, 4, 5.5],
      mat: "plaster",
    },
    {
      name: "Outer wall below",
      kind: "box",
      at: [-9.2, -2, 2.75],
      size: [0.4, 4, 5.5],
      mat: "plaster",
    },
    {
      kind: "box",
      at: [-9.2, 6, 0.15],
      size: [0.4, 12, 0.3],
      mat: "plaster",
    },
    {
      kind: "box",
      at: [-9.2, 6, 5.35],
      size: [0.4, 12, 0.3],
      mat: "plaster",
    },
    {
      name: "Level 4 slab",
      kind: "box",
      at: [-3.25, 12.15, 2.75],
      size: [11.5, 0.3, 5.5],
      mat: "white",
    },
    ...coffers,
  ],
}
