"use client"

import Link from "next/link"
import { MetricCard, PageHeader, PulseFeed, SectionTitle, Surface } from "@/components/blocks"
import { RevenueChart } from "@/components/revenue-chart"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { useCompany } from "@/hooks/company-store"
import { formatCompactIdr } from "@/lib/format"

export default function OverviewPage() {
  const { company, decisions } = useCompany()
  const pending = company.approvals.filter((item) => !decisions[item.id]).length
  const activity = company.activity.slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Good morning, Alex."
        description="Here’s what needs your attention today."
        actions={
          <Link href="/approvals" className={cn(buttonVariants(), "h-9 px-3")}>
            {pending} waiting for approval
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {company.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <SectionTitle title="Company Pulse" action={<Link href="/pulse" className="text-sm font-medium text-brand">View all</Link>} />
          <PulseFeed compact />
        </section>
        <div className="space-y-6">
          <Surface className="p-5">
            <SectionTitle title="Revenue and collections" />
            <p className="mb-3 text-[13px] text-muted-foreground">Six months for {company.name}. Blue is revenue, gray is cash collected.</p>
            <RevenueChart data={company.series} />
          </Surface>
          <Surface className="p-5">
            <SectionTitle title="Recent activity" action={<Link href="/activity" className="text-sm font-medium text-brand">Activity</Link>} />
            <ul className="divide-y">
              {activity.map((item) => (
                <li key={item.id} className="flex gap-3 py-3 text-sm">
                  <span className="w-16 shrink-0 tabular-nums text-muted-foreground">{item.time}</span>
                  <span>
                    <span className="font-medium">{item.actor}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] text-muted-foreground">Cash expected this week: {formatCompactIdr(company.cashThisWeek)}. {company.cashThisWeekNote}</p>
          </Surface>
        </div>
      </div>
    </div>
  )
}
