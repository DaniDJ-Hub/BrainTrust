"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OverlayPanelProps {
  children: React.ReactNode
  /** id of the heading inside the panel (aria-labelledby). */
  labelledBy?: string
  /** Accessible name when there is no visible heading id. */
  label?: string
  /**
   * Escape behaviour:
   * - "trigger-close": clicks the element marked `data-overlay-close` inside the panel,
   *   so the view runs its own exit flow (e.g. "unsaved changes" confirmation).
   * - "none": Escape is ignored (views with timers or that handle Escape themselves).
   * - a function: called directly (read-only views).
   */
  onEscape: "trigger-close" | "none" | (() => void)
  /** Panel width. */
  size?: "lg" | "xl"
  className?: string
}

/**
 * Full-screen modal surface for existing views (task, quiz, info) that are not Radix dialogs.
 * Adds dialog semantics, initial focus and Escape handling without changing the view's logic.
 */
export function OverlayPanel({ children, labelledBy, label, onEscape, size = "xl", className }: OverlayPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    return () => previousFocus.current?.focus?.()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return
      // A Radix dialog opened from inside the view handles its own Escape.
      if (document.querySelector('[role="alertdialog"], [role="dialog"][data-state="open"]')) return
      if (onEscape === "none") return
      if (onEscape === "trigger-close") {
        panelRef.current?.querySelector<HTMLElement>("[data-overlay-close]")?.click()
        return
      }
      onEscape()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onEscape])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 p-2 backdrop-blur-sm sm:p-4">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        tabIndex={-1}
        className={cn(
          "max-h-[95vh] w-full overflow-y-auto rounded-surface bg-background shadow-lg focus:outline-none",
          size === "xl" ? "max-w-6xl" : "max-w-4xl",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
