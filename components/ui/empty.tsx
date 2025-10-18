// import { cva, type VariantProps } from 'class-variance-authority'

// import { cn } from '@/lib/utils'

// function Empty({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <div
//       data-slot="empty"
//       className={cn(
//         'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12',
//         className,
//       )}
//       {...props}
//     />
//   )
// }

// function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <div
//       data-slot="empty-header"
//       className={cn(
//         'flex max-w-sm flex-col items-center gap-2 text-center',
//         className,
//       )}
//       {...props}
//     />
//   )
// }

// const emptyMediaVariants = cva(
//   'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
//   {
//     variants: {
//       variant: {
//         default: 'bg-transparent',
//         icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//     },
//   },
// )

// function EmptyMedia({
//   className,
//   variant = 'default',
//   ...props
// }: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
//   return (
//     <div
//       data-slot="empty-icon"
//       data-variant={variant}
//       className={cn(emptyMediaVariants({ variant, className }))}
//       {...props}
//     />
//   )
// }

// function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <div
//       data-slot="empty-title"
//       className={cn('text-lg font-medium tracking-tight', className)}
//       {...props}
//     />
//   )
// }

// function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
//   return (
//     <div
//       data-slot="empty-description"
//       className={cn(
//         'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
//         className,
//       )}
//       {...props}
//     />
//   )
// }

// function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <div
//       data-slot="empty-content"
//       className={cn(
//         'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
//         className,
//       )}
//       {...props}
//     />
//   )
// }

// export {
//   Empty,
//   EmptyHeader,
//   EmptyTitle,
//   EmptyDescription,
//   EmptyContent,
//   EmptyMedia,
// }
import * as React from "react"
import { cn } from "@/lib/utils"

const Empty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center rounded-lg p-8 text-center", className)}
      {...props}
    />
  )
})
Empty.displayName = "Empty"

const EmptyHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col items-center gap-2", className)} {...props} />
  },
)
EmptyHeader.displayName = "EmptyHeader"

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "icon"
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mb-2",
        variant === "icon" && "flex h-12 w-12 items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  )
})
EmptyMedia.displayName = "EmptyMedia"

const EmptyTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
  },
)
EmptyTitle.displayName = "EmptyTitle"

const EmptyDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-muted-foreground max-w-sm", className)} {...props} />
  },
)
EmptyDescription.displayName = "EmptyDescription"

const EmptyContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mt-4 flex flex-wrap items-center justify-center gap-2", className)} {...props} />
    )
  },
)
EmptyContent.displayName = "EmptyContent"

export { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent }
