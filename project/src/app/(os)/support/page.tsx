"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DataTable, PageHeader, StatusPill } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { useCompany } from "@/hooks/company-store"
import type { Ticket } from "@/types"

export default function SupportPage() {
  const store = useCompany()
  const { company } = store
  const [selected, setSelected] = useState<Ticket | null>(null)
  return (
    <div>
      <PageHeader title="Customer Service" description={company.blurbs.support} />
      <DataTable
        rows={company.tickets}
        empty="No conversations need a reply."
        onRow={setSelected}
        columns={[
          { header: company.labels.customer, cell: (row) => <span className="font-medium">{row.customer}</span> },
          { header: "Subject", cell: (row) => row.subject },
          { header: "Priority", cell: (row) => <StatusPill value={row.priority} /> },
          { header: "Status", cell: (row) => <StatusPill value={row.status} /> },
          { header: "Owner", cell: (row) => row.owner },
          { header: "Opened", cell: (row) => row.opened },
        ]}
      />
      <p className="mt-3 text-[13px] text-muted-foreground">{company.counts.conversations} conversations are being monitored.</p>
      {selected ? (
        <div className="mt-4 rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">{selected.subject}</h2>
          <p className="mt-2 text-sm leading-6">{selected.summary}</p>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                store.addActivity(`drafted a reply for ${selected.customer}.`, "Customer Service", "Customer Service Agent")
                toast.success("Reply drafted. It still needs a person to send.")
              }}
            >
              Draft reply
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                store.addActivity(`escalated ${selected.customer} to ${selected.owner}.`, "Customer Service")
                toast.success(`Escalated to ${selected.owner}`)
              }}
            >
              Escalate
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
