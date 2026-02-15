import type { ReactNode } from "react"

import urlsJson from "@/data/urls.json"

import { ThemeToggle } from "@/components/theme-toggle"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type UrlItem = {
  name: string
  url: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isUrlItem(value: unknown): value is UrlItem {
  if (!isRecord(value)) return false
  return typeof value.name === "string" && typeof value.url === "string"
}

function normalizeUrlItems(input: unknown): UrlItem[] {
  if (!Array.isArray(input)) return []
  return input.filter(isUrlItem)
}

function Shell({ children }: { children: ReactNode }) {
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
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  )
}

export default function Page() {
  const urls = normalizeUrlItems(urlsJson)

  return (
    <Shell>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {urls.map((item, index) => (
          <a
            key={`${item.name}-${item.url}`}
            href={item.url}
            className="focus-visible:ring-ring/40 rounded-xl outline-none focus-visible:ring-4"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <Card className="portal-card data-[slot=card]:h-full" size="sm">
              <CardHeader className="gap-2">
                <CardTitle className="text-base leading-snug font-semibold">
                  {item.name}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  <span className="text-muted-foreground break-all leading-snug">
                    {item.url}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </Shell>
  )
}
