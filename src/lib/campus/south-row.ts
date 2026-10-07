import { GATE1 } from "./blocks/gate1"
import { G } from "./blocks/g"
import { STAIRS } from "./blocks/stairs"
import { RECESS } from "./blocks/recess"
import { F } from "./blocks/f"
import { F_EAST } from "./blocks/f-east"
import { GATE2 } from "./blocks/gate2"
import { E } from "./blocks/e"
import type { Segment } from "./types"

export const SOUTH_ROW: Segment[] = [
  GATE1,
  G,
  STAIRS,
  RECESS,
  F,
  F_EAST,
  GATE2,
  E,
]
