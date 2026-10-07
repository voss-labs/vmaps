import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

/** Camera, sky colour and lights for the covered hall. */
export function createScene(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color("#dce5e5")
  scene.fog = new THREE.Fog("#dce5e5", 120, 300)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  // The roof sheets let in soft daylight, so most light is diffuse and the sun is gentle.
  scene.environment = environment
  scene.environmentIntensity = 0.6
  const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 450)
  camera.rotation.order = "YXZ"
  scene.add(new THREE.HemisphereLight("#f6f8ff", "#d8d4cc", 1.9))
  const sun = new THREE.DirectionalLight("#fff3d6", 2.2)
  sun.position.set(-35, 75, 30)
  sun.target.position.set(0, 0, 0)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, {
    left: -70,
    right: 70,
    top: 75,
    bottom: -75,
    near: 1,
    far: 220,
  })
  sun.shadow.bias = -0.0006
  sun.shadow.normalBias = 0.025
  scene.add(sun, sun.target)
  const fill = new THREE.DirectionalLight("#d8ebff", 0.6)
  fill.position.set(30, 20, -40)
  scene.add(fill)
  return { scene, camera, dispose: () => environment.dispose() }
}
