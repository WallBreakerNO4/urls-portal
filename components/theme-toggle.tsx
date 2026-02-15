"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoonIcon, SunIcon } from "@hugeicons/core-free-icons"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className="ring-foreground/10 hover:bg-muted/60 dark:hover:bg-muted/40 rounded-full ring-1"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="切换主题"
      title="切换主题"
      disabled={!mounted}
    >
      {mounted ? (
        <HugeiconsIcon
          icon={isDark ? SunIcon : MoonIcon}
          strokeWidth={2}
          className="size-4"
        />
      ) : null}
    </Button>
  )
}
