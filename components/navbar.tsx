"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { MegaMenu, platformMenuSections, productMenuSections, resourcesMenuSections } from "@/components/mega-menu/mega-menu"

const megaMenuConfig = [
    { label: "Platform", sections: platformMenuSections },
    { label: "Solutions", sections: productMenuSections },
    { label: "Resources", sections: resourcesMenuSections },
]

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"))
        }
        checkDarkMode()

        const observer = new MutationObserver(checkDarkMode)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

        return () => observer.disconnect()
    }, [])

    return (
        <nav
            className="fixed left-1/2 top-5 z-50 flex items-center justify-between transition-all duration-300 ease-out"
            style={{
                width: "min(95%, 1100px)",
                height: "60px",
                transform: "translateX(-50%)",
                borderRadius: "9999px",
                background: isDark
                    ? "linear-gradient(135deg, oklch(0.14 0.006 285 / 0.85), oklch(0.12 0.006 285 / 0.75))"
                    : "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.9), oklch(0.99 0.002 90 / 0.8))",
                backdropFilter: "blur(20px) saturate(180%)",
                boxShadow: isDark
                    ? "0 15px 40px oklch(0 0 0 / 0.3), 0 0 0 1px oklch(1 0 0 / 0.05) inset"
                    : "0 15px 40px oklch(0.12 0.005 285 / 0.06), 0 0 0 1px oklch(1 0 0 / 0.9) inset",
                border: isDark ? "1px solid oklch(1 0 0 / 0.08)" : "1px solid oklch(0.12 0.005 285 / 0.06)",
                padding: "0 20px",
            }}
        >
            {/* Logo - Plain, no background */}
            <Link
                href="/"
                className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
            >
                <Image
                    src="/mailfra-avatars.png"
                    alt="Mailfra"
                    width={32}
                    height={32}
                    className={`w-6 h-6 object-contain ${isDark ? "invert" : ""}`}
                    priority
                />
                <span className="font-semibold text-lg tracking-tight text-foreground">mailfra</span>
            </Link>

            {/* Navigation Links with MegaMenu */}
            <div className="hidden lg:flex items-center gap-0">
                {megaMenuConfig.map((menu) => (
                    <MegaMenu key={menu.label} label={menu.label} sections={menu.sections} />
                ))}
                <Link
                    href="/pricing"
                    className="relative px-4 py-2 text-sm font-semibold text-muted-foreground rounded-full transition-all duration-300 hover:text-foreground hover:bg-primary/5"
                >
                    Pricing
                </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard"
                    className="hidden md:block px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-300 hover:text-foreground"
                >
                    Sign In
                </Link>
                <Link href="/sign-up" className="hidden sm:block">
                    <Button
                        size="sm"
                        className="rounded-full px-5 h-10 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                            background: isDark
                                ? "linear-gradient(135deg, oklch(0.96 0.003 90), oklch(0.90 0.003 90))"
                                : "linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.20 0.005 285))",
                            color: isDark ? "oklch(0.12 0.005 285)" : "oklch(0.96 0.003 90)",
                            boxShadow: isDark ? "0 8px 24px oklch(1 0 0 / 0.15)" : "0 8px 24px oklch(0.12 0.005 285 / 0.25)",
                        }}
                    >
                        Get Started
                    </Button>
                </Link>

                <button
                    className="lg:hidden p-2 rounded-full transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden bg-background/98 backdrop-blur-xl overflow-y-auto">
                    <div className="flex flex-col py-6 p-4 pt-24">
                        {megaMenuConfig.map((menu) => (
                            <div key={menu.label} className="border-b border-border/30 last:border-0">
                                <h3 className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/40 rounded-lg mb-2">
                                    {menu.label}
                                </h3>
                                <div className="space-y-0.5 py-2">
                                    {menu.sections.map((section) =>
                                        section.items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-start gap-3 active:bg-primary/10 block"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium leading-tight">{item.title}</div>
                                                    {item.description && (
                                                        <div className="text-xs text-muted-foreground mt-1 leading-snug">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Pricing Link */}
                        <div className="border-b border-border/30 py-2 mt-4">
                            <h3 className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/40 rounded-lg mb-2">
                                Quick Links
                            </h3>
                            <Link
                                href="/pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 block"
                            >
                                Pricing
                            </Link>
                        </div>

                        {/* CTA Section */}
                        <div className="px-2 py-6 space-y-3 bg-gradient-to-b from-primary/5 to-transparent mt-4 rounded-lg">
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <Button size="lg" className="w-full rounded-full px-8 h-12 text-base font-medium">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full rounded-full px-8 h-12 text-base font-medium bg-transparent"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
