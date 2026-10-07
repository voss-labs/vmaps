// Positions are local to this entry; layout.ts explains the coordinates.
import type { Segment, Vec2 } from "../types"

const balcony: Vec2[] = [
  [0, 0],
  [3.5, 0],
  [2.5, 8],
  [0, 8],
]

// The maroon floor band follows the curved Computer Centre glass.
const curve = (gap: number): Vec2[] =>
  [11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23].map((a) => {
    const t = Math.min(1, Math.max(0, (a - 13) / 8))
    return [gap + 2.3 * 4 * t * (1 - t), a]
  })

export const G: Segment = {
  id: "G",
  name: "G block",
  kind: "block",
  letter: "G",
  from: -45,
  to: -24,
  facade: "sawtooth",
  tint: "#b0583f",
  letterAt: [3.45, 3.68, 1.2],
  notes:
    "Computer Centre labs at Level 1, behind the curved glass under the brick box at the east end.",
  pieces: [
    {
      name: "Lower balcony",
      kind: "shape",
      points: balcony,
      y: [3.7, 4],
      mat: "white",
    },
    {
      name: "Upper balcony",
      kind: "shape",
      points: balcony,
      y: [7.1, 7.4],
      mat: "white",
    },
    {
      kind: "railPath",
      points: [
        [0.9, 0.1],
        [3.4, 0.1],
        [2.4, 7.9],
      ],
      y: 4,
    },
    {
      kind: "railPath",
      points: [
        [0.9, 0.1],
        [3.4, 0.1],
        [2.4, 7.9],
      ],
      y: 7.4,
    },
    {
      name: "Brick box",
      kind: "bulge",
      along: [13, 21],
      out: 0,
      depth: 2.5,
      y: [3.5, 10.2],
      mat: "brick",
      back: 0.8,
    },
    {
      name: "Brick box window",
      kind: "glazing",
      at: [1.84, 5.25, 19.1],
      width: 3.2,
      height: 2.5,
      mat: "darkGlass",
      cols: 3,
      rows: 2,
      turn: -33,
    },
    {
      name: "Computer Centre glass",
      kind: "bulge",
      along: [13, 21],
      out: 0,
      depth: 2.3,
      y: [0, 3.5],
      mat: "glass",
      back: 0.8,
      solid: true,
      windows: { y: [0.2, 3.3], count: 6 },
    },
    {
      kind: "board",
      at: [2.06, 2.1, 15.6],
      width: 1.5,
      height: 0.8,
      bg: "#c62a2f",
      text: "COMPUTER\nCENTRE",
      turn: 22,
    },
    {
      kind: "board",
      at: [2.32, 1.3, 17.4],
      width: 1.9,
      height: 0.95,
      bg: "#2b3d8f",
      text: "IMMERSIVE TECHNOLOGY &\nNATURAL LANGUAGE\nPROCESSING LABORATORY",
    },
    {
      kind: "board",
      at: [0.9, 1.5, 4.5],
      width: 1.1,
      height: 0.85,
      bg: "#f4f4f4",
      text: "iResearch",
    },
    {
      name: "White fascia",
      kind: "box",
      at: [0.45, 12.3, 6.5],
      size: [0.9, 1.4, 13],
      mat: "white",
    },
    { kind: "stand", at: [4.3, 2.2], bg: "#1b1b1b" },
    { kind: "stand", at: [4.3, 4.6], bg: "#1b1b1b" },
    { kind: "flag", at: [5.3, 6.3], color: "#2f8f4e" },
    {
      name: "Maroon band",
      kind: "band",
      points: curve(2),
      width: 3,
      mat: "maroonTile",
    },
    {
      name: "Mustard stripe",
      kind: "band",
      points: curve(0.65),
      width: 0.25,
      mat: "mustard",
    },
  ],
}
