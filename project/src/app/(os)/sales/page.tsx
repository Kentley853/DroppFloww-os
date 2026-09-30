"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DataTable, PageHeader, StatusPill, Surface } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCompany } from "@/hooks/company-store"
import { formatCompactIdr, formatIdr } from "@/lib/format"
import { draftFor } from "@/services/assistant"
import type { Opportunity } from "@/types"

export default function SalesPage() {
  const store = useCompany()
  const { company } = store
  const [query, setQuery] = useState("")
  const [stage, setStage] = useState("All")
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const stages = ["All", ...Array.from(new Set(company.opportunities.map((item) => item.stage)))]
  const rows = useMemo(
    () =>
      company.opportunities.filter((item) => {
        const matchesStage = stage === "All" || item.stage === stage
        const blob = `${item.company} ${item.contact} ${item.owner}`.toLowerCase()
        return matchesStage && blob.includes(query.toLowerCase().trim())
      }),
    [company.opportunities, query, stage]
  )
  const openValue = company.opportunities.reduce((sum, item) => sum + item.value, 0)

  return (
    <div>
      <PageHeader
        title="Sales"
        description={company.blurbs.sales}
        actions={<div className="text-sm text-muted-foreground">{formatCompactIdr(openValue)} in this view of the book</div>}
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${company.labels.customer.toLowerCase()}s`} className="h-9 sm:max-w-xs" />
        <select className="h-9 rounded-lg border bg-card px-2.5 text-sm" value={stage} onChange={(event) => setStage(event.target.value)}>
          {stages.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <DataTable
        rows={rows}
        empty="Try another stage or clear the search."
        onRow={setSelected}
        columns={[
          { header: company.labels.customer, cell: (row) => <span className="font-medium">{row.company}</span> },
          { header: "Contact", cell: (row) => row.contact },
          { header: "Value", cell: (row) => <span className="tabular-nums">{formatIdr(row.value)}</span> },
          { header: "Stage", cell: (row) => row.stage },
          { header: "Probability", cell: (row) => <span className="tabular-nums">{row.probability}%</span> },
          { header: "Owner", cell: (row) => row.owner },
          { header: "Last contact", cell: (row) => row.lastContact },
          { header: "Status", cell: (row) => <StatusPill value={row.status} /> },
        ]}
      />
      <p className="mt-3 text-[13px] text-muted-foreground">Showing priority records from {company.counts.opportunities} in the full book.</p>
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.company}</SheetTitle>
              </SheetHeader>
              <div className="space-y-3 px-4 text-sm">
                <p className="leading-6 text-muted-foreground">{selected.note}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Fact label="Value" value={formatIdr(selected.value)} />
                  <Fact label="Stage" value={selected.stage} />
                  <Fact label="Owner" value={selected.owner} />
                  <Fact label="Last contact" value={selected.lastContact} />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(draftFor(company, selected.company))
                        toast.success("Follow-up copied")
                      } catch {
                        toast.message(draftFor(company, selected.company))
                      }
                    }}
                  >
                    Draft follow-up
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      store.addActivity(`asked ${selected.owner} to follow up with ${selected.company}.`, "Sales")
                      toast.success(`Reminder left for ${selected.owner}`)
                    }}
                  >
                    Remind owner
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Surface className="p-3 shadow-none">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </Surface>
  )
}
