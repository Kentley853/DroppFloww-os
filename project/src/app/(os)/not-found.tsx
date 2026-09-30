import Link from "next/link"

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-[28px] font-semibold tracking-tight">This page is not in the workspace.</h1>
      <p className="mt-2 text-sm text-muted-foreground">The rest of Droppflow is still available.</p>
      <Link href="/" className="mt-4 inline-flex text-sm font-medium text-brand">
        Back to overview
      </Link>
    </div>
  )
}
