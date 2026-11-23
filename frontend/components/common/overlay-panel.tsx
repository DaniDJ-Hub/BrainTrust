"use client"

import { useEffect, useRef } from "react"

interface OverlayPanelProps {
  children: React.ReactNode
  /** Accessible name of the dialog. */
  label: string
  /**
   * Escape behaviour:
   * - "trigger-close": clicks the element marked `data-overlay-close` inside the panel,
   *   so the view runs its own exit flow (e.g. "unsaved changes" confirmation).
   * - "none": Escape is ignored (views with timers such as the quiz).
   * - a function: called directly (read-only views).
   */
  onEscape: "trigger-close" | "none" | (() => void)
  /** Classes of the full-screen backdrop (kept from each screen's existing markup). */
  overlayClassName: string
  /** Classes of the panel that holds the view. */
  panelClassName: string
}

/**
 * Adds dialog semantics, initial focus, focus return and Escape handling to the
 * existing hand-made overlays without changing their look.
 */
export function OverlayPanel({ children, label, onEscape, overlayClassName, panelClassName }: OverlayPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || onEscape === "none") return
      // A Radix dialog opened from inside the view handles its own Escape.
      if (document.querySelector('[role="alertdialog"], [role="dialog"][data-state="open"]')) return
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
    <div className={overlayClassName}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`${panelClassName} focus:outline-none`}
      >
        {children}
      </div>
    </div>
  )
}
