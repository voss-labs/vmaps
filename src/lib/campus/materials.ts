import * as THREE from "three"
import type { MatName } from "./types"

type TexKind =
  | "tile"
  | "wood"
  | "concrete"
  | "brick"
  | "stone"
  | "osb"
  | "plaster"
  | "chequer"
  | "sheet"

// Textures are drawn at one texture per 1 / repeat metres, because every mesh gets UVs in metres.
function texture(kind: TexKind, base: string, repeat: number) {
  const c = document.createElement("canvas")
  c.width = c.height = 512
  const g = c.getContext("2d")!
  g.fillStyle = base
  g.fillRect(0, 0, 512, 512)
  let seed = 41
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const speckles = { osb: 2600, plaster: 22000, sheet: 0, chequer: 4000 }
  const alpha = { osb: 0.24, plaster: 0.045, sheet: 0, chequer: 0.06 }
  const count = speckles[kind as keyof typeof speckles] ?? 14000
  for (let i = 0; i < count; i++) {
    const a = rand() * (alpha[kind as keyof typeof alpha] ?? 0.1)
    g.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "20,20,20"},${a})`
    const x = rand() * 512,
      y = rand() * 512
    if (kind === "osb") g.fillRect(x, y, 6 + rand() * 22, 3 + rand() * 8)
    else if (kind === "wood") g.fillRect(x, y, 1, rand() * 70)
    else g.fillRect(x, y, 2, 2)
  }
  g.lineWidth = 2
  g.strokeStyle = kind === "tile" ? "#b3aa93" : "#24180f40"
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    g.beginPath()
    g.moveTo(x1, y1)
    g.lineTo(x2, y2)
    g.stroke()
  }
  if (kind === "tile")
    for (let i = 0; i <= 512; i += 128) {
      line(i, 0, i, 512)
      line(0, i, 512, i)
    }
  if (kind === "wood") for (let i = 0; i <= 512; i += 64) line(i, 0, i, 512)
  if (kind === "brick")
    for (let r = 0; r < 16; r++) {
      line(0, r * 32, 512, r * 32)
      for (let x = (r % 2) * 32; x < 512; x += 64)
        line(x, r * 32, x, r * 32 + 32)
    }
  if (kind === "stone") {
    g.lineWidth = 3
    for (let i = 0; i < 46; i++) {
      const x = rand() * 512,
        y = rand() * 512
      line(x, y, x + (rand() - 0.5) * 150, y + (rand() - 0.5) * 150)
    }
  }
  if (kind === "plaster")
    for (let i = 0; i < 18; i++) {
      const x = rand() * 512,
        w = 6 + rand() * 30
      const grad = g.createLinearGradient(0, 0, 0, 512)
      grad.addColorStop(0, "rgba(90,80,60,0)")
      grad.addColorStop(rand(), `rgba(90,80,60,${0.03 + rand() * 0.04})`)
      grad.addColorStop(1, "rgba(90,80,60,0)")
      g.fillStyle = grad
      g.fillRect(x, 0, w, 512)
    }
  if (kind === "chequer") {
    g.strokeStyle = "#ffffff55"
    g.lineWidth = 4
    for (let y = 8; y < 512; y += 32)
      for (let x = 8; x < 512; x += 32) {
        const flip = ((x + y) / 32) % 2 ? 1 : -1
        line(x, y, x + 14, y + 14 * flip)
      }
  }
  if (kind === "sheet")
    for (let x = 0; x < 512; x += 16) {
      g.fillStyle = x % 32 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"
      g.fillRect(x, 0, 8, 512)
    }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.anisotropy = 4
  return t
}

export function createMaterials(): Record<MatName, THREE.MeshStandardMaterial> {
  const m = (
    color: string,
    roughness = 0.75,
    metalness = 0,
    extra: THREE.MeshStandardMaterialParameters = {}
  ) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra })
  const tex = (kind: TexKind, base: string, repeat: number, roughness = 0.85) =>
    m("#ffffff", roughness, 0, { map: texture(kind, base, repeat) })
  return {
    white: m("#eeeae1"),
    plaster: tex("plaster", "#ece7dc", 0.2, 0.9),
    cream: tex("plaster", "#e4d7b9", 0.2, 0.9),
    beam: m("#e2e5de"),
    panel: m("#cfd4d3", 0.45, 0.3),
    steel: m("#c3c9c7", 0.28, 0.75),
    chequer: m("#ffffff", 0.45, 0.6, {
      map: texture("chequer", "#7d8487", 1.5),
    }),
    black: m("#2f3539", 0.6, 0.2),
    glass: m("#8fb0b5", 0.08, 0.2, { transparent: true, opacity: 0.45 }),
    darkGlass: m("#24394a", 0.12, 0.5),
    frosted: m("#dde6e5", 0.4, 0, { transparent: true, opacity: 0.85 }),
    polycarb: m("#eef2ee", 0.5, 0, { transparent: true, opacity: 0.8 }),
    floor: tex("tile", "#d3bf9b", 2.27, 0.42),
    floorDiag: (() => {
      const t = texture("tile", "#d6c4a2", 2.27)
      t.rotation = Math.PI / 4
      return m("#ffffff", 0.42, 0, { map: t })
    })(),
    paver: m("#4d5358", 0.7),
    mustard: m("#c39a3b", 0.6),
    darkTile: m("#5d4b40", 0.5),
    maroonTile: m("#7a3f35", 0.5),
    labFloor: m("#8d918c", 0.6),
    concrete: tex("concrete", "#aab1ae", 0.25),
    stone: tex("stone", "#8b918e", 0.3, 0.9),
    sandstone: tex("stone", "#b8a07e", 0.3, 0.9),
    brick: tex("brick", "#ad5a43", 0.42, 0.9),
    redBrick: tex("brick", "#8e3b2e", 0.42, 0.9),
    maroon: m("#7a2f2c"),
    wood: tex("wood", "#5b4636", 0.625, 0.8),
    osb: tex("osb", "#b07a4a", 0.5),
    yellow: m("#efc31b", 0.7),
    orange: m("#c4622c"),
    tan: m("#c9a77a", 0.8),
    blue: m("#3b5aa3", 0.7),
    navy: m("#1f3350", 0.6),
    red: m("#b8322c", 0.55),
    linen: m("#eee0bf"),
    slate: m("#3e464b", 0.6),
    leaf: m("#3f6b3a", 0.8),
    pot: m("#7d7466", 0.85),
    light: m("#fffaf0", 0.4, 0, {
      emissive: "#fff6e0",
      emissiveIntensity: 1.1,
    }),
    tarp: m("#1f86d0", 0.6, 0, {
      emissive: "#1a7fd6",
      emissiveIntensity: 0.7,
      side: THREE.DoubleSide,
    }),
    bamboo: m("#a88b5a", 0.8),
    plastic: m("#2a2f33", 0.7, 0, { side: THREE.DoubleSide }),
    screen: m("#dfe9ff", 0.4, 0, {
      emissive: "#9fb8ff",
      emissiveIntensity: 0.6,
    }),
    gloss: tex("tile", "#ece6da", 0.42, 0.18),
    chair: m("#e4572e", 0.55),
    mosaic: tex("tile", "#d0452c", 8, 0.4),
    salmon: m("#d99482", 0.8),
    padded: tex("tile", "#d6c19b", 0.6, 0.9),
    laminate: tex("wood", "#3a2a22", 1.2, 0.6),
    darkBrick: tex("brick", "#5b3527", 0.42, 0.9),
    teal: m("#3aa894", 0.7),
    soffit: m("#26292b", 0.95),
    roofSheet: m("#ffffff", 0.85, 0, {
      side: THREE.DoubleSide,
      map: texture("sheet", "#eceae4", 0.5),
      emissive: "#3a3936",
    }),
  }
}

export function readableOn(hex: string) {
  const n = parseInt(hex.slice(1, 7), 16)
  const lum =
    0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return lum > 150 ? "#23302a" : "#ffffff"
}
