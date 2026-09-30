"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { permissionLabel, agents } from "@/agents/definitions"
import { PageHeader, Surface } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { companies } from "@/data/companies"
import { useCompany } from "@/hooks/company-store"
import { cn } from "cn"

export default function SettingsPage() {
  const { company, setCompanyId, resetCompany } = useCompany()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const finance = agents.find((agent) => agent.id === "finance")!

  return (
    <div>
      <PageHeader title="Settings" description="Demo company, appearance, and the approval rules a buyer should see." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Demo company</h2>
          <div className="grid gap-3">
            {companies.map((item) => {
              const active = item.id === company.id
              return (
                <Surface key={item.id} className={cn("p-5", active && "ring-1 ring-primary/40")}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-semibold">{item.name}</div>
                      <div className="mt-1 text-[13px] text-muted-foreground">
                        {item.industry} · {item.employees} people
                      </div>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{item.summary}</p>
                    </div>
                    {active ? (
                      <span className="text-[13px] font-medium text-brand">Showing now</span>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCompanyId(item.id)
                          toast.success(`Now showing ${item.name}`)
                        }}
                      >
                        Use this company
                      </Button>
                    )}
                  </div>
                </Surface>
              )
            })}
          </div>
        </section>
        <div className="space-y-6">
          <Surface className="p-5">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-2 text-sm">Alex · Owner</p>
            <p className="text-[13px] text-muted-foreground">{company.name}</p>
            <div className="mt-4 flex gap-2">
              <Button variant={mounted && theme === "dark" ? "outline" : "default"} onClick={() => setTheme("light")}>
                Light
              </Button>
              <Button variant={mounted && theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
                Dark
              </Button>
            </div>
          </Surface>
          <Surface className="p-5">
            <h2 className="text-lg font-semibold">Finance Agent permissions</h2>
            <p className="mt-1 text-sm text-muted-foreground">The same pattern applies to every department. People stay in control.</p>
            <ul className="mt-3 divide-y">
              {finance.permissions.map((permission) => (
                <li key={permission.action} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>{permission.action}</span>
                  <span className={cn(permission.level === "approval" && "text-amber-800 dark:text-amber-200", permission.level === "denied" && "text-muted-foreground")}>
                    {permissionLabel[permission.level]}
                  </span>
                </li>
              ))}
            </ul>
          </Surface>
          <Surface className="p-5">
            <h2 className="text-lg font-semibold">This browser</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Approvals, dismissed pulse items, and chats are stored locally so a demo can continue. Integrations on the onboarding page are simulated.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                resetCompany()
                toast.success("Demo data restored")
              }}
            >
              Reset {company.name}
            </Button>
          </Surface>
        </div>
      </div>
    </div>
  )
}
