import { cn } from "@/lib/utils"

/**
 * All 22 illustration types from the Creator DS Product_Illustrations set.
 * Each maps to a file in public/illustrations/{type}-{state}.svg
 */
export type ProductIllustrationType =
  | "create-report"
  | "create-form"
  | "create-page"
  | "create-workflow"
  | "page-blank"
  | "page-template"
  | "report-list"
  | "report-kanban"
  | "report-pivot-chart"
  | "report-pivot-table"
  | "report-sheet"
  | "report-calendar"
  | "report-timeline"
  | "report-map"
  | "workflow-form-event"
  | "workflow-schedule"
  | "workflow-function"
  | "workflow-batch-record"
  | "workflow-approval"
  | "workflow-payment"
  | "workflow-business-process"
  | "workflow-payment-checkout"

export type ProductIllustrationState = "Default" | "Active"

export interface ProductIllustrationProps {
  /** Which scenario illustration to show */
  type: ProductIllustrationType
  /** Default (gray resting) or Active (blue highlighted). Defaults to "Default". */
  state?: ProductIllustrationState
  /** Extra classes — use to set width/height when displaying at a custom scale */
  className?: string
  /** Alt text override. Defaults to a humanised version of `type`. */
  alt?: string
}

/**
 * Atom — Creator DS product illustration set.
 *
 * Use the `type` prop to select the scenario (create-report, report-list, etc.)
 * and `state` for Default (resting) vs Active (highlighted/selected).
 *
 * Renders at the SVG's native size by default (~135×124 px for create/report
 * types, ~135×108 px for workflow types). Pass a `className` to override dimensions.
 *
 * @example
 * ```tsx
 * // Empty state — large centred illustration
 * <ProductIllustration type="create-report" className="w-[180px] h-auto mx-auto" />
 *
 * // Selection tile — active state
 * <ProductIllustration type="page-blank" state="Active" />
 * ```
 */
export function ProductIllustration({
  type,
  state = "Default",
  className,
  alt,
}: ProductIllustrationProps) {
  const suffix = state === "Active" ? "active" : "default"
  const src = `/illustrations/${type}-${suffix}.svg`
  const defaultAlt = type.replace(/-/g, " ")

  return (
    <img
      src={src}
      alt={alt ?? defaultAlt}
      className={cn("block shrink-0", className)}
      draggable={false}
    />
  )
}

export default ProductIllustration
