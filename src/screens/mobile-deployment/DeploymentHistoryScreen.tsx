/**
 * DeploymentHistoryScreen (S-06)
 *
 * Feature: 004 — Mobile App Deployment (Post-CodeSign Distribution)
 * PRD section: §8.6 Deployment Record Model, §9.4 Screen S-06
 *
 * Lists all past deployment attempts for a signed app — newest first.
 * Columns: Channel, Track, Version, Status, Initiated By, Date, Actions
 *
 * States:
 *   - Populated table with mixed statuses
 *   - Empty state (no deployments yet)
 *   - Error rows with Retry action
 *   - Success rows with "View in Console" external link
 */

import {
  RotateCcw,
  ExternalLink,
  History,
  Plus,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { useNavigation } from "@/screens/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type DeployStatus = "success" | "failed" | "running" | "queued" | "cancelled"
type Channel = "Google Play" | "Firebase" | "Zoho MDM" | "Ad-hoc"

interface DeploymentRecord {
  id: string
  channel: Channel
  track: string
  version: string
  buildNumber: string
  status: DeployStatus
  initiatedBy: string
  createdAt: string
  completedAt?: string
  storeLink?: string
  errorMessage?: string
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: "dep-1",
    channel: "Google Play",
    track: "Internal testing",
    version: "v2.4.1",
    buildNumber: "241",
    status: "running",
    initiatedBy: "rajan.sharma",
    createdAt: "Today, 11:05 AM",
  },
  {
    id: "dep-2",
    channel: "Firebase",
    track: "Beta group",
    version: "v2.4.1",
    buildNumber: "241",
    status: "success",
    initiatedBy: "rajan.sharma",
    createdAt: "Today, 10:52 AM",
    completedAt: "Today, 10:54 AM",
    storeLink: "https://appdistribution.firebase.google.com",
  },
  {
    id: "dep-3",
    channel: "Google Play",
    track: "Internal testing",
    version: "v2.4.0",
    buildNumber: "240",
    status: "failed",
    initiatedBy: "admin@zylker.com",
    createdAt: "Yesterday, 6:30 PM",
    completedAt: "Yesterday, 6:31 PM",
    errorMessage: "Package name does not match Play Store app: com.zylker.crm",
  },
  {
    id: "dep-4",
    channel: "Google Play",
    track: "Internal testing",
    version: "v2.3.9",
    buildNumber: "239",
    status: "success",
    initiatedBy: "admin@zylker.com",
    createdAt: "2 days ago",
    completedAt: "2 days ago",
    storeLink: "https://play.google.com/console",
  },
  {
    id: "dep-5",
    channel: "Zoho MDM",
    track: "Enterprise MDM",
    version: "v2.3.8",
    buildNumber: "238",
    status: "success",
    initiatedBy: "it.admin@zylker.com",
    createdAt: "5 days ago",
    completedAt: "5 days ago",
  },
  {
    id: "dep-6",
    channel: "Ad-hoc",
    track: "Ad-hoc link",
    version: "v2.3.7",
    buildNumber: "237",
    status: "cancelled",
    initiatedBy: "rajan.sharma",
    createdAt: "1 week ago",
  },
]

// ─── Status badge helper ──────────────────────────────────────────────────────

function DeployStatusBadge({ status }: { status: DeployStatus }) {
  switch (status) {
    case "success":   return <Badge variant="subtle" colour="success" size="sm">Success</Badge>
    case "failed":    return <Badge variant="subtle" colour="error" size="sm">Failed</Badge>
    case "running":   return <Badge variant="subtle" colour="primary" size="sm">Running</Badge>
    case "queued":    return <Badge variant="subtle" colour="indigo" size="sm">Queued</Badge>
    case "cancelled": return <Badge variant="subtle" colour="indigo" size="sm">Cancelled</Badge>
  }
}

function channelBadgeColour(channel: Channel): "primary" | "warning" | "indigo" {
  switch (channel) {
    case "Google Play": return "primary"
    case "Firebase":    return "warning"
    default:            return "indigo"
  }
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DeploymentHistoryScreen() {
  const { navigate } = useNavigation()
  const records = SEED_DEPLOYMENTS

  function handleRetry(_id: string) {
    // In production this would re-enqueue the job; here navigate to wizard
    navigate("deploy-wizard-channel")
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto" style={{ padding: "var(--cds-padding-section-v) var(--cds-padding-section-h)" }}>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("mobile-app-list")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "var(--cds-gap-tight)",
              color: "var(--cds-huegrey-text-default)",
              fontSize: "var(--cds-text-p3)",
              padding: 0,
              marginBottom: "var(--cds-space-16)",
            }}
          >
            <ArrowLeft size={13} />
            Back to Mobile
          </button>

          {/* Page header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "var(--cds-space-24)",
              flexWrap: "wrap",
              gap: "var(--cds-gap-default)",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "var(--cds-text-p1)",
                  lineHeight: "var(--cds-leading-p1)",
                  fontWeight: 600,
                  color: "var(--cds-huegrey-text-dark)",
                  margin: "0 0 var(--cds-space-4)",
                }}
              >
                Deployment History
              </h1>
              <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)" }}>
                Zylker CRM — Android · All deployment attempts, newest first
              </p>
            </div>
            <Button
              onClick={() => navigate("deploy-wizard-channel")}
              style={{ gap: "var(--cds-gap-tight)" }}
            >
              <Plus size={14} />
              New deployment
            </Button>
          </div>

          {/* Deployment table */}
          {records.length > 0 ? (
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
                    <TableHead>Channel</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Initiated by</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead style={{ width: 120 }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow
                      key={record.id}
                      onClick={record.status === "running" ? () => navigate("deploy-in-progress") : undefined}
                      style={{
                        cursor: record.status === "running" ? "pointer" : "default",
                        ...(record.status === "failed"
                          ? { backgroundColor: "var(--cds-error-surface-subtle)" }
                          : record.status === "running"
                          ? { backgroundColor: "var(--cds-primary-surface-subtle)" }
                          : {}),
                      }}
                    >
                      <TableCell>
                        <Badge variant="subtle" colour={channelBadgeColour(record.channel)}>
                          {record.channel}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                        {record.track}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ margin: 0, fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-dark)" }}>
                            {record.version}
                          </p>
                          <p style={{ margin: 0, fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                            Build {record.buildNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--cds-gap-tight)" }}>
                          <DeployStatusBadge status={record.status} />
                          {record.status === "failed" && record.errorMessage && (
                            <p style={{ margin: 0, fontSize: "var(--cds-text-p4)", color: "var(--cds-error-text-default)", maxWidth: 200 }}>
                              {record.errorMessage}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                        {record.initiatedBy}
                      </TableCell>
                      <TableCell style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                        <div>
                          <p style={{ margin: 0 }}>{record.createdAt}</p>
                          {record.completedAt && record.completedAt !== record.createdAt && (
                            <p style={{ margin: 0, color: "var(--cds-huegrey-text-muted)" }}>
                              Done: {record.completedAt}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", gap: "var(--cds-gap-tight)", alignItems: "center" }}>
                          {record.status === "running" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); navigate("deploy-in-progress") }}
                              style={{ gap: "var(--cds-gap-tight)", padding: "var(--cds-space-4) var(--cds-space-8)", color: "var(--cds-primary-text-default)" }}
                            >
                              View progress
                            </Button>
                          )}
                          {record.storeLink && (
                            <Button size="sm" variant="ghost" style={{ gap: "var(--cds-gap-tight)", padding: "var(--cds-space-4) var(--cds-space-8)" }}>
                              <ExternalLink size={12} />
                              Console
                            </Button>
                          )}
                          {record.status === "failed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRetry(record.id)}
                              style={{ gap: "var(--cds-gap-tight)", padding: "var(--cds-space-4) var(--cds-space-8)", color: "var(--cds-primary-text-default)" }}
                            >
                              <RotateCcw size={12} />
                              Retry
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Empty state */
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: "var(--cds-radius-r)",
                padding: "var(--cds-space-32)",
                textAlign: "center",
              }}
            >
              <History size={32} style={{ color: "var(--cds-huegrey-border-default)", margin: "0 auto var(--cds-space-12)" }} />
              <p style={{ fontSize: "var(--cds-text-p2)", fontWeight: 500, color: "var(--cds-huegrey-text-dark)", margin: "0 0 var(--cds-space-4)" }}>
                No deployments yet
              </p>
              <p style={{ fontSize: "var(--cds-text-p2)", color: "var(--cds-huegrey-text-default)", margin: "0 0 var(--cds-space-16)" }}>
                Deploy this signed app to Google Play, Firebase, or Zoho MDM to see history here.
              </p>
              <Button onClick={() => navigate("deploy-wizard-channel")} style={{ gap: "var(--cds-gap-tight)" }}>
                <Plus size={14} />
                Deploy now
              </Button>
              {/* TODO: replace with <EmptyState /> once built — ds-parity P1 */}
            </div>
          )}

          {/* Pagination placeholder */}
          {records.length >= 10 && (
            <div style={{ marginTop: "var(--cds-space-16)", textAlign: "center" }}>
              {/* TODO: replace with <Pagination /> once built — ds-parity P1 */}
              <p style={{ fontSize: "var(--cds-text-p3)", color: "var(--cds-huegrey-text-default)" }}>
                Showing {records.length} of {records.length} deployments
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
