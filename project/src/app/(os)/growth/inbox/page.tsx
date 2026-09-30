"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader, StatusPill, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"
import type { GrowthLead } from "@/data/growth"

const statuses = ["All", "New", "Contacted", "Qualified", "Meeting", "Proposal", "Won", "Lost", "Nurture"]

export default function LeadInboxPage() {
  const { profile, leads, store } = useGrowthView()
  const [status, setStatus] = useState("All")
  const [selected, setSelected] = useState<GrowthLead | null>(leads[0] ?? null)
  const visible = leads.filter((lead) => status === "All" || lead.status === status)
  const current = visible.find((lead) => lead.id === selected?.id) ?? visible[0] ?? null
  const router = useRouter()

  return (
    <div>
      <PageHeader title="Lead inbox" description="Every source in one list. New items from Simulate lead appear here. This is demo data, not a live inbox." />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Surface className="p-4"><div className="text-[12px] text-muted-foreground">Avg response</div><div className="mt-1 text-xl font-semibold">{profile.metrics.find((item) => item.id === "response")?.display}</div></Surface>
        <Surface className="p-4"><div className="text-[12px] text-muted-foreground">Waiting</div><div className="mt-1 text-xl font-semibold">{profile.speed.waiting + store.growth[store.company.id].extraLeads.length}</div></Surface>
        <Surface className="p-4"><div className="text-[12px] text-muted-foreground">Missed the hour</div><div className="mt-1 text-xl font-semibold">{profile.speed.missed}</div></Surface>
        <Surface className="p-4"><div className="text-[12px] text-muted-foreground">Drafted, not sent</div><div className="mt-1 text-xl font-semibold">{profile.speed.auto}</div></Surface>
      </div>
      <div className="mb-3 flex gap-2 overflow-auto">
        {statuses.map((item) => (
          <button key={item} onClick={() => setStatus(item)} className={`shrink-0 rounded-full border px-3 py-1 text-[13px] ${status === item ? "border-transparent bg-brand-soft text-brand" : "hover:bg-muted"}`}>{item}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-2">
          {visible.length === 0 ? <Surface className="p-8 text-sm">You’re caught up. New enquiries will appear here.</Surface> : null}
          {visible.map((lead) => (
            <button key={lead.id} onClick={() => setSelected(lead)} className={`w-full rounded-xl border px-4 py-3 text-left ${current?.id === lead.id ? "border-primary bg-card" : "bg-card hover:bg-muted"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{lead.company}</span>
                <StatusPill value={lead.classification} />
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{lead.lastMessage}</p>
              <div className="mt-2 text-[12px] text-muted-foreground">{lead.source} · {lead.owner} · score {lead.score} · {lead.response}</div>
            </button>
          ))}
        </div>
        {current ? (
          <Surface className="p-5">
            <div className="text-[12px] font-medium tracking-wide text-muted-foreground uppercase">{current.classification} lead</div>
            <h2 className="mt-1 text-lg font-semibold">{current.company}</h2>
            <p className="mt-2 text-sm leading-6">{current.reason}</p>
            <p className="mt-2 text-sm leading-6">Recommended: {current.next}</p>
            <div className="mt-3 text-[13px] text-muted-foreground">Based on: the message, the source ({current.source}), and the last CRM note in this demo.</div>
            <Surface className="mt-4 bg-muted/40 p-3 text-sm leading-6 shadow-none">{profile.speed.sampleReply}</Surface>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { store.addActivity(`approved a draft reply to ${current.company}. It was not sent to a live channel.`, "Growth"); toast.success("Reply approved. Not sent — no channel is connected.") }}>Reply</Button>
              <Button size="sm" variant="outline" onClick={() => router.push("/growth/meetings")}>Book meeting</Button>
              <Button size="sm" variant="outline" onClick={() => { store.setLeadStatus(current.id, "Qualified"); store.addActivity(`assigned ${store.company.people[0]} to ${current.company}.`, "Sales"); toast.success(`Assigned to ${store.company.people[0]}`) }}>Assign</Button>
              <Button size="sm" variant="outline" onClick={() => router.push("/growth/pipeline")}>Open profile</Button>
            </div>
            {current.score >= 85 ? <p className="mt-3 text-[13px] text-muted-foreground">High-value. A person should review before anything is sent.</p> : null}
          </Surface>
        ) : null}
      </div>
    </div>
  )
}
