// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ReachAI - AI-Powered Cold Email Personalization",
//   description:
//     "Write cold emails that actually get replies. ReachAI uses AI to research prospects and craft hyper-personalized outreach at scale.",
//   generator: "v0.app",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`font-sans antialiased`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }


// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
// import { Analytics } from "@vercel/analytics/next"
// import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ReachAI - AI-Powered Cold Email Personalization",
//   description:
//     "Write cold emails that actually get replies. ReachAI uses AI to research prospects and craft hyper-personalized outreach at scale.",
//   generator: "v0.app",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={`font-sans antialiased`}>
//           {children}
//           <Analytics />
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }

// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
// import { Analytics } from "@vercel/analytics/next"
// import { ThemeProvider } from "@/components/theme-provider"
// import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ReachAI - AI-Powered Cold Email Personalization",
//   description:
//     "Write cold emails that actually get replies. ReachAI uses AI to research prospects and craft hyper-personalized outreach at scale.",
//   generator: "Cashe",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <ClerkProvider>
//       <html lang="en" suppressHydrationWarning>
//         <body className={`font-sans antialiased`}>
//           <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
//             {children}
//           </ThemeProvider>
//           <Analytics />
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReachAI - AI-Powered Cold Email Personalization",
  description:
    "Write cold emails that actually get replies. ReachAI uses AI to research prospects and craft hyper-personalized outreach at scale.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-right" richColors />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
