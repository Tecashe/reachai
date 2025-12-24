// "use client"

// import Image from "next/image"
// import Link from "next/link"

// const footerLinks = {
//   Product: [
//     { label: "Features", href: "/features" },
//     { label: "Pricing", href: "/pricing" },
//     { label: "Integrations", href: "/integrations" },
//     { label: "API", href: "/docs" },
//     { label: "Changelog", href: "/changelog" },
//     { label: "Roadmap", href: "/roadmap" },
//   ],
//   Resources: [
//     { label: "Blog", href: "/blog" },
//     { label: "Guides", href: "/guides" },
//     { label: "Templates", href: "/templates" },
//     { label: "Webinars", href: "/webinars" },
//     { label: "Case Studies", href: "/case-studies" },
//     { label: "Help Center", href: "/help" },
//   ],
//   Company: [
//     { label: "About", href: "/about" },
//     { label: "Careers", href: "/careers" },
//     { label: "Press", href: "/press" },
//     { label: "Partners", href: "/partners" },
//     { label: "Contact", href: "/contact" },
    
//   ],
//   Compare: [
//     { label: "vs Instantly", href: "/compare/instantly" },
//     { label: "vs Smartlead", href: "/compare/smartlead" },
//     { label: "vs Apollo", href: "/compare/apollo" },
//     { label: "vs Lemlist", href: "/compare/lemlist" },
//   ],
// }

// export function PageFooter() {
//   return (
//     <footer className="bg-background border-t border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
//           {/* Brand */}
//           <div className="col-span-2 md:col-span-3 lg:col-span-2">
//              <Link href="/" className="inline-flex items-center gap-2 mb-4">
//                 <Image
//                   src="/mailfra-logo.png"
//                   alt="Mailfra"
//                   width={36}
//                   height={36}
//                   className="w-9 h-9 rounded-xl object-contain"
//                 />
//                 <span className="font-semibold text-lg text-foreground">mailfra</span>
//               </Link>
//             <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
//               The modern cold email platform for revenue teams. Scale your outreach without sacrificing deliverability.
//             </p>
//             <div className="flex gap-2">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 h-10 px-4 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
//               />
//               <button className="h-10 px-4 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors">
//                 Subscribe
//               </button>
//             </div>
//           </div>

//           {/* Links */}
//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category}>
//               <h3 className="font-semibold text-foreground mb-4">{category}</h3>
//               <ul className="space-y-3">
//                 {links.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       href={link.href}
//                       className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} mailfra. All rights reserved.</p>
//             <div className="flex items-center gap-6">
//               <Link
//                 href="/privacy"
//                 className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Privacy
//               </Link>
//               <Link
//                 href="/terms"
//                 className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Terms
//               </Link>
//               <Link
//                 href="/cookies"
//                 className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Cookies
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default PageFooter

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "API", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Guides", href: "/guides" },
    { label: "Templates", href: "/templates" },
    { label: "Webinars", href: "/webinars" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Help Center", href: "/help" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
    
  ],
  Compare: [
    { label: "vs Instantly", href: "/compare/instantly" },
    { label: "vs Smartlead", href: "/compare/smartlead" },
    { label: "vs Apollo", href: "/compare/apollo" },
    { label: "vs Lemlist", href: "/compare/lemlist" },
  ],
}

export function PageFooter() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logo to show
  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light"
  const logoSrc = currentTheme === "dark" ? "/mailfra-logo-dark.png" : "/mailfra-logo-light.png"

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
             <Link href="/" className="inline-flex items-center gap-2 mb-4">
                {mounted && (
                  <Image
                    src={logoSrc}
                    alt="Mailfra"
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain"
                  />
                )}
                <span className="font-semibold text-lg text-foreground">mailfra</span>
              </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              The modern cold email platform for revenue teams. Scale your outreach without sacrificing deliverability.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-10 px-4 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <button className="h-10 px-4 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} mailfra. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PageFooter