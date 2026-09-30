"use client"

import Link from "next/link"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"

const flow = [
  { stage: "Traffic", agent: "Marketing Agent", href: "/growth/marketing" },
  { stage: "Leads", agent: "Lead Generation Agent", href: "/growth/leads" },
  { stage: "Qualification", agent: "Speed-to-Lead Agent", href: "/growth/inbox" },
  { stage: "Conversations", agent: "Follow-Up Agent", href: "/growth/pipeline" },
  { stage: "Meetings", agent: "Meeting Agent", href: "/growth/meetings" },
  { stage: "Proposals", agent: "Sales Agent", href: "/growth/pipeline" },
  { stage: "Revenue", agent: "Executive Agent", href: "/" },
]

export default function GrowthCommandPage() {
  const { profile } = useGrowthView()
  return (
    <div>
      <PageHeader title="Growth Command Center" description="One path from attention to revenue. Each stage has an owner, human or agent." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {flow.map((item, index) => (
          <Link key={item.stage} href={item.href}>
            <Surface className="h-full p-4 transition-colors hover:border-foreground/20">
              <div className="text-[12px] text-muted-foreground">{index + 1}</div>
              <div className="mt-1 text-lg font-semibold">{item.stage}</div>
              <div className="mt-1 text-sm text-muted-foreground">{item.agent}</div>
            </Surface>
          </Link>
        ))}
      </div>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">How the agents handed this off</h2>
        <ol className="mt-4 space-y-3">
          {profile.collaboration.map((item) => (
            <li key={item.text} className="text-sm"><span className="font-medium">{item.actor}.</span> {item.text}</li>
          ))}
        </ol>
      </Surface>
      <p className="mt-4 text-sm text-muted-foreground">Industry path: {profile.workflow.join(" → ")}</p>
    </div>
  )
}
