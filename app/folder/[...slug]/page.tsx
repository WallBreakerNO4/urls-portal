import { Fragment } from "react"

import Link from "next/link"
import { notFound } from "next/navigation"

import { PortalShell } from "@/components/portal-shell"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  findFolderTrailByPath,
  listFolderPaths,
  loadPortalData,
} from "@/lib/portal"

type FolderPageProps = {
  params: Promise<{
    slug: string[]
  }>
}

const portalItems = loadPortalData()

export function generateStaticParams() {
  return listFolderPaths(portalItems).map((slug) => ({ slug }))
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { slug } = await params
  const trail = findFolderTrailByPath(portalItems, slug)

  if (trail.length !== slug.length) {
    notFound()
  }

  const currentFolder = trail[trail.length - 1]

  return (
    <PortalShell>
      <div className="space-y-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">首页</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {trail.map((folder, index) => {
              const isLast = index === trail.length - 1
              const path = trail.slice(0, index + 1).map((item) => item.slug)

              return (
                <Fragment key={`${folder.slug}-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={`/folder/${path.join("/")}`}>{folder.name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {currentFolder.items.map((item, index) => (
            <Link
              key={item.type === "folder" ? `${item.name}-${item.slug}` : `${item.name}-${item.url}`}
              href={
                item.type === "folder"
                  ? `/folder/${[...slug, item.slug].join("/")}`
                  : item.url
              }
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
      </div>
    </PortalShell>
  )
}
