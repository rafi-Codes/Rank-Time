// src/components/ui/alert.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========== ALERT VARIANTS ========== */
const alertVariants = cva(
  "glass-panel relative w-full rounded-lg border p-4 text-foreground [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        /* Default - informational */
        default: "border-info/20 bg-info/5 text-info [&>svg]:text-info",
        
        /* Success - positive action */
        success:
          "border-success/30 bg-success/5 text-success [&>svg]:text-success",
        
        /* Warning - caution */
        warning:
          "border-warning/30 bg-warning/5 text-warning [&>svg]:text-warning",
        
        /* Destructive - error/danger */
        destructive:
          "border-danger/30 bg-danger/5 text-danger dark:border-danger/50 [&>svg]:text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* ========== ALERT COMPONENT ========== */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

/* ========== ALERT TITLE ========== */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/* ========== ALERT DESCRIPTION ========== */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
