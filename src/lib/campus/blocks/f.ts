// Positions are local to this entry; layout.ts explains the coordinates.
import type { Piece, Segment } from "../types"

// The white Level 1 volume's front runs from 2.5 m out at the west end to 1.7 m at the east end.
const front = (a: number) => 2.5 - (0.8 * a) / 10.5
const TURN = -4.4

const poster = (
  a: number,
  bg: string,
  text: string,
  size = [0.55, 0.75]
): Piece => ({
  kind: "board",
  at: [front(a) + 0.03, 1.65 + (size[1] - 0.75) / 2, a],
  width: size[0],
  height: size[1],
  bg,
  text,
  turn: TURN,
})

export const F: Segment = {
  id: "F",
  name: "F block",
  kind: "block",
  letter: "F",
  from: -14.5,
  to: -4,
  depth: 8,
  facade: "solid",
  wall: "cream",
  tint: "#c4622c",
  letterAt: [front(6.5) + 0.05, 3.85, 6.5],
  notes:
    "A white Level 1 volume with the F sign, a window band and posters, its prow cantilevered over the blue recess. Above it, the cream wall and the dark timber box.",
  pieces: [
    {
      name: "White volume",
      kind: "shape",
      points: [
        [-0.3, 0],
        [2.5, 0],
        [1.7, 10.5],
        [-0.3, 10.5],
      ],
      y: [0, 5],
      mat: "white",
      solid: true,
    },
    {
      name: "Prow",
      kind: "shape",
      points: [
        [-0.3, -5.5],
        [3.3, -5.5],
        [2.5, 0],
        [-0.3, 0],
      ],
      y: [3.6, 5],
      mat: "white",
    },
    {
      kind: "shape",
      points: [
        [-0.3, -3],
        [2.95, -3],
        [2.5, 0],
        [-0.3, 0],
      ],
      y: [2.8, 3.6],
      mat: "white",
    },
    {
      name: "Window band",
      kind: "glazing",
      at: [front(4) + 0.04, 2, 4],
      width: 7,
      height: 2,
      cols: 6,
      rows: 2,
      turn: TURN,
    },
    poster(8.1, "#1d6f6a", "YOU CAN'T\nBUILD A\nREPUTATION"),
    poster(8.8, "#e3b21f", "WANTING\nTO WIN IS..."),
    poster(9.5, "#2e6fa7", "LOOK\nWITHIN"),
    poster(10.15, "#2b55a8", "WHEN IN\nDOUBT,\nFIND OUT!", [0.6, 0.95]),
    {
      kind: "glazing",
      at: [0.04, 6.1, 9],
      width: 2.2,
      height: 1,
      cols: 3,
      rows: 1,
    },
    {
      kind: "glazing",
      at: [0.04, 6.1, 4.2],
      width: 0.9,
      height: 0.8,
      cols: 1,
      rows: 1,
    },
    {
      name: "Floodlight",
      kind: "box",
      at: [0.15, 7.6, 6.5],
      size: [0.3, 0.25, 0.4],
      mat: "black",
    },
    {
      name: "Timber box",
      kind: "profileWall",
      out: -2,
      thick: 3,
      base: 8,
      points: [
        [2, 15],
        [9, 13.8],
      ],
      mat: "wood",
    },
    {
      name: "Bay window",
      kind: "box",
      at: [1.4, 10.4, 4.8],
      size: [0.8, 2, 2.6],
      mat: "white",
    },
    {
      kind: "glazing",
      at: [1.82, 10.4, 4.8],
      width: 2.3,
      height: 1.7,
      cols: 4,
      rows: 2,
    },
  ],
}
