/**
 * PdfExportSettingsScreen
 *
 * Feature: 005 — PDF Export Settings (Watermark Configuration)
 * PRD section: §6 (Functional Requirements)
 *
 * Layout: TopBar + LeftNav shell
 *   ├── Breadcrumb: Operations / PDF Export Settings
 *   ├── Page header + description
 *   ├── Search input
 *   └── Table: Application Name | Status | Watermark Content
 *
 * Business rules:
 *   - Enable → auto-selects Logged-in Email ID (FR-6.3)
 *   - Remove all content → auto-disables (FR-6.6)
 *   - Custom Text → inline Input, max 250 chars (FR-6.5)
 *   - Fixed content order: Custom Text → Username → Email → Timestamp → IP (FR-6.7)
 *
 * DS gaps flagged inline per AGENTS.md rules.
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronDown, Search } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

// ─── Types ────────────────────────────────────────────────────────────────────

/** Fixed system-defined rendering order per FR-6.7 */
type ContentField =
  | "custom-text"
  | "username"
  | "email"
  | "timestamp"
  | "ip"

const CONTENT_FIELDS: { id: ContentField; label: string }[] = [
  { id: "custom-text", label: "Custom Text" },
  { id: "username",    label: "Logged-in Username" },
  { id: "email",       label: "Logged-in Email ID" },
  { id: "timestamp",   label: "Export Timestamp" },
  { id: "ip",          label: "Current IP Address" },
]

interface AppRow {
  id: string
  name: string
  icon: string
  enabled: boolean
  /** Selected content fields — must match ContentField union */
  content: ContentField[]
  /** Custom text value when "custom-text" is selected */
  customText: string
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const INITIAL_APPS: AppRow[] = [
  {
    id: "crm-portal",
    name: "CRM Portal",
    icon: "CP",
    enabled: true,
    content: ["email"],
    customText: "",
  },
  {
    id: "hr-onboarding",
    name: "HR Onboarding",
    icon: "HR",
    enabled: true,
    content: ["custom-text", "email", "timestamp"],
    customText: "CONFIDENTIAL",
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    icon: "ET",
    enabled: false,
    content: ["email"],
    customText: "",
  },
  {
    id: "field-service",
    name: "Field Service App",
    icon: "FS",
    enabled: true,
    content: ["username", "email", "ip"],
    customText: "",
  },
  {
    id: "inventory-mgr",
    name: "Inventory Manager",
    icon: "IM",
    enabled: false,
    content: [],
    customText: "",
  },
  {
    id: "vendor-portal",
    name: "Vendor Portal",
    icon: "VP",
    enabled: true,
    content: ["custom-text", "username"],
    customText: "INTERNAL USE ONLY",
  },
  {
    id: "compliance-hub",
    name: "Compliance Hub",
    icon: "CH",
    enabled: false,
    content: [],
    customText: "",
  },
  {
    id: "project-mgmt",
    name: "Project Management",
    icon: "PM",
    enabled: true,
    content: ["email", "timestamp"],
    customText: "",
  },
]

// ─── App icon avatar ──────────────────────────────────────────────────────────

function AppAvatar({ initials }: { initials: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--cds-radius-s)",
        background: "var(--cds-primary-surface-low)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--cds-primary-text-default)",
        fontSize: "var(--cds-text-p3)",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ─── Watermark content multi-select (Popover + Checkboxes) ───────────────────
// DS gap: no native multi-select component — composed from Popover + Checkbox.
// Replace with MultiSelect DS component when available (parity P1).

function ContentSelector({
  appId,
  enabled,
  content,
  customText,
  onChange,
}: {
  appId: string
  enabled: boolean
  content: ContentField[]
  customText: string
  onChange: (content: ContentField[], customText: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [localText, setLocalText] = React.useState(customText)
  const charLimit = 250

  function handleFieldToggle(fieldId: ContentField, checked: boolean) {
    const next = checked
      ? [...content, fieldId]
      : content.filter((f) => f !== fieldId)
    // Maintain fixed system order
    const ordered = CONTENT_FIELDS.map((f) => f.id).filter((id) =>
      next.includes(id)
    ) as ContentField[]
    onChange(ordered, fieldId === "custom-text" && !checked ? "" : localText)
  }

  function handleTextChange(value: string) {
    if (value.length > charLimit) return
    setLocalText(value)
    onChange(content, value)
  }

  const hasContent = content.length > 0
  const exceedsLimit = localText.length > charLimit

  if (!enabled) {
    return (
      <span
        style={{
          fontSize: "var(--cds-text-p3)",
          color: "var(--cds-huegrey-text-subtle)",
        }}
      >
        —
      </span>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* DS gap: no multi-select trigger chip DS component — raw <button> */}
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--cds-gap-tight)",
            padding: "var(--cds-space-4) var(--cds-space-8)",
            border: "1px solid var(--border)",
            borderRadius: "var(--cds-radius-s)",
            background: "var(--cds-huegrey-surface-base)",
            cursor: "pointer",
            fontSize: "var(--cds-text-p2)",
            color: "var(--cds-huegrey-text-default)",
            minWidth: 160,
            maxWidth: 320,
          }}
        >
          <span
            style={{
              flex: 1,
              textAlign: "left",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: hasContent
                ? "var(--cds-huegrey-text-dark)"
                : "var(--cds-huegrey-text-subtle)",
            }}
          >
            {hasContent
              ? CONTENT_FIELDS.filter((f) => content.includes(f.id))
                  .map((f) => f.label)
                  .join(", ")
              : "Select content…"}
          </span>
          {hasContent && (
            <Badge
              variant="secondary"
              style={{
                fontSize: 11,
                padding: "0 var(--cds-space-6)",
                flexShrink: 0,
              }}
            >
              {content.length}
            </Badge>
          )}
          <ChevronDown
            size={14}
            color="var(--cds-huegrey-text-subtle)"
            style={{ flexShrink: 0 }}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        style={{ width: 300, padding: "var(--cds-space-4) 0" }}
      >
        <div
          style={{
            padding: "var(--cds-space-8) var(--cds-space-12)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontSize: "var(--cds-text-p3)",
              fontWeight: 600,
              color: "var(--cds-huegrey-text-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Watermark Content
          </span>
        </div>

        <div style={{ padding: "var(--cds-space-4) 0" }}>
          {CONTENT_FIELDS.map((field) => {
            const checked = content.includes(field.id)
            return (
              <div key={field.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--cds-gap-small)",
                    padding: "var(--cds-space-8) var(--cds-space-12)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFieldToggle(field.id, !checked)}
                >
                  <Checkbox
                    id={`${appId}-${field.id}`}
                    checked={checked}
                    onCheckedChange={(val) =>
                      handleFieldToggle(field.id, !!val)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={`${appId}-${field.id}`}
                    style={{
                      fontSize: "var(--cds-text-p2)",
                      color: "var(--cds-huegrey-text-dark)",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {field.label}
                  </Label>
                </div>

                {/* Custom text input — only when Custom Text is checked */}
                {field.id === "custom-text" && checked && (
                  <div
                    style={{
                      padding:
                        "var(--cds-space-4) var(--cds-space-12) var(--cds-space-8) 40px",
                    }}
                  >
                    <Input
                      placeholder="e.g. CONFIDENTIAL"
                      value={localText}
                      onChange={(e) => handleTextChange(e.target.value)}
                      maxLength={charLimit}
                      style={{
                        fontSize: "var(--cds-text-p2)",
                        borderColor: exceedsLimit
                          ? "var(--cds-danger-border-default)"
                          : undefined,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "var(--cds-space-4)",
                      }}
                    >
                      {exceedsLimit ? (
                        <span
                          style={{
                            fontSize: "var(--cds-text-p3)",
                            color: "var(--cds-danger-text-default)",
                          }}
                        >
                          Max 250 characters
                        </span>
                      ) : (
                        <span />
                      )}
                      <span
                        style={{
                          fontSize: "var(--cds-text-p3)",
                          color:
                            exceedsLimit
                              ? "var(--cds-danger-text-default)"
                              : "var(--cds-huegrey-text-subtle)",
                          marginLeft: "auto",
                        }}
                      >
                        {localText.length}/{charLimit}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PdfExportSettingsScreen() {
  const [apps, setApps] = React.useState<AppRow[]>(INITIAL_APPS)
  const [search, setSearch] = React.useState("")

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleToggle(appId: string, value: boolean) {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app
        if (value) {
          // FR-6.3: auto-select Logged-in Email ID on enable
          const hasContent = app.content.length > 0
          return {
            ...app,
            enabled: true,
            content: hasContent ? app.content : ["email"],
          }
        }
        return { ...app, enabled: false }
      })
    )
  }

  function handleContentChange(
    appId: string,
    content: ContentField[],
    customText: string
  ) {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app
        // FR-6.6: auto-disable when last content removed
        const nextEnabled = content.length > 0 ? app.enabled : false
        return { ...app, content, customText, enabled: nextEnabled }
      })
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeId="operations" />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)",
          }}
        >
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: "var(--cds-space-24)" }}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  style={{
                    fontSize: "var(--cds-text-p3)",
                    color: "var(--cds-huegrey-text-subtle)",
                  }}
                >
                  Operations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  style={{
                    fontSize: "var(--cds-text-p3)",
                    color: "var(--cds-huegrey-text-default)",
                  }}
                >
                  PDF Export Settings
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page header */}
          <PageHeader
            title="PDF Export Settings"
            description="Protect exported PDFs by embedding watermark information automatically. Enable watermarking per application and configure the content — such as user identity, timestamp, or custom text — that appears on every exported document."
          />

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--cds-gap-default)",
              marginBottom: "var(--cds-space-20)",
            }}
          >
            {/* DS gap: InputPrefix not used here — using raw positioned icon;
                replace with InputPrefix + prefixIcon when parity addressed */}
            <div style={{ position: "relative", width: 280 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--cds-huegrey-text-subtle)",
                  pointerEvents: "none",
                }}
              />
              <Input
                placeholder="Search applications…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  paddingLeft: 30,
                  fontSize: "var(--cds-text-p2)",
                }}
              />
            </div>

            <span
              style={{
                marginLeft: "auto",
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-huegrey-text-subtle)",
              }}
            >
              {filtered.length} application{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Applications table */}
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--cds-radius-r)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "35%" }}>
                    Application Name
                  </TableHead>
                  <TableHead style={{ width: "15%" }}>Status</TableHead>
                  <TableHead>Watermark Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        padding: "var(--cds-space-48)",
                        color: "var(--cds-huegrey-text-subtle)",
                        fontSize: "var(--cds-text-p2)",
                      }}
                    >
                      {/* DS gap: EmptyState component not available — raw cell */}
                      No applications match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app) => (
                    <TableRow key={app.id}>
                      {/* Application Name */}
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--cds-gap-default)",
                          }}
                        >
                          <AppAvatar initials={app.icon} />
                          <span
                            style={{
                              fontSize: "var(--cds-text-p2)",
                              fontWeight: 500,
                              color: "var(--cds-huegrey-text-dark)",
                            }}
                          >
                            {app.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status toggle */}
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--cds-gap-small)",
                          }}
                        >
                          <Switch
                            checked={app.enabled}
                            onCheckedChange={(val) =>
                              handleToggle(app.id, val)
                            }
                          />
                          <span
                            style={{
                              fontSize: "var(--cds-text-p3)",
                              color: app.enabled
                                ? "var(--cds-success-text-default)"
                                : "var(--cds-huegrey-text-subtle)",
                            }}
                          >
                            {app.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Watermark Content */}
                      <TableCell>
                        <ContentSelector
                          appId={app.id}
                          enabled={app.enabled}
                          content={app.content}
                          customText={app.customText}
                          onChange={(content, customText) =>
                            handleContentChange(app.id, content, customText)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Info note */}
          <div
            style={{
              marginTop: "var(--cds-space-16)",
              padding: "var(--cds-space-12) var(--cds-space-16)",
              background: "var(--cds-huegrey-surface-low)",
              borderRadius: "var(--cds-radius-s)",
              fontSize: "var(--cds-text-p3)",
              lineHeight: "var(--cds-leading-p3)",
              color: "var(--cds-huegrey-text-default)",
            }}
          >
            {/* DS gap: Notes/InlineAlert component not available — raw div */}
            Watermarks are applied automatically to exported PDFs for
            applications with watermarking enabled. Dynamic values (username,
            email, timestamp, IP address) are resolved at export time. Changes
            take effect on the next PDF export.
          </div>
        </main>
      </div>
    </div>
  )
}
