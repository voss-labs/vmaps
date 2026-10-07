"use client"
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import {
  buildCampus,
  PLACES,
  START_PLACE,
  surfaceHeight,
  isBlocked,
  type PlaceId,
} from "@/lib/campus"
import { loadView, restoreView, saveView } from "@/lib/dev-view"
import { createScene } from "@/lib/scene-setup"
import { registerNavigateTool } from "@/lib/webmcp"
export type ViewerHandle = {
  goTo: (id: PlaceId) => void
  setMode: (mode: "walk" | "overview") => void
  start: () => void
  pause: () => void
  move: (key: string, down: boolean) => void
  reset: () => void
}
type Props = {
  onReady: () => void
  onError: (s: string) => void
  onPosition: (x: number, z: number, y: number, yaw: number) => void
  onLock: (b: boolean) => void
  onMode: (m: "walk" | "overview") => void
}
export const CampusViewer = forwardRef<ViewerHandle, Props>(
  function CampusViewer(props, ref) {
    const host = useRef<HTMLDivElement>(null)
    const api = useRef<ViewerHandle | null>(null)
    const callbacks = useRef(props)
    callbacks.current = props
    useImperativeHandle(
      ref,
      () => ({
        goTo: (id) => api.current?.goTo(id),
        setMode: (m) => api.current?.setMode(m),
        start: () => api.current?.start(),
        pause: () => api.current?.pause(),
        move: (k, d) => api.current?.move(k, d),
        reset: () => api.current?.reset(),
      }),
      []
    )
    useEffect(() => {
      const el = host.current!
      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: "high-performance",
        })
      } catch {
        callbacks.current.onError(
          "This browser could not start 3D. Enable hardware acceleration or try another browser."
        )
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      el.appendChild(renderer.domElement)
      renderer.domElement.tabIndex = 0
      renderer.domElement.setAttribute(
        "aria-label",
        "Interactive 3D map of Level 1 of the VIT main campus. Drag to look around; use W A S D to move."
      )
      const { scene, camera, dispose: disposeScene } = createScene(renderer)
      const campus = buildCampus(scene)
      const orbit = new OrbitControls(camera, renderer.domElement)
      orbit.enabled = false
      orbit.enableDamping = true
      orbit.minDistance = 10
      orbit.maxDistance = 220
      orbit.maxPolarAngle = Math.PI / 2.13
      orbit.target.set(0, 3, 0)
      let mode: "walk" | "overview" = "walk",
        running = false,
        ground = 0,
        dragging = false,
        prevX = 0,
        prevY = 0,
        frame = 0,
        last = performance.now(),
        report = 0,
        contextLost = false
      const keys = new Set<string>()
      const walkPos = new THREE.Vector3(),
        walkRot = new THREE.Euler()
      const goTo = (id: PlaceId) => {
        const p = PLACES.find((p) => p.id === id)
        if (!p) return
        if (mode === "overview") setMode("walk")
        camera.position.set(...p.pos)
        camera.lookAt(new THREE.Vector3(...p.target))
        camera.rotation.order = "YXZ"
        ground = p.pos[1] - 1.65
        keys.clear()
        walkPos.copy(camera.position)
        walkRot.copy(camera.rotation)
        callbacks.current.onPosition(
          camera.position.x,
          camera.position.z,
          ground,
          camera.rotation.y
        )
      }
      const pause = () => {
        running = false
        keys.clear()
        if (document.pointerLockElement === renderer.domElement)
          document.exitPointerLock()
        callbacks.current.onLock(false)
      }
      const setMode = (m: "walk" | "overview") => {
        if (mode === m) return
        pause()
        if (m === "overview") {
          walkPos.copy(camera.position)
          walkRot.copy(camera.rotation)
          camera.position.set(0, 92, 74)
          orbit.target.set(0, 0, -6)
          orbit.enabled = true
          orbit.update()
        } else {
          orbit.enabled = false
          camera.position.copy(walkPos)
          camera.rotation.copy(walkRot)
        }
        campus.roof.visible = m === "walk"
        campus.labels.visible = m === "overview"
        mode = m
        callbacks.current.onMode(m)
      }
      const start = () => {
        if (mode === "overview") setMode("walk")
        running = true
        callbacks.current.onLock(true)
        renderer.domElement.focus()
        if (window.matchMedia("(pointer:fine)").matches) {
          try {
            const p = renderer.domElement.requestPointerLock()
            p?.catch(() => {
              running = true
              callbacks.current.onLock(true)
            })
          } catch {
            /* Drag-to-look remains available. */
          }
        }
      }
      const move = (key: string, down: boolean) => {
        if (down) {
          running = true
          callbacks.current.onLock(true)
          keys.add(key)
        } else keys.delete(key)
      }
      api.current = {
        goTo,
        setMode,
        start,
        pause,
        move,
        reset: () => goTo(START_PLACE),
      }
      const saved = loadView()
      if (saved)
        restoreView(saved, camera, walkPos, walkRot, orbit, () =>
          setMode("overview")
        )
      else goTo(START_PLACE)
      callbacks.current.onPosition(walkPos.x, walkPos.z, ground, walkRot.y)
      const keydown = (e: KeyboardEvent) => {
        if (
          (e.target as HTMLElement)?.closest('input,textarea,[role="dialog"]')
        )
          return
        if (e.code === "Escape") {
          pause()
          return
        }
        if (e.code === "KeyM") {
          setMode(mode === "walk" ? "overview" : "walk")
          return
        }
        if (
          [
            "KeyW",
            "KeyA",
            "KeyS",
            "KeyD",
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ShiftLeft",
            "ShiftRight",
          ].includes(e.code) &&
          mode === "walk" &&
          running
        ) {
          e.preventDefault()
          keys.add(e.code)
        }
      }
      const keyup = (e: KeyboardEvent) => keys.delete(e.code)
      const pointerDown = (e: PointerEvent) => {
        if (mode !== "walk") return
        dragging = true
        prevX = e.clientX
        prevY = e.clientY
        renderer.domElement.setPointerCapture(e.pointerId)
      }
      const pointerMove = (e: PointerEvent) => {
        if (mode !== "walk") return
        const locked = document.pointerLockElement === renderer.domElement
        if (!locked && !dragging) return
        const dx = locked ? e.movementX : e.clientX - prevX,
          dy = locked ? e.movementY : e.clientY - prevY
        camera.rotation.y -= dx * 0.0025
        camera.rotation.x = THREE.MathUtils.clamp(
          camera.rotation.x - dy * 0.0025,
          -1.35,
          1.35
        )
        prevX = e.clientX
        prevY = e.clientY
      }
      const pointerUp = () => (dragging = false)
      const lockChange = () => {
        if (document.pointerLockElement === renderer.domElement) {
          running = true
          callbacks.current.onLock(true)
        } else {
          running = false
          keys.clear()
          callbacks.current.onLock(false)
        }
      }
      const contextLoss = (e: Event) => {
        e.preventDefault()
        contextLost = true
        pause()
        callbacks.current.onError(
          "The 3D view was interrupted. Reload this page to reconnect."
        )
      }
      const resize = () => {
        const { width, height } = el.getBoundingClientRect()
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
      const ro = new ResizeObserver(resize)
      ro.observe(el)
      resize()
      window.addEventListener("keydown", keydown)
      window.addEventListener("keyup", keyup)
      window.addEventListener("blur", pause)
      document.addEventListener("pointerlockchange", lockChange)
      renderer.domElement.addEventListener("pointerdown", pointerDown)
      renderer.domElement.addEventListener("pointermove", pointerMove)
      renderer.domElement.addEventListener("pointerup", pointerUp)
      renderer.domElement.addEventListener("pointercancel", pointerUp)
      renderer.domElement.addEventListener("webglcontextlost", contextLoss)
      function animate(now: number) {
        frame = requestAnimationFrame(animate)
        if (contextLost) return
        const dt = Math.min((now - last) / 1000, 0.035)
        last = now
        if (mode === "overview") orbit.update()
        else if (running) {
          let f =
            Number(keys.has("KeyW") || keys.has("ArrowUp")) -
            Number(keys.has("KeyS") || keys.has("ArrowDown"))
          let r =
            Number(keys.has("KeyD") || keys.has("ArrowRight")) -
            Number(keys.has("KeyA") || keys.has("ArrowLeft"))
          const norm = Math.hypot(f, r)
          if (norm) {
            f /= norm
            r /= norm
            const speed =
              keys.has("ShiftLeft") || keys.has("ShiftRight") ? 5 : 2.7
            const yaw = camera.rotation.y,
              dx = (-Math.sin(yaw) * f + Math.cos(yaw) * r) * speed * dt,
              dz = (-Math.cos(yaw) * f - Math.sin(yaw) * r) * speed * dt
            for (const [mx, mz] of [
              [dx, 0],
              [0, dz],
            ]) {
              const x = camera.position.x + mx,
                z = camera.position.z + mz
              const y = surfaceHeight(x, z, ground)
              if (y !== null && !isBlocked(x, z, y, campus.obstacles)) {
                camera.position.x = x
                camera.position.z = z
                ground = y
              }
            }
            camera.position.y = THREE.MathUtils.lerp(
              camera.position.y,
              ground + 1.65,
              Math.min(1, dt * 16)
            )
          }
        }
        if (now - report > 120) {
          callbacks.current.onPosition(
            camera.position.x,
            camera.position.z,
            ground,
            camera.rotation.y
          )
          report = now
          const overview = mode === "overview"
          saveView(
            overview ? walkPos : camera.position,
            overview ? walkRot : camera.rotation,
            overview ? { camera: camera.position, target: orbit.target } : null
          )
        }
        renderer.render(scene, camera)
      }
      renderer.render(scene, camera)
      callbacks.current.onReady()
      frame = requestAnimationFrame(animate)
      const lifecycle = new AbortController()
      registerNavigateTool(goTo, pause, lifecycle.signal)
      return () => {
        lifecycle.abort()
        pause()
        cancelAnimationFrame(frame)
        ro.disconnect()
        orbit.dispose()
        window.removeEventListener("keydown", keydown)
        window.removeEventListener("keyup", keyup)
        window.removeEventListener("blur", pause)
        document.removeEventListener("pointerlockchange", lockChange)
        scene.traverse((o) => {
          if (o instanceof THREE.Sprite) {
            o.material.map?.dispose()
            o.material.dispose()
          } else if (o instanceof THREE.Mesh) {
            o.geometry.dispose()
            const ms = Array.isArray(o.material) ? o.material : [o.material]
            ms.forEach((m) => {
              ;(m as THREE.MeshStandardMaterial).map?.dispose()
              m.dispose()
            })
          }
        })
        disposeScene()
        renderer.dispose()
        el.replaceChildren()
        api.current = null
      }
    }, [])
    return <div className="scene" ref={host} />
  }
)
