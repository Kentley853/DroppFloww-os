"use client"

import Link from "next/link"
import { PageHeader, SectionTitle, Surface } from "@/components/blocks"
import { useCompany } from "@/hooks/company-store"
import type { BrainNode } from "@/types"

const positions: Record<string, { x: string; y: string }> = {
  sales: { x: "50%", y: "16.6%" },
  finance: { x: "83.3%", y: "50%" },
  operations: { x: "83.3%", y: "83.3%" },
  marketing: { x: "16.6%", y: "83.3%" },
  support: { x: "16.6%", y: "50%" },
}

export default function CommandCenterPage() {
  const { company } = useCompany()
  const byId = Object.fromEntries(company.brain.map((node) => [node.id, node]))

  return (
    <div>
      <PageHeader
        title="Command Center"
        description="Every department reports into the company brain. You see the work. You decide what happens next."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Surface className="relative hidden p-6 lg:block">
          <div className="relative h-[580px]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full text-border">
            {Object.entries(positions).map(([id, node]) => (
              <line key={id} x1="50%" y1="50%" x2={node.x} y2={node.y} stroke="currentColor" strokeWidth="1" />
            ))}
          </svg>
          <div className="relative grid h-full grid-cols-3 grid-rows-3">
            <div />
            <DepartmentNode node={byId.sales} />
            <div />
            <DepartmentNode node={byId.support} />
            <div className="flex items-center justify-center px-3">
              <div className="w-full max-w-[240px] rounded-xl border border-primary/30 bg-card px-5 py-5 text-center">
                <div className="text-[11px] font-medium tracking-wide text-brand uppercase">Company brain</div>
                <div className="mt-1 text-lg font-semibold">{company.name}</div>
                <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{company.summary}</p>
              </div>
            </div>
            <DepartmentNode node={byId.finance} />
            <DepartmentNode node={byId.marketing} />
            <div />
            <DepartmentNode node={byId.operations} />
          </div>
          </div>
        </Surface>
        <div className="space-y-3 lg:hidden">
          <Surface className="p-5">
            <div className="text-[11px] font-medium tracking-wide text-brand uppercase">Company brain</div>
            <div className="mt-1 text-lg font-semibold">{company.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{company.summary}</p>
          </Surface>
          {company.brain.map((node) => (
            <Link key={node.id} href={node.href} className="block">
              <Surface className="p-4 transition-colors hover:border-foreground/20">
                <div className="text-sm font-semibold">{node.name}</div>
                <div className="mt-1 text-sm">{node.status}</div>
                <div className="mt-1 text-[13px] text-muted-foreground">{node.metric}</div>
              </Surface>
            </Link>
          ))}
        </div>
        <Surface className="p-5">
          <SectionTitle title="Live status" />
          <ul className="space-y-4">
            {company.brain.map((node) => (
              <li key={node.id}>
                <Link href={node.href} className="block rounded-lg hover:bg-muted/70">
                  <div className="text-sm font-medium">{node.name}</div>
                  <div className="text-[13px] text-muted-foreground">{node.status}</div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] leading-5 text-muted-foreground">Updated with this morning’s records. Connections are the work the departments already share.</p>
        </Surface>
      </div>
    </div>
  )
}

function DepartmentNode({ node }: { node?: BrainNode }) {
  if (!node) return <div />
  return (
    <div className="flex items-center justify-center px-2">
      <Link href={node.href} className="w-full max-w-[220px] rounded-xl border bg-card px-4 py-3 transition-colors duration-150 hover:border-foreground/20">
        <div className="text-[13px] font-semibold">{node.name}</div>
        <div className="mt-1 text-[13px] leading-5">{node.status}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">{node.metric}</div>
      </Link>
    </div>
  )
}
