
// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
// import { Analytics } from "@vercel/analytics/next"
// import { ThemeProvider } from "@/components/theme-provider"
// import { ScrollToTop } from "@/components/scroll-to-top"
// import { ExpandingButton } from "@/components/expanding-button"
// import { Toaster } from "sonner"
// import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })
// export const metadata: Metadata = {
//   title: "Mailfra - Modern Cold Email Platform",
//   description:
//     "The modern cold email platform for revenue teams. Scale your outreach without sacrificing deliverability.",
//   generator: "IamCasheMwangi",
//   icons: {
//     icon: [
//       {
//         url: "/mailfra-icon-light.png",
//         media: "(prefers-color-scheme: light)",
//       },
//       {
//         url: "/mailfra-icon-dark.png",
//         media: "(prefers-color-scheme: dark)",
//       },
//       {
//         url: "/mailfra-icon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: "/mailfra-apple-icon.png",
//   },
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
//           <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
//              <ScrollToTop />
//             {children}
//             <Toaster position="top-right" richColors />
//             <ExpandingButton />
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
import { ScrollToTop } from "@/components/scroll-to-top"
import { ExpandingButton } from "@/components/expanding-button"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mailfra - Modern Cold Email Platform",
  description:
    "The modern cold email platform for revenue teams. Scale your outreach without sacrificing deliverability.",
  generator: "IamCasheMwangi",
  icons: {
    icon: [
      {
        url: "/mailfra-icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/mailfra-icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/mailfra-icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/mailfra-apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Structured data for Google
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mailfra",
    "url": "https://mailfra.com", // Replace with your actual domain
    "logo": "https://yourdomain.com/mailfra-logo-light.png", // Replace with your actual domain
    "description": "The modern cold email platform for revenue teams. Scale your outreach without sacrificing deliverability.",
    "sameAs": [
      // Add your social media profiles here (optional)
      // "https://twitter.com/mailfra",
      // "https://linkedin.com/company/mailfra"
    ]
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        </head>
        <body className={`font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <ScrollToTop />
            {children}
            <Toaster position="top-right" richColors />
            <ExpandingButton />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}



