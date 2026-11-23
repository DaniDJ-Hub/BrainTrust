"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"
import { ConfirmDialog, type ConfirmOptions } from "./confirm-dialog"

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

/**
 * Promise-based replacement for window.confirm():
 *   const confirm = useConfirm()
 *   if (await confirm({ title: "¿Eliminar unidad?", tone: "destructive" })) { … }
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [open, setOpen] = useState(false)
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const settle = useCallback((value: boolean) => {
    resolver.current?.(value)
    resolver.current = null
  }, [])

  const confirm = useCallback<ConfirmFn>(
    (next) => {
      settle(false)
      setOptions(next)
      setOpen(true)
      return new Promise<boolean>((resolve) => {
        resolver.current = resolve
      })
    },
    [settle],
  )

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) settle(false)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <ConfirmDialog
          {...options}
          open={open}
          onOpenChange={handleOpenChange}
          onConfirm={() => {
            settle(true)
          }}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error("useConfirm must be used inside <ConfirmProvider>")
  return confirm
}
