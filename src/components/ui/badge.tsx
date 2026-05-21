// src/components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========== BADGE VARIANTS ========== */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      /* Variant styles */
      variant: {
        /* Default - primary accent */
        default:
          "border-primary/30 bg-primary/15 text-primary hover:bg-primary/20",
        
        /* Secondary - muted */
        secondary:
          "border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        
        /* Success - positive */
        success:
          "border-success/30 bg-success/15 text-success hover:bg-success/20",
        
        /* Warning - caution */
        warning:
          "border-warning/30 bg-warning/15 text-warning hover:bg-warning/20",
        
        /* Danger - error/negative */
        destructive:
          "border-danger/30 bg-danger/15 text-danger hover:bg-danger/20",
        
        /* Info - informational */
        info:
          "border-info/30 bg-info/15 text-info hover:bg-info/20",
        
        /* Outline - border focused */
        outline: "border-2 border-border bg-background/50 text-foreground hover:border-primary/50",
        
        /* Ghost - minimal */
        ghost: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },

      /* Size variants */
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{props.children}</span>
    </div>
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
