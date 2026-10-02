import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"

export type PlaceId = "walkway" | "atrium" | "cafe" | "gallery" | "upper"
export const PLACES = [
  {
    id: "walkway" as PlaceId,
    name: "The upper walkway",
    short: "Upper walkway",
    level: "Level 1",
    pos: [-4, 5.85, 18] as [number, number, number],
    target: [2, 4, -9] as [number, number, number],
    image: "stairway.jpg",
    time: "00:31",
    description:
      "The viewpoint from your video. Look across the atrium, then take the central stairs down.",
  },
  {
    id: "atrium" as PlaceId,
    name: "The central atrium",
    short: "Central atrium",
    level: "Ground",
    pos: [-2, 1.65, -3] as [number, number, number],
    target: [8, 5, 4] as [number, number, number],
    image: "atrium.jpg",
    time: "00:16",
    description:
      "Open gathering space, stepped seating, and views of the stacked interior balconies.",
  },
  {
    id: "cafe" as PlaceId,
    name: "Along the café",
    short: "Café edge",
    level: "Ground",
    pos: [6.8, 1.65, 0] as [number, number, number],
    target: [11, 2, -3] as [number, number, number],
    image: "feature-wall.jpg",
    time: "00:07",
    description:
      "The striped awning and small tables visible beneath the yellow feature wall.",
  },
  {
    id: "gallery" as PlaceId,
    name: "The stair gallery",
    short: "Stair gallery",
    level: "Level 1",
    pos: [-10, 5.85, 3] as [number, number, number],
    target: [-9, 6, -10] as [number, number, number],
    image: "atrium.jpg",
    time: "00:16",
    description:
      "Follow the open gallery around the atrium. The west staircase connects to the upper balcony.",
  },
  {
    id: "upper" as PlaceId,
    name: "The upper balcony",
    short: "Upper balcony",
    level: "Level 2",
    pos: [-10, 10.05, 1] as [number, number, number],
    target: [5, 5, 3] as [number, number, number],
    image: "feature-wall.jpg",
    time: "00:07",
    description:
      "An elevated perspective of the atrium. This level uses estimated connecting geometry.",
  },
]
export type Obstacle = {
  x: number
  z: number
  w: number
  d: number
  bottom: number
  top: number
}
export function surfaceHeight(
  x: number,
  z: number,
  current: number
): number | null {
  if (Math.abs(x) > 11.62 || Math.abs(z) > 20.62) return null
  const candidates = [0]
  if (Math.abs(x) >= 8.6 || z >= 16 || z <= -17) candidates.push(4.2, 8.4)
  if (Math.abs(x) <= 1.48 && z >= 3.6 && z <= 16.2)
    candidates.push(Math.max(0, Math.min(4.2, (z - 4) * 0.35)))
  if (x >= -11.55 && x <= -8.85 && z >= -12 && z <= 0.2)
    candidates.push(4.2 + Math.max(0, Math.min(4.2, (z + 12) * 0.35)))
  if (Math.abs(x) <= 1.48 && z >= 3.6 && z <= 16.2) {
    const ramp = Math.max(0, Math.min(4.2, (z - 4) * 0.35))
    if (Math.abs(ramp - current) < 0.43) return ramp
  }
  if (x >= -11.55 && x <= -8.85 && z >= -12 && z <= 0) {
    const ramp = 4.2 + (z + 12) * 0.35
    if (Math.abs(ramp - current) < 0.43) return ramp
  }
  const valid = candidates.filter((y) => Math.abs(y - current) < 0.43)
  return valid.length
    ? valid.reduce((a, b) =>
        Math.abs(a - current) < Math.abs(b - current) ? a : b
      )
    : null
}
export function isBlocked(
  x: number,
  z: number,
  y: number,
  obstacles: Obstacle[]
) {
  return obstacles.some(
    (o) =>
      y + 0.15 < o.top &&
      y + 1.55 > o.bottom &&
      Math.abs(x - o.x) < o.w / 2 + 0.26 &&
      Math.abs(z - o.z) < o.d / 2 + 0.26
  )
}
export function buildCampus(scene: THREE.Scene) {
  const main = new THREE.Group(),
    roof = new THREE.Group()
  scene.add(main, roof)
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>()
  const roofBatches = new Map<THREE.Material, THREE.BufferGeometry[]>()
  const obstacles: Obstacle[] = []
  function material(color: string, roughness = 0.75, metalness = 0) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness })
  }
  function texture(kind: "tile" | "wood" | "concrete" | "brick") {
    const c = document.createElement("canvas")
    c.width = c.height = 512
    const g = c.getContext("2d")!
    g.fillStyle =
      kind === "tile"
        ? "#d7d1b9"
        : kind === "wood"
          ? "#958667"
          : kind === "brick"
            ? "#95725b"
            : "#9caaa9"
    g.fillRect(0, 0, 512, 512)
    let seed = 41
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < 16000; i++) {
      g.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "20,20,20"},${rand() * 0.1})`
      const x = rand() * 512,
        y = rand() * 512
      g.fillRect(
        x,
        y,
        kind === "wood" ? 1 : 2,
        kind === "wood" ? rand() * 70 : 2
      )
    }
    g.lineWidth = 2
    g.strokeStyle = kind === "tile" ? "#b9b5a5" : "#655d5144"
    const step =
      kind === "tile" ? 128 : kind === "wood" ? 64 : kind === "brick" ? 32 : 512
    for (let i = 0; i <= 512; i += step) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i, 512)
      g.stroke()
      if (kind !== "wood") {
        g.beginPath()
        g.moveTo(0, i)
        g.lineTo(512, i)
        g.stroke()
      }
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(kind === "tile" ? 6 : 2, kind === "tile" ? 10 : 2)
    t.anisotropy = 4
    return t
  }
  const mats = {
    white: material("#eeeae1"),
    beam: material("#e2e5de"),
    floor: new THREE.MeshStandardMaterial({
      map: texture("tile"),
      roughness: 0.49,
    }),
    wood: new THREE.MeshStandardMaterial({
      map: texture("wood"),
      roughness: 0.75,
    }),
    clay: new THREE.MeshStandardMaterial({
      map: texture("brick"),
      roughness: 0.9,
    }),
    concrete: new THREE.MeshStandardMaterial({
      map: texture("concrete"),
      roughness: 0.85,
    }),
    yellow: material("#e8e933"),
    orange: material("#c79759"),
    rail: material("#bfc5c2", 0.3, 0.55),
    black: material("#343e42"),
    glass: material("#819fa5", 0.21, 0.25),
    darkGlass: material("#3e687b", 0.24, 0.2),
    red: material("#aa4a46"),
    linen: material("#eee0bf"),
    green: material("#385747"),
    pot: material("#85857a"),
    step: material("#b8bfbd"),
    light: new THREE.MeshStandardMaterial({
      color: "#fff9df",
      emissive: "#fff4ce",
      emissiveIntensity: 0.35,
    }),
  }
  function add(
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    rx = 0,
    ry = 0,
    rz = 0,
    onRoof = false
  ) {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
      new THREE.Vector3(1, 1, 1)
    )
    geo.applyMatrix4(matrix)
    const b = onRoof ? roofBatches : batches
    if (!b.has(mat)) b.set(mat, [])
    b.get(mat)!.push(geo)
  }
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material = mats.white,
    solid = false,
    onRoof = false
  ) {
    add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, 0, 0, 0, onRoof)
    if (solid) obstacles.push({ x, z, w, d, bottom: y - h / 2, top: y + h / 2 })
  }
  function rod(
    a: number[],
    b: number[],
    r = 0.032,
    mat: THREE.Material = mats.rail,
    onRoof = false
  ) {
    const p = new THREE.Vector3(...a),
      q = new THREE.Vector3(...b),
      v = q.clone().sub(p)
    const geo = new THREE.CylinderGeometry(r, r, v.length(), 7)
    geo.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        v.clone().normalize()
      )
    )
    const m = p.add(q).multiplyScalar(0.5)
    add(geo, mat, m.x, m.y, m.z, 0, 0, 0, onRoof)
  }
  function rail(
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    y1: number,
    y2 = y1
  ) {
    const n = Math.ceil(Math.hypot(x2 - x1, z2 - z1) / 1.9)
    for (let i = 0; i <= n; i++) {
      const t = i / n,
        x = x1 + (x2 - x1) * t,
        z = z1 + (z2 - z1) * t,
        y = y1 + (y2 - y1) * t
      rod([x, y, z], [x, y + 1.08, z], 0.04)
    }
    for (const h of [0.28, 0.64, 1.08])
      rod([x1, y1 + h, z1], [x2, y2 + h, z2], h === 1.08 ? 0.044 : 0.024)
  }
  function windowPanel(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    side: "x" | "z" = "x",
    dark = false
  ) {
    const m = dark ? mats.darkGlass : mats.glass
    box(side === "x" ? 0.065 : w, h, side === "x" ? w : 0.065, x, y, z, m)
    for (const s of [-1, 1])
      box(
        side === "x" ? 0.1 : 0.055,
        h + 0.08,
        side === "x" ? 0.055 : 0.1,
        x + (side === "z" ? (s * w) / 2 : 0),
        y,
        z + (side === "x" ? (s * w) / 2 : 0),
        mats.white
      )
    for (const yy of [-h / 2, 0, h / 2])
      box(
        side === "x" ? 0.12 : w + 0.07,
        0.06,
        side === "x" ? w + 0.07 : 0.12,
        x,
        y + yy,
        z,
        mats.white
      )
    const n = Math.ceil(w / 1.1)
    for (let i = 1; i < n; i++)
      box(
        side === "x" ? 0.12 : 0.055,
        h,
        side === "x" ? 0.055 : 0.12,
        x + (side === "z" ? -w / 2 + (i * w) / n : 0),
        y,
        z + (side === "x" ? -w / 2 + (i * w) / n : 0),
        mats.white
      )
  }
  function sign(
    text: string,
    x: number,
    y: number,
    z: number,
    w: number,
    color = "#344c64",
    ry = 0
  ) {
    const c = document.createElement("canvas")
    c.width = 768
    c.height = 160
    const g = c.getContext("2d")!
    g.fillStyle = color
    g.fillRect(0, 0, 768, 160)
    g.fillStyle = "white"
    g.font = "600 62px Arial"
    g.textAlign = "center"
    g.textBaseline = "middle"
    g.fillText(text, 384, 82)
    const map = new THREE.CanvasTexture(c)
    map.colorSpace = THREE.SRGBColorSpace
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, (w * 160) / 768),
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.8,
        side: THREE.DoubleSide,
      })
    )
    mesh.position.set(x, y, z)
    mesh.rotation.y = ry
    main.add(mesh)
  }
  // An estimated 24 m by 42 m central atrium, calibrated visually from the supplied clip.
  box(24, 0.35, 42, 0, -0.175, 0, mats.floor)
  box(0.35, 12.5, 42, -12, 6.1, 0)
  box(0.35, 12.5, 42, 12, 6.1, 0)
  box(24, 12.5, 0.3, 0, 6.1, -21)
  box(24, 12.5, 0.3, 0, 6.1, 21)
  // Continuous perimeter balconies, with a stair opening on the near edge.
  for (const y of [4.2, 8.4]) {
    if (y === 8.4) {
      box(3.4, 0.28, 9, -10.3, y - 0.14, -16.5, mats.floor)
      box(3.4, 0.28, 21, -10.3, y - 0.14, 10.5, mats.floor)
    } else box(3.4, 0.28, 42, -10.3, y - 0.14, 0, mats.floor)
    box(3.4, 0.28, 42, 10.3, y - 0.14, 0, mats.floor)
    box(17.2, 0.28, 4, 0, y - 0.14, -19, mats.floor)
    box(17.2, 0.28, 5, 0, y - 0.14, 18.5, mats.wood)
    rail(-8.55, -17, -8.55, 16, y)
    rail(8.55, -17, 8.55, 16, y)
    rail(-8.55, -17, 8.55, -17, y)
    if (y === 4.2) {
      rail(-8.55, 16, -1.65, 16, y)
      rail(1.65, 16, 8.55, 16, y)
    } else rail(-8.55, 16, 8.55, 16, y)
    box(0.2, 0.65, 33, -8.55, y - 0.38, -0.5, mats.white)
    box(0.2, 0.65, 33, 8.55, y - 0.38, -0.5, mats.white)
  }
  // Tall white structural piers and exposed beams.
  for (const x of [-8.35, 8.35])
    for (const z of [-18, -10, -2, 6, 14, 20]) {
      box(0.44, 12.7, 0.44, x, 6.2, z, mats.beam, true)
      box(3.6, 0.25, 0.25, x < 0 ? -10.1 : 10.1, 4.1, z, mats.beam)
    }
  for (const z of [-19, -13, -7, -1, 5, 11, 17]) {
    box(24, 0.34, 0.25, 0, 12.2, z, mats.beam, false, true)
    for (const x of [-12, 12])
      rod([x, 12.2, z], [0, 14.1, z], 0.08, mats.beam, true)
  }
  for (let x = -12; x <= 12; x += 1.5)
    rod([x, 12.9, -21], [x, 12.9, 21], 0.055, mats.beam, true)
  // A translucent daylight roof: visible inside; lifted away in overview.
  const roofmat = new THREE.MeshStandardMaterial({
    color: "#e9ece5",
    transparent: true,
    opacity: 0.48,
    side: THREE.DoubleSide,
    roughness: 0.6,
  })
  box(24, 0.06, 42, 0, 13, 0, roofmat, false, true)
  for (let z = 16.5; z < 21; z += 0.62)
    box(24, 0.2, 0.13, 0, 7.65, z, mats.wood)
  // The distinctive yellow angled volume on the east façade.
  const yellowShape = new THREE.Shape()
  yellowShape.moveTo(-5.8, 0)
  yellowShape.lineTo(5.8, 0)
  yellowShape.lineTo(6.8, 6.4)
  yellowShape.lineTo(-8, 6.4)
  yellowShape.closePath()
  add(
    new THREE.ExtrudeGeometry(yellowShape, { depth: 0.3, bevelEnabled: false }),
    mats.yellow,
    11.42,
    4.2,
    8,
    0,
    -Math.PI / 2,
    0
  )
  for (const y of [5.25, 6.05, 6.85])
    box(0.06, 0.48, 3.8, 11.05, y, 8, mats.step)
  box(0.18, 2.35, 1.35, 11.02, 5.375, 14, mats.black)
  box(0.2, 2.18, 1.14, 10.91, 5.34, 14, mats.wood)
  sign("P", 10.96, 7.95, 8, 0.48, "#3f6092", -Math.PI / 2)
  // White façades, timber-clad cantilevered rooms, gridded windows.
  for (const z of [-14, -5, 4, 13]) {
    box(0.8, 3.25, 5.6, -11.45, 9.95, z, mats.clay, true)
    windowPanel(-11.0, 10.15, z, 4.65, 2.25)
    windowPanel(-11.7, 6.1, z, 3.2, 2.2)
    box(0.14, 2.3, 1.1, -11.7, 1.15, z + 1.8, mats.wood)
  }
  for (const z of [-14, -6]) {
    windowPanel(11.76, 9.85, z, 4.8, 2.25)
    windowPanel(11.76, 6.0, z, 3.5, 2.2)
  }
  box(6, 4.1, 0.5, -4, 9.7, -20.65, mats.orange)
  windowPanel(4, 6.5, -20.75, 8, 6.2, "z", true)
  windowPanel(-4, 5.8, -20.35, 4, 3.1, "z")
  // Concrete sculptural volume beside the far stairwell.
  const arc = new THREE.Shape()
  arc.moveTo(-2.4, 0)
  arc.bezierCurveTo(-2.5, 2, -3.3, 5, -3.9, 6.1)
  arc.lineTo(-0.4, 5.8)
  arc.bezierCurveTo(0.1, 3, 1.1, 1, 1.4, 0)
  arc.closePath()
  add(
    new THREE.ExtrudeGeometry(arc, { depth: 1.6, bevelEnabled: false }),
    mats.concrete,
    -3.5,
    0,
    -15.4
  )
  obstacles.push({ x: -4.9, z: -14.5, w: 4.5, d: 1.8, bottom: 0, top: 6 })
  // Central stairs: 30 treads. Collision uses a continuous walkable slope.
  for (let i = 0; i < 30; i++) {
    const h = (i + 1) * 0.14,
      z = 4 + (i + 0.5) * 0.4
    box(3.3, 0.14, 0.405, 0, h - 0.07, z, mats.step)
    box(3.25, 0.027, 0.045, 0, h + 0.012, z - 0.18, mats.rail)
  }
  rod([-1.58, 0.2, 4], [-1.58, 4.2, 16], 0.12, mats.black)
  rod([1.58, 0.2, 4], [1.58, 4.2, 16], 0.12, mats.black)
  rail(-1.64, 4, -1.64, 16, 0, 4.2)
  rail(1.64, 4, 1.64, 16, 0, 4.2)
  // West stair connects the first and second galleries.
  for (let i = 0; i < 28; i++) {
    const h = 4.2 + (i + 1) * 0.15
    box(
      2.4,
      0.15,
      12 / 28,
      -10.2,
      h - 0.075,
      -12 + ((i + 0.5) * 12) / 28,
      mats.step
    )
  }
  rail(-8.92, -12, -8.92, 0, 4.2, 8.4)
  rail(-11.5, -12, -11.5, 0, 4.2, 8.4)
  rod([-8.96, 4.1, -12], [-8.96, 8.3, 0], 0.13, mats.black)
  // Striped café awning and glazing, observed at ground level.
  box(0.5, 2.8, 10, 11.47, 1.4, -1.2, mats.orange, true)
  windowPanel(11.17, 1.55, -1.2, 8.8, 1.9)
  for (let i = 0; i < 32; i++) {
    const z = -6.2 + (i + 0.5) * 0.3125
    box(2.1, 0.12, 0.3125, 10.5, 3.03, z, i % 2 ? mats.linen : mats.red)
    box(0.1, 0.24, 0.3125, 9.49, 2.91, z, i % 2 ? mats.linen : mats.red)
  }
  sign("CAFÉ", 9.42, 2.45, -1.1, 1.25, "#805139", -Math.PI / 2)
  for (const z of [-4.5, -1, 2.5]) {
    add(
      new THREE.CylinderGeometry(0.56, 0.56, 0.08, 24),
      mats.linen,
      8.15,
      0.83,
      z
    )
    rod([8.15, 0, z], [8.15, 0.82, z], 0.07, mats.black)
    obstacles.push({ x: 8.15, z, w: 1.15, d: 1.15, bottom: 0, top: 0.87 })
    for (const offset of [-0.85, 0.85]) {
      add(
        new THREE.CylinderGeometry(0.25, 0.25, 0.09, 16),
        mats.red,
        8.15,
        0.49,
        z + offset
      )
      rod([8.15, 0, z + offset], [8.15, 0.47, z + offset], 0.055, mats.black)
    }
  }
  // Simple timber benches and the low stepped gathering plinths.
  for (const z of [-9, 0])
    for (const x of [-4.8, 3.7]) {
      box(3.2, 0.17, 0.75, x, 0.48, z, mats.wood, true)
      for (const dx of [-1.1, 1.1])
        box(0.22, 0.4, 0.65, x + dx, 0.2, z, mats.black)
    }
  for (const x of [-5.6, 4.8]) {
    box(4.5, 0.22, 3, x, 0.11, -8, mats.step)
    box(4.5, 0.22, 1.6, x, 0.33, -8.7, mats.step)
  }
  // Potted interior plants and wall notice boards.
  for (const [x, z, y] of [
    [-7, 13, 0],
    [7, 13, 0],
    [-10, -18, 4.2],
    [10, -18, 4.2],
  ]) {
    add(
      new THREE.CylinderGeometry(0.42, 0.29, 0.64, 12),
      mats.pot,
      x,
      y + 0.32,
      z
    )
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3
      rod(
        [x, y + 0.5, z],
        [
          x + Math.cos(a) * 0.26,
          y + 1.4 + (i % 2) * 0.3,
          z + Math.sin(a) * 0.26,
        ],
        0.025,
        mats.green
      )
      add(
        new THREE.SphereGeometry(0.31, 6, 5),
        mats.green,
        x + Math.cos(a) * 0.27,
        y + 1.25 + (i % 2) * 0.3,
        z + Math.sin(a) * 0.27
      )
    }
    obstacles.push({ x, z, w: 0.85, d: 0.85, bottom: y, top: y + 1.5 })
  }
  box(0.07, 1.7, 2.7, -11.72, 1.7, 9, mats.darkGlass)
  box(0.07, 1.1, 3.2, 11.71, 6.1, -18.5, mats.red)
  sign("VIDYALANKAR", 0, 10.4, -20.7, 7, "#9b3d37")
  for (const z of [-16, -8, 0, 8, 18])
    for (const x of [-10.2, 10.2]) box(0.14, 0.055, 1.6, x, 7.8, z, mats.light)
  // Batch static meshes for smooth navigation on integrated GPUs.
  for (const [map, group] of [
    [batches, main],
    [roofBatches, roof],
  ] as const) {
    for (const [mat, geos] of map) {
      const merged = mergeGeometries(geos, false)
      if (merged) {
        const mesh = new THREE.Mesh(merged, mat)
        mesh.castShadow = mat !== mats.floor
        mesh.receiveShadow = true
        group.add(mesh)
      }
      geos.forEach((g) => g.dispose())
    }
  }
  return { main, roof, obstacles }
}
