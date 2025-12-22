export interface PaginationParams {
  limit?: number | string | null
  offset?: number | string | null
  cursor?: string
}

export interface PaginationMeta {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  nextCursor?: string
  prevCursor?: string
}

export interface CursorPaginationMeta {
  limit: number
  hasMore: boolean
  nextCursor?: string
  prevCursor?: string
}

export function normalizePagination(params: {
  limit?: string | null
  offset?: string | null
}): { limit: number; offset: number } {
  const limit = Math.min(Math.max(Number(params.limit) || 50, 1), 100)
  const offset = Math.max(Number(params.offset) || 0, 0)
  return { limit, offset }
}

export function createPaginationMeta(total: number, limit: number, offset: number): PaginationMeta {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  }
}

export function createCursorPaginationMeta<T extends { id: string }>(items: T[], limit: number): CursorPaginationMeta {
  const hasMore = items.length > limit
  const actualItems = hasMore ? items.slice(0, limit) : items

  return {
    limit,
    hasMore,
    nextCursor: hasMore ? actualItems[actualItems.length - 1].id : undefined,
    prevCursor: actualItems.length > 0 ? actualItems[0].id : undefined,
  }
}

export function encodeCursor(id: string): string {
  return Buffer.from(id).toString("base64")
}

export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, "base64").toString("utf-8")
}
