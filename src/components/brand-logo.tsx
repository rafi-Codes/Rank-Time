import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  alt?: string
}

export function BrandLogo({ className, alt = "Rank Time" }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
      aria-hidden={alt === ""}
    >
      <img
        src="/logo.svg"
        alt={alt}
        className="h-full w-full max-h-full max-w-full object-contain object-center dark:brightness-0 dark:invert"
      />
    </span>
  )
}
