// Furniture, counters, signs, lights and the view outside for the M block canteen (m-canteen.ts).
import type { Face, Piece, Vec2 } from "./types"

// Long tables are 1.2 x 0.75 m modules pushed together, with a chair about every 0.6 m.
const run = (x0: number, x1: number, z: number): Piece => ({
  kind: "dining",
  at: [(x0 + x1) / 2, z],
  size: [x1 - x0, 0.75],
  seats: Math.round((x1 - x0) / 0.6),
  top: "linen",
})

const round = (at: Vec2): Piece => ({
  kind: "dining",
  at,
  size: [0.8, 0.8],
  seats: 3,
  style: "round",
  top: "linen",
})

const bar = (at: Vec2): Piece => ({
  kind: "dining",
  at,
  size: [0.6, 0.6],
  style: "bar",
  top: "linen",
})

const fan = (x: number, z: number, face: Face): Piece => ({
  kind: "fan",
  at: [x, 2.4, z],
  wall: true,
  face,
})

const uv = (x: number, y: number, z: number): Piece => ({
  kind: "box",
  at: [x, y, z],
  size: [0.6, 0.22, 0.14],
  mat: "tarp",
})

const hanging = (
  x: number,
  y: number,
  z: number,
  bg: string,
  text: string
): Piece[] => [
  {
    kind: "board",
    at: [x, y, z],
    width: 0.5,
    height: 0.65,
    bg,
    text,
    face: "west",
  },
  {
    kind: "strut",
    from: [x, y + 0.33, z],
    to: [x, 3.6, z],
    size: [0.01, 0.01],
    mat: "black",
  },
]

const tree = (x: number, z: number): Piece[] => [
  { kind: "cylinder", at: [x, 2, z], r: 0.18, h: 4, mat: "wood" },
  { kind: "cylinder", at: [x, 4.8, z], r: 1.8, h: 2.4, top: 0.5, mat: "leaf" },
]

export const FIT: Piece[] = [
  // Tables between the column rows, and round and high tables by the glass.
  run(-14.6, -11.6, 58.3),
  run(-10.6, -7.6, 58.3),
  run(-5.4, -2.8, 58.3),
  run(-15.6, -12, 62),
  run(-11, -7.4, 62),
  run(-6.4, -2.8, 62),
  run(-1.8, 1.8, 62),
  run(-7.6, -4.4, 64.1),
  round([-11.3, 56.45]),
  bar([-17, 55.95]),
  bar([-16.15, 55.95]),
  bar([-17, 56.75]),
  bar([-16.15, 56.75]),
  {
    kind: "dining",
    at: [3.9, 61.6],
    size: [1.2, 0.75],
    seats: 2,
    top: "linen",
  },

  // Servery: a cold cabinet, a queue lane and the bain-marie counter in front of the kitchen.
  {
    name: "Cold cabinet",
    kind: "box",
    at: [-1.5, 0.5, 56.4],
    size: [1, 1, 0.6],
    mat: "steel",
    solid: true,
  },
  { kind: "box", at: [-1.5, 1.15, 56.4], size: [1, 0.3, 0.6], mat: "glass" },
  ...[57.2, 58.1, 59, 59.9].map((z): Piece => ({
    kind: "column",
    at: [0, z],
    y: [0, 1],
    r: 0.03,
    mat: "steel",
  })),
  {
    kind: "strut",
    from: [0, 0.95, 57.2],
    to: [0, 0.95, 59.9],
    size: [0.03, 0.06],
    mat: "navy",
  },
  { kind: "solid", at: [0, 58.55], size: [0.1, 2.7], y: [0, 1] },
  {
    name: "Serving counter",
    kind: "counter",
    at: [1.4, 58.4],
    length: 2.6,
    turn: true,
    guard: true,
  },
  { kind: "counter", at: [3, 58.4], length: 2.6, turn: true },
  { kind: "counter", at: [1.5, 64.55], length: 3, guard: true },
  { kind: "box", at: [6.6, 2.6, 59.6], size: [0.3, 0.3, 0.4], mat: "black" },

  // Signs and posters.
  {
    name: "Menu wall",
    kind: "board",
    at: [-5.5, 1.74, 65.18],
    width: 4.3,
    height: 1.18,
    bg: "#e9ece4",
    fg: "#2f4a3a",
    text: "MENU\nSouth Indian  |  Chinese  |  Wraps & Frankie  |  Chaat  |  Lunch  |  Beverages",
    face: "west",
  },
  {
    kind: "standee",
    at: [-1.9, 64.35],
    color: "#f2f2ee",
    text: "WHAT'S YOUR\nFOOD\nGPA?",
  },
  {
    kind: "standee",
    at: [-9.4, 55.85],
    color: "#f5f5f0",
    text: "Follow a\nbetter diet.",
  },
  ...hanging(-6.6, 2.45, 61.4, "#c4532c", "Food\nfor\nthought"),
  ...hanging(
    -12.3,
    2.6,
    63.5,
    "#f2c230",
    "NEXT\nBREAKTHROUGH\nIS JUST ONE\nCOFFEE AWAY"
  ),
  {
    kind: "board",
    at: [-16.6, 1.5, 63.88],
    width: 0.6,
    height: 0.85,
    bg: "#e8a87c",
    text: "GEOGRAPHY\nIS HISTORY!",
    face: "west",
  },
  {
    kind: "board",
    at: [-12.2, 1.05, 63.88],
    width: 1.3,
    height: 2.1,
    bg: "#5a4636",
    face: "west",
  },
  {
    name: "Eat Right mural",
    kind: "board",
    at: [-11.3, 1.6, 55.43],
    width: 3.2,
    height: 2,
    bg: "#dfe8da",
    text: "Eat Right India\nEAT RIGHT. FUEL YOUR DREAMS.",
    face: "east",
  },
  {
    name: "Cash counter",
    kind: "box",
    at: [-16.4, 0.53, 63.5],
    size: [1.3, 1.05, 0.6],
    mat: "laminate",
    solid: true,
  },
  {
    kind: "box",
    at: [-15.25, 0.45, 63.6],
    size: [0.7, 0.9, 0.5],
    mat: "steel",
    solid: true,
  },
  {
    kind: "board",
    at: [-17.15, 0.65, 61.6],
    width: 0.5,
    height: 1,
    bg: "#1e2422",
    fg: "#f2f2ee",
    text: "COFFEE\nPOHA\nUPMA\nIDLI\nMISAL PAV\nLUNCH",
    face: "north",
  },
  { kind: "plant", at: [-17, 62.7] },
  {
    name: "Bin",
    kind: "box",
    at: [-6.5, 0.45, 57.15],
    size: [0.45, 0.9, 0.45],
    mat: "black",
    solid: true,
  },

  // Lights, fans, insect lamps and the red sprinkler pipes under the black ceiling.
  {
    kind: "pendants",
    from: [-14.2, 58.3],
    to: [-3.4, 58.3],
    count: 6,
    y: 2.7,
    top: 3.6,
  },
  {
    kind: "pendants",
    from: [-15.2, 62],
    to: [1.4, 62],
    count: 8,
    y: 2.7,
    top: 3.6,
  },
  {
    kind: "pendants",
    from: [-7.2, 64.1],
    to: [-4.8, 64.1],
    count: 2,
    y: 2.7,
    top: 3.6,
  },
  {
    kind: "pendants",
    from: [-16.6, 56.4],
    to: [-16.6, 56.4],
    count: 1,
    y: 2.7,
    top: 3.6,
  },
  {
    kind: "pendants",
    from: [-3.5, 53.2],
    to: [0, 53.2],
    count: 3,
    y: 2.9,
    top: 4.3,
  },
  fan(-13, 56.8, "east"),
  fan(-2.3, 56.8, "east"),
  fan(-13, 59.7, "west"),
  fan(-9.5, 60.3, "east"),
  fan(-5.9, 59.7, "west"),
  fan(-2.3, 60.3, "east"),
  fan(-15, 55.55, "east"),
  fan(-1, 65.15, "west"),
  fan(-14, 63.85, "west"),
  uv(4.4, 2.5, 56.3),
  uv(3.5, 2.6, 60.9),
  uv(-16.8, 2.6, 60.5),
  uv(-13.9, 2.6, 57.4),
  ...[58.3, 62].map((z): Piece => ({
    kind: "strut",
    from: [-17.3, 2.95, z],
    to: [6.5, 2.95, z],
    size: [0.08, 0.08],
    mat: "red",
  })),
  ...[-11.2, -4.1].map((x): Piece => ({
    kind: "strut",
    from: [x, 2.97, 55.5],
    to: [x, 2.97, 65.1],
    size: [0.08, 0.08],
    mat: "red",
  })),

  // Outside the glass: a paved strip with seats, the road with a parked car, trees and a fence.
  {
    kind: "box",
    at: [-19.4, -0.08, 60.2],
    size: [3.6, 0.16, 12],
    mat: "concrete",
  },
  { kind: "box", at: [-24.2, -0.1, 60.2], size: [6, 0.16, 16], mat: "slate" },
  { kind: "box", at: [-28.2, -0.06, 60.2], size: [2, 0.12, 16], mat: "leaf" },
  { kind: "box", at: [-29.3, 1.25, 60.2], size: [0.08, 2.5, 16], mat: "steel" },
  { kind: "box", at: [-22.6, 0.75, 61.8], size: [1.9, 1, 4.6], mat: "white" },
  {
    kind: "box",
    at: [-22.6, 1.55, 61.6],
    size: [1.8, 0.6, 3],
    mat: "darkGlass",
  },
  {
    kind: "dining",
    at: [-19.3, 58.6],
    size: [0.8, 0.8],
    seats: 3,
    style: "round",
    top: "white",
  },
  { kind: "cylinder", at: [-19.3, 1.2, 58.6], r: 0.03, h: 2.4, mat: "steel" },
  {
    kind: "cylinder",
    at: [-19.3, 2.45, 58.6],
    r: 1.4,
    h: 0.45,
    top: 0.05,
    mat: "red",
  },
  {
    kind: "dining",
    at: [-19.6, 62.2],
    size: [0.8, 0.8],
    seats: 3,
    style: "round",
    top: "white",
  },
  { kind: "plant", at: [-18.1, 56.6] },
  { kind: "plant", at: [-18.1, 63.4] },
  ...tree(-28.2, 55.5),
  ...tree(-28.2, 60.5),
  ...tree(-28.2, 65.5),
]
