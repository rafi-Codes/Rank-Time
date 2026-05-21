// src/components/ui/textarea.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-lg border border-input bg-background/80 px-4 py-3 text-sm text-foreground ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background/40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
