export type RoiInput = {
  employees: number
  salary: number
  hoursPerWeek: number
  leads: number
  leadValue: number
  responseHours: number
  missedPct: number
  conversionPct: number
  dealSize: number
  marketingSpend: number
}

export type RoiResult = {
  hoursMonth: number
  laborCost: number
  recoveredLeads: number
  pipeline: number
  closeRate: number
}

export function calculateRoi(input: RoiInput): RoiResult {
  const hoursMonth = input.employees * input.hoursPerWeek * 4.33
  const hourly = input.salary / 173
  const laborCost = hoursMonth * hourly
  const recoveredLeads = input.leads * (input.missedPct / 100)
  const closeRate = Math.min(Math.max(input.conversionPct, 0), 100) / 100
  const pipeline = recoveredLeads * closeRate * input.dealSize
  return {
    hoursMonth,
    laborCost,
    recoveredLeads,
    pipeline,
    closeRate,
  }
}
