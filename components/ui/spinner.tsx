// import { Loader2Icon } from 'lucide-react'

// import { cn } from '@/lib/utils'

// function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
//   return (
//     <Loader2Icon
//       role="status"
//       aria-label="Loading"
//       className={cn('size-4 animate-spin', className)}
//       {...props}
//     />
//   )
// }

// export { Spinner }

// import type React from "react"
// import { Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"

// function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
//   return <Loader2 className={cn("animate-spin", className)} {...props} />
// }

// export { Spinner }
"use client"

import type React from "react"
import { WaveLoader } from "../loader/wave-loader"


function Spinner({
  className,
  ...props
}: React.ComponentProps<"svg"> & {
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  speed?: "slow" | "normal" | "fast"
  bars?: number
  gap?: "tight" | "normal" | "wide"
}) {
  return (
    <WaveLoader
      color={className ? undefined : "bg-foreground"}
      size="md"
      speed="normal"
      bars={5}
      gap="normal"
      {...props}
    />
  )
}

export { Spinner }
