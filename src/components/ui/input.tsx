import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
  isLoading?: boolean
  helperText?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      success,
      isLoading,
      helperText,
      icon,
      suffix,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          {/* Leading icon */}
          {icon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {icon}
            </div>
          )}

          {/* Input field */}
          <input
            type={type}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
            className={cn(
              /* Base styles */
              "flex h-input w-full rounded-lg border bg-background/80 px-4 py-2 text-base text-foreground",
              "ring-offset-background transition-all duration-200",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              
              /* Icon padding */
              icon && "pl-10",
              suffix && "pr-10",
              
              /* Focus state */
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0",
              
              /* Border states */
              error
                ? "border-danger focus-visible:border-danger focus-visible:ring-danger/30"
                : success
                ? "border-success focus-visible:border-success focus-visible:ring-success/30"
                : "border-input focus-visible:border-primary focus-visible:bg-background focus-visible:ring-ring/30",
              
              /* Disabled state */
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
              
              /* Dark mode */
              "dark:bg-background/40",
              
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Suffix/Trailing content */}
          {suffix && (
            <div className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
              {suffix}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="pointer-events-none absolute right-3 flex items-center">
              <svg
                className="h-4 w-4 animate-spin text-primary"
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
            </div>
          )}

          {/* Status indicators */}
          {!isLoading && (error || success) && (
            <div className="pointer-events-none absolute right-3 flex items-center">
              {error && (
                <svg
                  className="h-5 w-5 text-danger"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              )}
              {success && !error && (
                <svg
                  className="h-5 w-5 text-success"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Helper text */}
        {helperText && (
          <p
            id={`${props.id}-helper`}
            className={cn(
              "mt-1.5 text-xs",
              error
                ? "text-danger"
                : success
                ? "text-success"
                : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
