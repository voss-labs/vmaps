import * as THREE from "three"
import { readableOn } from "./materials"

const FONT = "Arial, Helvetica, sans-serif"

function canvasTexture(c: HTMLCanvasElement) {
  const map = new THREE.CanvasTexture(c)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 4
  return map
}

/** Flat text and picture surfaces: signs, block letters, boards and overview labels. */
export function createText(
  main: THREE.Group,
  labels: THREE.Group,
  base: () => number
) {
  function addPlane(
    c: HTMLCanvasElement,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    yaw: number
  ) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: canvasTexture(c), toneMapped: false })
    )
    mesh.position.set(x, y + base(), z)
    mesh.rotation.y = yaw
    main.add(mesh)
  }
  function sign(
    text: string,
    x: number,
    y: number,
    z: number,
    height: number,
    yaw: number,
    bg = "#24407a",
    fg = "#ffffff"
  ) {
    const font = `600 96px ${FONT}`
    const c = document.createElement("canvas")
    const g = c.getContext("2d")!
    g.font = font
    c.width = Math.ceil(g.measureText(text).width) + 96
    c.height = 160
    g.fillStyle = bg
    g.fillRect(0, 0, c.width, c.height)
    g.fillStyle = fg
    g.font = font
    g.textAlign = "center"
    g.textBaseline = "middle"
    g.fillText(text, c.width / 2, 84)
    addPlane(c, (height * c.width) / c.height, height, x, y, z, yaw)
  }
  function letterSign(
    letter: string,
    x: number,
    y: number,
    z: number,
    size: number,
    yaw: number
  ) {
    const c = document.createElement("canvas")
    c.width = c.height = 256
    const g = c.getContext("2d")!
    g.fillStyle = "#24407a"
    g.fillRect(0, 0, 256, 256)
    g.fillStyle = "#ffffff"
    g.textAlign = "center"
    g.textBaseline = "middle"
    g.font = `700 150px ${FONT}`
    g.fillText(letter, 128, 110)
    g.font = `600 42px ${FONT}`
    g.fillText("Block", 128, 214)
    addPlane(c, size, size, x, y, z, yaw)
  }
  // A poster or notice board: a coloured panel with a few lines of text.
  function board(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    yaw: number,
    bg: string,
    text = "",
    fg = readableOn(bg)
  ) {
    const c = document.createElement("canvas")
    c.width = 512
    c.height = Math.max(32, Math.round((512 * h) / w))
    const g = c.getContext("2d")!
    g.fillStyle = bg
    g.fillRect(0, 0, c.width, c.height)
    g.strokeStyle = "rgba(0,0,0,0.25)"
    g.lineWidth = 6
    g.strokeRect(3, 3, c.width - 6, c.height - 6)
    const lines = text ? text.split("\n") : []
    if (lines.length) {
      const size = Math.min(
        (c.height * 0.7) / lines.length,
        (c.width * 1.6) / Math.max(...lines.map((l) => l.length))
      )
      g.fillStyle = fg
      g.font = `700 ${Math.floor(size)}px ${FONT}`
      g.textAlign = "center"
      g.textBaseline = "middle"
      lines.forEach((l, i) =>
        g.fillText(
          l,
          c.width / 2,
          c.height / 2 + (i - (lines.length - 1) / 2) * size * 1.15
        )
      )
    }
    addPlane(c, w, h, x, y, z, yaw)
  }
  function label(
    text: string,
    x: number,
    y: number,
    z: number,
    height = 3,
    bg = "#fbfaf4"
  ) {
    const font = `700 88px ${FONT}`
    const c = document.createElement("canvas")
    const g = c.getContext("2d")!
    g.font = font
    c.width = Math.ceil(g.measureText(text).width) + 80
    c.height = 140
    g.fillStyle = bg
    g.beginPath()
    g.roundRect(0, 0, c.width, c.height, 30)
    g.fill()
    g.fillStyle = readableOn(bg)
    g.font = font
    g.textAlign = "center"
    g.textBaseline = "middle"
    g.fillText(text, c.width / 2, 74)
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: canvasTexture(c),
        depthTest: false,
        transparent: true,
      })
    )
    sprite.position.set(x, y + base(), z)
    sprite.scale.set((height * c.width) / c.height, height, 1)
    sprite.renderOrder = 10
    labels.add(sprite)
  }
  return { sign, letterSign, board, label }
}
