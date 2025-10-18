// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Check, CreditCard, Download } from "lucide-react"

// const plans = [
//   {
//     name: "FREE",
//     price: "$0",
//     period: "forever",
//     features: ["100 emails/month", "1 campaign", "Basic analytics", "Email support"],
//     current: false,
//   },
//   {
//     name: "STARTER",
//     price: "$29",
//     period: "per month",
//     features: ["1,000 emails/month", "5 campaigns", "Advanced analytics", "AI email generation", "Priority support"],
//     current: true,
//   },
//   {
//     name: "PRO",
//     price: "$79",
//     period: "per month",
//     features: [
//       "10,000 emails/month",
//       "Unlimited campaigns",
//       "Advanced analytics",
//       "AI research assistant",
//       "Team collaboration",
//       "API access",
//       "Priority support",
//     ],
//     current: false,
//   },
//   {
//     name: "AGENCY",
//     price: "$199",
//     period: "per month",
//     features: [
//       "50,000 emails/month",
//       "Unlimited campaigns",
//       "White-label options",
//       "Dedicated account manager",
//       "Custom integrations",
//       "SLA guarantee",
//     ],
//     current: false,
//   },
// ]

// const invoices = [
//   { id: "INV-001", date: "Jan 1, 2025", amount: "$29.00", status: "Paid" },
//   { id: "INV-002", date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
//   { id: "INV-003", date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
// ]

// export default function BillingPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
//         <p className="text-muted-foreground">Manage your subscription and billing information</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Current Plan</CardTitle>
//           <CardDescription>You are currently on the Starter plan</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-2xl font-bold">$29/month</p>
//               <p className="text-sm text-muted-foreground">Next billing date: Feb 1, 2025</p>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline">Cancel Subscription</Button>
//               <Button>Upgrade Plan</Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div>
//         <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {plans.map((plan) => (
//             <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>{plan.name}</CardTitle>
//                   {plan.current && <Badge>Current</Badge>}
//                 </div>
//                 <div className="mt-4">
//                   <span className="text-3xl font-bold">{plan.price}</span>
//                   <span className="text-muted-foreground">/{plan.period}</span>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <ul className="space-y-2">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-start gap-2 text-sm">
//                       <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <Button className="w-full" variant={plan.current ? "outline" : "default"} disabled={plan.current}>
//                   {plan.current ? "Current Plan" : "Upgrade"}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Payment Method</CardTitle>
//           <CardDescription>Manage your payment methods</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between p-4 border border-border rounded-lg">
//             <div className="flex items-center gap-4">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
//                 <CreditCard className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="font-medium">•••• •••• •••• 4242</p>
//                 <p className="text-sm text-muted-foreground">Expires 12/2025</p>
//               </div>
//             </div>
//             <Button variant="outline" size="sm">
//               Update
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Billing History</CardTitle>
//           <CardDescription>Download your past invoices</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {invoices.map((invoice) => (
//               <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                 <div>
//                   <p className="font-medium">{invoice.id}</p>
//                   <p className="text-sm text-muted-foreground">{invoice.date}</p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="text-right">
//                     <p className="font-medium">{invoice.amount}</p>
//                     <Badge variant="secondary">{invoice.status}</Badge>
//                   </div>
//                   <Button variant="ghost" size="icon">
//                     <Download className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Download } from "lucide-react"
import { getUserSubscription, getBillingHistory } from "@/lib/actions/billing"
import { PRICING_TIERS } from "@/lib/constants"

export default async function BillingPage() {
  const subscription = await getUserSubscription()
  const invoices = await getBillingHistory()

  const currentPlan = PRICING_TIERS.find((p) => p.tier === subscription.tier)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the {currentPlan?.name || "Free"} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                ${currentPlan?.price || 0}/{currentPlan?.interval || "month"}
              </p>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
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
                >
                  <Button variant="outline" type="submit">
                    Cancel Subscription
                  </Button>
                </form>
              )}
              <Button>Upgrade Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_TIERS.map((plan) => {
            const isCurrent = plan.tier === subscription.tier
            return (
              <Card key={plan.tier} className={isCurrent ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrent && <Badge>Current</Badge>}
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={isCurrent ? "outline" : "default"} disabled={isCurrent}>
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date.toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${(invoice.amount / 100).toFixed(2)}</p>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
