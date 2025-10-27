// import Link from "next/link"
// import { Sparkles } from "lucide-react"

// export function LandingFooter() {
//   return (
//     <footer className="border-t border-border/40 py-12">
//       <div className="container">
//         <div className="grid gap-8 md:grid-cols-4">
//           <div>
//             <Link href="/" className="flex items-center gap-2 mb-4">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
//                 <Sparkles className="h-5 w-5 text-white" />
//               </div>
//               <span className="text-xl font-bold">ReachAI</span>
//             </Link>
//             <p className="text-sm text-muted-foreground">
//               AI-powered cold email personalization platform for modern sales teams.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-3">Product</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>
//                 <Link href="#features" className="hover:text-foreground transition-colors">
//                   Features
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#pricing" className="hover:text-foreground transition-colors">
//                   Pricing
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#how-it-works" className="hover:text-foreground transition-colors">
//                   How It Works
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/integrations" className="hover:text-foreground transition-colors">
//                   Integrations
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-3">Company</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>
//                 <Link href="/about" className="hover:text-foreground transition-colors">
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/blog" className="hover:text-foreground transition-colors">
//                   Blog
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/careers" className="hover:text-foreground transition-colors">
//                   Careers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="hover:text-foreground transition-colors">
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-3">Legal</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>
//                 <Link href="/privacy" className="hover:text-foreground transition-colors">
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/terms" className="hover:text-foreground transition-colors">
//                   Terms of Service
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/security" className="hover:text-foreground transition-colors">
//                   Security
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
//           <p>© 2025 ReachAI. All rights reserved.</p>
//           <div className="flex items-center gap-6">
//             <Link href="https://twitter.com" className="hover:text-foreground transition-colors">
//               Twitter
//             </Link>
//             <Link href="https://linkedin.com" className="hover:text-foreground transition-colors">
//               LinkedIn
//             </Link>
//             <Link href="https://github.com" className="hover:text-foreground transition-colors">
//               GitHub
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

import Link from "next/link"
import Image from "next/image"

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-8 w-8">
                <Image src="/logo.png" alt="ReachAI Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold">ReachAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered cold email personalization platform for modern sales teams.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-foreground transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 ReachAI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="https://twitter.com" className="hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="https://linkedin.com" className="hover:text-foreground transition-colors">
              LinkedIn
            </Link>
            <Link href="https://github.com" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
