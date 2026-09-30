"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { onboardingSteps } from "@/data/onboarding"
import { useCompany } from "@/hooks/company-store"

export default function OnboardingPage() {
  const { onboarding, completeStep } = useCompany()
  const [working, setWorking] = useState<string | null>(null)
  const [explain, setExplain] = useState<string | null>(null)
  const done = onboardingSteps.filter((step) => onboarding[step.id]).length

  function run(id: string, kind: "setup" | "integration") {
    if (kind === "integration") {
      setExplain(id)
      return
    }
    setWorking(id)
    window.setTimeout(() => {
      completeStep(id)
      setWorking(null)
      toast.success("Marked complete")
    }, 450)
  }

  return (
    <div>
      <PageHeader
        title="Onboarding"
        description="A checklist for going live. Connections here are simulated so a demo can walk through the sequence."
      />
      <div className="mb-4 text-sm text-muted-foreground">
        {done} of {onboardingSteps.length} complete
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${(done / onboardingSteps.length) * 100}%` }} />
      </div>
      <div className="space-y-3">
        {onboardingSteps.map((step, index) => {
          const complete = !!onboarding[step.id]
          return (
            <Surface key={step.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-medium">
                {complete ? "✓" : index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{step.title}</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.detail}</p>
              </div>
              {complete ? (
                <span className="text-[13px] font-medium text-emerald-700 dark:text-emerald-300">Complete</span>
              ) : (
                <Button size="sm" disabled={working === step.id} onClick={() => run(step.id, step.kind)}>
                  {working === step.id ? "Working…" : step.kind === "integration" ? "Simulate connection" : "Mark complete"}
                </Button>
              )}
            </Surface>
          )
        })}
      </div>
      {done === onboardingSteps.length ? (
        <Surface className="mt-4 p-5">
          <div className="text-[15px] font-medium">The checklist is complete.</div>
          <p className="mt-1 text-sm text-muted-foreground">In a live company, this is the moment you invite the team. Sensitive actions still wait for approval.</p>
        </Surface>
      ) : null}
      <Dialog open={!!explain} onOpenChange={(open) => !open && setExplain(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Simulated connection</DialogTitle>
            <DialogDescription>This prototype does not contact Google, your inbox, or your accounting system. Marking it complete only records the step locally.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setExplain(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!explain) return
                completeStep(explain)
                toast.success("Connection simulated")
                setExplain(null)
              }}
            >
              Mark connected
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
