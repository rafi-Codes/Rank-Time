"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  footer?: React.ReactNode
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  className,
  children,
  ...props
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => onOpenChange(false)}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={cn(
          "glass-tier-4 max-h-[90vh] w-full max-w-[500px] overflow-hidden rounded-[var(--radius-2xl)] shadow-[var(--shadow-xl)]",
          "animate-[pageEnter_200ms_var(--easing-ease-out)]",
          className
        )}
        onMouseDown={(event) => event.stopPropagation()}
        {...props}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--glass-premium-border)] p-6">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-foreground">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto p-6">{children}</div>
        {footer && (
          <footer className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-[var(--glass-premium-border)] p-6">
            {footer}
          </footer>
        )}
      </section>
    </div>
  )
}
