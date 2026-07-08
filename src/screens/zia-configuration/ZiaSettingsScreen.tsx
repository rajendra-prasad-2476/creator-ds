/**
 * ZiaSettingsScreen
 *
 * Feature: 001 — Zia Configuration Enhancements
 * PRD section: FR-2, FR-3, FR-4
 *
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Breadcrumb: Operations / Zia
 *   ├── Page header — "Zia" + description
 *   └── Tabs
 *       ├── LLM Providers — 4 provider cards (Zoho Native, OpenAI, Anthropic, Google)
 *       └── Features — table with provider mapping dropdown + ON/OFF toggle
 *
 * Access: Admin / Super Admin only (FR-1.1)
 * Missing components flagged inline per AGENTS.md rules.
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { StatusBadge } from "@/components/ui/status-badge"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type ProviderStatus = "configured" | "configure"

interface Provider {
  id: string
  name: string
  type: "Native" | "BYOK"
  status: ProviderStatus
  description: string
  /** Initials shown in the avatar circle */
  initials: string
  avatarColor: string
}

interface ZiaFeature {
  id: string
  name: string
  /** null = "Select LLM Provider" */
  mappedProvider: string | null
  mappedKeyName: string | null
  enabled: boolean
  /** FR-5.3: features that do NOT support Zoho GenAI get disabled on key deletion */
  supportsZoho: boolean
  accessControl: string
}

interface MappingOption {
  providerId: string
  providerName: string
  keyName: string
  label: string
}

// ─── Demo data ─────────────────────────────────────────────────────────────────

const PROVIDERS: Provider[] = [
  {
    id: "zoho",
    name: "Zoho",
    type: "Native",
    status: "configured",
    description: "Zoho GenAI — built-in, always available. No API key required.",
    initials: "Z",
    avatarColor: "var(--cds-primary-surface-default)",
  },
  {
    id: "openai",
    name: "OpenAI",
    type: "BYOK",
    status: "configure",
    description: "GPT-4 and other OpenAI models via your own API key.",
    initials: "OA",
    avatarColor: "#10A37F",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    type: "BYOK",
    status: "configure",
    description: "Claude models via your own API key.",
    initials: "AN",
    avatarColor: "#D97706",
  },
  {
    id: "google",
    name: "Google",
    type: "BYOK",
    status: "configure",
    description: "Gemini models via your own API key.",
    initials: "G",
    avatarColor: "#4285F4",
  },
]

const INITIAL_FEATURES: ZiaFeature[] = [
  { id: "create-app",      name: "Create App",             mappedProvider: "zoho", mappedKeyName: "Zoho GenAI", enabled: true,  supportsZoho: true,  accessControl: "Admin / Super Admin" },
  { id: "create-form",     name: "Create Form",            mappedProvider: null,   mappedKeyName: null,         enabled: false, supportsZoho: true,  accessControl: "Admin / Super Admin" },
  { id: "next-field",      name: "Next Field Suggestions", mappedProvider: null,   mappedKeyName: null,         enabled: false, supportsZoho: true,  accessControl: "Admin / Super Admin" },
  { id: "deluge-assist",   name: "Deluge Assistance",      mappedProvider: null,   mappedKeyName: null,         enabled: false, supportsZoho: true,  accessControl: "Admin / Super Admin" },
  { id: "ai-agent",        name: "AI Agent",               mappedProvider: null,   mappedKeyName: null,         enabled: false, supportsZoho: false, accessControl: "Admin / Super Admin" },
  { id: "deluge-zia-task", name: "Deluge Zia Task",        mappedProvider: null,   mappedKeyName: null,         enabled: false, supportsZoho: true,  accessControl: "Admin / Super Admin" },
]

/** Only configured BYOK providers + Zoho appear here (FR-4.2.2) */
const MAPPING_OPTIONS: MappingOption[] = [
  { providerId: "zoho", providerName: "Zoho", keyName: "Zoho GenAI", label: "Zoho — Zoho GenAI" },
  // BYOK providers appear only when configured — demo shows none configured yet
]

// ─── Provider Card ────────────────────────────────────────────────────────────

function ProviderCard({
  provider,
  onConfigure,
}: {
  provider: Provider
  onConfigure?: (id: string) => void
}) {
  const isConfigured = provider.status === "configured"

  return (
    <Card
      style={{
        borderRadius: "var(--cds-radius-r)",
        border: "1px solid var(--border)",
      }}
    >
      <CardHeader style={{ paddingBottom: "var(--cds-space-8)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--cds-gap-default)",
          }}
        >
          {/* Provider avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--cds-radius-s)",
              background: provider.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--cds-white)",
              fontSize: "var(--cds-text-p3)",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {provider.initials}
          </div>

          {/* Status badge */}
          <StatusBadge status={isConfigured ? "configured" : "not-configured"} />
        </div>

        <div style={{ marginTop: "var(--cds-space-12)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--cds-gap-small)",
              marginBottom: "var(--cds-space-4)",
            }}
          >
            <span
              style={{
                fontSize: "var(--cds-text-p1)",
                fontWeight: 600,
                color: "var(--cds-huegrey-text-dark)",
              }}
            >
              {provider.name}
            </span>
            <Badge
              variant="subtle"
              style={{
                fontSize: "var(--cds-text-p4)",
                borderRadius: "var(--cds-radius-full)",
              }}
            >
              {provider.type}
            </Badge>
          </div>
          <p
            style={{
              fontSize: "var(--cds-text-p3)",
              color: "var(--cds-huegrey-text-default)",
              margin: 0,
              lineHeight: "var(--cds-leading-p3)",
            }}
          >
            {provider.description}
          </p>
        </div>
      </CardHeader>

      <Separator />

      <CardContent
        style={{
          paddingTop: "var(--cds-space-12)",
          paddingBottom: "var(--cds-space-12)",
        }}
      >
        {provider.type === "Native" ? (
          <span
            style={{
              fontSize: "var(--cds-text-p3)",
              color: "var(--cds-huegrey-text-default)",
            }}
          >
            Always available · No key required
          </span>
        ) : isConfigured ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConfigure?.(provider.id)}
          >
            Manage Keys
          </Button>
        ) : (
          <Button size="sm" onClick={() => onConfigure?.(provider.id)}>
            Configure
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Features Table ───────────────────────────────────────────────────────────

function FeaturesTable({
  features,
  mappingOptions,
  onMappingChange,
  onToggle,
}: {
  features: ZiaFeature[]
  mappingOptions: MappingOption[]
  onMappingChange: (featureId: string, value: string) => void
  onToggle: (featureId: string, value: boolean) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: "24%" }}>Feature</TableHead>
          <TableHead style={{ width: "36%" }}>LLM Provider</TableHead>
          <TableHead style={{ width: "16%" }}>Status</TableHead>
          <TableHead style={{ width: "24%" }}>Access Control</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => {
          const hasMapping =
            feature.mappedProvider !== null && feature.mappedKeyName !== null
          const mappingValue = hasMapping
            ? `${feature.mappedProvider}::${feature.mappedKeyName}`
            : ""

          return (
            <TableRow key={feature.id}>
              {/* Feature name */}
              <TableCell
                style={{
                  fontWeight: 500,
                  color: "var(--cds-huegrey-text-dark)",
                  fontSize: "var(--cds-text-p2)",
                }}
              >
                {feature.name}
                {!feature.supportsZoho && (
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        style={{
                          marginLeft: "var(--cds-gap-tight)",
                          cursor: "help",
                          color: "var(--cds-warning-text-default, #D25704)",
                          fontSize: "var(--cds-text-p3)",
                        }}
                      >
                        ⚠
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Does not support Zoho GenAI — will be disabled on BYOK key deletion
                    </TooltipContent>
                  </Tooltip>
                )}
              </TableCell>

              {/* Provider mapping dropdown (FR-4.2) */}
              <TableCell>
                <Select
                  value={mappingValue}
                  onValueChange={(val) => val && onMappingChange(feature.id, val)}
                >
                  <SelectTrigger
                    style={{
                      width: "100%",
                      maxWidth: 280,
                      fontSize: "var(--cds-text-p2)",
                      borderColor: hasMapping
                        ? "var(--border)"
                        : "var(--cds-warning-border-default, #D25704)",
                    }}
                  >
                    <SelectValue placeholder="Select LLM Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {mappingOptions.map((opt) => (
                      <SelectItem
                        key={`${opt.providerId}::${opt.keyName}`}
                        value={`${opt.providerId}::${opt.keyName}`}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              {/* ON/OFF toggle (FR-4.3) */}
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--cds-gap-small)",
                  }}
                >
                  <Switch
                    checked={feature.enabled}
                    disabled={!hasMapping}
                    onCheckedChange={(val) => onToggle(feature.id, val)}
                  />
                  <span
                    style={{
                      fontSize: "var(--cds-text-p3)",
                      color: feature.enabled
                        ? "var(--cds-success-text-default, #078841)"
                        : "var(--cds-huegrey-text-default)",
                    }}
                  >
                    {feature.enabled ? "ON" : "OFF"}
                  </span>
                </div>
              </TableCell>

              {/* Access Control (informational, FR-4.1.2) */}
              <TableCell
                style={{
                  fontSize: "var(--cds-text-p3)",
                  color: "var(--cds-huegrey-text-default)",
                }}
              >
                {feature.accessControl}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ZiaSettingsScreen() {
  const [features, setFeatures] = React.useState<ZiaFeature[]>(INITIAL_FEATURES)

  const { navigate, goBack, canGoBack } = useNavigation()

  function handleMappingChange(featureId: string, value: string) {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id !== featureId) return f
        if (!value) {
          // FR-4.3.2: no mapping → force OFF
          return { ...f, mappedProvider: null, mappedKeyName: null, enabled: false }
        }
        const [providerId, keyName] = value.split("::")
        return { ...f, mappedProvider: providerId, mappedKeyName: keyName }
      })
    )
  }

  function handleToggle(featureId: string, enabled: boolean) {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled } : f))
    )
  }

  function handleConfigure(providerId: string) {
    navigate("zia-provider-detail", { providerId })
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
                {canGoBack ? (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); goBack() }}
                  >
                    Operations
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href="#">Operations</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Zia</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page header */}
          <div style={{ marginBottom: "var(--cds-space-24)" }}>
            <h1
              style={{
                fontSize: "var(--cds-text-h2)",
                lineHeight: "var(--cds-leading-h2)",
                fontWeight: 600,
                color: "var(--cds-huegrey-text-dark)",
                margin: "0 0 var(--cds-space-4)",
              }}
            >
              Zia
            </h1>
            <p
              style={{
                fontSize: "var(--cds-text-p2)",
                color: "var(--cds-huegrey-text-default)",
                margin: 0,
              }}
            >
              Configure LLM providers and map them to Zia features across your
              organisation.
            </p>
          </div>

          {/* Tabs — LLM Providers | Features */}
          <Tabs defaultValue="providers">
            <TabsList
              style={{
                borderBottom: "1px solid var(--border)",
                background: "transparent",
                padding: 0,
                marginBottom: "var(--cds-space-24)",
              }}
            >
              <TabsTrigger value="providers">LLM Providers</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            {/* ── LLM Providers tab ── */}
            <TabsContent value="providers">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "var(--cds-gap-default)",
                }}
              >
                {PROVIDERS.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onConfigure={handleConfigure}
                  />
                ))}
              </div>
            </TabsContent>

            {/* ── Features tab ── */}
            <TabsContent value="features">
              {/* TODO: replace with <InlineAlert /> once built — ds-parity P1 */}
              {features.some((f) => !f.mappedProvider) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--cds-gap-small)",
                    padding: "var(--cds-padding-card)",
                    borderRadius: "var(--cds-radius-r)",
                    border:
                      "1px solid var(--cds-warning-border-default, #D25704)",
                    background:
                      "var(--cds-warning-surface-subtle, #FFF8F0)",
                    marginBottom: "var(--cds-space-16)",
                    fontSize: "var(--cds-text-p2)",
                    color: "var(--cds-huegrey-text-dark)",
                  }}
                >
                  <span>⚠️</span>
                  <span>
                    Some features have no LLM provider mapped. They will remain{" "}
                    <strong>OFF</strong> until a provider is configured and
                    selected.
                  </span>
                </div>
              )}

              <FeaturesTable
                features={features}
                mappingOptions={MAPPING_OPTIONS}
                onMappingChange={handleMappingChange}
                onToggle={handleToggle}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
