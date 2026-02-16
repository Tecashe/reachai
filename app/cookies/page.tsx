'use client'

import { PageHeader } from '@/components/shared/page-header'
import { PageFooter } from '@/components/shared/page-footer'
import { ArrowLeft, Calendar, Cookie } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const sections = [
    { id: 'what-are-cookies', title: 'What Are Cookies?' },
    { id: 'types-cookies', title: 'Types of Cookies' },
    { id: 'cookies-we-use', title: 'Cookies We Use' },
    { id: 'third-party-cookies', title: 'Third-Party Cookies' },
    { id: 'cookie-consent', title: 'Cookie Consent' },
    { id: 'manage-cookies', title: 'How to Manage Cookies' },
    { id: 'california-privacy', title: 'California Privacy Rights' },
    { id: 'contact', title: 'Contact Us' },
]

export default function CookiesPage() {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(s => document.getElementById(s.id)).filter(Boolean)
            const current = sectionElements.find(el => {
                if (!el) return false
                const rect = el.getBoundingClientRect()
                return rect.top <= 100 && rect.bottom >= 100
            })
            if (current) {
                setActiveSection(current.id)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-background">
            <PageHeader />

            {/* Hero */}
            <section className="py-12 md:py-20 px-4 md:px-6 border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 md:mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="w-12 md:w-14 h-12 md:h-14 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center">
                            <Cookie className="w-6 md:w-7 h-6 md:h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-foreground">Cookie Policy</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm md:text-base">Last updated: December 1, 2024</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16 px-4 md:px-6 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-[200px_1fr] gap-8 md:gap-12 lg:gap-16">
                        {/* Sidebar Navigation */}
                        <nav className="hidden lg:block">
                            <div className="sticky top-32">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">On this page</h3>
                                <ul className="space-y-1">
                                    {sections.map((section) => (
                                        <li key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                className={`block py-2 text-sm transition-colors ${activeSection === section.id
                                                        ? 'text-foreground font-medium border-l-2 border-primary pl-3'
                                                        : 'text-muted-foreground hover:text-foreground pl-3'
                                                    }`}
                                            >
                                                {section.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>

                        {/* Main Content */}
                        <div className="space-y-10 md:space-y-12 max-w-none">
                            <section id="what-are-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">What Are Cookies?</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">
                                    Cookies are small text files that are stored on your computer or mobile device when you visit our website. They contain information about your browsing preferences and help us recognize you when you return to our site. Cookies are widely used to make websites work more efficiently and to provide information to website owners.
                                </p>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                    We use cookies to improve your browsing experience, personalize content, analyze traffic, and enhance security. By using Mailfra, you consent to our use of cookies as described in this policy.
                                </p>
                            </section>

                            <section id="types-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Types of Cookies</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                                    Different types of cookies serve different purposes on our website:
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Session Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                            These are temporary cookies that are deleted when you close your browser. They help us keep track of your activity during a single browsing session, such as items in your shopping cart or form data you've entered.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Persistent Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                            These cookies remain on your device for a longer period, even after you close your browser. They help us remember your preferences and login information on future visits.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">First-Party Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                            Set directly by Mailfra, these cookies are used to store your preferences and enhance your experience on our platform.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Third-Party Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                            Set by other websites and services we use (like analytics providers), these cookies help us understand how you use our site and improve our services.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section id="cookies-we-use" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Cookies We Use</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                                    Here is a detailed list of the cookies we use on Mailfra:
                                </p>

                                <div className="space-y-6 overflow-x-auto">
                                    <table className="w-full text-sm md:text-base border border-border rounded-lg overflow-hidden">
                                        <thead className="bg-card border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-foreground">Cookie Name</th>
                                                <th className="px-4 py-3 text-left font-semibold text-foreground">Purpose</th>
                                                <th className="px-4 py-3 text-left font-semibold text-foreground">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            <tr className="hover:bg-card/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs md:text-sm">session_id</td>
                                                <td className="px-4 py-3 text-muted-foreground">Maintains your user session and login status</td>
                                                <td className="px-4 py-3 text-muted-foreground">Session</td>
                                            </tr>
                                            <tr className="hover:bg-card/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs md:text-sm">preferences</td>
                                                <td className="px-4 py-3 text-muted-foreground">Stores your theme, language, and display preferences</td>
                                                <td className="px-4 py-3 text-muted-foreground">1 year</td>
                                            </tr>
                                            <tr className="hover:bg-card/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs md:text-sm">analytics_id</td>
                                                <td className="px-4 py-3 text-muted-foreground">Tracks anonymous usage patterns to improve our service</td>
                                                <td className="px-4 py-3 text-muted-foreground">2 years</td>
                                            </tr>
                                            <tr className="hover:bg-card/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs md:text-sm">csrf_token</td>
                                                <td className="px-4 py-3 text-muted-foreground">Security cookie to prevent cross-site request forgery attacks</td>
                                                <td className="px-4 py-3 text-muted-foreground">Session</td>
                                            </tr>
                                            <tr className="hover:bg-card/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs md:text-sm">remember_me</td>
                                                <td className="px-4 py-3 text-muted-foreground">Allows "Remember Me" functionality for login</td>
                                                <td className="px-4 py-3 text-muted-foreground">30 days</td>
                                            </tr>
                                            <tr className="hover:bg-card/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs md:text-sm">cookie_consent</td>
                                                <td className="px-4 py-3 text-muted-foreground">Records your cookie consent preferences</td>
                                                <td className="px-4 py-3 text-muted-foreground">1 year</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section id="third-party-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Third-Party Cookies</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                                    We use the following third-party services that may set their own cookies:
                                </p>

                                <div className="space-y-4">
                                    <div className="border border-border rounded-lg p-4 md:p-6 bg-card/50">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Google Analytics</h3>
                                        <p className="text-muted-foreground text-base md:text-lg mb-3">
                                            We use Google Analytics to understand how users interact with our website and to improve our services. Google Analytics sets cookies to track page views, bounce rate, and user behavior.
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">Cookie:</span> _ga, _gid, _gat
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-lg p-4 md:p-6 bg-card/50">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Stripe Payments</h3>
                                        <p className="text-muted-foreground text-base md:text-lg mb-3">
                                            When you make a payment through Stripe, Stripe may set cookies for payment processing and fraud prevention.
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">Purpose:</span> Payment processing and security
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-lg p-4 md:p-6 bg-card/50">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Hotjar</h3>
                                        <p className="text-muted-foreground text-base md:text-lg mb-3">
                                            We use Hotjar to collect user feedback and understand how users interact with our website through heatmaps and session recordings (with consent).
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">Cookie:</span> _hjid, _hjIncludedInSessionSample
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section id="cookie-consent" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Cookie Consent</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                                    When you first visit Mailfra, we will ask for your consent to use cookies. We categorize cookies as follows:
                                </p>

                                <div className="space-y-4">
                                    <div className="border border-border rounded-lg p-4 md:p-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Essential Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg">
                                            These cookies are necessary for the website to function properly. They include session management and security cookies. You cannot opt out of these cookies.
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-lg p-4 md:p-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Performance Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg">
                                            These cookies help us understand how you use our website and improve performance. You can opt out of these cookies.
                                        </p>
                                    </div>

                                    <div className="border border-border rounded-lg p-4 md:p-6">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">Marketing Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg">
                                            These cookies are used to track your behavior across websites for targeted advertising. You can opt out of these cookies at any time.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section id="manage-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">How to Manage Cookies</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                                    You have full control over cookies on your device. Here's how you can manage them:
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Browser Settings</h3>
                                        <p className="text-muted-foreground text-base md:text-lg mb-4">
                                            Most browsers allow you to refuse cookies or alert you when a cookie is being set. Here's how to manage cookies in popular browsers:
                                        </p>
                                        <ul className="space-y-2 text-muted-foreground text-base md:text-lg">
                                            <li className="flex gap-3">
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span><span className="font-medium text-foreground">Chrome:</span> Settings → Privacy and security → Cookies and other site data</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span><span className="font-medium text-foreground">Firefox:</span> Settings → Privacy & Security → Cookies and Site Data</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span><span className="font-medium text-foreground">Safari:</span> Preferences → Privacy → Cookies and website data</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span><span className="font-medium text-foreground">Edge:</span> Settings → Privacy → Clear browsing data</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Cookie Consent Manager</h3>
                                        <p className="text-muted-foreground text-base md:text-lg">
                                            You can manage your cookie preferences at any time by clicking the "Cookie Preferences" button in the footer of our website or accessing your account settings.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Opt-Out of Third-Party Cookies</h3>
                                        <p className="text-muted-foreground text-base md:text-lg mb-4">
                                            You can opt out of third-party cookies from specific providers:
                                        </p>
                                        <ul className="space-y-2 text-muted-foreground text-base md:text-lg">
                                            <li className="flex gap-3">
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span><span className="font-medium text-foreground">Google Analytics:</span> Install the Google Analytics Opt-out Browser Add-on</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-primary font-bold mt-1">•</span>
                                                <span><span className="font-medium text-foreground">Hotjar:</span> Visit hotjar.com/opt-out to disable Hotjar tracking</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section id="california-privacy" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">California Privacy Rights</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">
                                    Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding cookies and personal information:
                                </p>
                                <ul className="space-y-3 text-muted-foreground text-base md:text-lg">
                                    <li className="flex gap-3">
                                        <span className="text-primary font-bold mt-1">•</span>
                                        <span><span className="font-medium text-foreground">Right to Know:</span> You can request what personal information we collect, including cookie data</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary font-bold mt-1">•</span>
                                        <span><span className="font-medium text-foreground">Right to Delete:</span> You can request that we delete personal information we've collected</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary font-bold mt-1">•</span>
                                        <span><span className="font-medium text-foreground">Right to Opt-Out:</span> You can opt out of the sale or sharing of your personal information</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-primary font-bold mt-1">•</span>
                                        <span><span className="font-medium text-foreground">Right to Non-Discrimination:</span> We will not discriminate against you for exercising your CCPA rights</span>
                                    </li>
                                </ul>
                            </section>

                            <section id="contact" className="scroll-mt-32">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Contact Us</h2>
                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                                    If you have any questions about this Cookie Policy or how we use cookies, please contact us:
                                </p>
                                <div className="space-y-3 text-muted-foreground text-base md:text-lg">
                                    <p className="flex gap-3">
                                        <span className="font-medium text-foreground min-w-fit">Email:</span>
                                        <span>privacy@mailfra.com</span>
                                    </p>
                                    <p className="flex gap-3">
                                        <span className="font-medium text-foreground min-w-fit">Address:</span>
                                        <span>548 Market Street, Suite 42, San Francisco, CA 94104</span>
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            <PageFooter />
        </main>
    )
}
