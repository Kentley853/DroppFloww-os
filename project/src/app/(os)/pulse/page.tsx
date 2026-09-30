"use client"

import { useState } from "react"
import { PageHeader, PulseFeed } from "@/components/blocks"
import { useCompany } from "@/hooks/company-store"
import { cn } from "cn"

const filters = ["All", "High", "Sales", "Finance", "Operations", "Marketing", "Customer Service"]

export default function PulsePage() {
  const { company } = useCompany()
  const [filter, setFilter] = useState("All")
  const items = company.pulse.filter((item) => {
    if (filter === "All") return true
    if (filter === "High") return item.priority === "high"
    return item.department === filter
  })
  return (
    <div>
      <PageHeader title="Company Pulse" description="What the company found since yesterday. Dismiss anything you have already handled." />
      <div className="mb-4 flex gap-2 overflow-auto">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn("shrink-0 rounded-full border px-3 py-1 text-[13px]", filter === item ? "border-transparent bg-brand-soft text-brand" : "hover:bg-muted")}
          >
            {item}
          </button>
        ))}
      </div>
      <PulseFeed items={items} />
    </div>
  )
}
