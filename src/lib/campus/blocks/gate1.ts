// Positions are local to this entry; layout.ts explains the coordinates.
import type { Segment } from "../types"

export const GATE1: Segment = {
  id: "gate1",
  name: "Main gate",
  kind: "court",
  from: -55,
  to: -45,
  tint: "#2f9bd6",
  opening: true,
  notes:
    "The main entrance is an opening in the south side, under a bamboo canopy, between the west wall and G block.",
  pieces: [
    {
      name: "Blue sheeting on bamboo",
      kind: "scaffold",
      from: [-0.5, 0],
      to: [-0.5, 10],
      y: [2.3, 13.9],
      sheet: "tarp",
    },
    {
      name: "White beam",
      kind: "box",
      at: [-0.3, 10, 5],
      size: [0.4, 0.5, 10],
      mat: "white",
    },
    {
      name: "Bamboo canopy",
      kind: "canopy",
      from: [-0.4, 0.4],
      to: [5.5, 9.6],
      y: 3.3,
    },
    { kind: "gate", out: -0.6, along: [0.3, 3], height: 2 },
    { kind: "gate", out: -0.6, along: [6.6, 9.7], height: 2 },
    {
      name: "Gate opening",
      kind: "solid",
      at: [-0.6, 5],
      size: [0.3, 10],
      y: [0, 3],
    },
    {
      name: "Street beyond the gate",
      kind: "box",
      at: [-8.7, 2, 5],
      size: [0.1, 4, 10],
      mat: "screen",
    },
    {
      name: "Return wall at G's corner",
      kind: "box",
      at: [-1.6, 6.95, 9.8],
      size: [2.8, 13.9, 0.4],
      mat: "redBrick",
    },
    {
      name: "Pavers under the canopy",
      kind: "decal",
      at: [2.5, 5],
      size: [6, 9.6],
      mat: "paver",
    },
    { kind: "flag", at: [4.6, 8.4], color: "#5b3a8c" },
    { kind: "flag", at: [5.6, 8.9], color: "#b3262e" },
    { kind: "label", text: "Main gate", at: [2, 6, 5] },
  ],
}
