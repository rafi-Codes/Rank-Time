"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========== LOADING SPINNER COMPONENT ========== */
const LoadingSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

/* ========== BUTTON VARIANTS ========== */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:transform-none",
  {
    variants: {
      variant: {
        /* Primary - Main CTA */
        default:
          "border border-transparent bg-[linear-gradient(135deg,var(--color-cyan-primary),var(--color-cyan-light))] text-[#0F1419] shadow-[0_8px_22px_rgba(0,217,255,0.28)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,217,255,0.42)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(0,217,255,0.22)]",
        
        /* Secondary - Alternative action */
        secondary:
          "border border-border bg-secondary/80 text-secondary-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted active:translate-y-0",
        
        /* Outline - Less prominent */
        outline:
          "glass-panel border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-[0_10px_30px_rgba(0,217,255,0.16)] active:translate-y-0",
        
        /* Ghost - Minimal style */
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20",
        
        /* Link - Text only */
        link: "text-primary underline-offset-4 hover:underline",
        
        /* Destructive - Danger action */
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-sm hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-md active:translate-y-0 active:bg-destructive/95",
        
        /* Success - Positive action */
        success:
          "border border-transparent bg-success text-white shadow-sm hover:-translate-y-0.5 hover:bg-success/90 hover:shadow-md active:translate-y-0",
      },
      size: {
        /* Compact sizes */
        xs: "h-7 px-2.5 text-xs",
        sm: "h-9 px-3 text-sm",
        
        /* Standard sizes */
        default: "h-10 px-4 py-2 text-sm",
        md: "h-11 px-5 py-2.5 text-base",
        
        /* Large sizes */
        lg: "h-12 px-6 py-3 text-base",
        xl: "h-14 px-8 py-3.5 text-lg",
        
        /* Icon button */
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/* ========== BUTTON PROPS INTERFACE ========== */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

/* ========== BUTTON COMPONENT ========== */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || isLoading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        ref={ref}
        {...props}
      >
        {/* Loading state */}
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {/* Icon left position */}
            {icon && iconPosition === "left" && <span>{icon}</span>}
            
            {/* Content */}
            <span>{children}</span>
            
            {/* Icon right position */}
            {icon && iconPosition === "right" && <span>{icon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
