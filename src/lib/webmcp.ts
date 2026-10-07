import { PLACES, type PlaceId } from "@/lib/campus"

export function registerNavigateTool(
  goTo: (id: PlaceId) => void,
  pause: () => void,
  signal: AbortSignal
) {
  const mc = (
    document as unknown as {
      modelContext?: { registerTool: (t: unknown, o: unknown) => void }
    }
  ).modelContext
  if (!mc?.registerTool) return
  try {
    mc.registerTool(
      {
        name: "navigate_vit_interior",
        description:
          "Move the visitor to a named viewpoint on Level 1 of the VIT main campus.",
        inputSchema: {
          type: "object",
          properties: {
            place: { type: "string", enum: PLACES.map((p) => p.id) },
          },
          required: ["place"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input: { place: string }) => {
          if (!PLACES.some((p) => p.id === input.place))
            throw new Error("Unknown viewpoint")
          pause()
          goTo(input.place as PlaceId)
          return { place: input.place, mode: "walk" }
        },
      },
      { signal }
    )
  } catch {
    /* Optional browser capability. */
  }
}
