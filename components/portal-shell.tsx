import type { ReactNode } from "react"

import { ThemeToggle } from "@/components/theme-toggle"

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-border/60 bg-background/70 supports-backdrop-filter:backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-col">
            <h1 className="font-sans text-lg leading-tight font-semibold tracking-tight sm:text-xl">
              URL 门户
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
