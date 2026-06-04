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
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-lg)] text-sm font-semibold tracking-normal ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:transform-none",
  {
    variants: {
      variant: {
        /* Primary - Main CTA */
        default:
          "isolate relative overflow-hidden border border-transparent bg-cyan-500 [background:var(--gradient-cyan-primary)] text-white shadow-[var(--shadow-cyan-sm)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(0,0,0,0.05))] hover:-translate-y-0.5 hover:shadow-[var(--shadow-cyan-md)] active:translate-y-0 active:shadow-[var(--shadow-cyan-sm)] [&>*]:relative [&>*]:z-[1]",
        
        /* Secondary - Alternative action */
        secondary:
          "glass-tier-1 border-[var(--glass-subtle-border)] text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary active:translate-y-0",
        
        /* Outline - Less prominent */
        outline:
          "glass-tier-2 border-[var(--glass-standard-border)] text-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-[var(--shadow-cyan-sm)] active:translate-y-0",
        
        /* Ghost - Minimal style */
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20",
        
        /* Link - Text only */
        link: "text-primary underline-offset-4 hover:underline",
        
        /* Destructive - Danger action */
        destructive:
          "border border-transparent bg-[var(--color-danger)] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        
        /* Success - Positive action */
        success:
          "border border-transparent bg-[var(--color-success)] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        
        /* Liquid Glass - Solid Primary */
        liquid:
          "isolate relative overflow-hidden border border-cyan-400/20 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-md hover:scale-[1.03] active:scale-[0.98] duration-300 transition cursor-pointer",
        
        /* Liquid Glass - Outline/Secondary */
        liquidOutline:
          "isolate relative overflow-hidden border border-white/10 bg-white/5 dark:bg-black/20 text-foreground shadow-sm hover:scale-[1.03] active:scale-[0.98] duration-300 transition hover:bg-white/10 dark:hover:bg-black/30 cursor-pointer",
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
    const filterId = "filter-" + React.useId().replace(/:/g, "")

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-disabled={isDisabled || undefined}
          aria-busy={isLoading || undefined}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    const isLiquid = variant === "liquid" || variant === "liquidOutline"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        ref={ref}
        {...props}
      >
        {isLiquid && (
          <>
            <div className="absolute top-0 left-0 z-0 h-full w-full rounded-[inherit] 
                shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            transition-all 
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
            <div
              className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-[inherit]"
              style={{ backdropFilter: `blur(4px) url("#${filterId}")` }}
            />
            <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none", opacity: 0 }}>
              <defs>
                <filter
                  id={filterId}
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                  colorInterpolationFilters="sRGB"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.05 0.05"
                    numOctaves="1"
                    seed="1"
                    result="turbulence"
                  />
                  <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="blurredNoise"
                    scale="12"
                    xChannelSelector="R"
                    yChannelSelector="B"
                  />
                </filter>
              </defs>
            </svg>
          </>
        )}
        {isLoading ? (
          <>
            <span className="relative z-[1]">
              <LoadingSpinner />
            </span>
            <span className="relative z-[1]">{loadingText || children}</span>
          </>
        ) : icon ? (
          <>
            {iconPosition === "left" && (
              <span className="relative z-[1] shrink-0">{icon}</span>
            )}
            <span className="relative z-[1]">{children}</span>
            {iconPosition === "right" && (
              <span className="relative z-[1] shrink-0">{icon}</span>
            )}
          </>
        ) : (
          <span className="relative z-[1] inline-flex items-center justify-center gap-2 [&_svg]:shrink-0">
            {children}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
