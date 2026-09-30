"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DataTable, PageHeader, StatusPill } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { useCompany } from "@/hooks/company-store"
import type { WorkItem } from "@/types"

export default function OperationsPage() {
  const store = useCompany()
  const { company } = store
  const [selected, setSelected] = useState<WorkItem | null>(null)
  return (
    <div>
      <PageHeader title="Operations" description={company.blurbs.operations} />
      <DataTable
        rows={company.work}
        empty="No active work."
        onRow={setSelected}
        columns={[
          { header: company.labels.work, cell: (row) => <span className="font-medium">{row.name}</span> },
          { header: "Owner", cell: (row) => row.owner },
          { header: "Progress", cell: (row) => <span className="tabular-nums">{row.progress}%</span> },
          { header: "Due", cell: (row) => row.due },
          { header: "Status", cell: (row) => <StatusPill value={row.status} /> },
        ]}
      />
      <p className="mt-3 text-[13px] text-muted-foreground">
        {company.counts.projects} items are being watched. These are the ones that need a person.
      </p>
      {selected ? (
        <div className="mt-4 rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">{selected.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.note}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${selected.progress}%` }} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                store.addActivity(`asked ${selected.owner} for an update on ${selected.name}.`, "Operations")
                toast.success(`Asked ${selected.owner} for an update`)
              }}
            >
              Ask for an update
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
