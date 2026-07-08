import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Blanket / overlay backdrop.
 *
 * The scrim rendered behind Slider panels, Sheets, Dialogs and other overlay
 * components. Sits at body-row level, below the panel in z-order. Backed by the
 * `--cds-blanket-overlay` token (primary-surface-bold-alpha10) — never hardcode
 * a custom rectangle for overlay backdrops.
 */
function Blanket({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="blanket"
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-40 bg-[var(--cds-blanket-overlay)] transition-opacity duration-150",
        className
      )}
      {...props}
    />
  )
}

export { Blanket }
