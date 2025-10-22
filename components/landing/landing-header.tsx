// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Sparkles } from "lucide-react"

// export function LandingHeader() {
//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         <Link href="/" className="flex items-center gap-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
//             <Sparkles className="h-5 w-5 text-white" />
//           </div>
//           <span className="text-xl font-bold">ReachAI</span>
//         </Link>

//         <nav className="hidden md:flex items-center gap-6">
//           <Link
//             href="#features"
//             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//           >
//             Features
//           </Link>
//           <Link
//             href="#how-it-works"
//             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//           >
//             How It Works
//           </Link>
//           <Link
//             href="#pricing"
//             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//           >
//             Pricing
//           </Link>
//           <Link
//             href="#testimonials"
//             className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//           >
//             Testimonials
//           </Link>
//         </nav>

//         <div className="flex items-center gap-3">
//           <Button variant="ghost" asChild>
//             <Link href="/sign-in">Sign In</Link>
//           </Button>
//           <Button asChild>
//             <Link href="/sign-up">Get Started</Link>
//           </Button>
//         </div>
//       </div>
//     </header>
//   )
// }
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">ReachAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="#features"
                  className="text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="#pricing"
                  className="text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className="text-lg font-medium hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Docs
                </Link>
                <div className="pt-4 border-t">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
