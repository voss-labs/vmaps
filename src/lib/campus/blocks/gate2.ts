// Positions are local to this entry; layout.ts explains the coordinates.
import type { Segment } from "../types"

export const GATE2: Segment = {
  id: "gate2",
  name: "Gate 2",
  kind: "court",
  from: 20,
  to: 25.2,
  tint: "#55606a",
  opening: true,
  notes:
    "A passage between F and E out to the parking, with black gates under a white lintel and a bamboo canopy outside. Blue sheeting covers the opening above.",
  pieces: [
    { kind: "gate", out: -2, along: [0.2, 5], height: 2.2 },
    {
      name: "Gate opening",
      kind: "solid",
      at: [-2, 2.6],
      size: [0.3, 5.2],
      y: [0, 3],
    },
    {
      name: "White lintel",
      kind: "box",
      at: [-1.75, 3.8, 2.6],
      size: [1.5, 1.6, 5.2],
      mat: "white",
    },
    {
      name: "Bamboo canopy",
      kind: "canopy",
      from: [-2.2, 0.3],
      to: [-4.6, 4.9],
      y: 2.6,
    },
    {
      name: "Parking beyond the gate",
      kind: "box",
      at: [-8.7, 2, 2.6],
      size: [0.1, 4, 5.2],
      mat: "screen",
    },
    {
      name: "Paving outside",
      kind: "decal",
      at: [-5.5, 2.6],
      size: [7, 5.2],
      mat: "paver",
    },
    { kind: "label", text: "Gate 2", at: [-3, 5.6, 2.6] },
  ],
}
