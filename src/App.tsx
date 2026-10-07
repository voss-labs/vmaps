"use client"
import { useRef, useState } from "react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Box,
  Camera,
  ChevronDown,
  Expand,
  Footprints,
  HelpCircle,
  MapPin,
  Mouse,
  Navigation,
  RotateCcw,
  Video,
} from "lucide-react"
import { CampusViewer, type ViewerHandle } from "@/components/campus-viewer"
import { FloorPlan } from "@/components/floor-plan"
import { HelpDialog, ReferenceDialog } from "@/components/info-dialogs"
import { levelName, PLACES, START_PLACE, type PlaceId } from "@/lib/campus"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function App() {
  const viewer = useRef<ViewerHandle>(null)
  const [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [mode, setMode] = useState<"walk" | "overview">("walk"),
    [active, setActive] = useState<PlaceId>(START_PLACE),
    [walking, setWalking] = useState(false),
    [source, setSource] = useState(false),
    [help, setHelp] = useState(false),
    [mobilePlaces, setMobilePlaces] = useState(false),
    [pos, setPos] = useState({ x: 0, z: -51, y: 0, yaw: 0 })
  const place = PLACES.find((p) => p.id === active)!
  const level = levelName(pos.y)
  const goTo = (id: PlaceId) => {
    setActive(id)
    viewer.current?.pause()
    viewer.current?.goTo(id)
    setMode("walk")
    setMobilePlaces(false)
  }
  const openSource = () => {
    viewer.current?.pause()
    setSource(true)
  }
  return (
    <main
      className={
        "explorer " +
        (walking ? "is-walking " : "") +
        (mode === "overview" ? "is-overview" : "")
      }
    >
      <header className="topbar">
        <a className="brand" href="./" aria-label="VIT Campus Explorer home">
          <span className="brand-mark">V</span>
          <span>
            <strong>
              VIT<span className="brand-separator">/</span>
              <span className="brand-title">Campus Explorer</span>
            </strong>
            <small>Vidyalankar Institute of Technology · VOSS Labs</small>
          </span>
        </a>
        <div className="top-actions">
          <span className="build-badge">
            CAMPUS DRAFT <span>02</span>
          </span>
          <button
            className="icon-button"
            title="Controls & about this map"
            aria-label="Controls and about this map"
            onClick={() => {
              viewer.current?.pause()
              setHelp(true)
            }}
          >
            <HelpCircle size={19} />
          </button>
          <button
            className="icon-button fullscreen-button"
            title="Full screen"
            aria-label="Toggle full screen"
            onClick={() => {
              if (document.fullscreenElement) void document.exitFullscreen()
              else
                void document.documentElement
                  .requestFullscreen?.()
                  .catch(() => {})
            }}
          >
            <Expand size={18} />
          </button>
        </div>
      </header>
      <div className="workspace">
        <aside
          className={"places-panel " + (mobilePlaces ? "mobile-open" : "")}
          aria-label="Explore viewpoints"
        >
          <div className="panel-heading">
            <div className="eyebrow">EXPLORE THE CAMPUS</div>
            <h1>
              A place you know.
              <br />A new perspective.
            </h1>
            <p>Walk Level 1 of the main campus.</p>
          </div>
          <div className="section-label">
            <span>JUMP TO A PLACE</span>
            <span>{String(PLACES.length).padStart(2, "0")}</span>
          </div>
          <nav className="place-list">
            {PLACES.map((p, i) => (
              <button
                key={p.id}
                className={"place-card " + (active === p.id ? "selected" : "")}
                onClick={() => goTo(p.id)}
              >
                <span className="place-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="place-copy">
                  <strong>{p.short}</strong>
                  <small>{p.level}</small>
                </span>
                {active === p.id ? (
                  <span className="selected-dot" />
                ) : (
                  <MapPin size={15} />
                )}
              </button>
            ))}
          </nav>
          <button className="source-card" onClick={openSource}>
            <img
              src={`${import.meta.env.BASE_URL}reference/feature-wall.jpg`}
              alt="Yellow feature wall extracted from the college video"
            />
            <span className="source-image-shade" />
            <span className="source-camera">
              <Video size={17} />
            </span>
            <span className="source-card-copy">
              <small>FROM YOUR WALKTHROUGH</small>
              <strong>See the real space</strong>
              <span>
                4 reference views <Camera size={13} />
              </span>
            </span>
          </button>
          <div className="coverage">
            <span className="coverage-symbol">
              <Box size={17} />
            </span>
            <p>
              <strong>Photo-based draft</strong>
              <span>Level 1 · Blocks A–G · Estimated sizes</span>
            </p>
          </div>
          <footer className="panel-footer">
            <span>VOSS LABS · VIT, MUMBAI</span>
            <span>EST. LEVEL 1 LAYOUT</span>
          </footer>
        </aside>
        <section className="viewport" aria-label="3D campus map">
          <CampusViewer
            ref={viewer}
            onReady={() => setReady(true)}
            onError={setError}
            onPosition={(x, z, y, yaw) => setPos({ x, z, y, yaw })}
            onLock={setWalking}
            onMode={setMode}
          />
          <div className="scene-vignette" />
          <div className="location-bar">
            <span className="location-icon">
              <MapPin size={16} />
            </span>
            <span>Main campus</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{mode === "overview" ? "Building overview" : level}</strong>
            <button
              className="mobile-places-toggle"
              aria-label="Show places"
              onClick={() => setMobilePlaces(!mobilePlaces)}
            >
              <ChevronDown size={18} />
            </button>
          </div>
          <div className="compass" title="View orientation">
            <div
              style={{ transform: `rotate(${(-pos.yaw * 180) / Math.PI}deg)` }}
            >
              <Navigation size={22} fill="currentColor" />
            </div>
            <span>VIEW</span>
          </div>
          {error ? (
            <div className="loading-state">
              <Box size={32} />
              <h2>3D view unavailable</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Reload view
              </button>
            </div>
          ) : !ready ? (
            <div className="loading-state">
              <span className="loading-orbit" />
              <h2>Opening the campus</h2>
              <p>Preparing your 3D campus…</p>
            </div>
          ) : null}
          {ready && !error && !walking && mode === "walk" && (
            <div className="walk-prompt">
              <div className="prompt-icon">
                <Footprints size={22} />
              </div>
              <div>
                <strong>You’re at {place.short.toLowerCase()}</strong>
                <span>Drag to look around, or step into the space.</span>
              </div>
              <button onClick={() => viewer.current?.start()}>
                Start walking <Footprints size={17} />
              </button>
            </div>
          )}
          {walking && mode === "walk" && (
            <>
              <div className="crosshair" />
              <div className="walking-notice">
                <Mouse size={14} /> Mouse to look <span /> <kbd>ESC</kbd> to
                release
              </div>
            </>
          )}
          {mode === "overview" && (
            <div className="overview-notice">
              <Box size={17} />
              <span>Drag to orbit · Scroll to zoom</span>
            </div>
          )}
          <FloorPlan
            mode={mode}
            level={level}
            pos={pos}
            active={active}
            onGo={goTo}
          />
          <div className="view-toolbar">
            <Tabs
              value={mode}
              onValueChange={(v) =>
                viewer.current?.setMode(v as "walk" | "overview")
              }
            >
              <TabsList className="mode-list">
                <TabsTrigger value="walk">
                  <Footprints size={17} />
                  Walk
                </TabsTrigger>
                <TabsTrigger value="overview">
                  <Box size={17} />
                  3D overview
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="toolbar-divider" />
            <button
              title="Return to starting view"
              aria-label="Return to starting view"
              onClick={() => goTo(START_PLACE)}
            >
              <RotateCcw size={17} />
            </button>
            <button
              title="View video frames"
              aria-label="View video reference frames"
              onClick={openSource}
            >
              <Camera size={18} />
            </button>
          </div>
          <div className="controls-guide">
            <span>
              <kbd>W</kbd>
              <span className="wasd">
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd>
              </span>
            </span>
            <span>Move</span>
            <i />
            <kbd>SHIFT</kbd>
            <span>Run</span>
            <i />
            <Mouse size={16} />
            <span>Look</span>
            <i />
            <kbd>M</kbd>
            <span>Map</span>
          </div>
          <div className="touch-controls" aria-label="Touch movement controls">
            {[
              { k: "KeyW", c: "up", I: ArrowUp },
              { k: "KeyA", c: "left", I: ArrowLeft },
              { k: "KeyS", c: "down", I: ArrowDown },
              { k: "KeyD", c: "right", I: ArrowRight },
            ].map(({ k, c, I }) => (
              <button
                key={k}
                className={c}
                aria-label={`Move ${c}`}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId)
                  viewer.current?.move(k, true)
                }}
                onPointerUp={() => viewer.current?.move(k, false)}
                onPointerCancel={() => viewer.current?.move(k, false)}
              >
                <I size={22} />
              </button>
            ))}
          </div>
          <span className="render-label">
            <span /> LIVE 3D <b>·</b> THREE.JS
          </span>
        </section>
      </div>
      <ReferenceDialog open={source} onOpenChange={setSource} />
      <HelpDialog open={help} onOpenChange={setHelp} />
    </main>
  )
}
