"use client"

import { PageHeader, Surface } from "@/components/blocks"

const groups = [
  ["Google Drive", "Gmail", "Google Calendar", "Google Sheets"],
  ["WhatsApp Business", "Meta", "Instagram", "LinkedIn"],
  ["HubSpot", "Salesforce", "Shopify"],
  ["Xero", "QuickBooks", "Slack", "Notion"],
  ["ERP", "Custom API", "Database"],
]

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader title="Integrations" description="None of these are connected. Connect your CRM to use this with live data. Until then, the product runs on the demo company." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.flat().map((name) => (
          <Surface key={name} className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-[12px] text-muted-foreground">Demo / Coming soon</span>
          </Surface>
        ))}
      </div>
    </div>
  )
}
