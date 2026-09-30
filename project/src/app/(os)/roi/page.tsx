"use client"

import { useMemo, useState } from "react"
import { PageHeader, Surface } from "@/components/blocks"
import { Input } from "@/components/ui/input"
import { calculateRoi } from "@/lib/roi"
import { formatCompactIdr, formatIdr, formatNumber } from "@/lib/format"

const fields = [
  { key: "leads", label: "Monthly leads", step: 1 },
  { key: "leadValue", label: "Average lead value (Rp)", step: 1000000 },
  { key: "responseHours", label: "Lead response time (hours)", step: 0.1 },
  { key: "missedPct", label: "Missed leads (%)", step: 1 },
  { key: "conversionPct", label: "Lead-to-sale conversion (%)", step: 0.1 },
  { key: "dealSize", label: "Average contract value (Rp)", step: 1000000 },
  { key: "employees", label: "Employees", step: 1 },
  { key: "salary", label: "Average monthly salary (Rp)", step: 100000 },
  { key: "hoursPerWeek", label: "Hours of repetitive work, per person", step: 0.5 },
  { key: "marketingSpend", label: "Monthly marketing spend (Rp)", step: 1000000 },
] as const

export default function RoiPage() {
  const [input, setInput] = useState({
    employees: 25,
    salary: 8_500_000,
    hoursPerWeek: 6,
    leads: 80,
    leadValue: 12_000_000,
    responseHours: 4,
    missedPct: 18,
    conversionPct: 12,
    dealSize: 45_000_000,
    marketingSpend: 18_000_000,
  })
  const result = useMemo(() => calculateRoi(input), [input])

  return (
    <div>
      <PageHeader
        title="ROI Calculator"
        description="Potential opportunity based on the assumptions provided. This is not a forecast of revenue."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-5">
          <div className="grid gap-4">
            {fields.map((field) => (
              <label key={field.key} className="text-sm">
                <span className="mb-1.5 block text-[13px] text-muted-foreground">{field.label}</span>
                <Input
                  type="number"
                  min={0}
                  step={field.step}
                  value={input[field.key]}
                  className="h-10"
                  onChange={(event) => setInput((current) => ({ ...current, [field.key]: Number(event.target.value) }))}
                />
              </label>
            ))}
          </div>
        </Surface>
        <div className="grid gap-3 sm:grid-cols-2">
          <Result label="Potential recovered opportunities" value={formatNumber(Math.round(result.recoveredLeads))} note={`Monthly leads × the missed-lead share you entered. You also entered ${input.responseHours} hours to first response and ${formatCompactIdr(input.leadValue)} average lead value. Those are assumptions, not a measured recovery.`} />
          <Result label="Potential time saved" value={`${formatNumber(Math.round(result.hoursMonth))} hours / month`} note="Employees × repetitive hours × 4.33 weeks. This is the work that could move, not a guarantee." />
          <Result label="Estimated labor efficiency opportunity" value={formatIdr(Math.round(result.laborCost))} note="Those hours × salary ÷ 173. An hourly cost assumption, not a payroll cut." />
          <Result label="Potential pipeline impact" value={formatCompactIdr(Math.round(result.pipeline))} note={`Recovered opportunities × ${result.closeRate * 100}% conversion × contract value. Marketing spend of ${formatCompactIdr(input.marketingSpend)} is shown as context and is not subtracted.`} />
        </div>
      </div>
    </div>
  )
}

function Result({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Surface className="p-5">
      <div className="text-[13px] text-muted-foreground">{label}</div>
      <div className="mt-2 text-[26px] font-semibold tracking-tight tabular-nums">{value}</div>
      <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{note}</p>
    </Surface>
  )
}
