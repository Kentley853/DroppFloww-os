export function formatIdr(value: number) {
  return `Rp ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`
}

export function formatCompactIdr(value: number) {
  const sign = value < 0 ? "-" : ""
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) {
    return `${sign}Rp ${trim(abs / 1_000_000_000)}B`
  }
  if (abs >= 1_000_000) {
    return `${sign}Rp ${trim(abs / 1_000_000)}M`
  }
  return `${sign}Rp ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}`
}

function trim(n: number) {
  return n.toFixed(1).replace(/\.0$/, "")
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatMetric(value: number, format: "idr" | "number") {
  return format === "idr" ? formatCompactIdr(value) : formatNumber(value)
}

export function formatChange(change: number) {
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "–"
  const amount = change === 0 ? "0.0" : Math.abs(change).toFixed(1)
  return `${arrow} ${amount}%`
}
