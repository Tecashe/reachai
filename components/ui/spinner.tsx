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
import type React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return <Loader2 className={cn("animate-spin", className)} {...props} />
}

export { Spinner }
