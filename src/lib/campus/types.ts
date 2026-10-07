export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export type MatName =
  | "white"
  | "plaster"
  | "cream"
  | "beam"
  | "panel"
  | "steel"
  | "chequer"
  | "black"
  | "glass"
  | "darkGlass"
  | "frosted"
  | "polycarb"
  | "floor"
  | "floorDiag"
  | "paver"
  | "mustard"
  | "darkTile"
  | "maroonTile"
  | "labFloor"
  | "concrete"
  | "stone"
  | "sandstone"
  | "brick"
  | "redBrick"
  | "maroon"
  | "wood"
  | "osb"
  | "yellow"
  | "orange"
  | "tan"
  | "blue"
  | "navy"
  | "red"
  | "linen"
  | "slate"
  | "leaf"
  | "pot"
  | "light"
  | "tarp"
  | "bamboo"
  | "plastic"
  | "screen"
  | "roofSheet"

/** "out" faces the main hall; the rest are compass directions in the model. */
export type Face = "out" | "west" | "east" | "north" | "south"

/*
  In a row entry, positions are local: Vec3 is [out, y, along] and a plan
  point (Vec2) is [out, along]. In the main hall list they are world [x, y, z]
  and [x, z].
*/
export type Piece = (
  | { kind: "box"; at: Vec3; size: Vec3; mat: MatName; solid?: boolean }
  | {
      kind: "bulge"
      along: Vec2
      out: number
      depth: number
      y: Vec2
      mat: MatName
      back?: number
      solid?: boolean
      windows?: { y: Vec2; count: number; mat?: MatName }
    }
  | { kind: "shape"; points: Vec2[]; y: Vec2; mat: MatName; solid?: boolean }
  | {
      kind: "stairs"
      out: number
      along: Vec2
      y: Vec2
      width: number
      look?: "steel" | "concrete"
    }
  | {
      kind: "flight"
      from: Vec2
      to: Vec2
      y: Vec2
      width: number
      look?: "steel" | "concrete"
    }
  | {
      kind: "stairTower"
      at: Vec2
      levels: number
      width: number
      run: number
    }
  | { kind: "rail"; from: Vec2; to: Vec2; y: number }
  | { kind: "railPath"; points: Vec2[]; y: number }
  | { kind: "awning"; out: number; along: Vec2; y: number; depth: number }
  | { kind: "frame"; at: Vec3; size: Vec3 }
  | { kind: "gate"; out: number; along: Vec2; height: number }
  | { kind: "table"; at: Vec2 }
  | { kind: "bench"; at: Vec2; length?: number; turn?: boolean }
  | { kind: "column"; at: Vec2; y?: Vec2; r?: number; mat?: MatName }
  | {
      kind: "curvedBalcony"
      along: Vec2
      out: number
      depth: number
      y: number
      mat?: MatName
    }
  | { kind: "bridge"; from: Vec2; to: Vec2; y: number; width: number }
  | {
      kind: "steps"
      from: Vec2
      to: Vec2
      width: number
      count: number
      height: number
      base?: number
      mat?: MatName
    }
  | {
      kind: "glazing"
      at: Vec3
      width: number
      height: number
      mat?: MatName
      cols?: number
      rows?: number
      face?: Face
      turn?: number
    }
  | {
      kind: "board"
      at: Vec3
      width: number
      height: number
      bg: string
      text?: string
      fg?: string
      face?: Face
      turn?: number
    }
  | {
      kind: "stand"
      at: Vec2
      bg?: string
      text?: string
      face?: Face
    }
  | { kind: "flag"; at: Vec2; color: string; height?: number }
  | { kind: "plant"; at: Vec2; y?: number; size?: number }
  | { kind: "lights"; from: Vec2; to: Vec2; y: number }
  | { kind: "decal"; at: Vec2; r?: number; size?: Vec2; mat: MatName }
  | { kind: "band"; points: Vec2[]; width: number; mat: MatName }
  | { kind: "canopy"; from: Vec2; to: Vec2; y: number }
  | {
      kind: "profileWall"
      out: number
      thick: number
      base: number
      points: Vec2[]
      mat: MatName
    }
  | { kind: "strut"; from: Vec3; to: Vec3; size?: Vec2; mat?: MatName }
  | { kind: "solid"; at: Vec2; size: Vec2; y?: Vec2 }
  | {
      kind: "bays"
      out: number
      along: Vec2
      height: number
      count: number
      clear?: number[]
      door?: number
      mat?: MatName
    }
  | { kind: "stools"; from: Vec2; to: Vec2; count: number; mat?: MatName }
  | { kind: "standee"; at: Vec2; color: string; text?: string; face?: Face }
  | { kind: "chess"; at: Vec2; size?: number }
  | { kind: "phonebox"; at: Vec2; face?: Face }
  | { kind: "vending"; at: Vec2; color?: string; text?: string; face?: Face }
  | {
      kind: "scaffold"
      from: Vec2
      to: Vec2
      y: Vec2
      sheet?: MatName
    }
  | {
      kind: "sign"
      text: string
      at: Vec3
      height: number
      bg?: string
      fg?: string
      face?: Face
      turn?: number
    }
  | { kind: "label"; text: string; at: Vec3 }
) & { name?: string }

export type Segment = {
  id: string
  name: string
  kind: "block" | "court"
  /** z where the entry starts (main gate side) and ends. */
  from: number
  to: number
  /** Metres from the outer wall to the front facing the main hall. */
  depth?: number
  facade?: "balconies" | "glass" | "sawtooth" | "solid"
  /** Curtain wall pane size [width, height] for glass facades. */
  pane?: Vec2
  /** Width of the open corridor in front of the upper rooms. */
  corridor?: number
  /** Main wall material of the block. */
  wall?: MatName
  /** What Level 1 shows to the hall: doors and windows, or a glass front. */
  ground?: "doors" | "glass" | "plain"
  /** Windows on the upper room fronts. */
  upper?: "dark" | "light" | "none"
  /** Level 1 front set back [along from, along to, metres], e.g. under a platform. */
  recess?: [number, number, number]
  letter?: string
  letterAt?: Vec3
  /** Colour on the floor plan and behind the overview letter. */
  tint: string
  /** No outer wall, for gates. */
  opening?: boolean
  notes?: string
  pieces: Piece[]
}

/** An opening in the Level 1 floor down to the labs: a rectangle, or an outline in `points`. */
export type Void = {
  name?: string
  x: number
  z: number
  w: number
  d: number
  /** World (x, z) outline; when set it replaces the rectangle. */
  points?: Vec2[]
  /** Explicit stair flights [from, to, y from, y to] for outlined openings. */
  flights?: [Vec2, Vec2, number, number][]
  /** Gap in the guard where the stair starts, from one point to another. */
  entry?: [Vec2, Vec2]
  /** How far down the opening goes; the labs floor by default. */
  depth?: number
  /** Which way the stairs go down, if there are stairs. */
  stairs?: "west" | "east"
  /** Benches on both long sides, or only on one: north is +x, east is +z. */
  benches?: boolean | "north" | "south" | "east" | "west"
}

/** The glass box between D and E, its platform and the stair under it (world coordinates). */
export type GlassBox = {
  box: { x: Vec2; z: Vec2; y: Vec2 }
  columns: { x: Vec2; z: number; step: number; count: number }
  platform: {
    x: Vec2
    z: Vec2
    y: number
    front: { z: Vec2; y: number; steps: number }
    wing: { x: Vec2; z: Vec2 }
  }
  stairs: { from: Vec2; to: Vec2; width: number }
  screen: { at: Vec3; size: Vec2; text: string }
}

export type Obstacle = {
  x: number
  z: number
  w: number
  d: number
  bottom: number
  top: number
}
