"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export default function GrowthOverviewPage() {
  const { profile, store } = useGrowthView()
  const router = useRouter()
  const [stageId, setStageId] = useState(profile.funnel[1]?.id ?? "leads")
  const stage = profile.funnel.find((item) => item.id === stageId) ?? profile.funnel[0]

  return (
    <div>
      <PageHeader
        title="Growth Engine"
        description="See where your next customers are coming from."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const lead = store.simulateLead()
                toast.success(`Simulated enquiry from ${lead.company}`)
                router.push("/growth/inbox")
              }}
            >
              Simulate new lead
            </Button>
            <Button onClick={() => { store.setDemoStep(0); router.push("/") }}>Start client demo</Button>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {profile.metrics.map((metric) => (
          <Surface key={metric.id} className="p-5">
            <div className="text-[13px] text-muted-foreground">{metric.label}</div>
            <div className="mt-2 text-[28px] font-semibold tracking-tight tabular-nums">{metric.display}</div>
            <div className="mt-2 text-[13px]">
              <span className={metric.change === 0 ? "text-muted-foreground" : (metric.change > 0) === metric.upIsGood ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
                {metric.change > 0 ? "↑" : metric.change < 0 ? "↓" : "–"} {Math.abs(metric.change).toFixed(1)}%
              </span>
              <span className="ml-2 text-muted-foreground">{metric.context}</span>
            </div>
          </Surface>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">{profile.pipelineNote}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Funnel</h2>
          <div className="space-y-2">
            {profile.funnel.map((item, index) => (
              <button key={item.id} onClick={() => setStageId(item.id)} className={cn("w-full rounded-xl border px-4 py-3 text-left transition-colors", stageId === item.id ? "border-primary bg-brand-soft" : "bg-card hover:bg-muted")}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm tabular-nums">{item.count.toLocaleString("en-US")}</span>
                </div>
                {item.conversion !== null ? <div className="mt-1 text-[12px] text-muted-foreground">{item.conversion}% from the previous step · {item.dropOff}% drop-off</div> : <div className="mt-1 text-[12px] text-muted-foreground">Top of the funnel</div>}
                {index < profile.funnel.length - 1 ? <div className="pt-1 text-center text-[11px] text-muted-foreground">↓</div> : null}
              </button>
            ))}
          </div>
        </div>
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">{stage?.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">People and sources in this step. Clicking a stage does not change the records.</p>
          <ul className="mt-4 divide-y">
            {stage?.people.map((person) => (
              <li key={person.name} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-medium">{person.name}</span>
                <span className="text-muted-foreground">{person.detail}</span>
              </li>
            ))}
          </ul>
          <Link href="/growth/pipeline" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>Open pipeline</Link>
        </Surface>
      </div>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">Since yesterday</h2>
        <p className="mt-2 text-sm leading-6">{profile.yesterday.leads} new leads. {profile.yesterday.qualified} qualified. {profile.yesterday.meetings} meetings booked. Pipeline added {profile.yesterday.pipeline}. {profile.yesterday.note}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/growth/command" className="font-medium text-brand">Growth command</Link>
          <Link href="/brief" className="font-medium text-brand">Morning brief</Link>
          <Link href="/wrap-up" className="font-medium text-brand">Daily wrap-up</Link>
        </div>
      </Surface>
    </div>
  )
}
