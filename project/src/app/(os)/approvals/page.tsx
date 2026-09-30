"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { toast } from "sonner"
import { getAgent } from "@/agents/definitions"
import { PageHeader, StatusPill, Surface } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCompany } from "@/hooks/company-store"
import type { Approval } from "@/types"
import { cn } from "cn"

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading approvals…</p>}>
      <Approvals />
    </Suspense>
  )
}

function Approvals() {
  const store = useCompany()
  const focus = useSearchParams().get("focus")
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [mode, setMode] = useState<"approved" | "rejected" | "modified" | null>(null)
  const [note, setNote] = useState("")
  const [working, setWorking] = useState(false)
  const approvals = [...store.growth[store.company.id].extraApprovals, ...store.company.approvals]
  const current = approvals.find((item) => item.id === pendingId) ?? null

  function open(item: Approval, next: "approved" | "rejected" | "modified") {
    setPendingId(item.id)
    setMode(next)
    setNote("")
  }

  function confirm() {
    if (!current || !mode) return
    setWorking(true)
    window.setTimeout(() => {
      store.decide(current.id, mode, note)
      const verb = mode === "approved" ? "approved" : mode === "rejected" ? "rejected" : "modified"
      store.addActivity(`${verb} “${current.action}”.`, getAgent(current.agentId).department)
      toast.success(mode === "approved" ? "Approved" : mode === "rejected" ? "Rejected" : "Modification saved")
      setWorking(false)
      setPendingId(null)
      setMode(null)
    }, 550)
  }

  const waiting = approvals.filter((item) => !store.decisions[item.id])

  return (
    <div>
      <PageHeader
        title="Approvals"
        description="Agents can prepare work. They cannot send money, discounts, or customer messages until you say so."
      />
      {waiting.length === 0 ? (
        <Surface className="px-5 py-12 text-center">
          <div className="text-[15px] font-medium">Nothing is waiting on you.</div>
          <p className="mt-1 text-sm text-muted-foreground">Decisions you have already made stay in the activity log.</p>
        </Surface>
      ) : null}
      <div className="space-y-4">
        {approvals.map((item) => {
          const decision = store.decisions[item.id]
          const agent = getAgent(item.agentId)
          return (
            <Surface key={item.id} id={item.id} className={cn("p-5", focus === item.id && "ring-2 ring-primary/40")}>
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground">{agent.name}</span>
                <span>·</span>
                <span>{item.requestedAt}</span>
                <StatusPill value={decision?.status ?? "pending"} />
                <span className="ml-auto">Risk {item.risk}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{item.action}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.reason}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-[12px] text-muted-foreground">Financial impact</div>
                  <p className="mt-1 text-sm leading-6">{item.impact}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {item.facts.map((fact) => (
                    <div key={fact.label} className="rounded-lg border px-3 py-2">
                      <div className="text-[12px] text-muted-foreground">{fact.label}</div>
                      <div className="text-sm font-medium">{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {decision ? (
                <p className="mt-4 text-sm">
                  {decision.status === "approved" ? "Approved" : decision.status === "rejected" ? "Rejected" : "Modified"} by Alex · {decision.at}
                  {decision.note ? ` · ${decision.note}` : ""}
                </p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => open(item, "approved")}>Approve</Button>
                  <Button variant="outline" onClick={() => open(item, "modified")}>
                    Modify
                  </Button>
                  <Button variant="ghost" onClick={() => open(item, "rejected")}>
                    Reject
                  </Button>
                </div>
              )}
            </Surface>
          )
        })}
      </div>
      <Dialog open={!!current && !!mode} onOpenChange={(openState) => !openState && !working && setMode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === "approved" ? "Approve this action?" : mode === "rejected" ? "Reject this recommendation?" : "Modify before it goes further"}
            </DialogTitle>
            <DialogDescription>
              {mode === "rejected"
                ? "The record stays unchanged. You can ask the agent for a different approach later."
                : "Droppflow records your decision. Nothing is sent to a customer or a bank from this prototype."}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6">{current?.action}</p>
          {mode === "modified" ? (
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What should change?" className="min-h-24" />
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={working} onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button disabled={working || (mode === "modified" && !note.trim())} onClick={confirm}>
              {working ? "Working…" : mode === "approved" ? "Approve" : mode === "rejected" ? "Reject" : "Save modification"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
