import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface DataTableColumn<T> {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  /** Numbers and grades go right-aligned with tabular figures. */
  align?: "left" | "right" | "center"
  /** Title of the mobile card (use on exactly one column). */
  primary?: boolean
  /** Row actions: rendered in the mobile card footer, without label. */
  actions?: boolean
  hideOnMobile?: boolean
  /** Text label for the mobile card when `header` is not plain text. */
  mobileLabel?: string
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  /** Describes the table for screen readers (visually hidden). */
  caption: string
  isLoading?: boolean
  loadingRows?: number
  /** Shown instead of the body when `rows` is empty (use <EmptyState size="compact" />). */
  emptyState?: React.ReactNode
  /** Replaces the default mobile card. */
  renderMobileCard?: (row: T) => React.ReactNode
  /** Breakpoint where the table replaces the cards. */
  stackBelow?: "md" | "lg"
  className?: string
}

const BREAKPOINT = {
  md: { table: "hidden md:block", cards: "md:hidden" },
  lg: { table: "hidden lg:block", cards: "lg:hidden" },
} as const

const ALIGN = { left: "text-left", right: "text-right tabular-nums", center: "text-center" } as const

function plainLabel<T>(column: DataTableColumn<T>): string | undefined {
  if (column.mobileLabel) return column.mobileLabel
  return typeof column.header === "string" ? column.header : undefined
}

function DefaultMobileCard<T>({ row, columns }: { row: T; columns: DataTableColumn<T>[] }) {
  const primary = columns.find((c) => c.primary)
  const actions = columns.filter((c) => c.actions)
  const fields = columns.filter((c) => !c.primary && !c.actions && !c.hideOnMobile)

  return (
    <div className="mobile-card">
      {primary && <div className="text-subheading text-foreground">{primary.cell(row)}</div>}
      {fields.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {fields.map((column) => (
            <div key={column.id} className="min-w-0 space-y-0.5">
              <dt className="text-caption text-muted-foreground">{plainLabel(column)}</dt>
              <dd className={cn("text-body text-foreground", column.align === "right" && "tabular-nums")}>{column.cell(row)}</dd>
            </div>
          ))}
        </dl>
      )}
      {actions.length > 0 && (
        <div className="flex justify-end gap-1 border-t border-border pt-2">
          {actions.map((column) => (
            <div key={column.id} className="flex gap-1">{column.cell(row)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  isLoading,
  loadingRows = 4,
  emptyState,
  renderMobileCard,
  stackBelow = "lg",
  className,
}: DataTableProps<T>) {
  const bp = BREAKPOINT[stackBelow]
  const isEmpty = !isLoading && rows.length === 0

  return (
    <div className={cn("card-base overflow-hidden", className)} aria-busy={isLoading || undefined}>
      <div className={cn(bp.table, "overflow-x-auto")}>
        <table className="w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th key={column.id} scope="col" className={cn("table-th", ALIGN[column.align ?? "left"], column.className)}>
                  {column.actions && typeof column.header === "string" ? (
                    <span className="sr-only">{column.header}</span>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: loadingRows }, (_, i) => (
                <tr key={`loading-${i}`} className="border-b border-border last:border-0">
                  {columns.map((column) => (
                    <td key={column.id} className="table-td">
                      <Skeleton className={cn("h-4", column.primary ? "w-40" : "w-20", column.align === "right" && "ml-auto")} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              rows.map((row) => (
                <tr key={getRowId(row)} className="table-row">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "table-td",
                        ALIGN[column.align ?? "left"],
                        column.primary && "font-semibold text-foreground",
                        column.actions && "whitespace-nowrap",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            {isEmpty && (
              <tr>
                <td colSpan={columns.length}>{emptyState}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className={cn(bp.cards, "space-y-3 bg-background p-3")} aria-label={caption}>
        {isLoading &&
          Array.from({ length: Math.min(loadingRows, 3) }, (_, i) => (
            <li key={`loading-${i}`} className="mobile-card" aria-hidden="true">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </li>
          ))}
        {!isLoading &&
          rows.map((row) => (
            <li key={getRowId(row)}>{renderMobileCard ? renderMobileCard(row) : <DefaultMobileCard row={row} columns={columns} />}</li>
          ))}
        {isEmpty && <li className="list-none">{emptyState}</li>}
      </ul>
    </div>
  )
}
