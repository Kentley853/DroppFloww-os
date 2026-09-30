"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DataTable, PageHeader, SectionTitle, StatusPill, Surface } from "@/components/blocks"
import { RevenueChart } from "@/components/revenue-chart"
import { Button } from "@/components/ui/button"
import { useCompany } from "@/hooks/company-store"
import { formatCompactIdr, formatIdr } from "@/lib/format"
import { draftFor } from "@/services/assistant"
import type { Invoice } from "@/types"

const filters = ["all", "overdue", "open", "pending", "paid"] as const

export default function FinancePage() {
  const store = useCompany()
  const { company } = store
  const [filter, setFilter] = useState<(typeof filters)[number]>("all")
  const [selected, setSelected] = useState<Invoice | null>(null)
  const rows = useMemo(
    () => company.invoices.filter((invoice) => filter === "all" || invoice.status === filter),
    [company.invoices, filter]
  )
  const overdue = company.invoices.filter((invoice) => invoice.status === "overdue")
  const overdueTotal = overdue.reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div>
      <PageHeader title="Finance" description={company.blurbs.finance} />
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <Surface className="p-5">
          <div className="text-[13px] text-muted-foreground">Overdue</div>
          <div className="mt-2 text-[26px] font-semibold tabular-nums">{formatCompactIdr(overdueTotal)}</div>
          <div className="mt-1 text-[13px] text-muted-foreground">{overdue.length} accounts</div>
        </Surface>
        <Surface className="p-5">
          <div className="text-[13px] text-muted-foreground">Expected this week</div>
          <div className="mt-2 text-[26px] font-semibold tabular-nums">{formatCompactIdr(company.cashThisWeek)}</div>
          <div className="mt-1 text-[13px] text-muted-foreground">{company.cashThisWeekNote}</div>
        </Surface>
        <Surface className="p-5">
          <div className="text-[13px] text-muted-foreground">Collected this month</div>
          <div className="mt-2 text-[26px] font-semibold tabular-nums">{formatCompactIdr(company.metrics.find((item) => item.id === "cash")?.value ?? 0)}</div>
          <div className="mt-1 text-[13px] text-muted-foreground">Recorded collections, not a forecast.</div>
        </Surface>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full border px-3 py-1 text-[13px] capitalize ${filter === item ? "border-transparent bg-brand-soft text-brand" : "hover:bg-muted"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <DataTable
        rows={rows}
        empty="No invoices in this status."
        onRow={setSelected}
        columns={[
          { header: company.labels.customer, cell: (row) => <span className="font-medium">{row.customer}</span> },
          { header: "Number", cell: (row) => row.number },
          { header: "Amount", cell: (row) => <span className="tabular-nums">{formatIdr(row.amount)}</span> },
          { header: "Due", cell: (row) => row.due },
          { header: "Status", cell: (row) => <StatusPill value={row.status} /> },
        ]}
      />
      <p className="mt-3 text-[13px] text-muted-foreground">Showing the invoices that need a decision, out of {company.counts.invoices} monitored.</p>
      {selected ? (
        <Surface className="mt-4 p-5">
          <SectionTitle title={selected.number} />
          <p className="text-sm leading-6 text-muted-foreground">{selected.note}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                toast.message("Reminder draft", { description: draftFor(company, "overdue invoice").split("\n")[0] })
                store.addActivity(`prepared a reminder draft for ${selected.customer}.`, "Finance", "Finance Agent")
              }}
            >
              Prepare reminder
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        </Surface>
      ) : null}
      <Surface className="mt-6 p-5">
        <SectionTitle title="Collections against revenue" />
        <RevenueChart data={company.series} />
      </Surface>
    </div>
  )
}
