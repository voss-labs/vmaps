import type { Vec3 } from "./types"

export type PlaceId =
  | "main-gate"
  | "a-block"
  | "exam"
  | "canteen"
  | "nescafe"
  | "gate-2"
  | "glass-box"

export type Place = {
  id: PlaceId
  name: string
  short: string
  level: string
  /** Eye position: Level 1 floor plus 1.65 m. */
  pos: Vec3
  target: Vec3
  description: string
}

export const START_PLACE: PlaceId = "main-gate"

export const PLACES: Place[] = [
  {
    id: "main-gate",
    name: "The main gate",
    short: "Main gate",
    level: "Level 1",
    pos: [-5, 1.65, -50],
    target: [6, 3, -30],
    description:
      "Just inside the main gate in the south side, looking down the main hall past A block.",
  },
  {
    id: "a-block",
    name: "A block and accounts",
    short: "A block",
    level: "Level 1",
    pos: [4, 1.65, -38.5],
    target: [8, 6.5, -43],
    description:
      "The VIT glass box, the accounts office and the stairs up to the library.",
  },
  {
    id: "exam",
    name: "Exam department",
    short: "Exam department",
    level: "Level 1",
    pos: [-1, 1.65, -23],
    target: [7, 2.4, -30],
    description:
      "Between A and B blocks, beside the red phone box and the ATMs.",
  },
  {
    id: "canteen",
    name: "C block canteen",
    short: "C block canteen",
    level: "Level 1",
    pos: [-1.8, 1.65, 7.5],
    target: [6.5, 2.4, 10.5],
    description:
      "Cafeteria C-101 with its striped awning. Ribbons & Balloons is at the far end.",
  },
  {
    id: "nescafe",
    name: "Nescafe",
    short: "Nescafe",
    level: "Level 1",
    pos: [4.5, 1.65, 24.5],
    target: [14, 2, 24.5],
    description: "The coffee kiosk between the C block canteen and D block.",
  },
  {
    id: "gate-2",
    name: "Gate 2",
    short: "Gate 2",
    level: "Level 1",
    pos: [-3, 1.65, 22.6],
    target: [-12, 2.4, 22.6],
    description:
      "The side gate between F and E blocks, out to the road and parking.",
  },
  {
    id: "glass-box",
    name: "The glass box",
    short: "Glass box",
    level: "Level 1",
    pos: [1, 1.65, 26.5],
    target: [-1, 9, 45],
    description:
      "Between D and E blocks. Under it are the lift, the IT department and the way to M block.",
  },
]
