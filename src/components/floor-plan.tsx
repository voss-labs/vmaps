import { Layers3 } from "lucide-react"
import {
  FLOORS,
  GLASS_BOX,
  HALL,
  NORTH_ROW,
  PLACES,
  SOUTH_ROW,
  VOIDS,
  outline,
  type PlaceId,
} from "@/lib/campus"

// Fit the main hall and anything walkable beyond its east wall into the 190 px card.
const TOP = -HALL.length / 2 - 3
const BOTTOM = Math.max(HALL.length / 2, ...FLOORS.map((f) => f.z[1])) + 6
const SCALE = Math.min(1.5, 184 / (BOTTOM - TOP))
const px = (x: number) => 95 + x * SCALE
const py = (z: number) => 3 + (z - TOP) * SCALE

type Props = {
  mode: "walk" | "overview"
  level: string
  pos: { x: number; z: number; yaw: number }
  active: PlaceId
  onGo: (id: PlaceId) => void
}

const rows = [
  ...NORTH_ROW.map((s) => ({ s, side: 1 })),
  ...SOUTH_ROW.map((s) => ({ s, side: -1 })),
]

export function FloorPlan({ mode, level, pos, active, onGo }: Props) {
  const half = HALL.width / 2,
    end = HALL.length / 2
  return (
    <div className="mini-map">
      <div className="map-head">
        <span>
          <Layers3 size={14} />{" "}
          {mode === "overview" ? "MAIN CAMPUS" : level.toUpperCase()}
        </span>
        <span className="map-you">
          <i /> You
        </span>
      </div>
      <svg
        viewBox="0 0 190 190"
        role="img"
        aria-label="Estimated Level 1 floor plan and current position"
      >
        <rect
          x={px(-half)}
          y={py(-end)}
          width={HALL.width * SCALE}
          height={HALL.length * SCALE}
          fill="#e9e8e0"
          stroke="#a5aaa3"
          strokeWidth="1.2"
        />
        {FLOORS.slice(1).map((f) => (
          <rect
            key={`${f.x[0]},${f.z[0]}`}
            x={px(f.x[0])}
            y={py(f.z[0])}
            width={(f.x[1] - f.x[0]) * SCALE}
            height={(f.z[1] - f.z[0]) * SCALE}
            fill="#e9e8e0"
            stroke="#a5aaa3"
            strokeWidth=".6"
          />
        ))}
        {rows.map(({ s, side }) => {
          const depth = s.depth ?? HALL.blockDepth
          const block = s.kind === "block"
          return (
            <g key={s.id}>
              <rect
                x={px(side > 0 ? half - depth : -half)}
                y={py(s.from)}
                width={depth * SCALE}
                height={(s.to - s.from) * SCALE}
                fill={block ? s.tint : "#f4f2ea"}
                fillOpacity={block ? 0.6 : 1}
                stroke="#b3b6ad"
                strokeWidth=".5"
              />
              {s.letter && (
                <text
                  x={px(side * (half - depth / 2))}
                  y={py((s.from + s.to) / 2) + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill="#2f3b35"
                  fontFamily="Arial"
                >
                  {s.letter}
                </text>
              )}
              {s.opening && (
                <>
                  <path
                    d={`M${px(side * half)} ${py(s.from + 1)}V${py(s.to - 1)}`}
                    stroke="#2f9bd6"
                    strokeWidth="2.4"
                  />
                  <text
                    x={px(side * (half + 2))}
                    y={py((s.from + s.to) / 2) + 2}
                    textAnchor={side > 0 ? "start" : "end"}
                    fontSize="5.5"
                    fill="#6d7569"
                    fontFamily="Arial"
                  >
                    {s.name.toUpperCase()}
                  </text>
                </>
              )}
            </g>
          )
        })}
        {VOIDS.map((v) => (
          <polygon
            key={`${v.x},${v.z}`}
            points={outline(v)
              .map(([x, z]) => `${px(x)},${py(z)}`)
              .join(" ")}
            fill="#c3c8bf"
            stroke="#99a095"
            strokeWidth=".4"
          />
        ))}
        <rect
          x={px(GLASS_BOX.box.x[0])}
          y={py(GLASS_BOX.box.z[0])}
          width={(GLASS_BOX.box.x[1] - GLASS_BOX.box.x[0]) * SCALE}
          height={(GLASS_BOX.box.z[1] - GLASS_BOX.box.z[0]) * SCALE}
          fill="#d4e3ea"
          stroke="#6f8ea3"
          strokeWidth=".6"
          strokeDasharray="2 1.5"
        />
        <text
          x="95"
          y={py(BOTTOM) - 1}
          textAnchor="middle"
          fontSize="5.5"
          fill="#6d7569"
          fontFamily="Arial"
        >
          M BLOCK
        </text>
        {PLACES.map((p, i) => (
          <g
            key={p.id}
            className="map-target"
            role="button"
            tabIndex={0}
            aria-label={`Go to ${p.short}`}
            onClick={() => onGo(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onGo(p.id)
            }}
          >
            <circle
              cx={px(p.pos[0])}
              cy={py(p.pos[2])}
              r="4.6"
              fill={active === p.id ? "#f7f7f0" : "#fff"}
              stroke="#8f8e85"
            />
            <text
              x={px(p.pos[0])}
              y={py(p.pos[2]) + 2.1}
              textAnchor="middle"
              fill="#4b504b"
              fontSize="6"
              fontFamily="Arial"
            >
              {i + 1}
            </text>
          </g>
        ))}
        {mode === "walk" && (
          <g
            transform={`translate(${px(pos.x)} ${py(pos.z)}) rotate(${(-pos.yaw * 180) / Math.PI}) scale(.6)`}
          >
            <path d="M0 0-10-21Q0-27 10-21Z" fill="#b84d3730" />
            <circle r="5.5" fill="#b84d37" stroke="#fff" strokeWidth="2" />
          </g>
        )}
      </svg>
      <div className="map-foot">
        {import.meta.env.DEV
          ? `x ${pos.x.toFixed(1)} · z ${pos.z.toFixed(1)}`
          : "Approximate layout"}{" "}
        <span>LEVEL 1</span>
      </div>
    </div>
  )
}
