/**
 * PortalAllowedIPsScreen
 *
 * Feature: 002 — Portal Security Policies
 * PRD section: FR-4 (Allowed IP Addresses)
 *
 * Allows administrators to restrict Portal access to trusted networks.
 * Supported: Individual IP, IP Range, CIDR Range.
 *
 * Empty state with "Add IP" action shown by default.
 * Inline IP entry form toggles on Add IP click.
 */

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Badge } from "@/components/ui/badge"
import { useNavigation } from "@/screens/navigation"
import { PortalSecurityShell } from "./_PortalSecurityShell"

// ─── Types ─────────────────────────────────────────────────────────────────────

type IPType = "individual" | "range" | "cidr"

interface IPEntry {
  id: string
  type: IPType
  value: string
  description: string
}

const TYPE_LABELS: Record<IPType, string> = {
  individual: "Individual IP",
  range:      "IP Range",
  cidr:       "CIDR Range",
}

// ─── Seed data (demo) ─────────────────────────────────────────────────────────

const SEED_IPS: IPEntry[] = [
  { id: "1", type: "individual", value: "203.0.113.10",           description: "Office — Mumbai"     },
  { id: "2", type: "range",      value: "10.0.0.1 – 10.0.0.255", description: "Internal VPN"        },
  { id: "3", type: "cidr",       value: "192.168.1.0/24",         description: "Branch network — BLR" },
]

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function PortalAllowedIPsScreen() {
  const { navigate, goBack, canGoBack } = useNavigation()
  const [entries, setEntries] = React.useState<IPEntry[]>(SEED_IPS)
  const [showForm, setShowForm] = React.useState(false)
  const [newType, setNewType]   = React.useState<IPType>("individual")
  const [newValue, setNewValue] = React.useState("")
  const [newDesc, setNewDesc]   = React.useState("")

  function addEntry() {
    if (!newValue.trim()) return
    setEntries((prev) => [
      ...prev,
      { id: Date.now().toString(), type: newType, value: newValue.trim(), description: newDesc.trim() },
    ])
    setNewValue("")
    setNewDesc("")
    setShowForm(false)
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <PortalSecurityShell activeNavId="allowed-ips">
      <div style={{ maxWidth: 700 }}>

        {/* Page title + description */}
        <h2
          style={{
            fontSize: "var(--cds-text-h3)",
            lineHeight: "var(--cds-leading-h3)",
            fontWeight: 600,
            color: "var(--cds-huegrey-text-dark)",
            margin: "0 0 var(--cds-space-8)",
          }}
        >
          Allowed IP Addresses
        </h2>
        <p
          style={{
            fontSize: "var(--cds-text-p2)",
            lineHeight: "var(--cds-leading-p2)",
            color: "var(--cds-huegrey-text-default)",
            margin: "0 0 var(--cds-space-24)",
          }}
        >
          Restrict Portal access to trusted networks. Authentication requests
          from addresses outside this list will be denied.
        </p>

        {/* Add IP button */}
        {!showForm && (
          <Button
            variant="outline"
            onClick={() => setShowForm(true)}
            style={{ marginBottom: "var(--cds-space-20)", gap: "var(--cds-gap-tight)" }}
          >
            <Plus size={14} />
            Add IP Address
          </Button>
        )}

        {/* Inline Add form */}
        {showForm && (
          <div
            style={{
              border: "1px solid var(--cds-primary-border-minimal)",
              borderRadius: "var(--cds-radius-r)",
              padding: "var(--cds-space-16)",
              marginBottom: "var(--cds-space-20)",
              backgroundColor: "var(--cds-primary-surface-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--cds-gap-default)",
            }}
          >
            <div style={{ display: "flex", gap: "var(--cds-gap-default)", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)", flex: "0 0 160px" }}>
                <Label style={{ fontSize: "var(--cds-text-p3)" }}>Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as IPType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual IP</SelectItem>
                    <SelectItem value="range">IP Range</SelectItem>
                    <SelectItem value="cidr">CIDR Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)", flex: 1, minWidth: 180 }}>
                <Label style={{ fontSize: "var(--cds-text-p3)" }}>
                  {newType === "individual" ? "IP Address" : newType === "range" ? "IP Range (start – end)" : "CIDR Notation"}
                </Label>
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={
                    newType === "individual" ? "e.g. 203.0.113.10"
                    : newType === "range"    ? "e.g. 10.0.0.1 – 10.0.0.255"
                    :                          "e.g. 192.168.1.0/24"
                  }
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-space-4)", flex: 1, minWidth: 160 }}>
                <Label style={{ fontSize: "var(--cds-text-p3)" }}>Description (optional)</Label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Office network"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
              <Button size="sm" onClick={addEntry}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* IP entries table */}
        {entries.length > 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--cds-radius-r)",
              overflow: "hidden",
              marginBottom: "var(--cds-space-32)",
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Address / Range</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead style={{ width: 48 }} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant="secondary">{TYPE_LABELS[entry.type]}</Badge>
                    </TableCell>
                    <TableCell
                      style={{
                        fontFamily: "var(--cds-font-family-mono)",
                        fontSize: "var(--cds-text-p3)",
                        color: "var(--cds-huegrey-text-dark)",
                      }}
                    >
                      {entry.value}
                    </TableCell>
                    <TableCell style={{ color: "var(--cds-huegrey-text-default)", fontSize: "var(--cds-text-p3)" }}>
                      {entry.description || "—"}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        aria-label="Remove"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--cds-huegrey-text-default)",
                          padding: "var(--cds-space-4)",
                          display: "flex",
                          borderRadius: "var(--cds-radius-s)",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div
            style={{
              border: "1px dashed var(--border)",
              borderRadius: "var(--cds-radius-r)",
              padding: "var(--cds-space-32)",
              textAlign: "center",
              marginBottom: "var(--cds-space-32)",
            }}
          >
            <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: 0 }}>
              No IP addresses configured. All networks are currently allowed.
            </p>
            {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "var(--cds-gap-small)" }}>
          <Button>Update Policy</Button>
          <Button variant="outline" onClick={() => canGoBack ? goBack() : navigate("portal-security-landing")}>
            Cancel
          </Button>
        </div>

      </div>
    </PortalSecurityShell>
  )
}
