import Link from "next/link"

import urlsJson from "@/data/urls.json"

import { PortalShell } from "@/components/portal-shell"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { normalizePortalItems } from "@/lib/portal"

export default function Page() {
  const items = normalizePortalItems(urlsJson)

  return (
    <PortalShell>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.type === "folder" ? `${item.name}-${item.slug}` : `${item.name}-${item.url}`}
            href={item.type === "folder" ? `/folder/${item.slug}` : item.url}
            className="focus-visible:ring-ring/40 rounded-xl outline-none focus-visible:ring-4"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <Card className="portal-card data-[slot=card]:h-full" size="sm">
              <CardHeader className="gap-2">
                <CardTitle className="text-base leading-snug font-semibold">
                  {item.name}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  {item.type === "folder" ? (
                    <span className="text-muted-foreground leading-snug">
                      文件夹 · {item.items.length} 项
                    </span>
                  ) : (
                    <span className="text-muted-foreground break-all leading-snug">
                      {item.url}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </PortalShell>
  )
}
