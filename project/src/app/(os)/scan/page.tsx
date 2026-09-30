"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { buildScanReport, scanSteps } from "@/data/scan"
import { useCompany } from "@/hooks/company-store"
import { cn } from "cn"

export default function ScanPage() {
  const { scan, setScan } = useCompany()
  const router = useRouter()
  const [other, setOther] = useState("")
  const step = scanSteps[scan.step]
  const report = scan.done ? buildScanReport(scan.answers) : null
  const selected = step ? scan.answers[step.id] : ""

  function choose(option: string) {
    if (!step) return
    setScan({ ...scan, answers: { ...scan.answers, [step.id]: option } })
    if (option !== "Other") setOther("")
  }

  function next() {
    if (!step) return
    const value = selected === "Other" ? other.trim() : selected
    if (!value) return
    const answers = { ...scan.answers, [step.id]: value }
    if (scan.step === scanSteps.length - 1) setScan({ step: scan.step, answers, done: true })
    else setScan({ step: scan.step + 1, answers, done: false })
  }

  if (report) {
    return (
      <div>
        <PageHeader
          title="Your recommended Droppflow setup"
          description="Potential opportunity based on provided information. This is a starting point for the conversation, not a guaranteed saving."
          actions={
            <Button
              variant="outline"
              onClick={() => {
                setScan({ step: 0, answers: {}, done: false })
                setOther("")
              }}
            >
              Start over
            </Button>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Surface className="p-6">
            <h2 className="text-lg font-semibold">Recommended agents</h2>
            <ul className="mt-4 divide-y">
              {report.agents.map((agent) => (
                <li key={agent} className="py-3 text-sm font-medium">
                  {agent}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Recommended automations</h2>
            <ul className="mt-3 space-y-2">
              {report.automations.map((item) => (
                <li key={item} className="text-sm leading-6">
                  {item}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Lead generation</h2>
            <ul className="mt-3 space-y-2">
              {report.leadWorkflows.map((item) => (
                <li key={item} className="text-sm leading-6">{item}</li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Follow-up</h2>
            <ul className="mt-3 space-y-2">
              {report.followWorkflows.map((item) => (
                <li key={item} className="text-sm leading-6">{item}</li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Social</h2>
            <ul className="mt-3 space-y-2">
              {report.socialWorkflows.map((item) => (
                <li key={item} className="text-sm leading-6">{item}</li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Owner notifications</h2>
            <ul className="mt-3 space-y-2">
              {report.notifications.map((item) => (
                <li key={item} className="text-sm leading-6">{item}</li>
              ))}
            </ul>
          </Surface>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Surface className="p-4">
                <div className="text-[12px] text-muted-foreground">Automations</div>
                <div className="mt-1 text-[26px] font-semibold tabular-nums">{report.automations.length}</div>
              </Surface>
              <Surface className="p-4">
                <div className="text-[12px] text-muted-foreground">Repetitive work</div>
                <div className="mt-1 text-[22px] font-semibold leading-tight">{report.hours}</div>
              </Surface>
              <Surface className="p-4">
                <div className="text-[12px] text-muted-foreground">Missed-lead estimate</div>
                <div className="mt-1 text-[18px] font-semibold leading-tight">{report.missedLeads}</div>
              </Surface>
            </div>
            <Surface className="p-6">
              <h2 className="text-lg font-semibold">Suggested roadmap</h2>
              <ol className="mt-4 space-y-4">
                {report.roadmap.map((item) => (
                  <li key={item.title}>
                    <div className="text-sm font-medium">{item.title}</div>
                    <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </li>
                ))}
              </ol>
              <Button
                className="mt-6"
                onClick={() => {
                  toast.success("Saved for the onboarding conversation")
                  router.push("/onboarding")
                }}
              >
                Use this as the setup
              </Button>
            </Surface>
          </div>
        </div>
      </div>
    )
  }

  if (!step) return null
  const progress = ((scan.step + 1) / scanSteps.length) * 100

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Business Scan" description="A short conversation you can run on a sales call. Answers stay in this browser." />
      <div className="mb-2 text-[13px] text-muted-foreground">
        Step {scan.step + 1} of {scanSteps.length}
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>
      <Surface className="p-6">
        <h2 className="text-[22px] font-semibold tracking-tight">{step.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.helper}</p>
        <div className="mt-5 grid gap-2">
          {step.options.map((option) => (
            <button
              key={option}
              onClick={() => choose(option)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-150 hover:border-foreground/20",
                selected === option && "border-primary bg-brand-soft text-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        {selected === "Other" ? (
          <Input className="mt-3 h-10" value={other} onChange={(event) => setOther(event.target.value)} placeholder="Tell us in a few words" />
        ) : null}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            disabled={scan.step === 0}
            onClick={() => setScan({ ...scan, step: Math.max(0, scan.step - 1), done: false })}
          >
            Back
          </Button>
          <Button disabled={!selected || (selected === "Other" && !other.trim())} onClick={next}>
            {scan.step === scanSteps.length - 1 ? "See recommendation" : "Continue"}
          </Button>
        </div>
      </Surface>
    </div>
  )
}
