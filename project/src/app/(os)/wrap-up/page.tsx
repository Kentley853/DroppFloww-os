"use client"

import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"

export default function WrapUpPage() {
  const { profile } = useGrowthView()
  const leads = profile.yesterday.leads + 5
  return (
    <div>
      <PageHeader title="Daily wrap-up" description="A short close for the owner. Figures use yesterday’s growth story plus the operating company." />
      <Surface className="p-6">
        <p className="text-[15px] leading-7">
          Today the company added {leads} leads, qualified {profile.yesterday.qualified + 3}, and booked {profile.yesterday.meetings + 1} meetings.
          One deal moved. Collections and support are on the operating overview.
        </p>
        <p className="mt-3 text-[15px] leading-7">Three items remain for tomorrow: the oldest proposal, anything still in Approvals, and the first meeting on the book.</p>
        <p className="mt-4 text-[13px] text-muted-foreground">These are demo totals for the story you are showing, not a live close of day.</p>
      </Surface>
    </div>
  )
}
