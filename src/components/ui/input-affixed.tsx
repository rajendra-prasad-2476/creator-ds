import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputAffixedProps
  extends Omit<React.ComponentProps<"input">, "prefix"> {
  /**
   * Visual validation status. Affects ONLY the left prefix CTA and the input
   * field — the right suffix CTA always keeps its default grey style.
   * - "error"   → error surface bg + red border on prefix + input
   * - "success" → success surface bg + green border on prefix + input
   * Defaults to "default".
   */
  status?: "default" | "error" | "success"

  // ── Left prefix CTA ────────────────────────────────────────────────────────
  /** Icon element rendered on the left of the prefix label (14 × 14 px slot). */
  prefixIcon?: React.ReactNode
  /** Text label in the prefix CTA. */
  prefixLabel?: string
  /** Optional second icon on the right of the prefix text (e.g. a dropdown chevron). */
  prefixTrailingIcon?: React.ReactNode
  /** Called when the prefix CTA button is clicked. */
  onPrefixClick?: React.MouseEventHandler<HTMLButtonElement>

  // ── Right suffix CTA ───────────────────────────────────────────────────────
  /** Icon element rendered on the left of the suffix label (14 × 14 px slot). */
  suffixIcon?: React.ReactNode
  /** Text label in the suffix CTA. */
  suffixLabel?: string
  /** Called when the suffix CTA button is clicked. */
  onSuffixClick?: React.MouseEventHandler<HTMLButtonElement>
}

/**
 * InputAffixed — Molecule.
 *
 * A text field with **both** a leading prefix CTA (left) and a trailing suffix
 * CTA (right). Use when both sides need interactive context elements
 * (e.g. currency symbol on the left + unit selector on the right).
 *
 * Use `InputPrefix` or `InputSuffix` when only one side is needed.
 *
 * Follows the `Input_Preffixed_Base` affixed Figma spec (node 3079:8161).
 *
 * Key behaviour: `status` (error / success) is applied to the **prefix CTA +
 * input field only**. The right suffix CTA always renders in its default grey
 * style — it is an independent action that does not reflect validation state.
 *
 * Usage:
 * ```tsx
 * <InputAffixed
 *   prefixIcon={<DollarSignIcon />}
 *   prefixLabel="USD"
 *   placeholder="0.00"
 *   suffixLabel=".00"
 *   onSuffixClick={() => {}}
 * />
 *
 * // Validation
 * <InputAffixed status="error" prefixLabel="$" suffixLabel="Add" />
 * ```
 */
function InputAffixed({
  className,
  type,
  status = "default",
  prefixIcon,
  prefixLabel,
  prefixTrailingIcon,
  onPrefixClick,
  suffixIcon,
  suffixLabel,
  onSuffixClick,
  disabled,
  ...props
}: InputAffixedProps) {
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      data-slot="input-affixed"
      data-status={status}
      className={cn("group/iaffx flex h-9 w-full", className)}
    >
      {/* ── Left prefix CTA (left-rounded only) ──────────────────────────── */}
      <button
        type="button"
        onClick={onPrefixClick}
        disabled={disabled}
        className={cn(
          "relative z-[1] flex items-center gap-[var(--cds-gap-tight)] px-3 h-full shrink-0",
          "rounded-l-[var(--cds-radius-r)] rounded-r-none",
          // Extend 1px right to overlap the input's left border (seamless join)
          "mr-[-1px]",
          "border outline-none transition-[border-color,background-color,color]",
          // Default — subtle gray bg, bold text
          "bg-[var(--cds-huegrey-surface-subtle)] border-[var(--cds-huegrey-border-fairish)]",
          "text-[var(--cds-huegrey-text-bold)]",
          // Container hover → primary border + primary text (default state only)
          !isError &&
            !isSuccess && [
              "group-hover/iaffx:enabled:border-[var(--cds-primary-border-default)]",
              "group-hover/iaffx:enabled:text-[var(--cds-primary-text-default)]",
            ],
          // Prefix self-hover → primary-surface-subtle bg
          !isError &&
            !isSuccess && [
              "hover:enabled:bg-[var(--cds-primary-surface-subtle)]",
              "hover:enabled:border-[var(--cds-primary-border-default)]",
              "hover:enabled:text-[var(--cds-primary-text-default)]",
            ],
          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
          "disabled:border-[var(--cds-huegrey-border-fairish)]",
          "disabled:text-[var(--cds-huegrey-text-fairish)]",
          // Error state — affects prefix only
          isError && [
            "bg-[var(--cds-error-surface-subtle)]",
            "border-[var(--cds-error-border-default)]",
            "text-[var(--cds-error-text-default)]",
            "group-hover/iaffx:enabled:border-[var(--cds-error-border-default)]",
            "hover:enabled:bg-[var(--cds-error-surface-subtle)]",
          ],
          // Success state — affects prefix only
          isSuccess && [
            "bg-[var(--cds-success-surface-subtle)]",
            "border-[var(--cds-success-border-default)]",
            "text-[var(--cds-success-text-default)]",
            "group-hover/iaffx:enabled:border-[var(--cds-success-border-default)]",
            "hover:enabled:bg-[var(--cds-success-surface-subtle)]",
          ],
        )}
      >
        {prefixIcon && (
          <span
            aria-hidden="true"
            className="shrink-0 size-[14px] flex items-center justify-center [&_svg]:size-full"
          >
            {prefixIcon}
          </span>
        )}
        {prefixLabel && (
          <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal whitespace-nowrap">
            {prefixLabel}
          </span>
        )}
        {prefixTrailingIcon && (
          <span
            aria-hidden="true"
            className="shrink-0 size-[14px] flex items-center justify-center [&_svg]:size-full"
          >
            {prefixTrailingIcon}
          </span>
        )}
      </button>

      {/* ── Input field (no radius — both ends share CTA borders) ─────────── */}
      <input
        type={type}
        disabled={disabled}
        aria-invalid={isError || props["aria-invalid"]}
        className={cn(
          // Layout — fills remaining width; 1px right-overlap for suffix border join
          "flex-1 min-w-0 h-full px-[11px] mr-[-1px]",
          // Typography — P2 Regular
          "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal",
          // No radius — both ends are shared with CTAs
          "rounded-none border outline-none transition-[border-color,box-shadow]",
          // Default colours
          "bg-[var(--cds-white)] border-[var(--cds-huegrey-border-fairish)] text-[var(--cds-huegrey-text-dark)]",
          "placeholder:text-[var(--cds-huegrey-text-fairish)]",
          // Container hover → primary border (non-disabled)
          "group-hover/iaffx:enabled:border-[var(--cds-primary-border-default)]",
          // Focus → primary border + elevation shadow + bring to front
          "focus:z-[2] focus:border-[var(--cds-primary-border-default)]",
          "focus:[box-shadow:0px_2px_2px_rgba(13,78,242,0.08),0px_1px_1px_rgba(13,78,242,0.05)]",
          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
          "disabled:border-[var(--cds-huegrey-border-fairish)]",
          "disabled:text-[var(--cds-huegrey-text-fairish)]",
          "disabled:placeholder:text-[var(--cds-huegrey-text-fairish)]",
          "disabled:focus:[box-shadow:none]",
          // Error state
          isError && [
            "bg-[var(--cds-error-surface-subtle)]",
            "border-[var(--cds-error-border-default)]",
            "group-hover/iaffx:enabled:border-[var(--cds-error-border-default)]",
            "focus:border-[var(--cds-error-border-default)] focus:[box-shadow:none]",
          ],
          // Success state
          isSuccess && [
            "bg-[var(--cds-success-surface-subtle)]",
            "border-[var(--cds-success-border-default)]",
            "group-hover/iaffx:enabled:border-[var(--cds-success-border-default)]",
            "focus:border-[var(--cds-success-border-default)] focus:[box-shadow:none]",
          ],
        )}
        {...props}
      />

      {/* ── Right suffix CTA (right-rounded only, always default style) ───── */}
      <button
        type="button"
        onClick={onSuffixClick}
        disabled={disabled}
        className={cn(
          "relative z-[1] flex items-center gap-[var(--cds-gap-tight)] px-3 h-full shrink-0",
          "rounded-r-[var(--cds-radius-r)] rounded-l-none",
          "border outline-none transition-[border-color,background-color,color]",
          // Right CTA always stays in default grey style — never adopts error/success colours.
          // Only hover interactions apply.
          "bg-[var(--cds-huegrey-surface-subtle)] border-[var(--cds-huegrey-border-fairish)]",
          "text-[var(--cds-huegrey-text-bold)]",
          // Container hover → primary border + primary text (always, ignores status)
          "group-hover/iaffx:enabled:border-[var(--cds-primary-border-default)]",
          "group-hover/iaffx:enabled:text-[var(--cds-primary-text-default)]",
          // Suffix self-hover → primary-surface-subtle bg
          "hover:enabled:bg-[var(--cds-primary-surface-subtle)]",
          "hover:enabled:border-[var(--cds-primary-border-default)]",
          "hover:enabled:text-[var(--cds-primary-text-default)]",
          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
          "disabled:border-[var(--cds-huegrey-border-fairish)]",
          "disabled:text-[var(--cds-huegrey-text-fairish)]",
        )}
      >
        {suffixIcon && (
          <span
            aria-hidden="true"
            className="shrink-0 size-[14px] flex items-center justify-center [&_svg]:size-full"
          >
            {suffixIcon}
          </span>
        )}
        {suffixLabel && (
          <span className="text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal whitespace-nowrap">
            {suffixLabel}
          </span>
        )}
      </button>
    </div>
  )
}

export { InputAffixed }
