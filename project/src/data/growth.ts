import type { AgentId, AgentRuntime, CompanyId, Fact } from "@/types"

export type GrowthStage = "new" | "qualified" | "discovery" | "proposal" | "negotiation" | "won" | "lost"

export type LeadClass = "hot" | "warm" | "cold" | "customer" | "spam" | "partner" | "applicant"

export type GrowthLead = {
  id: string
  name: string
  company: string
  contact: string
  source: string
  lastMessage: string
  intent: string
  score: number
  owner: string
  status: "New" | "Contacted" | "Qualified" | "Meeting" | "Proposal" | "Won" | "Lost" | "Nurture"
  response: string
  classification: LeadClass
  reason: string
  next: string
  industry: string
  employees: string
  location: string
  title: string
  revenue: string
  companyType: string
  fitReason: string
  country: string
}

export type GrowthDeal = {
  id: string
  company: string
  value: number
  owner: string
  days: number
  last: string
  stage: GrowthStage
  insight: string
  source: string
  basis: string[]
}

export type GrowthMetric = {
  id: string
  label: string
  display: string
  change: number
  upIsGood: boolean
  context: string
}

export type GrowthProfile = {
  metrics: GrowthMetric[]
  yesterday: { leads: number; qualified: number; meetings: number; pipeline: string; note: string }
  funnel: { id: string; label: string; count: number; conversion: number | null; dropOff: number | null; people: { name: string; detail: string }[] }[]
  pipelineNote: string
  leads: GrowthLead[]
  prospects: GrowthLead[]
  deals: GrowthDeal[]
  followups: { id: string; title: string; detail: string; company: string }[]
  channels: { name: string; spend: number; leads: number; qualified: number; cpl: number; cpql: number; meetings: number; revenue: number; conversion: number }[]
  marketingNote: string
  campaignWatch: { id: string; name: string; spend: number; leadMove: string; qualityMove: string; note: string; recommendation: string }[]
  outbound: { id: string; name: string; audience: string; channel: string; prospects: number; sent: number; replies: number; positive: number; meetings: number; unsubscribed: number; timeline: string[] }[]
  sequence: { day: string; title: string; body: string }[]
  posts: { id: string; day: number; channel: string; topic: string; status: "Draft" | "Awaiting Approval" | "Scheduled" | "Published" }[]
  socialLead: { comment: string; company: string; classification: string; action: string }
  meetings: {
    id: string
    company: string
    when: string
    attendees: string
    value: string
    source: string
    history: string
    pains: string
    questions: string
    cares: string
    objections: string
    points: string
    next: string
  }[]
  journey: { company: string; value: string; steps: string[] }
  collaboration: { actor: string; text: string }[]
  activity: { id: string; time: string; actor: string; text: string; department: string }[]
  alerts: { id: string; category: "critical" | "approval" | "opportunity" | "information"; title: string; body: string; time: string; href: string; level: "critical" | "decision" | "opportunity" | "routine" }[]
  workflow: string[]
  speed: { waiting: number; missed: number; auto: number; sampleName: string; sampleReply: string }
  icp: { industries: string; size: string; locations: string; buyers: string; problems: string; value: string; badFit: string }
  agents: AgentRuntime[]
  contexts: Partial<Record<AgentId, Fact[]>>
  simulation: GrowthLead
  offer: string
  pain: string
}

const logistics: GrowthProfile = {
  metrics: [
    { id: "leads", label: "New leads this month", display: "286", change: 14.2, upIsGood: true, context: "vs. last month" },
    { id: "qualified", label: "Qualified leads", display: "94", change: 6.8, upIsGood: true, context: "vs. last month" },
    { id: "meetings", label: "Meetings booked", display: "37", change: 8.8, upIsGood: true, context: "vs. last month" },
    { id: "proposals", label: "Proposals sent", display: "18", change: -5.3, upIsGood: true, context: "vs. last month" },
    { id: "won", label: "Deals won", display: "7", change: 16.7, upIsGood: true, context: "vs. last month" },
    { id: "pipeline", label: "Pipeline", display: "Rp 1.24B", change: 4.1, upIsGood: true, context: "open, all stages" },
    { id: "response", label: "Avg response", display: "3m 42s", change: -12.4, upIsGood: false, context: "faster than last month" },
    { id: "conversion", label: "Lead-to-meeting", display: "12.9%", change: -0.6, upIsGood: true, context: "37 of 286" },
  ],
  yesterday: { leads: 36, qualified: 8, meetings: 3, pipeline: "Rp 185M", note: "PT Metro Logistik entered discovery." },
  funnel: [
    { id: "traffic", label: "Traffic", count: 2840, conversion: null, dropOff: null, people: [{ name: "Google Ads", detail: "1,120 visits" }, { name: "Organic search", detail: "760 visits" }, { name: "LinkedIn", detail: "410 visits" }, { name: "Referral", detail: "550 visits" }] },
    { id: "leads", label: "Leads", count: 286, conversion: 10.1, dropOff: 89.9, people: [{ name: "PT Cakra Logistics", detail: "Website · hot" }, { name: "PT Prima Distribusi", detail: "LinkedIn" }, { name: "CV Sumber Pangan", detail: "Referral" }, { name: "PT Garuda Retail", detail: "Google Ads" }] },
    { id: "qualified", label: "Qualified", count: 94, conversion: 32.9, dropOff: 67.1, people: [{ name: "PT Lautan Emas", detail: "Qualified · Rp 64M" }, { name: "CV Mitra Pangan", detail: "Qualified · Rp 38M" }, { name: "PT Cakra Logistics", detail: "Qualified · Rp 96M" }] },
    { id: "meetings", label: "Meetings", count: 37, conversion: 39.4, dropOff: 60.6, people: [{ name: "PT Metro Logistik", detail: "Discovery tomorrow" }, { name: "PT Indo Kemas", detail: "Negotiation prep" }, { name: "Sinar Jaya Distribusi", detail: "Met yesterday" }] },
    { id: "proposals", label: "Proposals", count: 18, conversion: 48.6, dropOff: 51.4, people: [{ name: "PT Nusantara", detail: "Rp 85M · waiting 3 days" }, { name: "PT Khatulistiwa Cold Chain", detail: "Rp 92M" }, { name: "PT Artha Construction", detail: "Rp 210M · pricing requested" }] },
    { id: "won", label: "Won", count: 7, conversion: 38.9, dropOff: 61.1, people: [{ name: "PT Bandar Timur", detail: "Won · lane contract" }, { name: "CV Hasil Tani", detail: "Won · weekly chilled" }, { name: "PT Samudra Retail", detail: "Won · Jakarta–Surabaya" }] },
  ],
  pipelineNote: "The qualified book on the company overview is Rp 420M. This pipeline is Rp 1.24B because it includes early-stage demand.",
  leads: [
    { id: "l-cakra", name: "Andi Wijaya", company: "PT Cakra Logistics", contact: "andi@cakralogistik.co.id", source: "Website", lastMessage: "Can you share pricing and an implementation timeline this week?", intent: "Pricing and a demo", score: 94, owner: "Rina Wijaya", status: "New", response: "6 min", classification: "hot", reason: "Asked for pricing and an implementation timeline.", next: "Respond within 10 minutes and offer a discovery call.", industry: "Logistics", employees: "80", location: "Jakarta", title: "Operations Director", revenue: "Rp 40–80B", companyType: "Private", fitReason: "High shipment volume and a small coordination team.", country: "Indonesia" },
    { id: "l-artha", name: "Farah Putri", company: "PT Artha Construction", contact: "farah@arthaconstruction.co.id", source: "LinkedIn", lastMessage: "We need a partner for site deliveries. Please send pricing.", intent: "Pricing", score: 88, owner: "Dimas Pratama", status: "Proposal", response: "1 day", classification: "hot", reason: "Requested pricing yesterday and has not received it.", next: "Send the revised rate card today.", industry: "Construction", employees: "140", location: "Tangerang", title: "Procurement Lead", revenue: "Rp 80–150B", companyType: "Private", fitReason: "Regular site deliveries and a slow manual update process.", country: "Indonesia" },
    { id: "l-nusantara", name: "Budi Santoso", company: "PT Nusantara", contact: "budi@nusantara.co.id", source: "Referral", lastMessage: "Please send the revised pricing we discussed.", intent: "Revised proposal", score: 86, owner: "Rina Wijaya", status: "Proposal", response: "3 days", classification: "warm", reason: "Strong intent, waiting on a revised price for 3 days.", next: "Send the updated proposal today.", industry: "Distribution", employees: "210", location: "Jakarta", title: "Commercial Director", revenue: "Rp 100B+", companyType: "Private", fitReason: "Multi-lane freight and a live proposal.", country: "Indonesia" },
    { id: "l-metro", name: "Sinta Hartono", company: "PT Metro Logistik", contact: "sinta@metrologistik.co.id", source: "LinkedIn", lastMessage: "We are hiring coordinators. Can you walk us through coverage?", intent: "Discovery", score: 91, owner: "Dimas Pratama", status: "Meeting", response: "18 min", classification: "hot", reason: "Growing network, active hiring, discovery is booked.", next: "Use the briefing before tomorrow’s call.", industry: "Logistics", employees: "120", location: "Jakarta", title: "Operations Director", revenue: "Rp 60–90B", companyType: "Private", fitReason: "Growing logistics company with high operational complexity and active hiring.", country: "Indonesia" },
    { id: "l-prima", name: "Yoga Pratama", company: "PT Prima Distribusi", contact: "yoga@primadistribusi.co.id", source: "Instagram", lastMessage: "Can this work with our existing ERP?", intent: "Product question", score: 77, owner: "Unassigned", status: "New", response: "Waiting", classification: "warm", reason: "Public comment asking about ERP fit. Not yet in a private thread.", next: "Reply, then move the conversation to a direct message.", industry: "Distribution", employees: "90", location: "Bekasi", title: "IT Manager", revenue: "Rp 20–40B", companyType: "Private", fitReason: "Asked a specific integration question.", country: "Indonesia" },
    { id: "l-sumber", name: "Rudi Hartono", company: "CV Sumber Pangan", contact: "WhatsApp", source: "Referral", lastMessage: "Interested, but I need my brother to agree.", intent: "Internal approval", score: 61, owner: "Sari Kusuma", status: "Contacted", response: "2 hr", classification: "warm", reason: "Interested, waiting on an internal decision.", next: "Send a one-page summary he can forward.", industry: "Food", employees: "35", location: "Tangerang", title: "Owner", revenue: "Under Rp 10B", companyType: "Family", fitReason: "Chilled deliveries twice a week.", country: "Indonesia" },
    { id: "l-guide", name: "Nina Kusuma", company: "PT Senja Retail", contact: "nina@senjaretail.co.id", source: "Email", lastMessage: "Downloaded the lane guide. No reply yet.", intent: "Content", score: 34, owner: "Sari Kusuma", status: "Nurture", response: "No reply", classification: "cold", reason: "Downloaded a guide and has not replied.", next: "One short follow-up, then leave it.", industry: "Retail", employees: "50", location: "Bandung", title: "Operations", revenue: "Rp 10–20B", companyType: "Private", fitReason: "Early interest only.", country: "Indonesia" },
    { id: "l-job", name: "Dimas Putra", company: "—", contact: "dimas.putra@gmail.com", source: "Website", lastMessage: "I am applying for the dispatcher role.", intent: "Career", score: 5, owner: "—", status: "Lost", response: "—", classification: "applicant", reason: "This is a job application, not a customer.", next: "Send it to hiring. Do not treat it as a lead.", industry: "—", employees: "—", location: "Jakarta", title: "Applicant", revenue: "—", companyType: "Person", fitReason: "Not a customer.", country: "Indonesia" },
  ],
  prospects: [
    { id: "p-metro", name: "Sinta Hartono", company: "PT Metro Logistik", contact: "Operations Director", source: "Demo prospecting", lastMessage: "Simulated match", intent: "ICP match", score: 91, owner: "Unassigned", status: "New", response: "—", classification: "hot", reason: "Growing logistics company with high operational complexity and active hiring.", next: "Research, then ask before any outreach.", industry: "Logistics", employees: "120", location: "Jakarta", title: "Operations Director", revenue: "Rp 60–90B", companyType: "Private", fitReason: "Growing logistics company with high operational complexity and active hiring.", country: "Indonesia" },
    { id: "p-indo", name: "Helena Tan", company: "PT Indo Kemas", contact: "COO", source: "Demo prospecting", lastMessage: "Simulated match", intent: "ICP match", score: 84, owner: "Unassigned", status: "New", response: "—", classification: "warm", reason: "Packaging group adding a second warehouse in Bekasi.", next: "Add to pipeline only if the ICP still fits.", industry: "Manufacturing", employees: "260", location: "Bekasi", title: "COO", revenue: "Rp 90B+", companyType: "Private", fitReason: "New warehouse and a thin coordination team.", country: "Indonesia" },
    { id: "p-garuda", name: "Intan Sari", company: "PT Garuda Retail", contact: "Founder", source: "Demo prospecting", lastMessage: "Simulated match", intent: "ICP match", score: 73, owner: "Unassigned", status: "New", response: "—", classification: "warm", reason: "E-commerce fulfillment is outgrowing spreadsheets.", next: "Check city and shipment volume before outreach.", industry: "E-commerce", employees: "45", location: "Jakarta", title: "Founder", revenue: "Rp 15B", companyType: "Private", fitReason: "Manual customer updates on every order.", country: "Indonesia" },
  ],
  deals: [
    { id: "d-prima", company: "PT Prima Distribusi", value: 74_000_000, owner: "Unassigned", days: 1, last: "Comment on Instagram", stage: "new", insight: "Asked whether this works with their ERP.", source: "Instagram", basis: ["Source: Instagram comment", "No CRM activity yet", "Question: ERP fit"] },
    { id: "d-sumber", company: "CV Sumber Pangan", value: 42_000_000, owner: "Sari Kusuma", days: 4, last: "WhatsApp yesterday", stage: "new", insight: "Waiting on a family decision.", source: "Referral", basis: ["Last message: needs internal approval"] },
    { id: "d-garuda", company: "PT Garuda Retail", value: 85_000_000, owner: "Sari Kusuma", days: 2, last: "Form submit", stage: "new", insight: "Google Ads lead, not yet called.", source: "Google Ads", basis: ["Source: Google Ads", "No owner call logged"] },
    { id: "d-lautan", company: "PT Lautan Emas", value: 64_000_000, owner: "Sari Kusuma", days: 6, last: "18 Sep", stage: "qualified", insight: "Procurement calendar is the hold-up.", source: "Referral", basis: ["CRM note: waiting on procurement", "Also has an overdue invoice"] },
    { id: "d-mitra", company: "CV Mitra Pangan", value: 38_000_000, owner: "Rina Wijaya", days: 2, last: "22 Sep", stage: "qualified", insight: "Wants chilled pricing twice a week.", source: "WhatsApp", basis: ["Last contact 2 days ago"] },
    { id: "d-cakra", company: "PT Cakra Logistics", value: 96_000_000, owner: "Rina Wijaya", days: 0, last: "Today", stage: "qualified", insight: "Asked for pricing and a timeline this week.", source: "Website", basis: ["Website form today", "Asked for pricing", "No proposal yet"] },
    { id: "d-metro", company: "PT Metro Logistik", value: 185_000_000, owner: "Dimas Pratama", days: 1, last: "Booked yesterday", stage: "discovery", insight: "Discovery is booked. Briefing is ready.", source: "LinkedIn", basis: ["Meeting booked", "ICP score 91"] },
    { id: "d-harapan", company: "PT Harapan Cargo", value: 21_000_000, owner: "Sari Kusuma", days: 4, last: "20 Sep", stage: "discovery", insight: "Small lane, useful as a reference.", source: "Referral", basis: ["CRM: qualified, quiet for 4 days"] },
    { id: "d-nusantara", company: "PT Nusantara", value: 85_000_000, owner: "Rina Wijaya", days: 3, last: "21 Sep", stage: "proposal", insight: "Customer requested revised pricing but has not received it.", source: "Referral", basis: ["Last CRM activity: 3 days ago", "Proposal status: sent", "No reply received"] },
    { id: "d-khatul", company: "PT Khatulistiwa Cold Chain", value: 92_000_000, owner: "Dimas Pratama", days: 0, last: "Today", stage: "proposal", insight: "Asked for a weekend receiving window.", source: "Website", basis: ["Proposal sent", "Contacted today"] },
    { id: "d-artha", company: "PT Artha Construction", value: 210_000_000, owner: "Dimas Pratama", days: 1, last: "Yesterday", stage: "proposal", insight: "Requested pricing yesterday and has not received a response.", source: "LinkedIn", basis: ["LinkedIn first touch", "Website visit", "Pricing request: yesterday", "No reply sent"] },
    { id: "d-sinar", company: "Sinar Jaya Distribusi", value: 120_000_000, owner: "Dimas Pratama", days: 1, last: "23 Sep", stage: "negotiation", insight: "Comparing the Bekasi lane with an incumbent.", source: "Referral", basis: ["Stage: negotiation", "Met yesterday"] },
    { id: "d-indo", company: "PT Indo Kemas", value: 128_000_000, owner: "Rina Wijaya", days: 5, last: "19 Sep", stage: "negotiation", insight: "Opened the proposal twice today.", source: "Cold outreach", basis: ["Proposal opened twice today", "No reply", "Owner last touch: 5 days ago"] },
  ],
  followups: [
    { id: "f1", title: "7 qualified leads have not been contacted in more than 24 hours.", detail: "Three of them came from Google Ads this week.", company: "Qualified book" },
    { id: "f2", title: "PT Nusantara requested revised pricing 3 days ago.", detail: "The proposal is still the one from last week.", company: "PT Nusantara" },
    { id: "f3", title: "PT Indo Kemas opened the proposal twice today.", detail: "No one has called since Thursday.", company: "PT Indo Kemas" },
  ],
  channels: [
    { name: "Google Ads", spend: 18_000_000, leads: 86, qualified: 22, cpl: 209_302, cpql: 818_182, meetings: 9, revenue: 120_000_000, conversion: 10.5 },
    { name: "Organic search", spend: 0, leads: 54, qualified: 18, cpl: 0, cpql: 0, meetings: 7, revenue: 85_000_000, conversion: 13.0 },
    { name: "LinkedIn", spend: 6_500_000, leads: 38, qualified: 16, cpl: 171_053, cpql: 406_250, meetings: 8, revenue: 210_000_000, conversion: 21.1 },
    { name: "Referral", spend: 2_400_000, leads: 42, qualified: 20, cpl: 57_143, cpql: 120_000, meetings: 8, revenue: 185_000_000, conversion: 19.0 },
    { name: "WhatsApp", spend: 0, leads: 28, qualified: 10, cpl: 0, cpql: 0, meetings: 3, revenue: 42_000_000, conversion: 10.7 },
    { name: "Email", spend: 1_100_000, leads: 18, qualified: 4, cpl: 61_111, cpql: 275_000, meetings: 1, revenue: 0, conversion: 5.6 },
    { name: "Cold outreach", spend: 0, leads: 20, qualified: 4, cpl: 0, cpql: 0, meetings: 1, revenue: 0, conversion: 5.0 },
  ],
  marketingNote: "Google Ads produced 24% more leads this week, but cost per qualified lead increased 18%. Referral still closes at the highest rate. Instagram created more enquiries than last month, and referral leads produced the best customers.",
  campaignWatch: [
    { id: "cw1", name: "West Java lanes", spend: 12_400_000, leadMove: "Lead volume increased 9%.", qualityMove: "Qualified leads decreased 14%.", note: "Most low-quality leads came from Audience B.", recommendation: "Reduce Audience B. Test a clearer landing page. Shift about 20% of the test budget toward the referral program. This stays a recommendation until you approve it." },
  ],
  outbound: [
    { id: "ob1", name: "Bekasi warehouse operators", audience: "Operations leaders at manufacturers", channel: "Email", prospects: 40, sent: 28, replies: 6, positive: 3, meetings: 1, unsubscribed: 1, timeline: ["12 Sep · list approved", "14 Sep · first note sent", "17 Sep · follow-up", "21 Sep · one meeting booked"] },
  ],
  sequence: [
    { day: "Day 1", title: "Initial note", body: "A short note about customer updates and document chasing. No pitch deck." },
    { day: "Day 3", title: "Follow-up", body: "One question: how many people currently chase shipment updates?" },
    { day: "Day 7", title: "Value message", body: "A concrete example from a similar lane, without a case-study PDF." },
    { day: "Day 12", title: "Final follow-up", body: "Close the loop. Offer to stop writing if the timing is wrong." },
  ],
  posts: [
    { id: "post1", day: 18, channel: "LinkedIn", topic: "What a missed morning window costs a shipper", status: "Published" },
    { id: "post2", day: 24, channel: "LinkedIn", topic: "Three updates your customer should not have to chase", status: "Scheduled" },
    { id: "post3", day: 28, channel: "LinkedIn", topic: "Why logistics companies lose hours every week updating customers manually", status: "Awaiting Approval" },
    { id: "post4", day: 30, channel: "Instagram", topic: "A day on the Bekasi night shift", status: "Draft" },
  ],
  socialLead: { comment: "Can this work with our existing ERP?", company: "PT Prima Distribusi", classification: "Potential lead", action: "Reply publicly, then send a direct message and assign a salesperson." },
  meetings: [
    { id: "m1", company: "PT Metro Logistik", when: "Tomorrow, 10:00", attendees: "Sinta Hartono, Operations Director · Dimas Pratama", value: "Rp 185M", source: "LinkedIn", history: "One call yesterday. She asked about coordinator workload.", pains: "Hiring coordinators to chase updates that should be routine.", questions: "Coverage, weekend receiving, how handoff works.", cares: "Visibility for shippers, fewer status calls.", objections: "They already have a carrier on two lanes.", points: "Start with one lane. Show the morning update the shipper would receive.", next: "If the lane is real, send a scoped proposal the same day." },
    { id: "m2", company: "Sinar Jaya Distribusi", when: "Thursday, 15:00", attendees: "Helen Tan · Dimas Pratama", value: "Rp 120M", source: "Referral", history: "Negotiation in progress.", pains: "Bekasi lane compared with the incumbent.", questions: "Rate and cutoff time.", cares: "Reliability over the lowest rate.", objections: "Switching cost.", points: "Do not discount past the floor without approval.", next: "Confirm the cutoff they actually need." },
    { id: "m3", company: "PT Artha Construction", when: "Not booked", attendees: "Farah Putri", value: "Rp 210M", source: "LinkedIn", history: "Pricing requested yesterday. No reply sent.", pains: "Site deliveries and manual customer updates.", questions: "Pricing.", cares: "A partner who can say where the truck is.", objections: "They may already have a haulier.", points: "Answer the pricing request before offering a meeting.", next: "Send rates, then offer two times." },
  ],
  journey: { company: "PT Artha Construction", value: "Rp 210M", steps: ["LinkedIn", "Website", "Case study", "WhatsApp", "Meeting not booked yet", "Proposal requested", "Open"] },
  collaboration: [
    { actor: "Lead Generation Agent", text: "PT Metro Logistik matches the profile. Score 91." },
    { actor: "Sales Agent", text: "Created the opportunity at Rp 185M." },
    { actor: "Marketing Agent", text: "Source attributed to LinkedIn." },
    { actor: "Meeting Agent", text: "Discovery call booked for tomorrow at 10:00." },
    { actor: "Executive Agent", text: "Pipeline increased by Rp 185M." },
  ],
  activity: [
    { id: "ga1", time: "10:44", actor: "Lead Generation Agent", text: "Found 12 matching prospects in the demo list. None were contacted.", department: "Growth" },
    { id: "ga2", time: "10:39", actor: "Speed-to-Lead Agent", text: "Drafted a reply to the PT Cakra Logistics website enquiry.", department: "Growth" },
    { id: "ga3", time: "10:31", actor: "Marketing Agent", text: "Noted that cost per qualified lead on Google Ads is up 18%.", department: "Marketing" },
    { id: "ga4", time: "10:18", actor: "Meeting Agent", text: "Booked a discovery call with PT Metro Logistik.", department: "Growth" },
    { id: "ga5", time: "09:52", actor: "Follow-Up Agent", text: "Flagged PT Nusantara. Revised pricing is 3 days old.", department: "Sales" },
    { id: "ga6", time: "09:20", actor: "Social Media Agent", text: "Prepared three LinkedIn drafts. Nothing has been published.", department: "Growth" },
    { id: "ga7", time: "08:05", actor: "Droppflow", text: "Prepared the growth briefing.", department: "Management" },
  ],
  alerts: [
    { id: "gal-hot", category: "critical", title: "Hot lead: PT Cakra Logistics", body: "They asked for a demo and pricing.", time: "6 min ago", href: "/growth/inbox", level: "critical" },
    { id: "gal-miss", category: "opportunity", title: "Missed follow-up", body: "A Rp 85M proposal has had no activity for 3 days.", time: "32 min ago", href: "/growth/pipeline", level: "decision" },
    { id: "gal-ads", category: "information", title: "Campaign warning", body: "Cost per qualified lead increased 18% this week.", time: "1 hr ago", href: "/growth/campaigns", level: "opportunity" },
    { id: "gal-meet", category: "opportunity", title: "Meeting booked", body: "PT Metro Logistik is on the calendar tomorrow at 10:00.", time: "1 hr ago", href: "/growth/meetings", level: "opportunity" },
  ],
  workflow: ["Prospect", "Qualification", "Shipping-volume check", "Quote", "Negotiation", "Contract"],
  speed: { waiting: 4, missed: 1, auto: 11, sampleName: "Andi Wijaya", sampleReply: "Hi Andi, thanks for reaching out. I can help you see whether a dedicated lane would fit. Roughly how many people currently handle customer updates and shipment questions?" },
  icp: { industries: "Logistics, manufacturing, distribution, construction", size: "30–500 employees", locations: "Greater Jakarta, West Java", buyers: "Founder, COO, Operations Director, Finance Director", problems: "Manual follow-up, disconnected spreadsheets, slow customer updates, repetitive admin", value: "Rp 40–200M a year", badFit: "One-off moves, businesses under 10 people, or anyone who only wants the lowest rate" },
  offer: "a lane and a morning update the shipper does not have to chase",
  pain: "manual customer updates and document chasing",
  agents: [
    { agentId: "lead", status: "active", focus: "Scoring demo prospects against the ICP", tasksToday: 12, lastActivity: "4 min ago", suggestions: ["Who should we call today?", "Which prospects match the profile?"], intro: "These prospects are simulated from the profile you set. Nothing has been contacted. PT Metro Logistik is the strongest match I would research first." },
    { agentId: "speed", status: "active", focus: "Watching four enquiries that are still waiting", tasksToday: 11, lastActivity: "6 min ago", suggestions: ["Who is waiting on a first reply?", "Draft a reply to PT Cakra Logistics"], intro: "Average first response this month is 3 minutes 42 seconds. Four leads are still waiting, and one has missed the hour you set as the limit." },
    { agentId: "followup", status: "active", focus: "Watching proposals that have gone quiet", tasksToday: 7, lastActivity: "9 min ago", suggestions: ["Which proposals have gone cold?", "Draft a follow-up to PT Nusantara"], intro: "Seven qualified leads have not been touched in more than a day. PT Nusantara is the one I would not leave until tomorrow." },
    { agentId: "social", status: "idle", focus: "Three LinkedIn drafts are waiting for approval", tasksToday: 3, lastActivity: "40 min ago", suggestions: ["What should we post this week?"], intro: "Nothing in this calendar has been published by a live account. The 28 September LinkedIn draft is the one waiting on you." },
    { agentId: "campaign", status: "active", focus: "Reviewing Audience B on West Java lanes", tasksToday: 4, lastActivity: "22 min ago", suggestions: ["Why did lead quality decrease?", "Which campaign should we look at?"], intro: "West Java lanes spent Rp 12.4M this week. More leads came in, and fewer of them were qualified. I would not move the budget until you approve it." },
    { agentId: "meeting", status: "active", focus: "Preparing the Metro Logistik briefing", tasksToday: 3, lastActivity: "15 min ago", suggestions: ["Prepare me for tomorrow", "Which meetings are this week?"], intro: "Tomorrow at 10:00 is PT Metro Logistik. The briefing is ready. PT Artha Construction still needs a pricing reply before a meeting makes sense." },
  ],
  contexts: {
    lead: [{ label: "Mode", value: "Simulated prospecting" }, { label: "Best match", value: "PT Metro Logistik · 91" }, { label: "Profile", value: "30–500 people, Java" }],
    speed: [{ label: "Waiting", value: "4 leads" }, { label: "Missed the hour", value: "1" }, { label: "Newest", value: "PT Cakra Logistics" }],
    followup: [{ label: "Quiet qualified", value: "7" }, { label: "Oldest proposal", value: "PT Nusantara · 3 days" }, { label: "Opened today", value: "PT Indo Kemas" }],
    social: [{ label: "Waiting approval", value: "28 Sep LinkedIn" }, { label: "Published", value: "Demo only" }],
    campaign: [{ label: "Watch", value: "West Java lanes" }, { label: "Spend this week", value: "Rp 12.4M" }, { label: "Quality", value: "Qualified leads down 14%" }],
    meeting: [{ label: "Next", value: "PT Metro Logistik · tomorrow 10:00" }, { label: "Value", value: "Rp 185M" }],
  },
  simulation: { id: "sim", name: "Nadia Permata", company: "PT Samudra Foods", contact: "nadia@samudrafoods.co.id", source: "Website", lastMessage: "We need chilled delivery from Cengkareng three times a week. Can you share a rate?", intent: "Pricing", score: 89, owner: "Rina Wijaya", status: "New", response: "Just now", classification: "hot", reason: "Asked for a rate and described a weekly volume.", next: "Reply with two questions, then offer a 20-minute call.", industry: "Food", employees: "70", location: "Jakarta", title: "Supply Chain Manager", revenue: "Rp 25B", companyType: "Private", fitReason: "Recurring chilled volume and a named decision maker.", country: "Indonesia" },
}

const dental: GrowthProfile = {
  ...logistics,
  metrics: [
    { id: "leads", label: "New enquiries this month", display: "142", change: 9.2, upIsGood: true, context: "vs. last month" },
    { id: "qualified", label: "Qualified", display: "58", change: 4.1, upIsGood: true, context: "vs. last month" },
    { id: "meetings", label: "Appointments booked", display: "36", change: 2.9, upIsGood: true, context: "vs. last month" },
    { id: "proposals", label: "Treatment plans", display: "16", change: 6.7, upIsGood: true, context: "vs. last month" },
    { id: "won", label: "Plans accepted", display: "9", change: 12.5, upIsGood: true, context: "vs. last month" },
    { id: "pipeline", label: "Open plans", display: "Rp 128M", change: 9.1, upIsGood: true, context: "matches the clinic book" },
    { id: "response", label: "Avg response", display: "6m 20s", change: 3.2, upIsGood: false, context: "slower than last month" },
    { id: "conversion", label: "Enquiry-to-appointment", display: "25.4%", change: 1.1, upIsGood: true, context: "36 of 142" },
  ],
  yesterday: { leads: 11, qualified: 4, meetings: 3, pipeline: "Rp 28M", note: "Nadia Kusuma’s veneer plan is still waiting." },
  pipelineNote: "Open treatment plans are Rp 128M, the same book as the clinic overview.",
  funnel: [
    { id: "traffic", label: "Traffic", count: 1860, conversion: null, dropOff: null, people: [{ name: "Instagram", detail: "740 visits" }, { name: "Google Ads", detail: "510 visits" }, { name: "Google Maps", detail: "380 visits" }, { name: "Referral", detail: "230 visits" }] },
    { id: "leads", label: "Enquiries", count: 142, conversion: 7.6, dropOff: 92.4, people: [{ name: "Nadia Kusuma", detail: "WhatsApp" }, { name: "Sari Melati", detail: "Instagram" }, { name: "Herman Tan", detail: "Google Maps" }] },
    { id: "qualified", label: "Qualified", count: 58, conversion: 40.8, dropOff: 59.2, people: [{ name: "Keluarga Widjaja", detail: "Two children" }, { name: "PT Cipta Rasa", detail: "Corporate checkup" }] },
    { id: "meetings", label: "Appointments", count: 36, conversion: 62.1, dropOff: 37.9, people: [{ name: "Sari Melati", detail: "Whitening next week" }, { name: "Herman Tan", detail: "Implant consult done" }] },
    { id: "proposals", label: "Plans", count: 16, conversion: 44.4, dropOff: 55.6, people: [{ name: "Nadia Kusuma", detail: "Rp 28M · timeline requested" }] },
    { id: "won", label: "Accepted", count: 9, conversion: 56.3, dropOff: 43.7, people: [{ name: "Sari Melati", detail: "Whitening paid" }] },
  ],
  leads: [
    { id: "dl1", name: "Nadia Kusuma", company: "Nadia Kusuma", contact: "WhatsApp", source: "Instagram", lastMessage: "Can you send the timeline for the veneers?", intent: "Treatment plan", score: 82, owner: "Dr. Intan", status: "Proposal", response: "4 days", classification: "hot", reason: "Asked for a revised timeline and has been waiting four days.", next: "Call today with the appointment spacing.", industry: "Patient", employees: "—", location: "Jakarta Selatan", title: "Patient", revenue: "Rp 28M plan", companyType: "Patient", fitReason: "Ready to book if the timeline is clear.", country: "Indonesia" },
    { id: "dl2", name: "Lina Widjaja", company: "Keluarga Widjaja", contact: "Phone", source: "Referral", lastMessage: "We are comparing clinics for two children.", intent: "Ortho quote", score: 70, owner: "Dr. Intan", status: "Qualified", response: "6 days", classification: "warm", reason: "Interested, needs a family decision.", next: "Send one page they can compare.", industry: "Patient", employees: "—", location: "Kebayoran", title: "Parent", revenue: "Rp 36M plan", companyType: "Family", fitReason: "Two-child ortho, referred.", country: "Indonesia" },
    { id: "dl3", name: "Alya Putri", company: "Alya Putri", contact: "Instagram", source: "Instagram", lastMessage: "Do you have Thursday evening?", intent: "Appointment", score: 66, owner: "Ayu Lestari", status: "New", response: "Waiting", classification: "warm", reason: "Asked for a time the Thursday block does not have.", next: "Offer Wednesday or Saturday.", industry: "Patient", employees: "—", location: "Jakarta", title: "Patient", revenue: "Hygiene", companyType: "Patient", fitReason: "New patient, specific time.", country: "Indonesia" },
  ],
  prospects: [],
  deals: [
    { id: "dd1", company: "Nadia Kusuma", value: 28_000_000, owner: "Dr. Intan", days: 4, last: "20 Sep", stage: "proposal", insight: "Asked for a revised treatment timeline.", source: "Instagram", basis: ["Last contact 4 days ago", "Plan value Rp 28M"] },
    { id: "dd2", company: "Herman Tan", value: 45_000_000, owner: "Dr. Surya", days: 1, last: "23 Sep", stage: "discovery", insight: "Implant consult is done. Quote not sent.", source: "Google Maps", basis: ["Consult completed", "Two waiting-time complaints"] },
    { id: "dd3", company: "Keluarga Widjaja", value: 36_000_000, owner: "Dr. Intan", days: 6, last: "18 Sep", stage: "negotiation", insight: "Comparing clinics.", source: "Referral", basis: ["Quiet for 6 days"] },
    { id: "dd4", company: "Sari Melati", value: 8_500_000, owner: "Ayu Lestari", days: 0, last: "Today", stage: "qualified", insight: "Ready to book whitening.", source: "WhatsApp", basis: ["Contacted today"] },
    { id: "dd5", company: "PT Cipta Rasa", value: 10_500_000, owner: "Ayu Lestari", days: 2, last: "22 Sep", stage: "proposal", insight: "Corporate checkup for 18 staff.", source: "Email", basis: ["Proposal sent", "Invoice also open"] },
  ],
  followups: [
    { id: "df1", title: "8 patients have not rebooked after a missed appointment.", detail: "Thursday hygiene is the gap.", company: "Kebayoran" },
    { id: "df2", title: "Nadia Kusuma has been waiting four days for a timeline.", detail: "The Rp 28M veneer plan is still open.", company: "Nadia Kusuma" },
  ],
  channels: [
    { name: "Instagram", spend: 7_500_000, leads: 64, qualified: 28, cpl: 117_188, cpql: 267_857, meetings: 18, revenue: 28_000_000, conversion: 28.1 },
    { name: "Google Ads", spend: 4_200_000, leads: 31, qualified: 12, cpl: 135_484, cpql: 350_000, meetings: 7, revenue: 36_000_000, conversion: 22.6 },
    { name: "Google Maps", spend: 0, leads: 22, qualified: 9, cpl: 0, cpql: 0, meetings: 6, revenue: 45_000_000, conversion: 27.3 },
    { name: "WhatsApp", spend: 900_000, leads: 18, qualified: 7, cpl: 50_000, cpql: 128_571, meetings: 4, revenue: 8_500_000, conversion: 22.2 },
    { name: "Referral", spend: 0, leads: 7, qualified: 2, cpl: 0, cpql: 0, meetings: 1, revenue: 10_500_000, conversion: 14.3 },
  ],
  marketingNote: "Instagram created the most enquiries. Referral and Maps produce patients who already know what they want. Thursday chairs are still the constraint, not the ads.",
  campaignWatch: [
    { id: "dcw", name: "Family ortho evening", spend: 4_200_000, leadMove: "Enquiries are up 18%.", qualityMove: "Many ask for Thursday evening, which is full.", note: "The ads are not the bottleneck. The chair plan is.", recommendation: "Do not add budget until Wednesday and Saturday are offered in the first reply." },
  ],
  workflow: ["Instagram enquiry", "WhatsApp qualification", "Appointment", "Reminder", "Consultation", "Treatment plan", "Follow-up", "Review request"],
  speed: { waiting: 3, missed: 2, auto: 6, sampleName: "Alya", sampleReply: "Hi Alya, thanks for writing. Thursday evening is full this week. I can offer Wednesday at 16:00 or Saturday at 10:00. Which is easier?" },
  icp: { industries: "Patients and small corporate checkups", size: "Families and teams of 10–30 staff", locations: "South Jakarta", buyers: "The patient, a parent, or HR", problems: "Slow replies, unclear treatment timelines, missed reminders", value: "Rp 5–45M", badFit: "Patients who need hospital care we do not provide" },
  offer: "a clear time and a written plan",
  pain: "slow replies and missed Thursday chairs",
  posts: [
    { id: "dp1", day: 22, channel: "Instagram", topic: "What to expect at a first consult", status: "Published" },
    { id: "dp2", day: 26, channel: "Instagram", topic: "Thursday evenings are full — here is how to book", status: "Awaiting Approval" },
    { id: "dp3", day: 29, channel: "Facebook", topic: "Family ortho, explained simply", status: "Draft" },
  ],
  socialLead: { comment: "Do you take Thursday evenings for a first visit?", company: "Alya Putri", classification: "Potential patient", action: "Reply with the next open time and offer WhatsApp." },
  meetings: [
    { id: "dm1", company: "Nadia Kusuma", when: "Not booked", attendees: "Nadia Kusuma · Dr. Intan", value: "Rp 28M", source: "Instagram", history: "Asked for a timeline four days ago.", pains: "Unclear spacing of veneer visits.", questions: "How many visits, and when.", cares: "A written plan.", objections: "May keep comparing clinics.", points: "Send the timeline before talking about price again.", next: "Call today." },
    { id: "dm2", company: "Sari Melati", when: "Next week", attendees: "Sari Melati · Ayu Lestari", value: "Rp 8.5M", source: "WhatsApp", history: "Ready to book whitening.", pains: "None recorded.", questions: "Time of day.", cares: "A simple appointment.", objections: "None.", points: "Confirm the chair and send a reminder.", next: "Book it." },
  ],
  journey: { company: "Nadia Kusuma", value: "Rp 28M", steps: ["Instagram", "WhatsApp", "Consult", "Treatment plan", "Waiting on timeline"] },
  collaboration: [
    { actor: "Speed-to-Lead Agent", text: "Instagram enquiry from Nadia Kusuma was qualified." },
    { actor: "Sales Agent", text: "Treatment plan opened at Rp 28M." },
    { actor: "Marketing Agent", text: "Source attributed to Instagram." },
    { actor: "Follow-Up Agent", text: "Timeline request is now four days old." },
  ],
  activity: [
    { id: "dga1", time: "10:12", actor: "Speed-to-Lead Agent", text: "Flagged three Instagram enquiries still waiting on a time.", department: "Growth" },
    { id: "dga2", time: "09:40", actor: "Follow-Up Agent", text: "Nadia Kusuma’s timeline request is four days old.", department: "Growth" },
    { id: "dga3", time: "08:10", actor: "Droppflow", text: "Prepared the clinic growth briefing.", department: "Management" },
  ],
  alerts: [
    { id: "dgal1", category: "critical", title: "Patient waiting", body: "Nadia Kusuma asked for a veneer timeline four days ago.", time: "40 min ago", href: "/growth/inbox", level: "critical" },
    { id: "dgal2", category: "information", title: "Thursday is the constraint", body: "New enquiries are asking for a block that is already full.", time: "2 hr ago", href: "/growth/marketing", level: "opportunity" },
  ],
  outbound: [],
  sequence: [
    { day: "Day 1", title: "Reply", body: "Offer two real times. Do not send a brochure." },
    { day: "Day 2", title: "Reminder", body: "One line if they have not chosen a time." },
    { day: "Day 5", title: "Close the loop", body: "Ask if they would like the plan held." },
  ],
  contexts: {
    lead: [{ label: "Mode", value: "Simulated" }, { label: "Waiting", value: "Nadia Kusuma · timeline" }, { label: "Channel", value: "Instagram" }],
    speed: [{ label: "Waiting", value: "3 enquiries" }, { label: "Constraint", value: "Thursday evening" }, { label: "Response", value: "6m 20s" }],
    followup: [{ label: "Oldest plan", value: "Nadia Kusuma · 4 days" }, { label: "No-shows", value: "8 not rebooked" }],
    social: [{ label: "Waiting approval", value: "26 Sep Instagram" }, { label: "Published", value: "Demo only" }],
    campaign: [{ label: "Watch", value: "Family ortho evening" }, { label: "Constraint", value: "Chair plan, not ads" }],
    meeting: [{ label: "Next useful step", value: "Send Nadia’s timeline" }, { label: "Ready to book", value: "Sari Melati" }],
  },
  agents: [
    { agentId: "lead", status: "idle", focus: "Clinic demand is already in the inbox", tasksToday: 2, lastActivity: "1 hr ago", suggestions: ["Who should we call today?"], intro: "Prospecting for the clinic is simulated. The live work is the people who already asked for a time. Nadia Kusuma is waiting on a written timeline." },
    { agentId: "speed", status: "active", focus: "Three enquiries still need a real appointment time", tasksToday: 6, lastActivity: "20 min ago", suggestions: ["Who is waiting on a first reply?"], intro: "Average first response this month is 6 minutes 20 seconds. Three enquiries are still waiting, and two asked for a Thursday evening that is already full." },
    { agentId: "followup", status: "active", focus: "The veneer timeline is four days old", tasksToday: 4, lastActivity: "40 min ago", suggestions: ["Which proposals have gone cold?"], intro: "Nadia Kusuma has been waiting four days for a veneer timeline. Eight patients have not rebooked after a missed visit." },
    { agentId: "social", status: "idle", focus: "One Instagram draft is waiting", tasksToday: 1, lastActivity: "Yesterday", suggestions: ["What should we post this week?"], intro: "Nothing here is published to a live account. The 26 September Instagram draft is waiting on you." },
    { agentId: "campaign", status: "active", focus: "Evening ads are asking for a full chair", tasksToday: 2, lastActivity: "2 hr ago", suggestions: ["Why did lead quality decrease?"], intro: "Family ortho ads are bringing Thursday-evening requests. The chair plan is the constraint. I would not add budget until the first reply offers Wednesday or Saturday." },
    { agentId: "meeting", status: "active", focus: "One plan needs a timeline before another visit", tasksToday: 2, lastActivity: "1 hr ago", suggestions: ["Which meetings are this week?"], intro: "Nadia Kusuma still needs a written timeline before another meeting is useful. Sari Melati is ready to book whitening." },
  ],
  simulation: { id: "dsim", name: "Bunga Lestari", company: "Bunga Lestari", contact: "WhatsApp", source: "Instagram", lastMessage: "Hi, I would like a consult for whitening. Are you open Saturday?", intent: "Appointment", score: 74, owner: "Ayu Lestari", status: "New", response: "Just now", classification: "warm", reason: "Asked for a Saturday consult.", next: "Offer Saturday 10:00 or 11:30.", industry: "Patient", employees: "—", location: "Jakarta Selatan", title: "Patient", revenue: "Whitening", companyType: "Patient", fitReason: "Clear request and a channel the clinic already uses.", country: "Indonesia" },
}

const construction: GrowthProfile = {
  ...logistics,
  metrics: [
    { id: "leads", label: "New opportunities", display: "28", change: 7.7, upIsGood: true, context: "vs. last month" },
    { id: "qualified", label: "Qualified", display: "11", change: 0, upIsGood: true, context: "vs. last month" },
    { id: "meetings", label: "Meetings", display: "6", change: 20, upIsGood: true, context: "vs. last month" },
    { id: "proposals", label: "Proposals", display: "4", change: 0, upIsGood: true, context: "vs. last month" },
    { id: "won", label: "Awarded", display: "1", change: 0, upIsGood: true, context: "this month" },
    { id: "pipeline", label: "Open bids", display: "Rp 3.15B", change: 6.4, upIsGood: true, context: "same book as the overview" },
    { id: "response", label: "Avg response", display: "5h 10m", change: 8.4, upIsGood: false, context: "slower than last month" },
    { id: "conversion", label: "Meeting rate", display: "21.4%", change: 2.1, upIsGood: true, context: "6 of 28" },
  ],
  yesterday: { leads: 2, qualified: 1, meetings: 1, pipeline: "Rp 1.2B", note: "Summarecon still needs the preliminaries page." },
  pipelineNote: "Open bids are Rp 3.15B, the same figure as the company overview.",
  funnel: [
    { id: "traffic", label: "Introductions", count: 64, conversion: null, dropOff: null, people: [{ name: "Referral", detail: "22" }, { name: "Tender", detail: "14" }, { name: "LinkedIn", detail: "11" }, { name: "Existing network", detail: "17" }] },
    { id: "leads", label: "Opportunities", count: 28, conversion: 43.8, dropOff: 56.2, people: [{ name: "Summarecon fit-out", detail: "Rp 1.2B" }, { name: "Serpong school", detail: "Rp 640M" }] },
    { id: "qualified", label: "Qualified", count: 11, conversion: 39.3, dropOff: 60.7, people: [{ name: "Yayasan Cahaya", detail: "Board date pending" }] },
    { id: "meetings", label: "Meetings", count: 6, conversion: 54.5, dropOff: 45.5, people: [{ name: "Alam Sutera", detail: "Facade sample approved" }] },
    { id: "proposals", label: "Proposals", count: 4, conversion: 66.7, dropOff: 33.3, people: [{ name: "Summarecon", detail: "Preliminaries requested 3 days ago" }] },
    { id: "won", label: "Awarded", count: 1, conversion: 25, dropOff: 75, people: [{ name: "Serpong temporary works", detail: "Collected" }] },
  ],
  leads: [
    { id: "cl1", name: "Farah", company: "Summarecon fit-out", contact: "QS", source: "Referral", lastMessage: "Please revise the preliminaries page.", intent: "Proposal revision", score: 80, owner: "Bagus Santoso", status: "Proposal", response: "3 days", classification: "hot", reason: "A Rp 1.2B bid has been waiting on a page for three days.", next: "Send the revised page today.", industry: "Property", employees: "500+", location: "Tangerang", title: "QS", revenue: "Rp 1.2B bid", companyType: "Developer", fitReason: "Live bid with a named QS.", country: "Indonesia" },
    { id: "cl2", name: "Raka Gunawan", company: "Alam Sutera clubhouse", contact: "Project lead", source: "Existing network", lastMessage: "Facade sample is approved.", intent: "Variation", score: 76, owner: "Nadia Permata", status: "Meeting", response: "Today", classification: "warm", reason: "Sample approved. Variation is ready for issue.", next: "Issue the variation after approval.", industry: "Property", employees: "—", location: "Tangerang", title: "Project lead", revenue: "Rp 330M", companyType: "Client", fitReason: "Existing site, approved sample.", country: "Indonesia" },
  ],
  prospects: [
    { id: "cp1", name: "Dewi Anggraini", company: "PT Bumi Properti", contact: "Development Director", source: "Demo prospecting", lastMessage: "Simulated", intent: "ICP", score: 78, owner: "Unassigned", status: "New", response: "—", classification: "warm", reason: "Mid-rise pipeline in Serpong. Not contacted.", next: "Research only. This list is simulated.", industry: "Property", employees: "200", location: "Serpong", title: "Development Director", revenue: "—", companyType: "Developer", fitReason: "Fit-out volume that matches recent work.", country: "Indonesia" },
  ],
  deals: [
    { id: "cd1", company: "Summarecon fit-out", value: 1_200_000_000, owner: "Bagus Santoso", days: 3, last: "21 Sep", stage: "proposal", insight: "QS asked for revised preliminaries three days ago.", source: "Referral", basis: ["Last contact: 3 days ago", "Bid Rp 1.2B", "Page not sent"] },
    { id: "cd2", company: "BSD phase 2", value: 980_000_000, owner: "Bagus Santoso", days: 1, last: "23 Sep", stage: "negotiation", insight: "Depends on the current frame recovering.", source: "Existing network", basis: ["Site is 5 days late", "Client is PT Mega Properti"] },
    { id: "cd3", company: "Serpong school", value: 640_000_000, owner: "Nadia Permata", days: 5, last: "19 Sep", stage: "qualified", insight: "Waiting on their board date.", source: "Tender", basis: ["Quiet for 5 days"] },
    { id: "cd4", company: "Alam Sutera clubhouse", value: 330_000_000, owner: "Nadia Permata", days: 0, last: "Today", stage: "discovery", insight: "Facade variation went out this morning.", source: "Existing network", basis: ["Sample approved", "Variation drafted"] },
  ],
  followups: [
    { id: "cf1", title: "Summarecon’s preliminaries page is three days late.", detail: "The bid is Rp 1.2B.", company: "Summarecon fit-out" },
    { id: "cf2", title: "Serpong school has had no contact for five days.", detail: "They are waiting on a board date. A short note is enough.", company: "Serpong school" },
  ],
  channels: [
    { name: "Referral", spend: 3_000_000, leads: 9, qualified: 4, cpl: 333_333, cpql: 750_000, meetings: 2, revenue: 0, conversion: 22 },
    { name: "Tender", spend: 0, leads: 6, qualified: 3, cpl: 0, cpql: 0, meetings: 1, revenue: 0, conversion: 16.7 },
    { name: "LinkedIn", spend: 6_500_000, leads: 5, qualified: 2, cpl: 1_300_000, cpql: 3_250_000, meetings: 1, revenue: 0, conversion: 20 },
    { name: "Existing network", spend: 0, leads: 6, qualified: 2, cpl: 0, cpql: 0, meetings: 2, revenue: 330_000_000, conversion: 33 },
    { name: "Website", spend: 0, leads: 2, qualified: 0, cpl: 0, cpql: 0, meetings: 0, revenue: 0, conversion: 0 },
  ],
  marketingNote: "The QS breakfast is why Summarecon is in the pipeline. Paid social is not where these clients come from. The existing network still produces the meetings.",
  campaignWatch: [
    { id: "ccw", name: "Project showcase", spend: 6_500_000, leadMove: "Two site visits this month from the QS breakfast, not from the paused ads.", qualityMove: "The paused LinkedIn spend has not been the source of bids.", note: "A Rp 10M launch is waiting on approval.", recommendation: "Do not launch until you confirm the budget. Reputation spend is not a pipeline promise." },
  ],
  workflow: ["Opportunity discovered", "Company research", "Decision maker", "Outreach", "Meeting", "Site discussion", "Proposal", "Negotiation", "Awarded"],
  speed: { waiting: 1, missed: 1, auto: 0, sampleName: "Farah", sampleReply: "Farah, the revised preliminaries page is the item you asked for. I can send it today. Would you like it before or after the quantity check?" },
  icp: { industries: "Developers and institutional clients", size: "Projects we can staff", locations: "Greater Jakarta", buyers: "Development director, QS, project lead", problems: "Slow revisions, unclear site status, late proposals", value: "Rp 300M–1.5B", badFit: "One-room fit-outs or work outside our licenses" },
  offer: "a clear revision and a site lead who answers",
  pain: "proposals and site questions that sit for days",
  posts: [
    { id: "cp1", day: 16, channel: "LinkedIn", topic: "What the QS breakfast was actually for", status: "Published" },
    { id: "cp2", day: 27, channel: "LinkedIn", topic: "A note on rebar delays, written for clients", status: "Draft" },
  ],
  socialLead: { comment: "Are you bidding the Serpong school package?", company: "Yayasan Cahaya", classification: "Existing opportunity", action: "Do not reply publicly. Bagus should call." },
  meetings: [
    { id: "cm1", company: "Summarecon fit-out", when: "Waiting on the page", attendees: "Farah, QS · Bagus Santoso", value: "Rp 1.2B", source: "Referral, after the QS breakfast", history: "Preliminaries requested 21 Sep.", pains: "The page is late.", questions: "Preliminaries and program.", cares: "A contractor who answers the QS.", objections: "Delay on the current BSD site may color this bid.", points: "Send the page. Do not hide the BSD delay if they ask.", next: "Send today." },
  ],
  journey: { company: "Summarecon fit-out", value: "Rp 1.2B", steps: ["QS breakfast", "Referral", "Website", "Meeting", "Proposal", "Revision requested"] },
  collaboration: [
    { actor: "Marketing Agent", text: "Summarecon is attributed to the QS breakfast, then referral." },
    { actor: "Sales Agent", text: "Bid is open at Rp 1.2B." },
    { actor: "Follow-Up Agent", text: "The preliminaries request is three days old." },
    { actor: "Operations Agent", text: "BSD delay is the context if they ask about delivery." },
  ],
  activity: [
    { id: "cga1", time: "10:02", actor: "Follow-Up Agent", text: "Flagged the Summarecon preliminaries request.", department: "Growth" },
    { id: "cga2", time: "09:15", actor: "Lead Generation Agent", text: "Added one simulated developer prospect. Not contacted.", department: "Growth" },
    { id: "cga3", time: "08:05", actor: "Droppflow", text: "Prepared the growth briefing.", department: "Management" },
  ],
  alerts: [
    { id: "cgal1", category: "critical", title: "Rp 1.2B bid is waiting", body: "Summarecon asked for a revised page three days ago.", time: "1 hr ago", href: "/growth/pipeline", level: "critical" },
    { id: "cgal2", category: "approval", title: "Showcase budget", body: "Rp 10M is waiting. It is not a guaranteed pipeline number.", time: "Yesterday", href: "/approvals", level: "decision" },
  ],
  outbound: [],
  sequence: [
    { day: "Day 1", title: "After the introduction", body: "Refer to the person who introduced you. One question about the program." },
    { day: "Day 4", title: "If they asked for a document", body: "Send the document. Do not add a new pitch." },
    { day: "Day 10", title: "Close the loop", body: "Ask if the program moved." },
  ],
  contexts: {
    lead: [{ label: "Mode", value: "Simulated" }, { label: "Research only", value: "PT Bumi Properti" }, { label: "Live bid", value: "Summarecon · Rp 1.2B" }],
    speed: [{ label: "Waiting", value: "Preliminaries page" }, { label: "Age", value: "3 days" }],
    followup: [{ label: "Bid", value: "Summarecon" }, { label: "Quiet", value: "Serpong school · 5 days" }],
    social: [{ label: "Draft", value: "Rebar note" }, { label: "Published", value: "Demo only" }],
    campaign: [{ label: "Source of the bid", value: "QS breakfast" }, { label: "Waiting approval", value: "Rp 10M showcase" }],
    meeting: [{ label: "Next", value: "Send the page first" }, { label: "Value", value: "Rp 1.2B" }],
  },
  agents: [
    { agentId: "lead", status: "idle", focus: "One simulated developer is on the research list", tasksToday: 1, lastActivity: "This morning", suggestions: ["Who matches our profile?"], intro: "Prospecting here is simulated. PT Bumi Properti is a research-only match. Nothing has been contacted." },
    { agentId: "speed", status: "active", focus: "A Rp 1.2B bid is waiting on one page", tasksToday: 1, lastActivity: "1 hr ago", suggestions: ["Who is still waiting?"], intro: "The live request is Summarecon’s preliminaries page. It has been waiting three days." },
    { agentId: "followup", status: "active", focus: "Two bids have gone quiet", tasksToday: 2, lastActivity: "55 min ago", suggestions: ["Which deals need a follow-up?"], intro: "Summarecon is the item I would not leave. Serpong school only needs a short note about the board date." },
    { agentId: "social", status: "idle", focus: "A client note is still a draft", tasksToday: 1, lastActivity: "Yesterday", suggestions: ["What should we post this week?"], intro: "The LinkedIn note on rebar delays is a draft. Nothing has been published from this prototype." },
    { agentId: "campaign", status: "idle", focus: "A showcase budget is waiting on a person", tasksToday: 1, lastActivity: "Yesterday", suggestions: ["Which campaign needs a look?"], intro: "The QS breakfast is why Summarecon is in the pipeline. A Rp 10M showcase is waiting on approval. I would not launch it from here." },
    { agentId: "meeting", status: "active", focus: "The briefing is ready once the page goes out", tasksToday: 1, lastActivity: "1 hr ago", suggestions: ["Prepare me for the next meeting"], intro: "There is no new calendar hold until the preliminaries page goes out. The Summarecon briefing is ready." },
  ],
  simulation: { id: "csim", name: "Hendra Kusuma", company: "PT Senja Development", contact: "hendra@senjadev.co.id", source: "Referral", lastMessage: "We have a fit-out in Alam Sutera. Can your team visit next week?", intent: "Site visit", score: 83, owner: "Bagus Santoso", status: "New", response: "Just now", classification: "hot", reason: "Asked for a site visit next week.", next: "Offer two visit times. Do not send a brochure first.", industry: "Property", employees: "80", location: "Tangerang", title: "Development Manager", revenue: "—", companyType: "Developer", fitReason: "Named site and a request to meet.", country: "Indonesia" },
}

const profiles: Record<CompanyId, GrowthProfile> = { logistics, dental, construction }

export function getGrowth(id: CompanyId) {
  return profiles[id]
}
