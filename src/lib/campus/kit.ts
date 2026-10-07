import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"
import { createMaterials } from "./materials"
import { createText } from "./text"
import type { MatName, Obstacle, Vec2, Vec3 } from "./types"

const NO_SHADOW: MatName[] = [
  "floor",
  "darkTile",
  "maroonTile",
  "labFloor",
  "glass",
  "tarp",
  "screen",
  "light",
]

// Box UVs are scaled to metres so tiled textures keep their real size on any box.
function metreBox(w: number, h: number, d: number) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const uv = geo.getAttribute("uv") as THREE.BufferAttribute
  const faces: Vec2[] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ]
  for (let i = 0; i < 24; i++) {
    const [su, sv] = faces[Math.floor(i / 4)]
    uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv)
  }
  return geo
}

export type Kit = ReturnType<typeof createKit>

export function createKit(scene: THREE.Scene) {
  const mats = createMaterials()
  const main = new THREE.Group(),
    roof = new THREE.Group(),
    labels = new THREE.Group()
  labels.visible = false
  scene.add(main, roof, labels)
  const batches = new Map<THREE.Group, Map<MatName, THREE.BufferGeometry[]>>([
    [main, new Map()],
    [roof, new Map()],
  ])
  const obstacles: Obstacle[] = []
  // Height of the floor being furnished; pieces give heights above it.
  let base = 0

  function put(
    geo: THREE.BufferGeometry,
    mat: MatName,
    x: number,
    y: number,
    z: number,
    yaw = 0,
    group = main
  ) {
    const g = geo.index ? geo.toNonIndexed() : geo
    if (g !== geo) geo.dispose()
    if (yaw) g.rotateY(yaw)
    g.translate(x, y + base, z)
    const b = batches.get(group)!
    if (!b.has(mat)) b.set(mat, [])
    b.get(mat)!.push(g)
  }
  function solid(
    x: number,
    z: number,
    w: number,
    d: number,
    bottom: number,
    top: number
  ) {
    obstacles.push({ x, z, w, d, bottom: bottom + base, top: top + base })
  }
  function bounds(points: Vec2[], bottom: number, top: number) {
    const xs = points.map((p) => p[0]),
      zs = points.map((p) => p[1])
    const x0 = Math.min(...xs),
      x1 = Math.max(...xs),
      z0 = Math.min(...zs),
      z1 = Math.max(...zs)
    solid((x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0, bottom, top)
  }
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: MatName,
    o: { solid?: boolean; yaw?: number; group?: THREE.Group } = {}
  ) {
    const yaw = o.yaw ?? 0
    put(metreBox(w, h, d), mat, x, y, z, yaw, o.group)
    if (o.solid) {
      const c = Math.abs(Math.cos(yaw)),
        s = Math.abs(Math.sin(yaw))
      solid(x, z, w * c + d * s, w * s + d * c, y - h / 2, y + h / 2)
    }
  }
  /** A rectangular member from a to b; its width stays horizontal. */
  function beam(a: Vec3, b: Vec3, w: number, h: number, mat: MatName) {
    const p = new THREE.Vector3(...a),
      q = new THREE.Vector3(...b)
    const dir = q.clone().sub(p)
    const len = dir.length()
    if (len < 1e-4) return
    dir.normalize()
    const geo = metreBox(w, h, len)
    geo.rotateX(-Math.asin(dir.y))
    geo.rotateY(Math.atan2(dir.x, dir.z))
    const m = p.add(q).multiplyScalar(0.5)
    put(geo, mat, m.x, m.y, m.z)
  }
  function cylinder(
    r: number,
    h: number,
    x: number,
    y: number,
    z: number,
    mat: MatName,
    top = r
  ) {
    put(new THREE.CylinderGeometry(top, r, h, 20), mat, x, y, z)
  }
  function sphere(r: number, x: number, y: number, z: number, mat: MatName) {
    put(new THREE.IcosahedronGeometry(r, 1), mat, x, y, z)
  }
  function rod(
    a: Vec3,
    b: Vec3,
    r = 0.04,
    mat: MatName = "steel",
    group = main,
    open = false
  ) {
    const p = new THREE.Vector3(...a),
      q = new THREE.Vector3(...b)
    const v = q.clone().sub(p)
    const len = v.length()
    if (len < 1e-4) return
    const geo = new THREE.CylinderGeometry(r, r, len, open ? 5 : 7, 1, open)
    geo.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        v.normalize()
      )
    )
    const m = p.add(q).multiplyScalar(0.5)
    put(geo, mat, m.x, m.y, m.z, 0, group)
  }
  function railPath(points: Vec2[], y0: number, y1 = y0) {
    const total = points
      .slice(1)
      .reduce(
        (s, p, i) => s + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]),
        0
      )
    let walked = 0
    points.forEach((p, i) => {
      if (i)
        walked += Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1])
      const y = y0 + (y1 - y0) * (total ? walked / total : 0)
      if (i === 0 || i === points.length - 1 || i % 2 === 0)
        rod([p[0], y, p[1]], [p[0], y + 1.08, p[1]], 0.035)
      if (!i) return
      const q = points[i - 1]
      const yq =
        y0 +
        (y1 - y0) *
          (total ? (walked - Math.hypot(p[0] - q[0], p[1] - q[1])) / total : 0)
      for (const h of [0.36, 0.72, 1.08])
        rod(
          [q[0], yq + h, q[1]],
          [p[0], y + h, p[1]],
          h === 1.08 ? 0.042 : 0.022
        )
    })
  }
  function rail(
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    y1: number,
    y2 = y1
  ) {
    const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, z2 - z1) / 0.95))
    const points: Vec2[] = []
    for (let i = 0; i <= n; i++)
      points.push([x1 + ((x2 - x1) * i) / n, z1 + ((z2 - z1) * i) / n])
    railPath(points, y1, y2)
  }
  function panel(
    a: Vec2,
    b: Vec2,
    y0: number,
    y1: number,
    thick: number,
    mat: MatName,
    isSolid = false
  ) {
    const dx = b[0] - a[0],
      dz = b[1] - a[1]
    box(
      thick,
      y1 - y0,
      Math.hypot(dx, dz),
      (a[0] + b[0]) / 2,
      (y0 + y1) / 2,
      (a[1] + b[1]) / 2,
      mat,
      { yaw: Math.atan2(dx, dz), solid: isSolid }
    )
  }
  // Plan points are (x, z); the shape is drawn in (x, -z) and turned upright.
  function prism(
    points: Vec2[],
    y0: number,
    y1: number,
    mat: MatName,
    isSolid = false
  ) {
    const shape = new THREE.Shape(
      points.map(([x, z]) => new THREE.Vector2(x, -z))
    )
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: y1 - y0,
      bevelEnabled: false,
    })
    geo.rotateX(-Math.PI / 2)
    put(geo, mat, 0, y0, 0)
    if (isSolid) bounds(points, y0, y1)
  }
  function stairs(
    a: Vec2,
    b: Vec2,
    y0: number,
    y1: number,
    width: number,
    o: { solid?: boolean; look?: "steel" | "concrete"; rails?: boolean } = {}
  ) {
    const n = Math.max(2, Math.round(Math.abs(y1 - y0) / 0.165))
    const dx = b[0] - a[0],
      dz = b[1] - a[1]
    const yaw = Math.atan2(dx, dz)
    const tread = Math.hypot(dx, dz) / n
    const concrete = o.look === "concrete"
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n
      const y = y0 + ((y1 - y0) * (i + 1)) / n
      box(
        width,
        0.07,
        tread + 0.03,
        a[0] + dx * t,
        y - 0.035,
        a[1] + dz * t,
        concrete ? "plaster" : "chequer",
        { yaw }
      )
      if (concrete)
        box(
          width,
          Math.abs(y1 - y0) / n,
          0.04,
          a[0] + dx * (i / n),
          y - Math.abs(y1 - y0) / n / 2,
          a[1] + dz * (i / n),
          "plaster",
          { yaw }
        )
    }
    const ox = (Math.cos(yaw) * width) / 2,
      oz = (-Math.sin(yaw) * width) / 2
    if (concrete)
      beam(
        [a[0], y0 - 0.2, a[1]],
        [b[0], y1 - 0.2, b[1]],
        width,
        0.3,
        "plaster"
      )
    else
      for (const s of [-1, 1])
        beam(
          [a[0] + s * ox, y0 - 0.1, a[1] + s * oz],
          [b[0] + s * ox, y1 - 0.1, b[1] + s * oz],
          0.08,
          0.3,
          "black"
        )
    if (o.rails !== false)
      for (const s of [-1, 1])
        railPath(
          [
            [a[0] + s * ox * 0.96, a[1] + s * oz * 0.96],
            [b[0] + s * ox * 0.96, b[1] + s * oz * 0.96],
          ],
          y0,
          y1
        )
    if (o.solid !== false)
      bounds(
        [
          [a[0] + ox, a[1] + oz],
          [a[0] - ox, a[1] - oz],
          [b[0] + ox, b[1] + oz],
          [b[0] - ox, b[1] - oz],
        ],
        Math.min(y0, y1),
        Math.max(y0, y1)
      )
  }
  /** Low wall with a single handrail, as around the openings in the floor. */
  function guard(a: Vec2, b: Vec2, wall = 0.5, thick = 0.3) {
    panel(a, b, 0, wall, thick, "concrete")
    const n = Math.max(
      1,
      Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.8)
    )
    for (let i = 0; i <= n; i++) {
      const x = a[0] + ((b[0] - a[0]) * i) / n,
        z = a[1] + ((b[1] - a[1]) * i) / n
      rod([x, wall, z], [x, 1, z], 0.022)
    }
    rod([a[0], 1, a[1]], [b[0], 1, b[1]], 0.026)
  }
  function bars(a: Vec2, b: Vec2, height: number) {
    const n = Math.max(
      2,
      Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.22)
    )
    for (let i = 0; i <= n; i++) {
      const x = a[0] + ((b[0] - a[0]) * i) / n,
        z = a[1] + ((b[1] - a[1]) * i) / n
      rod([x, 0, z], [x, height, z], 0.025, "black")
    }
    for (const h of [0.15, height / 2, height - 0.05])
      rod([a[0], h, a[1]], [b[0], h, b[1]], 0.045, "black")
  }
  function finish() {
    const used = new Set<MatName>()
    for (const [group, byMat] of batches)
      for (const [name, geos] of byMat) {
        const merged = mergeGeometries(geos, false)
        geos.forEach((g) => g.dispose())
        if (!merged) continue
        used.add(name)
        const mesh = new THREE.Mesh(merged, mats[name])
        mesh.castShadow = !NO_SHADOW.includes(name)
        mesh.receiveShadow = true
        group.add(mesh)
      }
    for (const name of Object.keys(mats) as MatName[])
      if (!used.has(name)) {
        mats[name].map?.dispose()
        mats[name].dispose()
      }
  }
  return {
    main,
    roof,
    labels,
    obstacles,
    put,
    solid,
    bounds,
    box,
    beam,
    cylinder,
    sphere,
    rod,
    rail,
    railPath,
    panel,
    prism,
    stairs,
    guard,
    bars,
    finish,
    setBase: (y: number) => {
      base = y
    },
    ...createText(main, labels, () => base),
  }
}
