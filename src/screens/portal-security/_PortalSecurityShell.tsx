/**
 * _PortalSecurityShell.tsx
 *
 * Shared layout for all Portal Security Policy screens.
 * Renders: TopBar → LeftNav → Portal header bar → Portal tabs →
 *          two-column layout (left sub-nav | right content).
 *
 * Not a screen — prefix "_" signals internal use only.
 */

import * as React from "react"
import { ArrowLeft, Settings } from "lucide-react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/screens/navigation"

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SecurityNavId = "password-policy" | "mfa" | "allowed-ips" | "advanced"

interface PortalSecurityShellProps {
  activeNavId: SecurityNavId
  children: React.ReactNode
}

// ─── Sub-nav items ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: SecurityNavId; label: string; screenId: string }[] = [
  { id: "password-policy", label: "Password Policy",            screenId: "portal-password-policy" },
  { id: "mfa",             label: "Multi-factor authentication", screenId: "portal-mfa"             },
  { id: "allowed-ips",     label: "Allowed IPs",                screenId: "portal-allowed-ips"     },
  { id: "advanced",        label: "Advance settings",           screenId: "portal-advanced-settings"},
]

const PORTAL_TABS = [
  "Portal User (0)",
  "Authentication",
  "Email Notification",
  "Page Customization",
  "Security Policies",
]

// ─── Shell ──────────────────────────────────────────────────────────────────────

export function PortalSecurityShell({ activeNavId, children }: PortalSecurityShellProps) {
  const { navigate, goBack, canGoBack } = useNavigation()

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeId="portal" />

        <main className="flex flex-col flex-1 overflow-hidden">

          {/* ── Portal header bar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `var(--cds-space-12) var(--cds-padding-section-h)`,
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cds-gap-default)" }}>
              {/* Back arrow */}
              <button
                type="button"
                onClick={() => canGoBack ? goBack() : undefined}
                aria-label="Back"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--cds-huegrey-text-default)",
                  padding: "var(--cds-space-4)",
                  borderRadius: "var(--cds-radius-s)",
                }}
              >
                <ArrowLeft size={16} />
              </button>

              {/* Portal avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--cds-radius-s)",
                  backgroundColor: "var(--cds-primary-surface-default)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--cds-white)",
                  fontSize: "var(--cds-text-p3)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                TZ
              </div>

              {/* Portal name + URL */}
              <div>
                <div
                  style={{
                    fontSize: "var(--cds-text-p2)",
                    lineHeight: "var(--cds-leading-p2)",
                    fontWeight: 600,
                    color: "var(--cds-huegrey-text-dark)",
                  }}
                >
                  Task Zone | Public
                </div>
                <div
                  style={{
                    fontSize: "var(--cds-text-p3)",
                    lineHeight: "var(--cds-leading-p3)",
                    color: "var(--cds-huegrey-text-default)",
                  }}
                >
                  https://taskzone.zohocreatorportal.in
                </div>
              </div>
            </div>

            {/* Settings button */}
            <Button variant="outline" size="sm" style={{ gap: "var(--cds-gap-tight)" }}>
              <Settings size={14} />
              Settings
            </Button>
          </div>

          {/* ── Portal-level tabs ── */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              padding: `0 var(--cds-padding-section-h)`,
              flexShrink: 0,
            }}
          >
            {PORTAL_TABS.map((tab) => {
              const isActive = tab === "Security Policies"
              return (
                <button
                  key={tab}
                  type="button"
                  style={{
                    padding: `var(--cds-space-12) var(--cds-space-16)`,
                    fontSize: "var(--cds-text-p2)",
                    lineHeight: "var(--cds-leading-p2)",
                    fontWeight: isActive ? 500 : 400,
                    color: isActive
                      ? "var(--cds-primary-text-default)"
                      : "var(--cds-huegrey-text-default)",
                    borderBottom: isActive
                      ? "2px solid var(--cds-primary-border-default)"
                      : "2px solid transparent",
                    background: "none",
                    border: "none",
                    borderBottom: isActive
                      ? "2px solid var(--cds-primary-border-default)"
                      : "2px solid transparent",
                    cursor: "pointer",
                    marginBottom: -1,
                    whiteSpace: "nowrap",
                  } as React.CSSProperties}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* ── Two-column Security Policies layout ── */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

            {/* Left sub-nav */}
            <nav
              style={{
                width: 224,
                flexShrink: 0,
                borderRight: "1px solid var(--border)",
                padding: `var(--cds-space-8) 0`,
                overflowY: "auto",
              }}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = item.id === activeNavId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.screenId)}
                    style={{
                      display: "block",
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        padding: `var(--cds-space-12) var(--cds-space-16)`,
                        paddingLeft: `calc(var(--cds-space-16) - 2px)`,
                        borderLeft: isActive
                          ? "2px solid var(--cds-primary-border-default)"
                          : "2px solid transparent",
                        backgroundColor: isActive
                          ? "var(--cds-primary-surface-subtle)"
                          : "transparent",
                        fontSize: "var(--cds-text-p2)",
                        lineHeight: "var(--cds-leading-p2)",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive
                          ? "var(--cds-primary-text-default)"
                          : "var(--cds-huegrey-text-dark)",
                      }}
                    >
                      {item.label}
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* Right scrollable content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: `var(--cds-padding-section-v) var(--cds-padding-section-h)`,
              }}
            >
              {children}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
