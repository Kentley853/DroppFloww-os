"use client"

import { getGrowth, type GrowthDeal, type GrowthLead, type GrowthStage } from "@/data/growth"
import { useCompany } from "@/hooks/company-store"
import { formatCompactIdr } from "@/lib/format"

export function useGrowthView() {
  const store = useCompany()
  const profile = getGrowth(store.company.id)
  const overlay = store.growth[store.company.id]
  const leads: GrowthLead[] = [...overlay.extraLeads, ...profile.leads].map((lead) => ({
    ...lead,
    status: (overlay.statuses[lead.id] as GrowthLead["status"]) || lead.status,
  }))
  const deals: GrowthDeal[] = [...overlay.extraDeals, ...profile.deals].map((deal) => ({
    ...deal,
    stage: (overlay.stages[deal.id] as GrowthStage) || deal.stage,
  }))
  return { store, profile, overlay, leads, deals }
}

export const stages: GrowthStage[] = ["new", "qualified", "discovery", "proposal", "negotiation", "won", "lost"]

export function stageLabel(stage: string) {
  return stage.slice(0, 1).toUpperCase() + stage.slice(1)
}

export function money(value: number) {
  return formatCompactIdr(value)
}
