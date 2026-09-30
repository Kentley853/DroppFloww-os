"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AutomationsPage() {
  const { overlay, store } = useGrowthView()
  const [form, setForm] = useState({ name: "Website lead", when: "New lead enters from the website", condition: "Lead score is above 75", action: "Assign the sales owner, draft a reply, and notify them" })
  const defaults = [
    { id: "auto-web", name: "Website to a person", when: "New lead enters from the website", condition: "Score above 75", action: "Assign, draft a response, notify. A person approves the send." },
    { id: "auto-quiet", name: "Quiet for two days", when: "No reply after 2 days", condition: "Stage is qualified or proposal", action: "Create a follow-up task. Do not send it." },
  ]
  return (
    <div>
      <PageHeader title="Automations" description="A small set of rules. This is not a workflow studio. Nothing runs against a live inbox." />
      <div className="grid gap-3">
        {[...defaults, ...overlay.automations].map((item) => (
          <Surface key={item.id} className="p-5 text-sm">
            <div className="font-medium">{item.name}</div>
            <p className="mt-2">When · {item.when}</p>
            <p>If · {item.condition}</p>
            <p>Then · {item.action}</p>
            <p className="mt-2 text-[13px] text-muted-foreground">Approval sits with a person before a message or a budget moves.</p>
          </Surface>
        ))}
      </div>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">Add a demo rule</h2>
        <div className="mt-3 grid gap-3">
          {(["name", "when", "condition", "action"] as const).map((key) => (
            <Input key={key} className="h-9" value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
          ))}
          <Button onClick={() => { store.addAutomation({ id: `auto-${Date.now()}`, ...form }); toast.success("Rule saved in this browser") }}>Save rule</Button>
        </div>
      </Surface>
    </div>
  )
}
