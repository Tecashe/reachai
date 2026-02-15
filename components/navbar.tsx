"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { MegaMenu } from "@/components/mega-menu/mega-menu"

const megaMenus = [
    {
        label: "Platform",
        sections: [
            {
                title: "Dashboard Features",
                items: [
                    {
                        icon: null,
                        title: "Campaigns",
                        description: "Create and manage cold email campaigns",
                        href: "/dashboard/campaigns",
                        previewImage: "/images/megamenu/campaigns.jpg",
                        previewTitle: "Campaign Management",
                        previewDescription: "Create powerful cold email campaigns with A/B testing, smart scheduling, and real-time performance tracking. Launch sequences that convert with our intuitive campaign builder."
                    },
                    {
                        icon: null,
                        title: "Analytics",
                        description: "Real-time campaign performance tracking",
                        href: "/dashboard/analytics",
                        previewImage: "/images/megamenu/analytics.jpg",
                        previewTitle: "Advanced Analytics Dashboard",
                        previewDescription: "Track opens, clicks, replies, and conversions in real-time. Get actionable insights with detailed reports and visualizations to optimize your outreach strategy."
                    },
                    {
                        icon: null,
                        title: "Prospects & CRM",
                        description: "Manage leads and customer relationships",
                        href: "/dashboard/prospects",
                        previewImage: "/images/megamenu/prospects.jpg",
                        previewTitle: "Prospect Management",
                        previewDescription: "Import, organize, and segment your leads with our built-in CRM. Track interactions, manage pipelines, and never miss a follow-up opportunity."
                    },
                    {
                        icon: null,
                        title: "Sequences",
                        description: "Build automated follow-up sequences",
                        href: "/dashboard/sequences",
                        previewImage: "/images/megamenu/sequences.jpg",
                        previewTitle: "Email Sequence Builder",
                        previewDescription: "Design multi-step email sequences with conditional logic. Automate follow-ups based on prospect behavior and maximize your response rates."
                    },
                ],
                preview: {
                    title: "Dashboard Features",
                    description: "Access your complete cold email toolkit.",
                    cta: { label: "Go to Dashboard", href: "/dashboard" },
                },
            },
            {
                title: "Deliverability",
                items: [
                    {
                        icon: null,
                        title: "Email Warmup",
                        description: "Maximize inbox placement & deliverability",
                        href: "/dashboard/warmup",
                        previewImage: "/images/megamenu/warmup.jpg",
                        previewTitle: "Email Warmup Engine",
                        previewDescription: "Automatically warm up your email accounts with our intelligent warmup network. Improve sender reputation and ensure your emails land in the primary inbox."
                    },
                    {
                        icon: null,
                        title: "AI Generation",
                        description: "AI-powered email writing and prediction",
                        href: "/dashboard/generate",
                        previewImage: "/images/megamenu/ai-tools.jpg",
                        previewTitle: "AI-Powered Email Generation",
                        previewDescription: "Generate personalized email copies, subject lines, and entire sequences with AI. Our models are trained on millions of successful cold emails."
                    },
                    {
                        icon: null,
                        title: "Templates",
                        description: "Professional pre-built templates",
                        href: "/dashboard/templates",
                        previewImage: "/images/megamenu/templates.jpg",
                        previewTitle: "Email Templates Library",
                        previewDescription: "Access hundreds of proven email templates for every use case. Customize and save your own templates for quick access."
                    },
                ],
            },
        ],
    },
    {
        label: "Solutions",
        sections: [
            {
                title: "Compare",
                items: [
                    {
                        icon: null,
                        title: "vs Instantly",
                        description: "See how we compare",
                        href: "/compare/instantly",
                        previewImage: "/images/megamenu/compare.jpg",
                        previewTitle: "Mailfra vs Instantly",
                        previewDescription: "Discover why Mailfra offers better deliverability, more powerful automation, and superior AI capabilities compared to Instantly."
                    },
                    {
                        icon: null,
                        title: "vs Smartlead",
                        description: "Feature comparison",
                        href: "/compare/smartlead",
                        previewImage: "/images/megamenu/compare.jpg",
                        previewTitle: "Mailfra vs Smartlead",
                        previewDescription: "Compare features, pricing, and performance. See why teams are switching from Smartlead to Mailfra."
                    },
                    {
                        icon: null,
                        title: "vs Lemlist",
                        description: "Detailed comparison",
                        href: "/compare/lemlist",
                        previewImage: "/images/megamenu/analytics.jpg",
                        previewTitle: "Mailfra vs Lemlist",
                        previewDescription: "A detailed look at how Mailfra's features stack up against Lemlist for cold email outreach."
                    },
                ],
                preview: {
                    title: "Why Choose Mailfra",
                    description: "Compare Mailfra with other platforms.",
                    cta: { label: "View Comparisons", href: "/compare" },
                },
            },
            {
                title: "Business",
                items: [
                    {
                        icon: null,
                        title: "Pricing",
                        description: "Transparent pricing for all plans",
                        href: "/pricing",
                        previewImage: "/images/megamenu/analytics.jpg",
                        previewTitle: "Simple, Transparent Pricing",
                        previewDescription: "No hidden fees. Choose the plan that fits your needs with unlimited email accounts, sequences, and team members."
                    },
                    {
                        icon: null,
                        title: "Case Studies",
                        description: "Real results from real customers",
                        href: "/case-studies",
                        previewImage: "/images/megamenu/prospects.jpg",
                        previewTitle: "Customer Success Stories",
                        previewDescription: "See how teams like yours are using Mailfra to book more meetings, close more deals, and scale their outreach."
                    },
                    {
                        icon: null,
                        title: "Integrations",
                        description: "Connect your favorite tools",
                        href: "/integrations",
                        previewImage: "/images/megamenu/integrations.jpg",
                        previewTitle: "Powerful Integrations",
                        previewDescription: "Connect Mailfra with your CRM, calendar, and 50+ other tools. Sync data, automate workflows, and work smarter."
                    },
                ],
            },
        ],
    },
    {
        label: "Resources",
        sections: [
            {
                title: "Learning",
                items: [
                    {
                        icon: null,
                        title: "Blog",
                        description: "Latest insights and strategies",
                        href: "/blog",
                        previewImage: "/images/megamenu/prospects.jpg",
                        previewTitle: "Mailfra Blog",
                        previewDescription: "Expert tips, strategies, and insights on cold email, sales outreach, and lead generation. Updated weekly with actionable content."
                    },
                    {
                        icon: null,
                        title: "Guides & Tutorials",
                        description: "Step-by-step learning resources",
                        href: "/guides",
                        previewImage: "/images/megamenu/sequences.jpg",
                        previewTitle: "Guides & Tutorials",
                        previewDescription: "From beginner to advanced, our comprehensive guides will help you master cold email and get the most out of Mailfra."
                    },
                    {
                        icon: null,
                        title: "Help Center",
                        description: "Support and FAQ",
                        href: "/help",
                        previewImage: "/images/megamenu/analytics.jpg",
                        previewTitle: "Help Center",
                        previewDescription: "Get answers to common questions, troubleshooting guides, and step-by-step instructions for every feature."
                    },
                ],
                preview: {
                    title: "Learn & Grow",
                    description: "Access comprehensive guides and tutorials.",
                    cta: { label: "Browse Resources", href: "/guides" },
                },
            },
            {
                title: "Company",
                items: [
                    {
                        icon: null,
                        title: "Contact",
                        description: "Get in touch with us",
                        href: "/contact",
                        previewImage: "/images/megamenu/campaigns.jpg",
                        previewTitle: "Contact Us",
                        previewDescription: "Have questions? Our team is here to help. Reach out for sales inquiries, support, or partnership opportunities."
                    },
                    {
                        icon: null,
                        title: "About",
                        description: "Our mission and team",
                        href: "/about",
                        previewImage: "/images/megamenu/warmup.jpg",
                        previewTitle: "About Mailfra",
                        previewDescription: "Learn about our mission to revolutionize cold email outreach and the team making it happen."
                    },
                    {
                        icon: null,
                        title: "Changelog",
                        description: "Latest product updates",
                        href: "/changelog",
                        previewImage: "/images/megamenu/ai-tools.jpg",
                        previewTitle: "Product Changelog",
                        previewDescription: "Stay up to date with the latest features, improvements, and bug fixes. We ship new updates every week."
                    },
                ],
            },
        ],
    },
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
                href="/dashboard"
                className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
            >
                <Image
                    src="/mailfra-logo.png"
                    alt="Mailfra"
                    width={32}
                    height={32}
                    className={`w-6 h-6 object-contain ${isDark ? "brightness-0" : "brightness-0 invert"
                        }`}
                    priority
                />
                <span className="font-semibold text-lg tracking-tight text-foreground">mailfra</span>
            </Link>

            {/* Navigation Links with MegaMenu */}
            <div className="hidden lg:flex items-center gap-0">
                {megaMenus.map((menu) => (
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
                        {megaMenus.map((menu) => (
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
