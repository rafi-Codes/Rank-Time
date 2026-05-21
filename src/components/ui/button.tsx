"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:transform-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[linear-gradient(135deg,var(--color-cyan-primary),var(--color-cyan-light))] text-[#0F1419] shadow-[0_8px_22px_rgba(0,217,255,0.28)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,217,255,0.42)]",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-sm hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-md",
        outline:
          "glass-panel border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-[0_10px_30px_rgba(0,217,255,0.16)]",
        secondary:
          "border border-border bg-secondary/80 text-secondary-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted",
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
