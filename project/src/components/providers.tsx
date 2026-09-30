"use client"

import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { CompanyProvider } from "@/hooks/company-store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider delay={300}>
        <CompanyProvider>
          {children}
          <Toaster position="top-right" />
        </CompanyProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
