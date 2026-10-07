import { FIT } from "./m-canteen-fit"
import type { Floor, Piece, Vec2 } from "./types"

/*
  The M block canteen on M block's ground floor, down 7 steps (1.1 m) from the east end of the
  main hall. Plan positions are world (x, z). Heights in M_CANTEEN are above the canteen floor;
  FLOORS heights are above Level 1 of the main hall, so the canteen floor is at -1.1.
  One long hall runs north-south: the glass wall onto the road is at its south end, the kitchen
  and a side area with the Innovation Lounge door at its north end, and a servery bay runs
  back under the glass box platform beside the steps.
*/

export const CANTEEN_FLOOR = -1.1
const H = 3.6
// Walls and columns are white up to here and black above.
const BAND = 2.3

export const M_FLOORS: Floor[] = [
  { x: [-8.35, -5.35], z: [53.3, 55.3], y: [0, CANTEEN_FLOOR], axis: "z" },
  { x: [-8.35, -5.35], z: [55.3, 55.9], y: CANTEEN_FLOOR },
  { x: [-17.05, 6.35], z: [55.85, 63.55], y: CANTEEN_FLOOR },
  { x: [-8.05, 3.25], z: [63.55, 64.85], y: CANTEEN_FLOOR },
  { x: [-4.55, 1.15], z: [51.55, 55.85], y: CANTEEN_FLOOR },
]

const wall = (from: Vec2, to: Vec2, top = H): Piece[] => [
  { kind: "wall", from, to, y: [0, BAND], thick: 0.2, mat: "plaster" },
  { kind: "wall", from, to, y: [BAND, top], thick: 0.2, mat: "soffit" },
]

const plain = (from: Vec2, to: Vec2, y: Vec2): Piece => ({
  kind: "wall",
  from,
  to,
  y,
  thick: 0.2,
  mat: "plaster",
})

const column = (x: number, z: number): Piece[] => [
  {
    kind: "box",
    at: [x, BAND / 2, z],
    size: [0.55, BAND, 0.55],
    mat: "white",
    solid: true,
  },
  {
    kind: "box",
    at: [x, (BAND + 3.05) / 2, z],
    size: [0.55, 3.05 - BAND, 0.55],
    mat: "soffit",
  },
]

const COLUMN_X = [-13, -9.5, -5.9, -2.3, 1.35]

const SHELL: Piece[] = [
  {
    name: "Canteen floor",
    kind: "box",
    at: [-5.35, -0.15, 60.15],
    size: [24.3, 0.3, 10.3],
    mat: "gloss",
  },
  { kind: "box", at: [-1.7, -0.15, 53.2], size: [6.8, 0.3, 4.4], mat: "gloss" },
  {
    name: "Black ceiling",
    kind: "box",
    at: [-5.35, H + 0.02, 60.35],
    size: [24.3, 0.04, 9.9],
    mat: "soffit",
  },
  {
    kind: "box",
    at: [-5.35, H + 0.2, 60.35],
    size: [24.7, 0.3, 10.3],
    mat: "plaster",
  },
  ...[56.5, 60].map((z): Piece => ({
    kind: "box",
    at: [-5.35, 3.33, z],
    size: [24.3, 0.55, 0.35],
    mat: "soffit",
  })),
  ...COLUMN_X.map((x): Piece => ({
    kind: "box",
    at: [x, 3.33, 60.35],
    size: [0.35, 0.55, 9.9],
    mat: "soffit",
  })),
  ...COLUMN_X.flatMap((x, i) => column(x, i === 2 ? 56.8 : 56.5)),
  ...COLUMN_X.flatMap((x) => column(x, 60)),
  ...column(-4.85, 55.7),
  ...column(-8.85, 55.7),

  // West side: the main hall's east wall, the steps' side walls and the servery bay under the platform.
  {
    kind: "box",
    at: [-13.05, (BAND + H) / 2, 55.42],
    size: [8.9, H - BAND, 0.03],
    mat: "soffit",
  },
  plain([-8.7, 53], [-8.7, 55], [0, 4.4]),
  { name: "Servery bay", ...plain([-5.1, 51], [-5.1, 55.4], [0, 4.4]) },
  plain([1.6, 51], [1.6, 55.4], [0, 4.4]),
  plain([-5.2, 51], [1.7, 51], [0, 0.95]),
  plain([-5.2, 51], [1.7, 51], [2.3, 4.4]),
  plain([-5.2, 51], [-3.4, 51], [0.95, 2.3]),
  plain([0.2, 51], [1.7, 51], [0.95, 2.3]),
  {
    name: "Rolling shutter",
    kind: "box",
    at: [-1.6, 2.45, 50.82],
    size: [3.6, 0.3, 0.25],
    mat: "steel",
  },
  { kind: "box", at: [-1.6, 0.97, 51], size: [3.6, 0.05, 0.6], mat: "steel" },
  {
    kind: "board",
    at: [-4.3, 1.6, 50.87],
    width: 0.6,
    height: 0.9,
    bg: "#c0392b",
    text: "FOOD\nGPA?",
    face: "west",
  },
  // Sloped soffit over the steps, down to the first beam.
  {
    kind: "strut",
    from: [-6.85, 4.1, 53.3],
    to: [-6.85, 3.05, 56.6],
    size: [3.5, 0.15],
    mat: "white",
  },
  ...wall([2, 55.5], [6, 55.5]),

  // South end: the glass wall onto the road, with frameless double doors.
  {
    kind: "glazing",
    at: [-17.5, 1.15, 56.4],
    width: 2,
    height: 2.3,
    cols: 2,
    rows: 1,
    face: "north",
  },
  {
    kind: "glazing",
    at: [-17.5, 1.1, 57.78],
    width: 0.72,
    height: 2.2,
    cols: 1,
    rows: 1,
    face: "north",
  },
  {
    kind: "glazing",
    at: [-17.5, 1.1, 58.52],
    width: 0.72,
    height: 2.2,
    cols: 1,
    rows: 1,
    face: "north",
  },
  {
    kind: "glazing",
    at: [-17.5, 1.15, 61.45],
    width: 5.1,
    height: 2.3,
    cols: 3,
    rows: 1,
    face: "north",
  },
  {
    kind: "box",
    at: [-17.5, (BAND + H) / 2, 59.7],
    size: [0.12, H - BAND, 8.6],
    mat: "soffit",
  },
  {
    kind: "box",
    at: [-17.46, 1.15, 59.7],
    size: [0.02, 0.3, 8.6],
    mat: "frosted",
  },
  { kind: "solid", at: [-17.5, 59.7], size: [0.2, 8.6], y: [0, 2.3] },
  { kind: "decal", at: [-17, 58.15], size: [0.9, 1.4], mat: "black" },
  {
    name: "Bar-table nook pier",
    kind: "box",
    at: [-14.65, BAND / 2, 56.35],
    size: [1.5, BAND, 1.9],
    mat: "plaster",
    solid: true,
  },
  {
    kind: "box",
    at: [-14.65, (BAND + H) / 2, 56.35],
    size: [1.5, H - BAND, 1.9],
    mat: "soffit",
  },

  // East side: the Geography wall, a jog, and the long menu wall.
  ...wall([-17.5, 64], [-8.5, 64]),
  ...wall([-8.5, 64], [-8.5, 65.3]),
  ...wall([-8.5, 65.3], [3.7, 65.3]),
  {
    kind: "box",
    at: [4.1, BAND / 2, 64.2],
    size: [0.8, BAND, 2.2],
    mat: "plaster",
    solid: true,
  },
  {
    kind: "box",
    at: [4.1, (BAND + H) / 2, 64.2],
    size: [0.8, H - BAND, 2.2],
    mat: "soffit",
  },

  // North end: the kitchen, and the side area with the water cooler and the Innovation Lounge.
  {
    name: "Kitchen",
    kind: "box",
    at: [5.65, H / 2, 57.1],
    size: [2.3, H, 3.4],
    mat: "plaster",
    solid: true,
  },
  {
    kind: "box",
    at: [4.48, (BAND + H) / 2, 57.1],
    size: [0.03, H - BAND, 3.4],
    mat: "soffit",
  },
  {
    kind: "board",
    at: [4.47, 1.05, 56.3],
    width: 1,
    height: 2.1,
    bg: "#9aa0a4",
    face: "south",
  },
  ...wall([6.8, 58.8], [6.8, 63.1]),
  {
    kind: "board",
    at: [6.68, 1.05, 59.6],
    width: 1.05,
    height: 2.1,
    bg: "#2b2b2b",
    face: "south",
  },
  {
    kind: "board",
    at: [6.68, 1.05, 60.65],
    width: 0.8,
    height: 2.1,
    bg: "#4a3a2c",
    face: "south",
  },
  {
    name: "Water cooler",
    kind: "box",
    at: [6.4, 0.8, 61.6],
    size: [0.6, 1.6, 0.8],
    mat: "steel",
    solid: true,
  },
  {
    kind: "board",
    at: [6.68, 1.7, 62.45],
    width: 0.45,
    height: 0.65,
    bg: "#3a8fd0",
    text: "70%\nWATER",
    face: "south",
  },
  ...wall([4.5, 63.1], [5, 63.1]),
  ...wall([6.2, 63.1], [6.8, 63.1]),
  plain([5, 63.1], [6.2, 63.1], [2.1, BAND]),
  {
    kind: "wall",
    from: [5, 63.1],
    to: [6.2, 63.1],
    y: [BAND, H],
    thick: 0.2,
    mat: "soffit",
  },
  // Through the open M-003 door, a glimpse of the lounge corridor.
  { kind: "box", at: [5.6, -0.15, 64.6], size: [1.4, 0.3, 3], mat: "gloss" },
  plain([5, 63.1], [5, 66.1], [0, 2.7]),
  plain([6.2, 63.1], [6.2, 66.1], [0, 2.7]),
  plain([5, 66.1], [6.2, 66.1], [0, 2.7]),
  { kind: "box", at: [5.6, 2.72, 64.6], size: [1.4, 0.04, 3], mat: "white" },
  { kind: "lights", from: [5.6, 63.6], to: [5.6, 65.6], y: 2.66 },
  { kind: "box", at: [6.03, 1, 64.8], size: [0.15, 0.5, 0.15], mat: "red" },
  {
    kind: "board",
    at: [6.08, 1.6, 65.4],
    width: 0.5,
    height: 0.6,
    bg: "#e8e6dc",
    text: "M BLOCK\nGROUND\nFLOOR",
    face: "south",
  },
  {
    name: "Innovation Lounge door",
    kind: "board",
    at: [6.1, 1.05, 63.7],
    width: 1.1,
    height: 2.1,
    bg: "#2c3fa8",
    text: "M-003\n\nINNOVATION\nLOUNGE",
    fg: "#c6e03a",
    face: "south",
  },
  { kind: "solid", at: [5.6, 63.45], size: [1.2, 0.3], y: [0, 2.1] },
  { kind: "label", text: "M block canteen", at: [-5, 5.5, 60] },
]

export const M_CANTEEN: Piece[] = [...SHELL, ...FIT]
