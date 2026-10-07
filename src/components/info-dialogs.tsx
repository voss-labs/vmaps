import { useState } from "react"
import { Box, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const sourceFrames = [
  { file: "feature-wall.jpg", title: "Yellow feature wall", time: "00:07" },
  { file: "atrium.jpg", title: "Atrium & stair gallery", time: "00:16" },
  { file: "walkway.jpg", title: "Interior walkway", time: "00:25" },
  { file: "stairway.jpg", title: "Central stairway", time: "00:31" },
]

type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void }

export function ReferenceDialog({ open, onOpenChange }: DialogProps) {
  const [frame, setFrame] = useState(0)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="reference-dialog">
        <DialogHeader>
          <div className="eyebrow">THE REAL SPACE</div>
          <DialogTitle>Your video, frame by frame.</DialogTitle>
          <DialogDescription>
            Extracted from IMG_4946.MOV · 44 seconds. Compare these views with
            the 3D model.
          </DialogDescription>
        </DialogHeader>
        <div className="reference-layout">
          <div className="frame-view">
            <img
              src={
                import.meta.env.BASE_URL +
                "reference/" +
                sourceFrames[frame].file
              }
              alt={sourceFrames[frame].title}
            />
            <span>{sourceFrames[frame].time}</span>
          </div>
          <div className="frame-options">
            {sourceFrames.map((f, i) => (
              <button
                className={frame === i ? "active" : ""}
                key={f.file}
                onClick={() => setFrame(i)}
              >
                <img
                  src={import.meta.env.BASE_URL + "reference/" + f.file}
                  alt=""
                />
                <span>
                  <strong>{f.title}</strong>
                  <small>{f.time} · Source frame</small>
                </span>
                {frame === i && <Check size={16} />}
              </button>
            ))}
            <div className="reference-note">
              <Box size={19} />
              <p>
                The model is drawn by hand from photos, this video and a
                satellite view. It is not a measured scan.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function HelpDialog({ open, onOpenChange }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="help-dialog">
        <DialogHeader>
          <div className="eyebrow">MAKE YOURSELF AT HOME</div>
          <DialogTitle>A little help getting around.</DialogTitle>
          <DialogDescription>
            Walk Level 1 of the main campus in first person, or look at the
            whole building from above.
          </DialogDescription>
        </DialogHeader>
        <div className="help-controls">
          <p>
            <span>
              <kbd>W A S D</kbd> or <kbd>↑ ↓ ← →</kbd>
            </span>
            <strong>Walk</strong>
          </p>
          <p>
            <kbd>SHIFT</kbd>
            <strong>Walk faster</strong>
          </p>
          <p>
            <span>Mouse / touch drag</span>
            <strong>Look around</strong>
          </p>
          <p>
            <kbd>ESC</kbd>
            <strong>Release mouse</strong>
          </p>
          <p>
            <kbd>M</kbd>
            <strong>Switch overview</strong>
          </p>
        </div>
        <p className="help-note">
          Use the place list or numbered map points to jump to a viewpoint. On a
          phone, drag the scene to look and use the directional buttons to move.
        </p>
        <div className="scope-note">
          <strong>What this map covers</strong>
          <p>
            A first draft of Level 1 of the main campus, blocks A to G, built
            from photos of the floor and a satellite view of the roof. Sizes,
            positions and the upper floors are estimated, and M block and the
            ground-floor labs are not modelled yet. It is not a surveyed map.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
