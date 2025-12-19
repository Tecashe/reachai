

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, ArrowRight, Coins, Info, Sparkles, Zap, Check, ArrowUpRight } from "lucide-react"
import { getUserSubscription, getBillingHistory } from "@/lib/actions/billing"
import { PRICING_TIERS } from "@/lib/constants"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { PaymentMethodManager } from "@/components/billing/payment-method-manager"
import { cn } from "@/lib/utils"

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const subscription = await getUserSubscription()
  const invoices = await getBillingHistory()

  const currentPlan = PRICING_TIERS.find((p) => p.tier === subscription.tier)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative">
        <div className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-foreground/5 via-transparent to-foreground/5 blur-3xl -z-10" />
        <h1 className="text-4xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription, credits, and billing information</p>
      </div>

      {/* Info Alert - Liquid Glass Style */}
      <div className="glass-liquid rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay pointer-events-none" />
        <div className="relative flex gap-4">
          <div className="neu-raised rounded-xl p-3 h-fit">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold tracking-tight">How Billing Works</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Subscription</p>
                <p className="text-muted-foreground leading-relaxed">
                  Monthly/yearly fee for platform access and features. Provides unlimited campaigns, prospects, and team
                  members based on your tier.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Credits</p>
                <p className="text-muted-foreground leading-relaxed">
                  Pay-as-you-go for actual usage. 1 credit = 1 email sent or 1-3 credits per research action. Purchase
                  credits separately as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid - Credits & Subscription */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Credit Balance - Large Card */}
        <div className="lg:col-span-3 relative group">
          <div className="absolute -inset-1 rounded-3xl bg-foreground/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Card className="relative h-full glass-liquid border-0 overflow-hidden">
            <div className="absolute inset-0 noise-overlay pointer-events-none" />
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="neu-raised rounded-xl p-2.5">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg tracking-tight">Credit Balance</CardTitle>
                    <CardDescription className="text-xs">Available for emails & research</CardDescription>
                  </div>
                </div>
                <Link href="/dashboard/credits">
                  <Button className="btn-press bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-2">
                    Purchase Credits
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                {/* Email Credits */}
                <div className="glass rounded-2xl p-5 group/card hover:shadow-layered-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-chart-1" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Email Credits</p>
                  </div>
                  <p className="text-4xl font-bold tracking-tight tabular-nums">{user.emailCredits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">1 credit per email sent</p>
                </div>

                {/* Research Credits */}
                <div className="glass rounded-2xl p-5 group/card hover:shadow-layered-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-chart-3" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Research Credits
                    </p>
                  </div>
                  <p className="text-4xl font-bold tracking-tight tabular-nums">
                    {user.researchCredits.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">1-3 credits per research action</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Subscription - Compact Card */}
        <div className="lg:col-span-2 relative group">
          <div className="absolute -inset-1 rounded-3xl bg-foreground/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Card className="relative h-full floating-card border-border/50">
            <div className="absolute inset-0 noise-overlay pointer-events-none rounded-lg" />
            <CardHeader className="relative pb-2">
              <div className="flex items-center gap-3">
                <div className="neu-raised rounded-xl p-2.5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg tracking-tight">Current Plan</CardTitle>
                  <CardDescription className="text-xs">{currentPlan?.name || "Free"} tier</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">${currentPlan?.price || 0}</span>
                  <span className="text-muted-foreground text-sm">/{currentPlan?.interval || "month"}</span>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {subscription.status === "ACTIVE" && (
                  <form
                    action={async () => {
                      "use server"
                      const { cancelSubscription } = await import("@/lib/actions/billing")
                      await cancelSubscription()
                    }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      type="submit"
                      className="w-full btn-press rounded-xl text-sm bg-transparent"
                    >
                      Cancel
                    </Button>
                  </form>
                )}
                <Button className="flex-1 btn-press bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Plans - Bento */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
            <p className="text-sm text-muted-foreground mt-1">
              All plans require separate credit purchases for sending emails and conducting research.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {PRICING_TIERS.map((plan, index) => {
            const isCurrent = plan.tier === subscription.tier
            return (
              <div key={plan.tier} className={cn("relative group", plan.popular && "lg:scale-[1.02] z-10")}>
                {/* Hover glow */}
                <div
                  className={cn(
                    "absolute -inset-2 rounded-3xl transition-all duration-500",
                    plan.popular
                      ? "bg-foreground/5 blur-xl"
                      : "bg-foreground/3 blur-xl opacity-0 group-hover:opacity-100",
                  )}
                />

                <Card
                  className={cn(
                    "relative h-full transition-all duration-300 border-border/50",
                    plan.popular && "border-foreground/20",
                    isCurrent && "border-foreground/40 bg-secondary/30",
                    !isCurrent && "hover:border-foreground/20 hover:-translate-y-1 hover:shadow-layered-lg",
                  )}
                >
                  <div className="absolute inset-0 noise-overlay pointer-events-none rounded-lg" />

                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="glass-liquid px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Popular</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="relative pt-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="tracking-tight">{plan.name}</CardTitle>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight">${plan.price}</span>
                      <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-4">
                    <ul className="space-y-2">
                      {plan.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <div className="flex-shrink-0 rounded-full bg-foreground/10 p-0.5 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="text-muted-foreground text-xs leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-[10px] text-muted-foreground/60 pl-5">+{plan.features.length - 4} more</li>
                      )}
                    </ul>

                    <Button
                      className={cn(
                        "w-full btn-press rounded-xl text-sm",
                        isCurrent
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-foreground text-background hover:bg-foreground/90",
                      )}
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Method Manager */}
      <PaymentMethodManager />

      {/* Payment Method Card */}
      <Card className="relative floating-card border-border/50 overflow-hidden">
        <div className="absolute inset-0 noise-overlay pointer-events-none rounded-lg" />
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="neu-raised rounded-xl p-2.5">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="tracking-tight">Payment Method</CardTitle>
              <CardDescription className="text-xs">Manage your payment methods</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="glass rounded-2xl p-4 flex items-center justify-between group hover:shadow-layered-sm transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="neu-raised rounded-xl p-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium tracking-tight">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="btn-press rounded-xl gap-1.5">
              Update
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="relative floating-card border-border/50 overflow-hidden">
        <div className="absolute inset-0 noise-overlay pointer-events-none rounded-lg" />
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="neu-raised rounded-xl p-2.5">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="tracking-tight">Billing History</CardTitle>
              <CardDescription className="text-xs">Download your past invoices and credit purchases</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-3">
          {invoices.map((invoice, index) => (
            <div
              key={invoice.id}
              className={cn(
                "glass rounded-xl p-4 flex items-center justify-between",
                "hover:shadow-layered-sm transition-all duration-300 group",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-xs font-bold">
                  {invoice.date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium tracking-tight text-sm">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">{invoice.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold tracking-tight tabular-nums">${(invoice.amount / 100).toFixed(2)}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      invoice.status === "paid" && "bg-success/10 text-success",
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="btn-press rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
