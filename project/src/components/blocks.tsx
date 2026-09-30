"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCompany } from "@/hooks/company-store"
import { formatChange, formatMetric } from "@/lib/format"
import type { Metric, PulseItem } from "@/types"
import { cn } from "cn"

export function Surface({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04)]", className)} {...props}>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[30px]">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-[15px] leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  )
}

const pillClass: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  paid: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  approved: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  won: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  completed: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  resolved: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  "on-track": "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
  pending: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  open: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  "at-risk": "bg-orange-50 text-orange-900 dark:bg-orange-950/40 dark:text-orange-100",
  overdue: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-100",
  delayed: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-100",
  high: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-100",
  medium: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  paused: "bg-muted text-foreground",
  idle: "bg-muted text-muted-foreground",
  rejected: "bg-muted text-muted-foreground",
  modified: "bg-brand-soft text-brand",
  information: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  critical: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-100",
  approval: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  opportunity: "bg-brand-soft text-brand",
}

export function StatusPill({ value }: { value: string }) {
  const label = value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium", pillClass[value] ?? "bg-muted text-foreground")}>
      {label}
    </span>
  )
}

export function MetricCard({ metric }: { metric: Metric }) {
  const good = metric.change === 0 ? null : (metric.change > 0) === metric.upIsGood
  return (
    <Surface className="p-5">
      <div className="text-[13px] text-muted-foreground">{metric.label}</div>
      <div className="mt-2 text-[28px] font-semibold tracking-tight tabular-nums">{formatMetric(metric.value, metric.format)}</div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
        <span className={good === null ? "text-muted-foreground" : good ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
          {metric.change === 0 ? "No change" : formatChange(metric.change)}
        </span>
        <span className="text-muted-foreground">{metric.context}</span>
      </div>
    </Surface>
  )
}

const priorityCopy: Record<PulseItem["priority"], string> = {
  high: "High priority",
  medium: "Needs attention",
  low: "Insight",
}

export function PulseFeed({ items, compact = false }: { items?: PulseItem[]; compact?: boolean }) {
  const store = useCompany()
  const router = useRouter()
  const [assignFor, setAssignFor] = useState<PulseItem | null>(null)
  const [person, setPerson] = useState(store.company.people[0] ?? "")
  const visible = (items ?? store.company.pulse).filter((item) => !store.dismissedPulse.includes(item.id))

  if (!visible.length) {
    return (
      <Surface className="px-5 py-10 text-center">
        <div className="text-[15px] font-medium">Nothing urgent here.</div>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">Company Pulse will surface new items as the day moves. You are on track for the moment.</p>
      </Surface>
    )
  }

  return (
    <div className="space-y-3">
      {visible.slice(0, compact ? 4 : visible.length).map((item) => (
        <Surface key={item.id} className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className={cn("text-[11px] font-medium tracking-wide uppercase", item.priority === "high" ? "text-rose-700 dark:text-rose-300" : item.priority === "medium" ? "text-amber-800 dark:text-amber-200" : "text-muted-foreground")}>
                {priorityCopy[item.priority]}
              </div>
              <h3 className="mt-1 text-[15px] font-semibold leading-6">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
              <div className="mt-2 text-[13px] text-muted-foreground">
                {item.department} · {item.time}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.actions.includes("view") && item.href ? (
              <Button variant="outline" size="sm" onClick={() => router.push(item.href!)}>
                View details
              </Button>
            ) : null}
            {item.actions.includes("ask") ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/workforce/executive?q=${encodeURIComponent(item.askPrompt ?? item.title)}`)}
              >
                Ask AI
              </Button>
            ) : null}
            {item.actions.includes("assign") ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPerson(store.company.people[0] ?? "")
                  setAssignFor(item)
                }}
              >
                Assign
              </Button>
            ) : null}
            {item.actions.includes("approve") ? (
              <Button variant="outline" size="sm" onClick={() => router.push(item.approvalId ? `/approvals?focus=${item.approvalId}` : "/approvals")}>
                Approve
              </Button>
            ) : null}
            {item.actions.includes("dismiss") || true ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  store.dismissPulse(item.id)
                  toast("Dismissed from Company Pulse", {
                    action: { label: "Undo", onClick: () => store.restorePulse(item.id) },
                  })
                }}
              >
                Dismiss
              </Button>
            ) : null}
          </div>
        </Surface>
      ))}
      <Dialog open={!!assignFor} onOpenChange={(open) => !open && setAssignFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign this item</DialogTitle>
            <DialogDescription>Someone on the team will see it in the activity log. Nothing is sent externally.</DialogDescription>
          </DialogHeader>
          <label className="text-sm">
            <span className="mb-1.5 block text-[13px] text-muted-foreground">Owner</span>
            <select
              className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm"
              value={person}
              onChange={(event) => setPerson(event.target.value)}
            >
              {store.company.people.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignFor(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!assignFor) return
                store.addActivity(`assigned ${person} to “${assignFor.title}”.`, assignFor.department)
                toast.success(`Assigned to ${person}`)
                setAssignFor(null)
              }}
            >
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DataTable<T>({
  rows,
  columns,
  onRow,
  empty,
}: {
  rows: T[]
  columns: { header: string; cell: (row: T) => React.ReactNode; className?: string }[]
  onRow?: (row: T) => void
  empty: string
}) {
  if (!rows.length) {
    return (
      <Surface className="px-5 py-12 text-center">
        <div className="text-[15px] font-medium">Nothing in this view.</div>
        <p className="mt-1 text-sm text-muted-foreground">{empty}</p>
      </Surface>
    )
  }
  return (
    <>
      <Surface className="hidden overflow-hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[13px] text-muted-foreground">
              {columns.map((column) => (
                <th key={column.header} className={cn("px-4 py-3 font-medium", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={cn("border-b border-border/80 last:border-0", onRow && "cursor-pointer hover:bg-muted/60")}
                onClick={() => onRow?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.header} className={cn("px-4 py-3.5 align-middle", column.className)}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
      <div className="space-y-3 md:hidden">
        {rows.map((row, index) => (
          <Surface key={index} className={cn("p-4", onRow && "cursor-pointer")} onClick={() => onRow?.(row)}>
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.header} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-[12px] text-muted-foreground">{column.header}</span>
                  <span className="text-right">{column.cell(row)}</span>
                </div>
              ))}
            </div>
          </Surface>
        ))}
      </div>
    </>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Surface className="px-5 py-12 text-center">
      <div className="text-[15px] font-medium">{title}</div>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
    </Surface>
  )
}
