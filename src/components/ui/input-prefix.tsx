import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputPrefixProps
  extends Omit<React.ComponentProps<"input">, "prefix"> {
  /**
   * Visual validation status.
   * - "error"   → error surface bg + red border on both prefix and input
   * - "success" → success surface bg + green border on both prefix and input
   * Defaults to "default".
   */
  status?: "default" | "error" | "success"
  /** Icon element rendered on the left of the prefix CTA text (14 × 14 px slot). */
  prefixIcon?: React.ReactNode
  /** Text label rendered inside the prefix CTA button. */
  prefixLabel?: string
  /** Optional second icon on the right of the prefix text (e.g. a dropdown chevron). */
  prefixTrailingIcon?: React.ReactNode
  /** Called when the prefix CTA button is clicked. */
  onPrefixClick?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * Icon rendered at the trailing (right) edge of the input area.
   * Typical use: a SearchIcon to indicate the field is a search input.
   * Hidden when `showClear` is true.
   */
  trailingIcon?: React.ReactNode
  /** Called when the trailing icon button is clicked. */
  onTrailingClick?: React.MouseEventHandler<HTMLButtonElement>
  /**
   * When true, replaces the trailing icon with a clear (×) button.
   * Set this when the field has a committed value (the "Selected" Figma state).
   */
  showClear?: boolean
  /** Called when the clear (×) button is clicked. */
  onClear?: React.MouseEventHandler<HTMLButtonElement>
}

/**
 * InputPrefix — Molecule.
 *
 * A text field with a leading interactive CTA (icon, text) on the left, and an
 * optional trailing icon / clear button on the right inside the input area.
 * Follows the `Input_Preffixed_Base` Figma spec (node 3037:1040).
 *
 * Usage:
 * ```tsx
 * // With prefix CTA
 * <InputPrefix
 *   prefixIcon={<GlobeIcon />}
 *   prefixLabel="https://"
 *   placeholder="example.com"
 * />
 *
 * // With search trailing icon
 * <InputPrefix
 *   prefixLabel="Search"
 *   trailingIcon={<SearchIcon />}
 *   placeholder="Type to search…"
 * />
 *
 * // With clear button (field has a value)
 * <InputPrefix
 *   prefixLabel="+91"
 *   value={value}
 *   showClear
 *   onClear={() => setValue("")}
 * />
 *
 * // Validation states
 * <InputPrefix status="error"   prefixLabel="$" />
 * <InputPrefix status="success" prefixLabel="$" showClear onClear={handleClear} />
 * ```
 */
function InputPrefix({
  className,
  type,
  status = "default",
  prefixIcon,
  prefixLabel,
  prefixTrailingIcon,
  onPrefixClick,
  trailingIcon,
  onTrailingClick,
  showClear = false,
  onClear,
  disabled,
  ...props
}: InputPrefixProps) {
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      data-slot="input-prefix"
      data-status={status}
      className={cn("group/iprfx flex h-9 w-full", className)}
    >
      {/* ── Prefix CTA button (left, left-rounded) ───────────────────────── */}
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
          // Container hover → primary border + primary text (non-error/success)
          !isError &&
            !isSuccess && [
              "group-hover/iprfx:enabled:border-[var(--cds-primary-border-default)]",
              "group-hover/iprfx:enabled:text-[var(--cds-primary-text-default)]",
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
          // Error state
          isError && [
            "bg-[var(--cds-error-surface-subtle)]",
            "border-[var(--cds-error-border-default)]",
            "text-[var(--cds-error-text-default)]",
            "group-hover/iprfx:enabled:border-[var(--cds-error-border-default)]",
            "hover:enabled:bg-[var(--cds-error-surface-subtle)]",
          ],
          // Success state
          isSuccess && [
            "bg-[var(--cds-success-surface-subtle)]",
            "border-[var(--cds-success-border-default)]",
            "text-[var(--cds-success-text-default)]",
            "group-hover/iprfx:enabled:border-[var(--cds-success-border-default)]",
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

      {/* ── Input field (right, right-rounded) with trailing icon ─────────── */}
      <div className="relative flex-1 h-full">
        <input
          type={type}
          disabled={disabled}
          aria-invalid={isError || props["aria-invalid"]}
          className={cn(
            // Layout — fills wrapper; fixed height; right-side padding for trailing icon
            "w-full h-full",
            "pl-[11px]",
            // Add right padding only when there is a trailing element
            (trailingIcon || showClear) ? "pr-[38px]" : "pr-[11px]",
            // Typography — P2 Regular
            "text-[length:var(--cds-text-p2)] leading-[var(--cds-leading-p2)] font-normal",
            // Shape — right-rounded only
            "rounded-r-[var(--cds-radius-r)] rounded-l-none",
            "border outline-none transition-[border-color,box-shadow]",
            // Default colours
            "bg-[var(--cds-white)] border-[var(--cds-huegrey-border-fairish)] text-[var(--cds-huegrey-text-dark)]",
            "placeholder:text-[var(--cds-huegrey-text-fairish)]",
            // Container hover → primary border (non-disabled)
            "group-hover/iprfx:enabled:border-[var(--cds-primary-border-default)]",
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
            // Error state
            isError && [
              "bg-[var(--cds-error-surface-subtle)]",
              "border-[var(--cds-error-border-default)]",
              "group-hover/iprfx:enabled:border-[var(--cds-error-border-default)]",
              "focus:border-[var(--cds-error-border-default)] focus:[box-shadow:none]",
            ],
            // Success state
            isSuccess && [
              "bg-[var(--cds-success-surface-subtle)]",
              "border-[var(--cds-success-border-default)]",
              "group-hover/iprfx:enabled:border-[var(--cds-success-border-default)]",
              "focus:border-[var(--cds-success-border-default)] focus:[box-shadow:none]",
            ],
          )}
          {...props}
        />

        {/* Trailing right action — clear (×) or passive icon */}
        {showClear ? (
          <button
            type="button"
            aria-label="Clear"
            tabIndex={-1}
            onClick={onClear}
            disabled={disabled}
            className={cn(
              "absolute right-[11px] top-1/2 -translate-y-1/2",
              "flex items-center justify-center size-[14px]",
              "outline-none",
              disabled
                ? "cursor-not-allowed text-[var(--cds-huegrey-text-fairish)]"
                : "cursor-pointer text-[var(--cds-huegrey-text-default)] hover:text-[var(--cds-huegrey-text-dark)]",
              isError && "text-[var(--cds-error-text-default)]",
              isSuccess && "text-[var(--cds-success-text-default)]",
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="size-full"
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
          trailingIcon && (
            <button
              type="button"
              tabIndex={-1}
              onClick={onTrailingClick}
              disabled={disabled}
              aria-label="Search"
              className={cn(
                "absolute right-[11px] top-1/2 -translate-y-1/2",
                "flex items-center justify-center size-[14px]",
                "outline-none [&_svg]:size-full",
                disabled
                  ? "cursor-not-allowed text-[var(--cds-huegrey-text-fairish)]"
                  : "cursor-pointer text-[var(--cds-huegrey-text-default)]",
                !disabled && "group-hover/iprfx:text-[var(--cds-primary-text-default)]",
                isError && "text-[var(--cds-error-text-default)]",
                isSuccess && "text-[var(--cds-success-text-default)]",
              )}
            >
              {trailingIcon}
            </button>
          )
        )}
      </div>
    </div>
  )
}

export { InputPrefix }
