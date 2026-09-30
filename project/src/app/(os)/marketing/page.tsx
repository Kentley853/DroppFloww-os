"use client"

import { DataTable, PageHeader, StatusPill, Surface } from "@/components/blocks"
import { useCompany } from "@/hooks/company-store"
import { formatIdr } from "@/lib/format"

export default function MarketingPage() {
  const { company } = useCompany()
  const leads = company.campaigns.reduce((sum, item) => sum + item.leads, 0)
  return (
    <div>
      <PageHeader title="Marketing" description={company.blurbs.marketing} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Surface className="p-5">
          <div className="text-[13px] text-muted-foreground">Leads in view</div>
          <div className="mt-2 text-[26px] font-semibold tabular-nums">{leads}</div>
        </Surface>
        <Surface className="p-5">
          <div className="text-[13px] text-muted-foreground">Active campaigns</div>
          <div className="mt-2 text-[26px] font-semibold tabular-nums">{company.campaigns.filter((item) => item.status === "active").length}</div>
        </Surface>
        <Surface className="p-5">
          <div className="text-[13px] text-muted-foreground">Spend in view</div>
          <div className="mt-2 text-[26px] font-semibold tabular-nums">{formatIdr(company.campaigns.reduce((sum, item) => sum + item.spend, 0))}</div>
        </Surface>
      </div>
      <DataTable
        rows={company.campaigns}
        empty="No campaigns."
        columns={[
          { header: "Campaign", cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Channel", cell: (row) => row.channel },
          { header: "Spend", cell: (row) => <span className="tabular-nums">{formatIdr(row.spend)}</span> },
          { header: "Leads", cell: (row) => <span className="tabular-nums">{row.leads}</span> },
          { header: "Conversion", cell: (row) => <span className="tabular-nums">{row.conversion}%</span> },
          { header: "Status", cell: (row) => <StatusPill value={row.status} /> },
          { header: "Note", cell: (row) => <span className="text-muted-foreground">{row.note}</span> },
        ]}
      />
    </div>
  )
}
