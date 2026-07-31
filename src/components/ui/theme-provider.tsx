import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThemeTokens {
  /**
   * Main brand color — applied to buttons, active indicators, links, focus rings.
   * Maps to: --cds-primary-surface-default, --cds-primary-text-default,
   *          --cds-primary-border-default
   * @example "#E63946"
   */
  primaryColor?: string

  /**
   * Dark variant of the brand color — used for the TopBar background and deep
   * text. Defaults to a very dark tint of primaryColor if not set.
   * Maps to: --cds-primary-surface-bold, --cds-primary-text-dark
   * @example "#7A0010"
   */
  primaryColorBold?: string

  /**
   * Light tint of the brand color — used for the LeftNav background, card
   * hover surfaces, and subtle fills.
   * Maps to: --cds-primary-surface-subtle, --cds-primary-surface-subtle-hover
   * @example "#FFF0F1"
   */
  primaryColorSubtle?: string

  /**
   * Font family for all text. Must be loaded separately via @font-face or
   * a Google Fonts / CDN <link>.
   * Maps to: --default-font-family (Tailwind) and CSS font-family on the wrapper.
   * @example "'Inter', sans-serif"
   */
  font?: string

  /**
   * Escape hatch — pass any --cds-* token key/value pairs to override.
   * Keys must be valid CSS custom property names (start with --).
   * @example { "--cds-radius-r": "2px", "--cds-space-16": "14px" }
   */
  tokens?: Record<string, string>
}

export interface ThemeProviderProps extends ThemeTokens {
  children: React.ReactNode
  /**
   * Light / dark mode. Applies or removes the `dark` class on the wrapper.
   * Requires dark-mode token values to be defined in your CSS under `.dark { }`.
   * @default "light"
   */
  mode?: "light" | "dark"
  /** Extra class names applied to the wrapper element. */
  className?: string
}

// ─── ThemeProvider ─────────────────────────────────────────────────────────────

/**
 * Organism — Creator DS theme provider.
 *
 * Wraps your app (or a sub-tree) and injects brand token overrides as CSS
 * custom properties scoped to the wrapper element. All DS components inside
 * the wrapper automatically pick up the overrides — no component changes needed.
 *
 * ## Minimal usage (brand color only)
 * ```tsx
 * <ThemeProvider primaryColor="#E63946">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * ## Full branding
 * ```tsx
 * <ThemeProvider
 *   primaryColor="#E63946"
 *   primaryColorBold="#7A0010"
 *   primaryColorSubtle="#FFF5F5"
 *   font="'Inter', sans-serif"
 *   mode="light"
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * ## Fine-grained token overrides
 * ```tsx
 * <ThemeProvider
 *   primaryColor="#E63946"
 *   tokens={{
 *     "--cds-radius-r": "2px",
 *     "--cds-space-16": "14px",
 *   }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  primaryColor,
  primaryColorBold,
  primaryColorSubtle,
  font,
  tokens,
  mode = "light",
  className,
}: ThemeProviderProps) {
  // Build the CSS custom property map from structured props
  const cssVars: Record<string, string> = {}

  if (primaryColor) {
    cssVars["--cds-primary-surface-default"]       = primaryColor
    cssVars["--cds-primary-surface-default-hover"] = primaryColor  // product can refine via tokens
    cssVars["--cds-primary-text-default"]          = primaryColor
    cssVars["--cds-primary-border-default"]        = primaryColor
  }

  if (primaryColorBold) {
    cssVars["--cds-primary-surface-bold"]       = primaryColorBold
    cssVars["--cds-primary-surface-bold-hover"] = primaryColorBold
    cssVars["--cds-primary-text-dark"]          = primaryColorBold
    cssVars["--cds-primary-text-bold"]          = primaryColorBold
  }

  if (primaryColorSubtle) {
    cssVars["--cds-primary-surface-subtle"]       = primaryColorSubtle
    cssVars["--cds-primary-surface-subtle-hover"] = primaryColorSubtle
  }

  if (font) {
    cssVars["--default-font-family"] = font
  }

  // Merge in any fine-grained token overrides
  if (tokens) {
    Object.assign(cssVars, tokens)
  }

  return (
    <div
      data-slot="theme-provider"
      className={cn(mode === "dark" && "dark", className)}
      style={cssVars as React.CSSProperties}
    >
      {children}
    </div>
  )
}
