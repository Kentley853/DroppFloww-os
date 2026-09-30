"use client"

import Link from "next/link"
import { PageHeader, Surface } from "@/components/blocks"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { getAgent } from "@/agents/definitions"
import { getGrowth } from "@/data/growth"
import { useCompany } from "@/hooks/company-store"

export default function WorkforcePage() {
  const { company } = useCompany()
  const seen = new Set(company.agents.map((item) => item.agentId))
  const roster = [...company.agents, ...getGrowth(company.id).agents.filter((item) => !seen.has(item.agentId))]
  return (
    <div>
      <PageHeader
        title="AI Workforce"
        description="Each department has a colleague who prepares the work. You approve anything sensitive."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {roster.map((runtime) => {
          const agent = getAgent(runtime.agentId)
          return (
            <Surface key={runtime.agentId} className="flex flex-col p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                  {agent.name.replace(" Agent", "").slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[15px] font-semibold">{agent.name}</h2>
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <span className={runtime.status === "active" ? "size-1.5 rounded-full bg-emerald-600" : "size-1.5 rounded-full bg-amber-500"} />
                      {runtime.status === "active" ? "Active" : "Idle"}
                    </span>
                  </div>
                  <div className="text-[13px] text-muted-foreground">{agent.department}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6">{runtime.focus}</p>
              <div className="mt-3 text-[13px] text-muted-foreground">
                {runtime.tasksToday} tasks today · Last activity {runtime.lastActivity}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {runtime.suggestions.slice(0, 2).map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/workforce/${runtime.agentId}?q=${encodeURIComponent(suggestion)}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-auto whitespace-normal")}
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href={`/workforce/${runtime.agentId}`} className={cn(buttonVariants(), "h-9 px-3")}>
                  Open workspace
                </Link>
              </div>
            </Surface>
          )
        })}
      </div>
    </div>
  )
}
