"use client"

import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { money, stageLabel, stages, useGrowthView } from "@/components/growth/kit"

export default function PipelinePage() {
  const { deals, profile, overlay, store } = useGrowthView()
  const followups = profile.followups.filter((item) => !overlay.dismissedFollowups.includes(item.id))
  return (
    <div>
      <PageHeader title="Sales pipeline" description="Move a deal with the stage menu. Drag-and-drop is intentionally not used, so a demo does not lose a card." />
      {followups.length === 0 ? <Surface className="mb-4 p-4 text-sm">You’re caught up. New follow-up opportunities will appear here.</Surface> : (
        <div className="mb-4 grid gap-3 lg:grid-cols-3">
          {followups.map((item) => (
            <Surface key={item.id} className="p-4">
              <div className="text-sm font-medium">{item.title}</div>
              <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{item.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
                <button className="font-medium text-brand" onClick={() => toast.message(`Draft for ${item.company}. Nothing is sent.`)}>Draft follow-up</button>
                <button className="text-muted-foreground" onClick={() => { store.addActivity(`assigned ${store.company.people[0]} to ${item.company}.`, "Sales"); toast.success(`Assigned to ${store.company.people[0]}`) }}>Assign</button>
                <button className="text-muted-foreground" onClick={() => { store.addActivity(`will follow up with ${item.company} tomorrow.`, "Sales"); toast.success("Reminder set for tomorrow") }}>Remind tomorrow</button>
                <button className="text-muted-foreground" onClick={() => store.dismissFollowup(item.id)}>Move to nurture</button>
                <button className="text-muted-foreground" onClick={() => { store.dismissFollowup(item.id); toast("Closed as lost in this demo. The company record stays.") }}>Close lost</button>
              </div>
            </Surface>
          ))}
        </div>
      )}
      <div className="flex gap-3 overflow-auto pb-2">
        {stages.map((stage) => {
          const column = deals.filter((deal) => deal.stage === stage)
          return (
            <div key={stage} className="w-[260px] shrink-0">
              <div className="mb-2 flex items-center justify-between text-[13px]">
                <span className="font-medium">{stageLabel(stage)}</span>
                <span className="text-muted-foreground">{column.length}</span>
              </div>
              <div className="space-y-2">
                {column.map((deal) => (
                  <Surface key={deal.id} className="p-3">
                    <div className="text-sm font-medium">{deal.company}</div>
                    <div className="mt-1 text-[13px] tabular-nums">{money(deal.value)} · {deal.days}d · {deal.owner}</div>
                    <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{deal.insight}</p>
                    <div className="mt-2 text-[12px] text-muted-foreground">Based on: {deal.basis[0]}</div>
                    <select className="mt-3 h-8 w-full rounded-lg border bg-background px-2 text-[13px]" value={deal.stage} onChange={(event) => { store.setDealStage(deal.id, event.target.value); store.addActivity(`moved ${deal.company} to ${event.target.value}.`, "Sales"); }}>
                      {stages.map((option) => <option key={option} value={option}>{stageLabel(option)}</option>)}
                    </select>
                  </Surface>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
