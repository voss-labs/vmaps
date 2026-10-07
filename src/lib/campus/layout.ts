import type { GlassBox, Piece, Vec2, Void } from "./types"

export { NORTH_ROW } from "./north-row"
export { SOUTH_ROW } from "./south-row"

/*
  Level 1 of the main campus, in metres. Correct the model by editing the numbers here and in
  blocks/ (one file per block or court; north-row.ts and south-row.ts set their order).
  World: z runs along the main hall from the west wall (-55) to the end by M block (+55);
  x runs across it, with A to D on the +x side and G, F and E on the -x side; y is height above Level 1.
  Inside a row entry, pieces are local so they move with their block:
  at = [out, y, along] and size = [out, height, along], where out is metres from the block front
  into the hall (negative goes back into the block) and along is metres from the entry's west end.
*/

export const HALL = { length: 110, width: 36, roof: 16, blockDepth: 9 }
export const FLOOR_HEIGHT = 4

const curve = (p0: Vec2, p1: Vec2, p2: Vec2, n: number): Vec2[] =>
  Array.from({ length: n - 1 }, (_, i) => {
    const t = (i + 1) / n
    const [a, b, c] = [(1 - t) * (1 - t), 2 * (1 - t) * t, t * t]
    return [
      a * p0[0] + b * p1[0] + c * p2[0],
      a * p0[1] + b * p1[1] + c * p2[1],
    ]
  })

// The C/F stairwell: straight along C, curved toward F.
const cfSouth = curve([0.5, 22.5], [-2.75, 14.75], [1, 10], 8)

export const VOIDS: Void[] = [
  {
    name: "Stairs down to the labs, along G",
    x: -4.5,
    z: -39.25,
    w: 2.8,
    d: 13.5,
    stairs: "west",
    benches: "north",
  },
  { name: "Opening in front of B", x: 2.5, z: -17.5, w: 2.8, d: 5 },
  { name: "Opening by the SUCCESS wall", x: 6.1, z: -0.5, w: 3, d: 4 },
  {
    name: "Stairwell between C and F",
    x: 2.25,
    z: 16.25,
    w: 5,
    d: 12.5,
    points: [[4, 10], [4, 22.5], [0.5, 22.5], ...cfSouth, [1, 10]],
    entry: [
      [2.4, 10],
      [4, 10],
    ],
    flights: [
      [[3.2, 10.05], [3.2, 12.5], 0, -1.5],
      [[3.2, 14], [3.2, 20], -1.5, -4],
    ],
  },
  {
    name: "Opening between D and E",
    x: 1.4,
    z: 31.85,
    w: 3.8,
    d: 4.5,
    points: [
      [-0.5, 30.6],
      [-0.5, 33.1],
      [0.5, 34.1],
      [2.3, 34.1],
      [3.3, 33.1],
      [3.3, 30.6],
      [2.3, 29.6],
      [0.5, 29.6],
    ],
  },
  {
    name: "Well under the platform",
    x: -1.6,
    z: 49.75,
    w: 6.2,
    d: 6.5,
    depth: 1.1,
  },
]

export const GLASS_BOX: GlassBox = {
  box: { x: [-6.5, 2], z: [41, 53], y: [7.6, 12.8] },
  columns: { x: [-6.2, 1.7], z: 42, step: 1.65, count: 7 },
  platform: {
    x: [-6.5, 3],
    z: [41, 55],
    y: 4,
    front: { z: [41, 44.5], y: 2.8, steps: 4 },
    wing: { x: [3, 7], z: [46, 55] },
  },
  stairs: { from: [2, 47.3], to: [-6, 47.3], width: 1.6 },
  screen: {
    at: [-2.5, 6.15, 52.5],
    size: [3, 1.7],
    text: "PLACEMENTS\n2025-26",
  },
}

const bench = (at: Vec2, length: number, alongZ = false): Piece => ({
  kind: "bench",
  at,
  length,
  turn: alongZ,
})

export const ATRIUM: Piece[] = [
  { kind: "label", text: "Glass box", at: [0, 15.5, 47] },
  // At the foot of the west wall.
  {
    kind: "board",
    at: [2.6, 1, -54.77],
    width: 0.8,
    height: 1.2,
    bg: "#f2efe6",
    text: "NAAC\nGrade A+",
    face: "east",
  },
  {
    kind: "board",
    at: [3.6, 1, -54.77],
    width: 0.8,
    height: 1.2,
    bg: "#f2efe6",
    text: "NAAC\nA+",
    face: "east",
  },
  {
    kind: "board",
    at: [5, 0.9, -54.77],
    width: 1,
    height: 1.3,
    bg: "#8a5a33",
    text: "A",
    face: "east",
  },
  {
    name: "Post box",
    kind: "box",
    at: [6.5, 0.6, -54.5],
    size: [0.45, 1.2, 0.45],
    mat: "red",
    solid: true,
  },
  // Gate 2's blue sheeting, set back behind the gate.
  {
    kind: "scaffold",
    from: [-13.5, 20.2],
    to: [-13.5, 25],
    y: [4.6, 10.2],
    sheet: "tarp",
  },
  { kind: "decal", at: [1.4, 26.1], r: 1.2, mat: "darkTile" },
  {
    name: "Maroon band along E",
    kind: "band",
    points: [
      [-4.5, 20],
      [-4.5, 35.2],
    ],
    width: 3.5,
    mat: "maroonTile",
  },
  {
    name: "Dark band along the stairwell",
    kind: "band",
    points: cfSouth.map(([x, z]): Vec2 => [x - 1.3, z]),
    width: 1.5,
    mat: "darkTile",
  },
  bench([2.25, 23.3], 1.8),
  bench([4.45, -17.5], 1.6, true),
  bench([0.55, -17.5], 1.6, true),
  bench([2.5, -20.55], 1.6),
  bench([2.5, -14.45], 1.6),
  bench([8.15, -0.5], 1.8, true),
  bench([6.1, 2.05], 1.8),
  bench([4.05, -0.5], 1.8, true),
  bench([3.85, 31.85], 1.9, true),
  bench([-1.05, 31.85], 1.9, true),
  bench([1.4, 29.05], 1.6),
  bench([1.4, 34.65], 1.6),
  // D's cantilevered stair from the Level 2 landing up to a hung landing and on to Level 3.
  {
    name: "Level 2 landing",
    kind: "box",
    at: [5.2, 3.85, 42.2],
    size: [4.4, 0.3, 1.6],
    mat: "white",
  },
  {
    kind: "flight",
    from: [6, 41.5],
    to: [6, 38.9],
    y: [4, 6],
    width: 1.3,
    look: "steel",
  },
  {
    name: "Hung landing",
    kind: "box",
    at: [6.8, 5.9, 38.2],
    size: [2.8, 0.2, 1.4],
    mat: "black",
  },
  {
    kind: "railPath",
    points: [
      [5.4, 37.55],
      [8.2, 37.55],
    ],
    y: 6,
  },
  {
    kind: "strut",
    from: [5.5, 6, 37.6],
    to: [5.5, 14.9, 37.6],
    size: [0.05, 0.05],
    mat: "white",
  },
  {
    kind: "strut",
    from: [8.1, 6, 37.6],
    to: [8.1, 14.9, 37.6],
    size: [0.05, 0.05],
    mat: "white",
  },
  {
    kind: "flight",
    from: [7.6, 38.9],
    to: [7.6, 41.5],
    y: [6, 8],
    width: 1.3,
    look: "steel",
  },
  { kind: "box", at: [7.6, 7.9, 42.2], size: [1.6, 0.2, 1.4], mat: "black" },
  {
    name: "Notice gantry",
    kind: "stand",
    at: [-3, 44],
    bg: "#7a5230",
    face: "west",
  },
  {
    kind: "board",
    at: [7, 1.7, 49.3],
    width: 2,
    height: 1.4,
    bg: "#2f6b3a",
    text: "The\nNewsmakers",
    face: "south",
  },
  {
    kind: "board",
    at: [7, 1.6, 50.6],
    width: 0.6,
    height: 0.9,
    bg: "#f2c230",
    face: "south",
  },
  {
    name: "Canteen shutter below",
    kind: "board",
    at: [-1.6, -0.45, 52.86],
    width: 3,
    height: 0.9,
    bg: "#8d969c",
    face: "west",
  },
  {
    kind: "board",
    at: [-3.7, -0.4, 52.86],
    width: 0.6,
    height: 0.9,
    bg: "#c0392b",
    text: "FOOD\nGPA?",
    face: "west",
  },
]
