export type PortalUrlItem = {
  type: "url"
  name: string
  url: string
}

export type PortalFolderItem = {
  type: "folder"
  name: string
  slug: string
  items: PortalItem[]
}

export type PortalItem = PortalUrlItem | PortalFolderItem

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function normalizeSlugPart(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return cleaned || "folder"
}

function normalizeUrlNode(value: Record<string, unknown>): PortalUrlItem | null {
  if (typeof value.name !== "string" || typeof value.url !== "string") {
    return null
  }

  return {
    type: "url",
    name: value.name,
    url: value.url,
  }
}

function normalizeFolderNode(value: Record<string, unknown>): {
  name: string
  items: PortalItem[]
} | null {
  if (typeof value.name !== "string") {
    return null
  }

  const rawItems = Array.isArray(value.items)
    ? value.items
    : Array.isArray(value.urls)
      ? value.urls
      : null

  if (!rawItems) {
    return null
  }

  return {
    name: value.name,
    items: normalizePortalItems(rawItems),
  }
}

export function normalizePortalItems(input: unknown): PortalItem[] {
  if (!Array.isArray(input)) return []

  const result: PortalItem[] = []
  const folderSlugCount = new Map<string, number>()

  for (const item of input) {
    if (!isRecord(item)) continue

    const nodeType = item.type

    if (nodeType === "folder" || Array.isArray(item.items) || Array.isArray(item.urls)) {
      const folder = normalizeFolderNode(item)
      if (!folder) continue

      const baseSlug = normalizeSlugPart(folder.name)
      const seen = folderSlugCount.get(baseSlug) ?? 0
      folderSlugCount.set(baseSlug, seen + 1)

      result.push({
        type: "folder",
        name: folder.name,
        slug: seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`,
        items: folder.items,
      })

      continue
    }

    if (nodeType === "url" || nodeType === undefined) {
      const urlNode = normalizeUrlNode(item)
      if (!urlNode) continue
      result.push(urlNode)
    }
  }

  return result
}

export function listFolderPaths(items: PortalItem[], parentPath: string[] = []): string[][] {
  const result: string[][] = []

  for (const item of items) {
    if (item.type !== "folder") continue

    const nextPath = [...parentPath, item.slug]
    result.push(nextPath)
    result.push(...listFolderPaths(item.items, nextPath))
  }

  return result
}

export function findFolderTrailByPath(items: PortalItem[], path: string[]): PortalFolderItem[] {
  const trail: PortalFolderItem[] = []
  let cursor = items

  for (const segment of path) {
    const next = cursor.find(
      (item): item is PortalFolderItem => item.type === "folder" && item.slug === segment
    )

    if (!next) return []

    trail.push(next)
    cursor = next.items
  }

  return trail
}
