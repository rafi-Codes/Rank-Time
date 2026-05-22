// src/components/ui/card.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ========== CARD VARIANTS ========== */
const cardVariants = cva(
  "rounded-[var(--radius-xl)] text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        /* Default glass effect */
        default: "glass-tier-2 glass-interactive",
        
        /* Solid background */
        solid: "border border-border bg-card shadow-sm hover:shadow-md",
        
        /* Elevated appearance */
        elevated: "glass-tier-3 hover:-translate-y-0.5 hover:border-primary/40",
        
        /* Ghost - minimal */
        ghost: "border border-border/30 bg-transparent hover:bg-muted/50",
        
        /* Outline - border focused */
        outline: "border border-border bg-background/50 hover:border-primary/50",
        
        /* Interactive - clickable */
        interactive: "glass-tier-2 glass-interactive cursor-pointer hover:-translate-y-1",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-lg hover:-translate-y-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      role={interactive ? "button" : undefined}
      className={cn(cardVariants({ variant, interactive, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

/* ========== CARD HEADER ========== */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 border-b border-[var(--glass-border)]/50 p-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/* ========== CARD TITLE ========== */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-normal text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/* ========== CARD SUBTITLE ========== */
const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
))
CardSubtitle.displayName = "CardSubtitle"

/* ========== CARD DESCRIPTION ========== */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/* ========== CARD CONTENT ========== */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

/* ========== CARD FOOTER ========== */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between border-t border-[var(--glass-border)]/50 p-6",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardSubtitle, CardDescription, CardContent, cardVariants }
