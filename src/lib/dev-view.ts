import type * as THREE from "three"
import type { OrbitControls } from "three/addons/controls/OrbitControls.js"

// In dev, keep the camera where it was when an edit rebuilds the scene, so corrections can be checked in place.
const KEY = "vmaps-dev-view"

export type SavedView = { walk: number[]; overview: number[] | null }

export function loadView(): SavedView | null {
  if (!import.meta.env.DEV) return null
  try {
    const v = JSON.parse(
      sessionStorage.getItem(KEY) ?? "null"
    ) as SavedView | null
    return v && Array.isArray(v.walk) && v.walk.length === 5 ? v : null
  } catch {
    return null
  }
}

export function saveView(
  walkPos: THREE.Vector3,
  walkRot: THREE.Euler,
  overview: { camera: THREE.Vector3; target: THREE.Vector3 } | null
) {
  if (!import.meta.env.DEV) return
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        walk: [walkPos.x, walkPos.y, walkPos.z, walkRot.x, walkRot.y],
        overview: overview
          ? [...overview.camera.toArray(), ...overview.target.toArray()]
          : null,
      })
    )
  } catch {
    /* Storage can be unavailable; the view then resets on rebuild. */
  }
}

export function restoreView(
  saved: SavedView,
  camera: THREE.PerspectiveCamera,
  walkPos: THREE.Vector3,
  walkRot: THREE.Euler,
  orbit: OrbitControls,
  enterOverview: () => void
) {
  const [x, y, z, rx, ry] = saved.walk
  camera.position.set(x, y, z)
  camera.rotation.set(rx, ry, 0, "YXZ")
  walkPos.copy(camera.position)
  walkRot.copy(camera.rotation)
  if (!saved.overview) return
  enterOverview()
  const [cx, cy, cz, tx, ty, tz] = saved.overview
  camera.position.set(cx, cy, cz)
  orbit.target.set(tx, ty, tz)
  orbit.update()
}
