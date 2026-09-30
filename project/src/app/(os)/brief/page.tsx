"use client"

import Link from "next/link"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { formatCompactIdr } from "@/lib/format"

export default function BriefPage() {
  const { profile, store } = useGrowthView()
  const company = store.company
  return (
    <div>
      <PageHeader title={`Good morning, Alex.`} description="Here is what changed since yesterday." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">Business</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {company.metrics.slice(0, 4).map((metric) => <li key={metric.id} className="flex justify-between gap-3"><span>{metric.label}</span><span className="font-medium tabular-nums">{metric.format === "idr" ? formatCompactIdr(metric.value) : metric.value}</span></li>)}
          </ul>
        </Surface>
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">Growth</h2>
          <p className="mt-3 text-sm leading-6">{profile.yesterday.leads} new leads. {profile.yesterday.qualified} qualified. {profile.yesterday.meetings} meetings booked. {profile.yesterday.pipeline} pipeline added.</p>
        </Surface>
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">Attention</h2>
          <ul className="mt-3 space-y-2 text-sm">{company.pulse.slice(0, 3).map((item) => <li key={item.id}>{item.title}</li>)}</ul>
        </Surface>
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">Opportunity</h2>
          <p className="mt-3 text-sm leading-6">{profile.yesterday.note}</p>
          <p className="mt-3 text-sm">Today: follow-ups in the pipeline, approvals waiting, and the meetings on the book.</p>
          <Link href="/growth" className="mt-3 inline-block text-sm font-medium text-brand">Ask from the growth overview</Link>
        </Surface>
      </div>
    </div>
  )
}
