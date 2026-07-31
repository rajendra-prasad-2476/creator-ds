import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputSuffixProps
  extends Omit<React.ComponentProps<"input">, "suffix"> {
  /**
   * Visual validation status.
   * - "error"   → error surface bg + red border on both input and CTA
   * - "success" → success surface bg + green border on both input and CTA
   * Defaults to "default".
   */
  status?: "default" | "error" | "success"
  /** Icon element rendered inside the suffix CTA button (14 × 14 px slot). */
  suffixIcon?: React.ReactNode
  /** Text label rendered inside the suffix CTA button. */
  suffixLabel?: string
  /** Called when the suffix CTA button is clicked. */
  onSuffixClick?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * When true, replaces the suffix CTA with a clear (×) icon button.
   * Set this when the field has a committed value (the "Selected" Figma state).
   */
  showClear?: boolean
  /** Called when the clear (×) button is clicked. */
  onClear?: React.MouseEventHandler<HTMLButtonElement>
}

/**
 * InputSuffix — Molecule.
 *
 * A text field with a trailing interactive element (icon-button, text-button,
 * or clear action). Follows the `Input_Suffixed_Base` Figma spec (node 3007:320).
 *
 * Usage:
 * ```tsx
 * // With suffix CTA
 * <InputSuffix placeholder="Search…" suffixLabel="Go" onSuffixClick={handleSearch} />
 *
 * // With suffix icon + label
 * <InputSuffix suffixIcon={<CopyIcon />} suffixLabel="Copy" onSuffixClick={handleCopy} />
 *
 * // With clear button (field has a value)
 * <InputSuffix value={value} showClear onClear={() => setValue("")} />
 *
 * // Validation states
 * <InputSuffix status="error"   suffixLabel="Retry" />
 * <InputSuffix status="success" showClear onClear={handleClear} />
 * ```
 */
function InputSuffix({
  className,
  type,
  status = "default",
  suffixIcon,
  suffixLabel,
  onSuffixClick,
  showClear = false,
  onClear,
  disabled,
  ...props
}: InputSuffixProps) {
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      data-slot="input-suffix"
      data-status={status}
      className={cn("group/isuf flex h-9 w-full", className)}
    >
      {/* ── Text input (left, left-rounded only) ─────────────────────────── */}
      <input
        type={type}
        disabled={disabled}
        aria-invalid={isError || props["aria-invalid"]}
        className={cn(
          // Layout — fills remaining width; fixed 36 px height
          "flex-1 min-w-0 h-full px-[11px]",
          // Typography — P2 Regular
          "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal",
          // Shape — left-rounded only; 1 px right-overlap so borders merge
          "rounded-l-[var(--cds-radius-r)] rounded-r-none mr-[-1px]",
          "border outline-none transition-[border-color,box-shadow]",
          // Default colours
          "bg-[var(--cds-white)] border-[var(--cds-huegrey-border-fairish)] text-[var(--cds-huegrey-text-dark)]",
          "placeholder:text-[var(--cds-huegrey-text-fairish)]",
          // Container hover → primary border (non-disabled only)
          "group-hover/isuf:enabled:border-[var(--cds-primary-border-default)]",
          // Focus → primary border + blue elevation shadow + bring to front
          "focus:z-[2] focus:border-[var(--cds-primary-border-default)]",
          "focus:[box-shadow:0px_2px_2px_rgba(13,78,242,0.08),0px_1px_1px_rgba(13,78,242,0.05)]",
          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
          "disabled:border-[var(--cds-huegrey-border-fairish)]",
          "disabled:text-[var(--cds-huegrey-text-fairish)]",
          "disabled:placeholder:text-[var(--cds-huegrey-text-fairish)]",
          "disabled:focus:[box-shadow:none]",
          // Error state — overrides default hover too
          isError && [
            "bg-[var(--cds-error-surface-subtle)]",
            "border-[var(--cds-error-border-default)]",
            "group-hover/isuf:enabled:border-[var(--cds-error-border-default)]",
            "focus:border-[var(--cds-error-border-default)] focus:[box-shadow:none]",
          ],
          // Success state
          isSuccess && [
            "bg-[var(--cds-success-surface-subtle)]",
            "border-[var(--cds-success-border-default)]",
            "group-hover/isuf:enabled:border-[var(--cds-success-border-default)]",
            "focus:border-[var(--cds-success-border-default)] focus:[box-shadow:none]",
          ],
        )}
        {...props}
      />

      {/* ── Suffix: clear (×) or action CTA ─────────────────────────────── */}
      {showClear ? (
        /* Clear button — shown when field has a value (Figma "Selected" state) */
        <button
          type="button"
          aria-label="Clear"
          onClick={onClear}
          disabled={disabled}
          className={cn(
            "relative z-[1] flex items-center justify-center px-[11px] h-full shrink-0",
            "rounded-r-[var(--cds-radius-r)] rounded-l-none",
            "border outline-none transition-[border-color,background-color]",
            // Default
            "bg-[var(--cds-white)] border-[var(--cds-huegrey-border-fairish)]",
            // Container hover
            "group-hover/isuf:enabled:border-[var(--cds-primary-border-default)]",
            // Disabled
            "disabled:cursor-not-allowed",
            "disabled:bg-[var(--cds-huegrey-surface-subtle-hover)]",
            "disabled:border-[var(--cds-huegrey-border-fairish)]",
            // Error / Success border overrides
            isError && [
              "bg-[var(--cds-error-surface-subtle)]",
              "border-[var(--cds-error-border-default)]",
              "group-hover/isuf:enabled:border-[var(--cds-error-border-default)]",
            ],
            isSuccess && [
              "bg-[var(--cds-success-surface-subtle)]",
              "border-[var(--cds-success-border-default)]",
              "group-hover/isuf:enabled:border-[var(--cds-success-border-default)]",
            ],
          )}
        >
          {/* × close icon — 14 × 14 px */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className={cn(
              "text-[var(--cds-huegrey-text-default)]",
              disabled && "text-[var(--cds-huegrey-text-fairish)]",
            )}
          >
            <path
              d="M11 3L3 11M3 3l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : (
        /* Action CTA button (icon + optional label text) */
        <button
          type="button"
          onClick={onSuffixClick}
          disabled={disabled}
          className={cn(
            "relative z-[1] flex items-center gap-[var(--cds-gap-tight)] px-3 h-full shrink-0",
            "rounded-r-[var(--cds-radius-r)] rounded-l-none",
            "border outline-none transition-[border-color,background-color,color]",
            // Default — subtle gray bg, muted bold text
            "bg-[var(--cds-huegrey-surface-subtle)] border-[var(--cds-huegrey-border-fairish)]",
            "text-[var(--cds-huegrey-text-bold)]",
            // Container hover → primary border + primary text (on non-error/success)
            !isError &&
              !isSuccess && [
                "group-hover/isuf:enabled:border-[var(--cds-primary-border-default)]",
                "group-hover/isuf:enabled:text-[var(--cds-primary-text-default)]",
              ],
            // CTA self-hover → primary-surface-subtle bg
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
            // Error state — error surface, error border, error text
            isError && [
              "bg-[var(--cds-error-surface-subtle)]",
              "border-[var(--cds-error-border-default)]",
              "text-[var(--cds-error-text-default)]",
              "group-hover/isuf:enabled:border-[var(--cds-error-border-default)]",
              "hover:enabled:bg-[var(--cds-error-surface-subtle)]",
            ],
            // Success state — success surface, success border, success text
            isSuccess && [
              "bg-[var(--cds-success-surface-subtle)]",
              "border-[var(--cds-success-border-default)]",
              "text-[var(--cds-success-text-default)]",
              "group-hover/isuf:enabled:border-[var(--cds-success-border-default)]",
              "hover:enabled:bg-[var(--cds-success-surface-subtle)]",
            ],
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
      )}
    </div>
  )
}

export { InputSuffix }
