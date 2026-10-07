// Positions are local to this entry; layout.ts explains the coordinates.
import type { Segment } from "../types"

export const CHESS: Segment = {
  id: "chess",
  name: "Chess corner",
  kind: "court",
  from: -41,
  to: -37.5,
  tint: "#8e3b2a",
  notes: "A red wall with a big college poster and the floor chess set.",
  pieces: [
    {
      name: "Red wall",
      kind: "box",
      at: [-0.2, 4.25, 1.75],
      size: [0.3, 8.5, 3.5],
      mat: "maroon",
    },
    {
      name: "Window",
      kind: "glazing",
      at: [-0.03, 5.7, 1.3],
      width: 1.3,
      height: 1.1,
      cols: 2,
      rows: 1,
    },
    {
      name: "AC unit",
      kind: "box",
      at: [0.15, 5.1, 2.75],
      size: [0.3, 0.6, 0.85],
      mat: "white",
    },
    {
      name: "College poster",
      kind: "board",
      at: [-0.03, 2.8, 1.75],
      width: 3.2,
      height: 3,
      bg: "#b9312c",
      text: "COLLEGE\nLIFE",
    },
    { kind: "chess", at: [2.2, 1.75], size: 3.2 },
    { kind: "stools", from: [4, 0.7], to: [4, 2.8], count: 2 },
    {
      name: "Black sheet over the slot",
      kind: "scaffold",
      from: [-0.25, 2],
      to: [-0.25, 3.5],
      y: [8.5, 13.9],
      sheet: "plastic",
    },
    { kind: "stand", at: [0.7, 3.2], bg: "#1f4e8c" },
  ],
}
