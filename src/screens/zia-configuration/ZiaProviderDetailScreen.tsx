/**
 * ZiaProviderDetailScreen
 *
 * Feature: 001 — Zia Configuration Enhancements
 * PRD section: FR-3.2, FR-3.3, FR-3.4, FR-3.5
 *
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Breadcrumb: Operations / Zia / [Provider]
 *   ├── Page header — provider name + type badge
 *   └── Tabs
 *       ├── Configuration — API keys table (add / edit / delete)
 *       └── Usage — redirect links to vendor dashboards
 *
 * Rules enforced:
 *   - Max 5 keys per provider (FR-3.3.4)
 *   - Delete shows generic warning before confirming (FR-3.3.3)
 *   - Key values masked after creation (Security NFR)
 *   - Edit replaces key value in-place (FR-3.3.2)
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiKey {
  id: string
  serviceKeyName: string
  /** Always masked — never the real value (Security NFR) */
  maskedValue: string
  activeFeatures: number
}

interface ProviderConfig {
  id: string
  name: string
  type: "Native" | "BYOK"
  /** Redirect URL for the Usage tab */
  usageDashboardUrl: string
  usageDashboardLabel: string
}

// ─── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_PROVIDER: ProviderConfig = {
  id: "openai",
  name: "OpenAI",
  type: "BYOK",
  usageDashboardUrl: "https://platform.openai.com/usage",
  usageDashboardLabel: "OpenAI Platform",
}

const INITIAL_KEYS: ApiKey[] = [
  {
    id: "key-1",
    serviceKeyName: "Production Key",
    maskedValue: "sk-••••••••••••••••••••••••XYZ9",
    activeFeatures: 3,
  },
  {
    id: "key-2",
    serviceKeyName: "Development Key",
    maskedValue: "sk-••••••••••••••••••••••••ABC1",
    activeFeatures: 1,
  },
]

const PROVIDERS_MAP: Record<string, ProviderConfig> = {
  zoho: {
    id: "zoho",
    name: "Zoho",
    type: "Native",
    usageDashboardUrl: "https://www.zoho.com/ai",
    usageDashboardLabel: "Zoho AI",
  },
  openai: DEMO_PROVIDER,
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    type: "BYOK",
    usageDashboardUrl: "https://console.anthropic.com",
    usageDashboardLabel: "Anthropic Console",
  },
  google: {
    id: "google",
    name: "Google",
    type: "BYOK",
    usageDashboardUrl: "https://aistudio.google.com",
    usageDashboardLabel: "Google AI Studio",
  },
}

const MAX_KEYS = 5

// ─── Add / Edit Key Dialog ────────────────────────────────────────────────────

function KeyDialog({
  open,
  mode,
  initialName,
  onClose,
  onSave,
}: {
  open: boolean
  mode: "add" | "edit"
  initialName?: string
  onClose: () => void
  onSave: (serviceKeyName: string, apiKeyValue: string) => void
}) {
  const [serviceKeyName, setServiceKeyName] = React.useState(initialName ?? "")
  const [apiKeyValue, setApiKeyValue] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setServiceKeyName(initialName ?? "")
      setApiKeyValue("")
    }
  }, [open, initialName])

  function handleSave() {
    if (!serviceKeyName.trim() || !apiKeyValue.trim()) return
    onSave(serviceKeyName.trim(), apiKeyValue.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent style={{ maxWidth: 480 }}>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add API Key" : "Edit API Key"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new API key. The key will be validated by the AI Gateway before being saved."
              : "Replace the stored key value. Features mapped to this service key name will automatically use the new key."}
          </DialogDescription>
        </DialogHeader>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--cds-gap-default)",
            padding: "var(--cds-space-4) 0",
          }}
        >
          {/* Service key name (edit: read-only, name doesn't change — FR-3.3.2) */}
          <div>
            <Label
              style={{
                display: "block",
                marginBottom: "var(--cds-space-4)",
                fontSize: "var(--cds-text-p2)",
              }}
            >
              Service key name
            </Label>
            <Input
              placeholder="e.g. Production Key"
              value={serviceKeyName}
              readOnly={mode === "edit"}
              onChange={(e) => setServiceKeyName(e.target.value)}
              style={
                mode === "edit"
                  ? { background: "var(--cds-surface-default, #F5F5F5)" }
                  : {}
              }
            />
            {mode === "edit" && (
              <p
                style={{
                  fontSize: "var(--cds-text-p3)",
                  color: "var(--cds-huegrey-text-default)",
                  margin: "var(--cds-space-4) 0 0",
                }}
              >
                Service key name cannot be changed after creation.
              </p>
            )}
          </div>

          {/* API key value */}
          <div>
            <Label
              style={{
                display: "block",
                marginBottom: "var(--cds-space-4)",
                fontSize: "var(--cds-text-p2)",
              }}
            >
              API key value
            </Label>
            <Input
              type="password"
              placeholder={mode === "edit" ? "Enter new key value" : "sk-…"}
              value={apiKeyValue}
              onChange={(e) => setApiKeyValue(e.target.value)}
            />
            <p
              style={{
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-huegrey-text-default)",
                margin: "var(--cds-space-4) 0 0",
              }}
            >
              The key will be validated by the AI Gateway. It will be masked
              after saving.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!serviceKeyName.trim() || !apiKeyValue.trim()}
          >
            {mode === "add" ? "Add Key" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Delete Key Confirmation ──────────────────────────────────────────────────

function DeleteKeyDialog({
  open,
  keyName,
  onCancel,
  onConfirm,
}: {
  open: boolean
  keyName: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>          <AlertDialogIcon variant="alert" />          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete <strong>{keyName}</strong>.
            <br />
            <br />
            Features mapped to this key may be remapped to Zoho GenAI (if
            supported) or automatically turned OFF. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Delete Key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Usage Tab ────────────────────────────────────────────────────────────────

const USAGE_LINKS: Record<string, { label: string; url: string; description: string }[]> = {
  openai: [
    {
      label: "OpenAI Platform",
      url: "https://platform.openai.com/usage",
      description: "View token usage, costs, and request logs for your OpenAI account.",
    },
  ],
  anthropic: [
    {
      label: "Anthropic Console",
      url: "https://console.anthropic.com",
      description: "View usage and billing for your Anthropic account.",
    },
  ],
  google: [
    {
      label: "Google AI Studio",
      url: "https://aistudio.google.com",
      description: "View usage and quotas for your Google AI account.",
    },
    {
      label: "Google Cloud Console",
      url: "https://console.cloud.google.com",
      description: "Manage billing and API quotas in Google Cloud.",
    },
  ],
}

function UsageTab({ providerId }: { providerId: string }) {
  const links = USAGE_LINKS[providerId] ?? []

  return (
    <div style={{ maxWidth: 600 }}>
      {/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--cds-gap-small)",
          padding: "var(--cds-padding-card)",
          borderRadius: "var(--cds-radius-r)",
          border: "1px solid var(--cds-primary-border-default, #0D4EF2)",
          background: "var(--cds-primary-surface-subtle, #EEF2FE)",
          marginBottom: "var(--cds-space-24)",
          fontSize: "var(--cds-text-p2)",
          color: "var(--cds-huegrey-text-dark)",
        }}
      >
        <span>ℹ️</span>
        <span>
          Usage tracking is managed by the provider's own dashboard. Follow
          the links below to view token consumption, costs, and request logs.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--cds-gap-default)",
        }}
      >
        {links.map((link) => (
          <div
            key={link.url}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--cds-padding-card)",
              borderRadius: "var(--cds-radius-r)",
              border: "1px solid var(--border)",
              background: "var(--cds-white)",
              gap: "var(--cds-gap-default)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "var(--cds-text-p2)",
                  fontWeight: 600,
                  color: "var(--cds-huegrey-text-dark)",
                  marginBottom: "var(--cds-space-4)",
                }}
              >
                {link.label}
              </div>
              <div
                style={{
                  fontSize: "var(--cds-text-p3)",
                  color: "var(--cds-huegrey-text-default)",
                }}
              >
                {link.description}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(link.url, "_blank", "noopener")}
              style={{ flexShrink: 0 }}
            >
              Visit →
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ZiaProviderDetailScreen({
  provider: providerProp,
  providerId,
}: {
  provider?: ProviderConfig
  providerId?: string
}) {
  const resolvedProvider =
    providerProp ??
    (providerId ? PROVIDERS_MAP[providerId] : undefined) ??
    DEMO_PROVIDER
  const provider = resolvedProvider
  const { goBack, canGoBack } = useNavigation()
  const [keys, setKeys] = React.useState<ApiKey[]>(INITIAL_KEYS)
  const [addOpen, setAddOpen] = React.useState(false)
  const [editKey, setEditKey] = React.useState<ApiKey | null>(null)
  const [deleteKey, setDeleteKey] = React.useState<ApiKey | null>(null)

  const atLimit = keys.length >= MAX_KEYS

  function handleAdd(serviceKeyName: string, _apiKeyValue: string) {
    // In production: call AI Gateway to validate, then save
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      serviceKeyName,
      maskedValue: "sk-••••••••••••••••••••••••NEW",
      activeFeatures: 0,
    }
    setKeys((prev) => [...prev, newKey])
    setAddOpen(false)
  }

  function handleEdit(serviceKeyName: string, _apiKeyValue: string) {
    // FR-3.3.2: Replace key value in-place — name stays the same
    setKeys((prev) =>
      prev.map((k) =>
        k.serviceKeyName === serviceKeyName
          ? { ...k, maskedValue: "sk-••••••••••••••••••••••••UPD" }
          : k
      )
    )
    setEditKey(null)
  }

  function handleDelete() {
    if (!deleteKey) return
    setKeys((prev) => prev.filter((k) => k.id !== deleteKey.id))
    setDeleteKey(null)
    // FR-5.1.1: remap logic runs server-side after deletion
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeId="operations" />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding:
              "var(--cds-padding-section-v) var(--cds-padding-section-h)",
          }}
        >
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: "var(--cds-space-16)" }}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Operations</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {canGoBack ? (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); goBack() }}
                  >
                    Zia
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href="#">Zia</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{provider.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--cds-gap-small)",
              marginBottom: "var(--cds-space-24)",
            }}
          >
            <h1
              style={{
                fontSize: "var(--cds-text-h2)",
                lineHeight: "var(--cds-leading-h2)",
                fontWeight: 600,
                color: "var(--cds-huegrey-text-dark)",
                margin: 0,
              }}
            >
              {provider.name}
            </h1>
            <Badge
              variant="subtle"
              style={{ borderRadius: "var(--cds-radius-full)" }}
            >
              {provider.type}
            </Badge>
          </div>

          {/* Tabs — Configuration | Usage */}
          <Tabs defaultValue="configuration">
            <TabsList
              style={{
                borderBottom: "1px solid var(--border)",
                background: "transparent",
                padding: 0,
                marginBottom: "var(--cds-space-24)",
              }}
            >
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            {/* ── Configuration tab ── */}
            <TabsContent value="configuration">
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "var(--cds-space-16)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "var(--cds-text-p2)",
                      color: "var(--cds-huegrey-text-default)",
                    }}
                  >
                    {keys.length} of {MAX_KEYS} keys configured
                  </span>
                </div>
                <Button
                  size="sm"
                  disabled={atLimit}
                  onClick={() => setAddOpen(true)}
                >
                  + Add Key
                </Button>
              </div>

              {atLimit && (
                // TODO: replace with <InlineAlert /> once built — ds-parity P1
                <div
                  style={{
                    padding: "var(--cds-padding-card)",
                    borderRadius: "var(--cds-radius-r)",
                    border:
                      "1px solid var(--cds-warning-border-default, #D25704)",
                    background: "var(--cds-warning-surface-subtle, #FFF8F0)",
                    marginBottom: "var(--cds-space-16)",
                    fontSize: "var(--cds-text-p2)",
                    color: "var(--cds-huegrey-text-dark)",
                  }}
                >
                  Maximum of {MAX_KEYS} API keys reached. Delete an existing
                  key to add a new one.
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Key Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Active Features</TableHead>
                    <TableHead style={{ width: 120 }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell
                        style={{
                          fontWeight: 500,
                          color: "var(--cds-huegrey-text-dark)",
                          fontSize: "var(--cds-text-p2)",
                        }}
                      >
                        {key.serviceKeyName}
                      </TableCell>

                      <TableCell
                        style={{
                          fontFamily: "monospace",
                          fontSize: "var(--cds-text-p2)",
                          color: "var(--cds-huegrey-text-default)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {key.maskedValue}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="subtle"
                          style={{ borderRadius: "var(--cds-radius-full)" }}
                        >
                          {key.activeFeatures}{" "}
                          {key.activeFeatures === 1 ? "feature" : "features"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--cds-gap-small)",
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditKey(key)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{
                              color: "var(--cds-error-text-default, #CC1914)",
                            }}
                            onClick={() => setDeleteKey(key)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {keys.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        style={{ textAlign: "center", padding: "var(--cds-space-32)" }}
                      >
                        {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
                        <div
                          style={{
                            color: "var(--cds-huegrey-text-default)",
                            fontSize: "var(--cds-text-p2)",
                          }}
                        >
                          No API keys configured yet.{" "}
                          <button
                            onClick={() => setAddOpen(true)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              color: "var(--cds-primary-text-default)",
                              fontSize: "var(--cds-text-p2)",
                              textDecoration: "underline",
                            }}
                          >
                            Add your first key
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* ── Usage tab ── */}
            <TabsContent value="usage">
              <UsageTab providerId={provider.id} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add Key dialog */}
      <KeyDialog
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
      />

      {/* Edit Key dialog */}
      <KeyDialog
        open={editKey !== null}
        mode="edit"
        initialName={editKey?.serviceKeyName}
        onClose={() => setEditKey(null)}
        onSave={handleEdit}
      />

      {/* Delete confirmation */}
      <DeleteKeyDialog
        open={deleteKey !== null}
        keyName={deleteKey?.serviceKeyName ?? ""}
        onCancel={() => setDeleteKey(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
