"use client"

import { useState } from "react"
import { agents, permissionLabel } from "@/agents/definitions"
import { PageHeader, Surface } from "@/components/blocks"
import { useCompany } from "@/hooks/company-store"

export default function AgentBuilderPage() {
  const { growth, company, patchGrowth } = useCompany()
  const [id, setId] = useState(agents[1].id)
  const agent = agents.find((item) => item.id === id) ?? agents[0]
  const note = growth[company.id].agentNotes[agent.id] ?? agent.purpose
  return (
    <div>
      <PageHeader title="Agent builder" description="A configuration view. Changes are saved in this browser and do not rewrite the live agent." />
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-1">
          {agents.map((item) => (
            <button key={item.id} onClick={() => setId(item.id)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${item.id === agent.id ? "bg-brand-soft text-brand" : "hover:bg-muted"}`}>{item.name}</button>
          ))}
        </div>
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">{agent.name}</h2>
          <p className="text-sm text-muted-foreground">{agent.department}</p>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-[13px] text-muted-foreground">Primary responsibility</span>
            <textarea className="min-h-20 w-full rounded-lg border bg-background p-3 text-sm" value={note} onChange={(event) => patchGrowth({ agentNotes: { ...growth[company.id].agentNotes, [agent.id]: event.target.value } })} />
          </label>
          <h3 className="mt-5 text-sm font-medium">Works with</h3>
          <p className="mt-1 text-sm text-muted-foreground">{agent.tools.join(" · ")}</p>
          <h3 className="mt-5 text-sm font-medium">Permissions</h3>
          <ul className="mt-2 divide-y">
            {agent.permissions.map((permission) => (
              <li key={permission.action} className="flex justify-between gap-3 py-2 text-sm">
                <span>{permission.action}</span>
                <span className="text-muted-foreground">{permissionLabel[permission.level]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted-foreground">Cannot approve a large discount, send a contract, delete a customer, move money, or change an ad budget without a person.</p>
        </Surface>
      </div>
    </div>
  )
}
