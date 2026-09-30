"use client"

import { useState } from "react"
import { PageHeader, Surface } from "@/components/blocks"
import { getGrowth } from "@/data/growth"
import { useCompany } from "@/hooks/company-store"
import { cn } from "cn"

export default function ActivityPage() {
  const { company, extraActivity } = useCompany()
  const [department, setDepartment] = useState("All")
  const feed = [
    ...extraActivity.filter((item) => item.companyId === company.id).map((item) => item.item),
    ...getGrowth(company.id).activity,
    ...company.activity,
  ]
  const departments = ["All", ...Array.from(new Set(feed.map((item) => item.department)))]
  const visible = feed.filter((item) => department === "All" || item.department === department)
  return (
    <div>
      <PageHeader title="Activity" description="A single log of what changed across the company, including decisions you made." />
      <div className="mb-4 flex gap-2 overflow-auto">
        {departments.map((item) => (
          <button
            key={item}
            onClick={() => setDepartment(item)}
            className={cn("shrink-0 rounded-full border px-3 py-1 text-[13px]", department === item ? "border-transparent bg-brand-soft text-brand" : "hover:bg-muted")}
          >
            {item}
          </button>
        ))}
      </div>
      <Surface className="divide-y">
        {visible.map((item) => (
          <div key={item.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[88px_160px_1fr] sm:gap-4">
            <div className="text-[13px] tabular-nums text-muted-foreground">{item.time}</div>
            <div className="text-sm font-medium">{item.actor}</div>
            <div className="text-sm leading-6">
              {item.text}
              <span className="mt-0.5 block text-[12px] text-muted-foreground">{item.department}</span>
            </div>
          </div>
        ))}
      </Surface>
    </div>
  )
}
