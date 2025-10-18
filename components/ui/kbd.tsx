// import { cn } from '@/lib/utils'

// function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
//   return (
//     <kbd
//       data-slot="kbd"
//       className={cn(
//         'bg-muted w-fit text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none',
//         "[&_svg:not([class*='size-'])]:size-3",
//         '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
//         className,
//       )}
//       {...props}
//     />
//   )
// }

// function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <kbd
//       data-slot="kbd-group"
//       className={cn('inline-flex items-center gap-1', className)}
//       {...props}
//     />
//   )
// }

// export { Kbd, KbdGroup }
import * as React from "react"
import { cn } from "@/lib/utils"

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className,
      )}
      {...props}
    />
  )
})
Kbd.displayName = "Kbd"

const KbdGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center gap-1", className)} {...props} />
  },
)
KbdGroup.displayName = "KbdGroup"

export { Kbd, KbdGroup }
