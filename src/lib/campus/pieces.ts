import { bulgePoints, faceYaw, toWorld, type Frame } from "./frame"
import { booth, counter, dining, fan, pendants, wall } from "./furniture"
import type { Kit } from "./kit"
import {
  band,
  bench,
  chess,
  decal,
  flag,
  glazing,
  lights,
  phonebox,
  plant,
  stand,
  standee,
  stools,
  table,
  vending,
} from "./props"
import {
  awning,
  bays,
  bridge,
  canopy,
  column,
  curvedBalcony,
  frame,
  profileWall,
  scaffold,
  stairTower,
  steps,
} from "./structures"
import type { MatName, Piece, Vec2 } from "./types"

export { segmentFrame, WORLD, type Frame } from "./frame"
export { sawtooth } from "./structures"

const DEG = Math.PI / 180

/** Windows spaced along the curved front of a bulge, each turned to face outwards. */
function bulgeWindows(
  kit: Kit,
  f: Frame,
  p: { along: Vec2; out: number; depth: number },
  y: Vec2,
  count: number,
  mat: MatName = "glass"
) {
  const at = (t: number): Vec2 =>
    toWorld(f, [
      p.out + p.depth * 4 * t * (1 - t),
      p.along[0] + (p.along[1] - p.along[0]) * t,
    ])
  const [ox, oz] = [Math.sin(f.yaw), Math.cos(f.yaw)]
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count,
      h = 0.5 / count
    const [ax, az] = at(t - h),
      [bx, bz] = at(t + h)
    let [nx, nz] = [bz - az, -(bx - ax)]
    if (nx * ox + nz * oz < 0) [nx, nz] = [-nx, -nz]
    const len = Math.hypot(nx, nz)
    const [cx, cz] = at(t)
    glazing(
      kit,
      [cx + (nx / len) * 0.04, (y[0] + y[1]) / 2, cz + (nz / len) * 0.04],
      len * 0.75,
      y[1] - y[0],
      Math.atan2(nx, nz),
      mat,
      1,
      1
    )
  }
}

export function placePiece(kit: Kit, p: Piece, f: Frame) {
  const w = (q: [number, number]) => toWorld(f, q)
  const yaw = (face?: Parameters<typeof faceYaw>[1], turn = 0) =>
    faceYaw(f, face) + turn * DEG
  switch (p.kind) {
    case "box":
      kit.box(
        p.size[0],
        p.size[1],
        p.size[2],
        f.x(p.at[0]),
        p.at[1],
        f.z(p.at[2]),
        p.mat,
        { solid: p.solid }
      )
      break
    case "bulge":
      kit.prism(
        bulgePoints(p.along, p.out, p.depth, p.back ?? 0.5).map(w),
        p.y[0],
        p.y[1],
        p.mat,
        p.solid
      )
      if (p.windows)
        bulgeWindows(kit, f, p, p.windows.y, p.windows.count, p.windows.mat)
      break
    case "shape":
      kit.prism(p.points.map(w), p.y[0], p.y[1], p.mat, p.solid)
      break
    case "stairs":
      kit.stairs(
        w([p.out, p.along[0]]),
        w([p.out, p.along[1]]),
        p.y[0],
        p.y[1],
        p.width,
        { look: p.look }
      )
      break
    case "flight":
      kit.stairs(w(p.from), w(p.to), p.y[0], p.y[1], p.width, { look: p.look })
      break
    case "stairTower":
      stairTower(kit, f, p.at, p.levels, p.width, p.run)
      break
    case "rail": {
      const [a, b] = [w(p.from), w(p.to)]
      kit.rail(a[0], a[1], b[0], b[1], p.y)
      break
    }
    case "railPath":
      kit.railPath(p.points.map(w), p.y)
      break
    case "awning":
      awning(kit, f, p.out, p.along, p.y, p.depth)
      break
    case "frame":
      frame(kit, f, p.at, p.size)
      break
    case "gate":
      kit.bars(w([p.out, p.along[0]]), w([p.out, p.along[1]]), p.height)
      break
    case "table":
      table(kit, w(p.at))
      break
    case "bench":
      bench(kit, w(p.at), p.length ?? 2.2, alongZ(f, p.turn))
      break
    case "column":
      column(kit, w(p.at), p.y, p.r, p.mat)
      break
    case "curvedBalcony":
      curvedBalcony(kit, f, p.along, p.out, p.depth, p.y, p.mat)
      break
    case "bridge":
      bridge(kit, w(p.from), w(p.to), p.y, p.width)
      break
    case "steps":
      steps(kit, w(p.from), w(p.to), p.width, p.count, p.height, p.base, p.mat)
      break
    case "glazing":
      glazing(
        kit,
        [f.x(p.at[0]), p.at[1], f.z(p.at[2])],
        p.width,
        p.height,
        yaw(p.face, p.turn),
        p.mat,
        p.cols,
        p.rows
      )
      break
    case "board":
      kit.board(
        f.x(p.at[0]),
        p.at[1],
        f.z(p.at[2]),
        p.width,
        p.height,
        yaw(p.face, p.turn),
        p.bg,
        p.text,
        p.fg
      )
      break
    case "stand":
      stand(kit, w(p.at), yaw(p.face), p.bg ?? "#2f5d3a", p.text)
      break
    case "standee":
      standee(kit, w(p.at), yaw(p.face), p.color, p.text)
      break
    case "flag":
      flag(kit, w(p.at), f.yaw, p.color, p.height)
      break
    case "plant":
      plant(kit, w(p.at), p.y, p.size)
      break
    case "lights":
      lights(kit, w(p.from), w(p.to), p.y)
      break
    case "decal":
      decal(kit, w(p.at), p.mat, p.r, p.size)
      break
    case "band":
      band(kit, p.points.map(w), p.width, p.mat)
      break
    case "chess":
      chess(kit, w(p.at), p.size)
      break
    case "phonebox":
      phonebox(kit, w(p.at), yaw(p.face))
      break
    case "vending":
      vending(kit, w(p.at), yaw(p.face), p.color, p.text)
      break
    case "stools":
      stools(kit, w(p.from), w(p.to), p.count, p.mat)
      break
    case "scaffold":
      scaffold(kit, f, p.from, p.to, p.y, p.sheet)
      break
    case "canopy":
      canopy(kit, f, p.from, p.to, p.y)
      break
    case "profileWall":
      profileWall(kit, f, p.out, p.thick, p.base, p.points, p.mat)
      break
    case "strut": {
      const [sw, sh] = p.size ?? [0.4, 0.5]
      kit.beam(
        [f.x(p.from[0]), p.from[1], f.z(p.from[2])],
        [f.x(p.to[0]), p.to[1], f.z(p.to[2])],
        sw,
        sh,
        p.mat ?? "beam"
      )
      break
    }
    case "solid": {
      const [a, b] = [
        w([p.at[0] - p.size[0] / 2, p.at[1] - p.size[1] / 2]),
        w([p.at[0] + p.size[0] / 2, p.at[1] + p.size[1] / 2]),
      ]
      kit.bounds([a, b], p.y?.[0] ?? 0, p.y?.[1] ?? 2)
      break
    }
    case "bays":
      bays(kit, f, p.out, p.along, p.height, p.count, p.clear, p.door, p.mat)
      break
    case "sign":
      kit.sign(
        p.text,
        f.x(p.at[0]),
        p.at[1],
        f.z(p.at[2]),
        p.height,
        yaw(p.face, p.turn),
        p.bg,
        p.fg
      )
      break
    case "label":
      kit.label(p.text, f.x(p.at[0]), p.at[1], f.z(p.at[2]))
      break
    case "wall":
      wall(
        kit,
        w(p.from),
        w(p.to),
        p.y ?? [0, 3.7],
        p.thick ?? 0.15,
        p.mat,
        p.solid !== false
      )
      break
    case "dining":
      dining(
        kit,
        w(p.at),
        alongZ(f, p.turn),
        p.size ?? [1.2, 0.75],
        p.seats ?? 2,
        p.style ?? "square",
        p.top ?? "linen"
      )
      break
    case "booth":
      booth(kit, w(p.at), p.length, alongZ(f, p.turn))
      break
    case "pendants":
      pendants(kit, w(p.from), w(p.to), p.count, p.y, p.top)
      break
    case "fan":
      fan(kit, f.x(p.at[0]), p.at[1], f.z(p.at[2]), !!p.wall, yaw(p.face))
      break
    case "cylinder":
      kit.cylinder(
        p.r,
        p.h,
        f.x(p.at[0]),
        p.at[1],
        f.z(p.at[2]),
        p.mat,
        p.top ?? p.r
      )
      break
    case "counter":
      counter(kit, w(p.at), p.length, alongZ(f, p.turn), !!p.guard)
      break
  }
}

// Long things lie along the block in a row entry and along x in the main hall list, unless turned.
const alongZ = (f: Frame, turn?: boolean) =>
  Math.abs(Math.sin(f.yaw)) > 0.5 !== Boolean(turn)
