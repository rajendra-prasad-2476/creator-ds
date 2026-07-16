/**
 * BillingTemplate
 *
 * Pattern: Billing / Subscription page
 * Structure:
 *   TopBar + LeftNav shell
 *   ├── Page header       — title · description
 *   ├── Tabs              — Subscription | Usage Details
 *   │   ├── Subscription tab:
 *   │   │   ├── Referral banner  (optional)
 *   │   │   ├── Plan summary card — current plan · support plan · subscription cycle · renewal date · upgrade CTA
 *   │   │   └── Plan details grid — stat tiles (label + value)
 *   │   └── Usage Details tab:
 *   │       └── Info notice + custom slot
 *
 * Slots to customise:
 *   pageTitle / pageDescription
 *   referralBanner        — text + link label (set to null to hide)
 *   plan                  — PlanSummary object
 *   planDetails           — array of PlanStatItem
 *   usageDetailsContent   — ReactNode rendered inside the Usage Details tab
 */

import * as React from "react"
import { TopBar } from "@/components/ui/top-bar"
import { LeftNav } from "@/components/ui/left-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanSummary {
  /** e.g. "ENTERPRISE" */
  planName: string
  /** Badge variant to use for the plan name badge */
  planBadgeVariant?: "prominent" | "subtle"
  /** e.g. "Classic" */
  supportPlan: string
  /** e.g. "Yearly" */
  subscriptionCycle: string
  /** e.g. "26 Jun 2027" */
  renewalDate: string
  /** Label for the upgrade CTA button */
  upgradeLabel?: string
  onUpgradeClick?: () => void
}

export interface PlanStatItem {
  id: string
  /** e.g. "Users", "Apps", "BI & Analytics" */
  label: string
  /** e.g. "2 of 2", "4 of Unlimited", "—" */
  value: string
}

export interface ReferralBanner {
  text: string
  linkLabel: string
  onLinkClick?: () => void
}

export interface BillingTemplateProps {
  pageTitle?: string
  pageDescription?: string
  /** Set to null/undefined to hide the referral banner */
  referralBanner?: ReferralBanner | null
  plan?: PlanSummary
  planDetails?: PlanStatItem[]
  /** Content rendered inside the Usage Details tab */
  usageDetailsContent?: React.ReactNode
  /** Default active tab */
  defaultTab?: "subscription" | "usage-details"
}

// ─── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_PLAN: PlanSummary = {
  planName: "ENTERPRISE",
  planBadgeVariant: "subtle",
  supportPlan: "Classic",
  subscriptionCycle: "Yearly",
  renewalDate: "26 Jun 2027",
  upgradeLabel: "→ UPGRADE",
}

const DEMO_PLAN_DETAILS: PlanStatItem[] = [
  { id: "users",        label: "Users",            value: "2 of 2"         },
  { id: "apps",         label: "Apps",             value: "4 of Unlimited" },
  { id: "bi",           label: "BI & Analytics",   value: "—"              },
  { id: "integrations", label: "Integration Flows", value: "—"             },
  { id: "rpa",          label: "RPA Flows",        value: "—"              },
]

const DEMO_REFERRAL: ReferralBanner = {
  text: "Receive 15% of your friend's subscription fee in Zoho Wallet credits once they become a paying customer and complete 90 days with Zoho.",
  linkLabel: "Refer friend",
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ReferralBannerRow({ banner }: { banner: ReferralBanner }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--cds-gap-small)",
        padding: "var(--cds-padding-card)",
        borderRadius: "var(--cds-radius-r)",
        border: "1px solid var(--cds-success-border-default, #078841)",
        background: "var(--cds-success-surface-subtle, #F0FAF4)",
        marginBottom: "var(--cds-space-16)",
        fontSize: "var(--cds-text-p2)",
        lineHeight: "var(--cds-leading-p2)",
        color: "var(--cds-huegrey-text-dark)",
      }}
    >
      {/* gift icon placeholder */}
      <span style={{ fontSize: "1.2em" }}>🎁</span>
      <span style={{ flex: 1 }}>{banner.text}</span>
      <button
        onClick={banner.onLinkClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--cds-primary-text-default)",
          fontSize: "var(--cds-text-p2)",
          textDecoration: "underline",
          whiteSpace: "nowrap",
        }}
      >
        {banner.linkLabel}
      </button>
    </div>
  )
}

function PlanSummaryCard({ plan }: { plan: PlanSummary }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--cds-gap-default)",
        padding: "var(--cds-space-24)",
        borderRadius: "var(--cds-radius-r)",
        border: "1px solid var(--border)",
        background: "var(--cds-white)",
        marginBottom: "var(--cds-space-24)",
        flexWrap: "wrap",
      }}
    >
      {/* Current Plan */}
      <div style={{ flex: "1 1 140px" }}>
        <div
          style={{
            fontSize: "var(--cds-text-p3)",
            color: "var(--cds-huegrey-text-default)",
            marginBottom: "var(--cds-space-4)",
          }}
        >
          Current Plan
        </div>
        <Badge variant={plan.planBadgeVariant ?? "subtle"}>
          {plan.planName}
        </Badge>
      </div>

      <Separator orientation="vertical" style={{ height: 40, flexShrink: 0 }} />

      {/* Support Plan */}
      <div style={{ flex: "1 1 140px" }}>
        <div
          style={{
            fontSize: "var(--cds-text-p3)",
            color: "var(--cds-huegrey-text-default)",
            marginBottom: "var(--cds-space-4)",
          }}
        >
          Support Plan
        </div>
        <div
          style={{
            fontSize: "var(--cds-text-p2)",
            color: "var(--cds-primary-text-default)",
            fontWeight: 500,
          }}
        >
          {plan.supportPlan}
        </div>
      </div>

      <Separator orientation="vertical" style={{ height: 40, flexShrink: 0 }} />

      {/* Subscription */}
      <div style={{ flex: "1 1 140px" }}>
        <div
          style={{
            fontSize: "var(--cds-text-p3)",
            color: "var(--cds-huegrey-text-default)",
            marginBottom: "var(--cds-space-4)",
          }}
        >
          Subscription
        </div>
        <div
          style={{
            fontSize: "var(--cds-text-p2)",
            color: "var(--cds-huegrey-text-dark)",
            fontWeight: 500,
          }}
        >
          {plan.subscriptionCycle}
        </div>
      </div>

      <Separator orientation="vertical" style={{ height: 40, flexShrink: 0 }} />

      {/* Recurring on */}
      <div style={{ flex: "1 1 140px" }}>
        <div
          style={{
            fontSize: "var(--cds-text-p3)",
            color: "var(--cds-huegrey-text-default)",
            marginBottom: "var(--cds-space-4)",
          }}
        >
          Recurring on
        </div>
        <div
          style={{
            fontSize: "var(--cds-text-p2)",
            color: "var(--cds-huegrey-text-dark)",
            fontWeight: 500,
          }}
        >
          {plan.renewalDate}
        </div>
      </div>

      {/* Upgrade CTA */}
      <Button
        onClick={plan.onUpgradeClick}
        style={{
          marginLeft: "auto",
          background: "var(--cds-success-surface-default, #078841)",
          color: "var(--cds-white)",
          border: "none",
          borderRadius: "var(--cds-radius-r)",
          padding: "0 var(--cds-space-24)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {plan.upgradeLabel ?? "Upgrade"}
      </Button>
    </div>
  )
}

function PlanDetailsGrid({ items }: { items: PlanStatItem[] }) {
  return (
    <div>
      <div
        style={{
          fontSize: "var(--cds-text-p1)",
          fontWeight: 600,
          color: "var(--cds-huegrey-text-dark)",
          marginBottom: "var(--cds-space-12)",
        }}
      >
        Plan Details
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "var(--cds-gap-default)",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "var(--cds-padding-card)",
              borderRadius: "var(--cds-radius-r)",
              border: "1px solid var(--border)",
              background: "var(--cds-white)",
            }}
          >
            {/* icon placeholder */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--cds-radius-s)",
                background: "var(--cds-primary-surface-subtle, #EEF2FE)",
                marginBottom: "var(--cds-space-8)",
              }}
            />
            <div
              style={{
                fontSize: "var(--cds-text-p3)",
                color: "var(--cds-huegrey-text-default)",
                marginBottom: "var(--cds-space-4)",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: "var(--cds-text-p2)",
                color: "var(--cds-huegrey-text-dark)",
                fontWeight: 500,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DefaultUsageDetailsContent() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--cds-gap-small)",
        padding: "var(--cds-padding-card)",
        borderRadius: "var(--cds-radius-r)",
        border: "1px solid var(--cds-primary-border-default, #0D4EF2)",
        background: "var(--cds-primary-surface-subtle, #EEF2FE)",
        fontSize: "var(--cds-text-p2)",
        lineHeight: "var(--cds-leading-p2)",
        color: "var(--cds-huegrey-text-dark)",
      }}
    >
      <span>ℹ️</span>
      <span>
        Usage details dashboard just got better. Along with viewing components'
        usage, you can now monitor metrics, access detailed insights, and set
        custom alerts.{" "}
        <button
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
          Explore
        </button>
      </span>
    </div>
  )
}

// ─── Main template ─────────────────────────────────────────────────────────────

export default function BillingTemplate({
  pageTitle = "Billing",
  pageDescription = "Comprehensive view of your active subscription. Upgrade your plan or purchase add-ons as you expand.",
  referralBanner = DEMO_REFERRAL,
  plan = DEMO_PLAN,
  planDetails = DEMO_PLAN_DETAILS,
  usageDetailsContent,
  defaultTab = "subscription",
}: BillingTemplateProps) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding:
              "var(--cds-padding-section-v) var(--cds-padding-section-h)",
          }}
        >
          {/* Page header */}
          <div style={{ marginBottom: "var(--cds-space-24)" }}>
            <h1
              style={{
                fontSize: "var(--cds-text-p1)",
                lineHeight: "var(--cds-leading-p1)",
                fontWeight: 500,
                color: "var(--cds-huegrey-text-dark)",
                margin: 0,
              }}
            >
              {pageTitle}
            </h1>
            {pageDescription && (
              <p
                style={{
                  fontSize: "var(--cds-text-p2)",
                  lineHeight: "var(--cds-leading-p2)",
                  color: "var(--cds-huegrey-text-default)",
                  margin: "var(--cds-space-4) 0 0",
                }}
              >
                {pageDescription}
              </p>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue={defaultTab}>
            <TabsList
              style={{
                borderBottom: "1px solid var(--border)",
                background: "transparent",
                padding: 0,
                marginBottom: "var(--cds-space-24)",
              }}
            >
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="usage-details">Usage Details</TabsTrigger>
            </TabsList>

            {/* Subscription tab */}
            <TabsContent value="subscription">
              {referralBanner && (
                <ReferralBannerRow banner={referralBanner} />
              )}
              {plan && <PlanSummaryCard plan={plan} />}
              {planDetails && planDetails.length > 0 && (
                <PlanDetailsGrid items={planDetails} />
              )}
            </TabsContent>

            {/* Usage Details tab */}
            <TabsContent value="usage-details">
              {usageDetailsContent ?? <DefaultUsageDetailsContent />}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
