"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  Bell,
  Briefcase,
  Calculator,
  Headset,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Orbit,
  ScanSearch,
  ScrollText,
  Settings,
  ShieldCheck,
  Landmark,
  Boxes,
  Search,
  Users,
  TrendingUp,
  Radar,
  Inbox,
  Columns3,
  Send,
  LineChart,
  Share2,
  Flag,
  PenLine,
  CalendarCheck,
  ChartColumn,
  Sunrise,
  Workflow,
  Plug,
  SunMedium,
  ChevronDown,
} from "lucide-react"
import { CommandDialog } from "@/components/command-dialog"
import { VoiceAssistant } from "@/components/voice-assistant"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useCompany } from "@/hooks/company-store"
import { getGrowth } from "@/data/growth"
import { getAgent, isAgentId } from "@/agents/definitions"
import { companies } from "@/data/companies"
import { cn } from "cn"
import { useTheme } from "next-themes"

const groups: { label: string; items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] }[] = [
  {
    label: "Workspace",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/brief", label: "Morning Brief", icon: Sunrise, exact: true },
      { href: "/command-center", label: "Command Center", icon: Orbit, exact: true },
      { href: "/pulse", label: "Company Pulse", icon: Activity, exact: true },
      { href: "/activity", label: "Activity", icon: ScrollText, exact: true },
    ],
  },
  {
    label: "Departments",
    items: [
      { href: "/sales", label: "Sales", icon: Briefcase },
      { href: "/finance", label: "Finance", icon: Landmark },
      { href: "/operations", label: "Operations", icon: Boxes },
      { href: "/marketing", label: "Marketing", icon: Megaphone },
      { href: "/support", label: "Customer Service", icon: Headset, exact: true },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/growth", label: "Growth Overview", icon: TrendingUp, exact: true },
      { href: "/growth/command", label: "Growth Command", icon: Orbit, exact: true },
      { href: "/growth/leads", label: "Lead Generation", icon: Radar, exact: true },
      { href: "/growth/inbox", label: "Lead Inbox", icon: Inbox, exact: true },
      { href: "/growth/pipeline", label: "Sales Pipeline", icon: Columns3, exact: true },
      { href: "/growth/outbound", label: "Outbound", icon: Send, exact: true },
      { href: "/growth/marketing", label: "Marketing", icon: LineChart, exact: true },
      { href: "/growth/social", label: "Social Media", icon: Share2, exact: true },
      { href: "/growth/campaigns", label: "Campaigns", icon: Flag, exact: true },
      { href: "/growth/content", label: "Content Studio", icon: PenLine, exact: true },
      { href: "/growth/meetings", label: "Meetings", icon: CalendarCheck, exact: true },
      { href: "/growth/analytics", label: "Growth Analytics", icon: ChartColumn, exact: true },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/workforce", label: "AI Workforce", icon: Users },
      { href: "/approvals", label: "Approvals", icon: ShieldCheck, exact: true },
      { href: "/automations", label: "Automations", icon: Workflow, exact: true },
      { href: "/agent-builder", label: "Agent Builder", icon: Users, exact: true },
    ],
  },
  {
    label: "Client tools",
    items: [
      { href: "/scan", label: "Business Scan", icon: ScanSearch },
      { href: "/roi", label: "ROI Calculator", icon: Calculator },
      { href: "/whatsapp", label: "WhatsApp", icon: MessageCircle },
      { href: "/onboarding", label: "Onboarding", icon: ListChecks, exact: true },
      { href: "/integrations", label: "Integrations", icon: Plug, exact: true },
      { href: "/wrap-up", label: "Daily Wrap-Up", icon: SunMedium, exact: true },
    ],
  },
]

function titleFor(pathname: string) {
  if (pathname.startsWith("/workforce/")) {
    const id = pathname.split("/")[2] ?? ""
    return isAgentId(id) ? getAgent(id).name : "AI Workforce"
  }
  const match = groups.flatMap((group) => group.items).find((item) => item.href === pathname)
  if (match) return match.label
  if (pathname === "/settings") return "Settings"
  return "Droppflow"
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="text-primary">
        <rect width="22" height="22" rx="6" fill="currentColor" />
        <path d="M6.2 6.2h6.3a4.3 4.3 0 0 1 0 8.6H6.2V6.2Z" fill="none" stroke="white" strokeWidth="1.6" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">Droppflow</span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { company, decisions, growth } = useCompany()
  const pending = company.approvals.filter((item) => !decisions[item.id]).length + growth[company.id].extraApprovals.filter((item) => !decisions[item.id]).length
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Workspace: true, Departments: false, Growth: true, Intelligence: false, "Client tools": false })
  return (
    <nav className="flex flex-1 flex-col gap-3 overflow-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.label}>
          <button
            type="button"
            className="flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
            onClick={() => setOpenGroups((current) => ({ ...current, [group.label]: !current[group.label] }))}
          >
            {group.label}
            <ChevronDown className={cn("size-3 transition-transform", openGroups[group.label] ? "rotate-0" : "-rotate-90")} />
          </button>
          {openGroups[group.label] ? <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] text-foreground/80 transition-colors duration-150 hover:bg-muted",
                    active && "bg-brand-soft font-medium text-brand"
                  )}
                >
                  <Icon className={cn("size-4 text-muted-foreground", active && "text-brand")} />
                  <span className="truncate">{item.label}</span>
                  {item.href === "/approvals" && pending > 0 ? (
                    <span className={cn("ml-auto text-[11px] tabular-nums", active ? "text-brand" : "text-muted-foreground")}>{pending}</span>
                  ) : null}
                </Link>
              )
            })}
          </div> : null}
        </div>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { company, ready, readNotifications, dismissedNotifications, setCompanyId, growth, demoStep, setDemoStep, simulateLead } = useCompany()
  const { setTheme, theme } = useTheme()
  const [navOpen, setNavOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "critical" | "approval" | "opportunity" | "information">("all")
  const title = titleFor(pathname)

  useEffect(() => {
    document.title = `${title} · Droppflow`
  }, [title])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  const alertMode = growth[company.id].alertMode
  const growthNotes = getGrowth(company.id).alerts.filter((item) => {
    if (dismissedNotifications.includes(item.id)) return false
    if (alertMode === "muted" || alertMode === "daily") return false
    if (alertMode === "critical") return item.level === "critical"
    return item.level !== "routine"
  })
  const notes = [...growthNotes, ...company.notifications].filter((item) => !dismissedNotifications.includes(item.id))
  const unread = notes.filter((item) => !readNotifications.includes(item.id)).length
  const visibleNotes = notes.filter((item) => filter === "all" || item.category === filter)

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="sticky top-0 hidden h-svh w-[252px] shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Logo />
        </div>
        <div className="px-5 pt-3 text-[12px] text-muted-foreground">{company.name}</div>
        <NavLinks />
        <div className="border-t p-3">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] hover:bg-muted",
              pathname === "/settings" && "bg-brand-soft font-medium text-brand"
            )}
          >
            <Settings className={cn("size-4 text-muted-foreground", pathname === "/settings" && "text-brand")} />
            Settings
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-5 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open navigation">
            <Menu />
          </Button>
          <div className="min-w-0 text-sm font-medium">{title}</div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden h-9 w-[280px] items-center gap-2 rounded-lg border bg-card px-3 text-left text-sm text-muted-foreground transition-colors duration-150 hover:border-foreground/15 md:flex xl:w-[340px]"
            >
              <Search className="size-4" />
              <span className="flex-1 truncate">Ask Droppflow anything…</span>
              <kbd className="rounded border px-1.5 text-[11px]">⌘K</kbd>
            </button>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search" onClick={() => setCommandOpen(true)}>
              <Search />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Voice" onClick={() => setVoiceOpen(true)}>
              <Mic />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative" onClick={() => setNotesOpen(true)}>
              <Bell />
              {unread > 0 ? <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" /> : null}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 hover:bg-muted" aria-label="Account">
                <span className="flex size-7 items-center justify-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand">A</span>
                <span className="hidden text-sm font-medium sm:inline">Alex</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div>Alex</div>
                    <div className="text-[12px] font-normal text-muted-foreground">Owner · {company.name}</div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setDemoStep(0); router.push("/") }}>Start client demo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { simulateLead(); router.push("/growth/inbox") }}>Simulate new lead</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/onboarding")}>Onboarding</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? "Use light mode" : "Use dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {companies.map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => setCompanyId(item.id)}>
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {demoStep !== null ? <DemoBanner /> : null}
        <main className="flex-1 px-3 py-5 pb-24 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <div className={cn("mx-auto w-full max-w-[1560px] transition-opacity duration-200", ready ? "opacity-100" : "opacity-0")}>{children}</div>
        </main>
      </div>
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[280px]">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-14 items-center border-b px-4">
            <Logo />
          </div>
          <NavLinks onNavigate={() => setNavOpen(false)} />
          <div className="border-t p-3">
            <Link href="/settings" onClick={() => setNavOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] hover:bg-muted">
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetTitle>Notifications</SheetTitle>
          <div className="flex flex-wrap gap-1.5 px-4">
            {(["all", "critical", "approval", "opportunity", "information"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] capitalize transition-colors",
                  filter === item ? "border-transparent bg-brand-soft text-brand" : "hover:bg-muted"
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-3 flex-1 space-y-2 overflow-auto px-4 pb-6">
            {visibleNotes.length === 0 ? <p className="py-8 text-sm text-muted-foreground">Nothing in this filter.</p> : null}
            {visibleNotes.map((item) => (
              <NotificationButton key={item.id} item={item} unread={!readNotifications.includes(item.id)} onOpen={() => setNotesOpen(false)} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} />
      <VoiceAssistant open={voiceOpen} onOpenChange={setVoiceOpen} />
    </div>
  )
}

const DEMO = [
  { href: "/", title: "Company overview", body: "Start with the company the owner already runs." },
  { href: "/pulse", title: "Company pulse", body: "Three things that need a person, not a feed of everything." },
  { href: "/workforce", title: "AI workforce", body: "Department agents prepare work. Sensitive actions wait." },
  { href: "/growth", title: "Growth engine", body: "The same system shows where the next customers come from." },
  { href: "/growth/inbox", title: "New lead", body: "A simulated enquiry arrives. It is not a live source." },
  { href: "/growth/inbox", title: "Qualification", body: "Score, reason, and a draft reply. Nothing is sent yet." },
  { href: "/growth/pipeline", title: "Pipeline", body: "The opportunity sits with an owner and a next step." },
  { href: "/growth/meetings", title: "Meeting", body: "A briefing is ready before anyone walks into the room." },
  { href: "/finance", title: "Finance and operations", body: "The rest of the company sees the customer when the work is real." },
  { href: "/whatsapp", title: "Owner summary", body: "One WhatsApp note. Not every event." },
]

function DemoBanner() {
  const { demoStep, setDemoStep, simulateLead } = useCompany()
  const router = useRouter()
  if (demoStep === null) return null
  const step = DEMO[demoStep] ?? DEMO[0]
  return (
    <div className="border-b bg-card px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-medium text-brand">Client demo · {demoStep + 1} of {DEMO.length}</div>
          <div className="text-sm font-medium">{step.title}</div>
          <p className="text-[13px] text-muted-foreground">{step.body}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDemoStep(null)}>Exit</Button>
          <Button
            size="sm"
            onClick={() => {
              const next = demoStep + 1
              if (next >= DEMO.length) {
                setDemoStep(null)
                return
              }
              if (DEMO[next]?.title === "New lead") simulateLead()
              setDemoStep(next)
              router.push(DEMO[next].href)
            }}
          >
            {demoStep === DEMO.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotificationButton({
  item,
  unread,
  onOpen,
}: {
  item: { id: string; category: string; title: string; body: string; time: string; href: string }
  unread: boolean
  onOpen: () => void
}) {
  const router = useRouter()
  const { markNotificationRead } = useCompany()
  return (
    <button
      type="button"
      className="w-full rounded-xl border px-3 py-3 text-left transition-colors hover:bg-muted"
      onClick={() => {
        markNotificationRead(item.id)
        router.push(item.href)
        onOpen()
      }}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{item.category}</span>
        <span className="text-[12px] text-muted-foreground">{item.time}</span>
      </span>
      <span className={cn("mt-1 block text-sm", unread && "font-medium")}>{item.title}</span>
      <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">{item.body}</span>
    </button>
  )
}
