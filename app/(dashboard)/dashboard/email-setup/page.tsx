// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DomainSetupWizard } from "@/components/email-setup/domain-setup-wizard"
// import { SendingAccountWizard } from "@/components/email-setup/sending-account-wizard"
// import { DNSVerificationGuide } from "@/components/email-setup/dns-verification-guide"
// import { EmailAuthStatus } from "@/components/email-setup/email-auth-status"
// import { Shield, Mail, Server, CheckCircle2 } from "lucide-react"

// export default async function EmailSetupPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
//         <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">SPF Records</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Setup Required</div>
//             <p className="text-xs text-muted-foreground">Sender Policy Framework</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">DKIM Keys</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Not Configured</div>
//             <p className="text-xs text-muted-foreground">DomainKeys Identified Mail</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">DMARC Policy</CardTitle>
//             <Server className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Not Set</div>
//             <p className="text-xs text-muted-foreground">Domain-based Authentication</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">MX Records</CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Pending</div>
//             <p className="text-xs text-muted-foreground">Mail Exchange</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Setup Tabs */}
//       <Tabs defaultValue="domain" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="domain">Domain Setup</TabsTrigger>
//           <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
//           <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
//           <TabsTrigger value="status">Verification Status</TabsTrigger>
//         </TabsList>

//         <TabsContent value="domain" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Add Your Domain</CardTitle>
//               <CardDescription>
//                 Start by adding your sending domain. We'll generate the DNS records you need to configure.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <DomainSetupWizard />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="dns" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>DNS Configuration Guide</CardTitle>
//               <CardDescription>
//                 Follow these step-by-step instructions to configure SPF, DKIM, DMARC, and MX records for your domain.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <DNSVerificationGuide />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="accounts" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Connect Sending Accounts</CardTitle>
//               <CardDescription>
//                 Add email accounts to send from. Each account must be from a verified domain with proper DNS setup.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <SendingAccountWizard />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="status" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Email Authentication Status</CardTitle>
//               <CardDescription>
//                 Real-time verification status of your domains and email authentication records.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EmailAuthStatus />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DomainSetupWizard } from "@/components/email-setup/domain-setup-wizard"
// import { SendingAccountWizard } from "@/components/email-setup/sending-account-wizard"
// import { DNSVerificationGuide } from "@/components/email-setup/dns-verification-guide"
// import { EmailAuthStatus } from "@/components/email-setup/email-auth-status"
// import { Shield, Mail, Server, CheckCircle2 } from "lucide-react"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { redirect } from "next/navigation"

// export default async function EmailSetupPage() {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) redirect("/sign-in")

//   const domains = await db.domain.findMany({
//     where: { userId: user.id },
//     include: { deliverabilityHealth: true },
//   })

//   // Calculate overall DNS status
//   const totalDomains = domains.length
//   const verifiedDomains = domains.filter((d) => d.isVerified).length
//   const spfConfigured = domains.filter((d) => d.deliverabilityHealth?.spfStatus === "VALID").length
//   const dkimConfigured = domains.filter((d) => d.deliverabilityHealth?.dkimStatus === "VALID").length
//   const dmarcConfigured = domains.filter((d) => d.deliverabilityHealth?.dmarcStatus === "VALID").length
//   const mxConfigured = domains.filter((d) => d.deliverabilityHealth?.mxStatus === "VALID").length

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
//         <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">SPF Records</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {spfConfigured}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">Sender Policy Framework</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">DKIM Keys</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dkimConfigured}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">DomainKeys Identified Mail</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">DMARC Policy</CardTitle>
//             <Server className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dmarcConfigured}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">Domain-based Authentication</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Verified Domains</CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {verifiedDomains}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">Fully Configured</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Setup Tabs */}
//       <Tabs defaultValue="domain" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="domain">Domain Setup</TabsTrigger>
//           <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
//           <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
//           <TabsTrigger value="status">Verification Status</TabsTrigger>
//         </TabsList>

//         <TabsContent value="domain" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Add Your Domain</CardTitle>
//               <CardDescription>
//                 Start by adding your sending domain. We'll generate the DNS records you need to configure.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <DomainSetupWizard />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="dns" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>DNS Configuration Guide</CardTitle>
//               <CardDescription>
//                 Follow these step-by-step instructions to configure SPF, DKIM, DMARC, and MX records for your domain.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <DNSVerificationGuide />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="accounts" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Connect Sending Accounts</CardTitle>
//               <CardDescription>
//                 Add email accounts to send from. Each account must be from a verified domain with proper DNS setup.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <SendingAccountWizard />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="status" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Email Authentication Status</CardTitle>
//               <CardDescription>
//                 Real-time verification status of your domains and email authentication records.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EmailAuthStatus />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DomainSetupWizard } from "@/components/email-setup/domain-setup-wizard"
// import { SendingAccountWizard } from "@/components/email-setup/sending-account-wizard"
// import { DNSVerificationGuide } from "@/components/email-setup/dns-verification-guide"
// import { EmailAuthStatus } from "@/components/email-setup/email-auth-status"
// import { Shield, Mail, Server, CheckCircle2 } from "lucide-react"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { redirect } from "next/navigation"

// export default async function EmailSetupPage() {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) redirect("/sign-in")

//   const domains = await db.domain.findMany({
//     where: { userId: user.id },
//     include: { deliverabilityHealth: true },
//   })

//   // Calculate overall DNS status
//   const totalDomains = domains.length
//   const verifiedDomains = domains.filter((d) => d.isVerified).length
//   const spfConfigured = domains.filter((d) => d.deliverabilityHealth?.spfStatus === "VALID").length
//   const dkimConfigured = domains.filter((d) => d.deliverabilityHealth?.dkimStatus === "VALID").length
//   const dmarcConfigured = domains.filter((d) => d.deliverabilityHealth?.dmarcStatus === "VALID").length
//   const mxConfigured = domains.filter((d) => d.deliverabilityHealth?.mxRecordsValid).length

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
//         <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">SPF Records</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {spfConfigured}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">Sender Policy Framework</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">DKIM Keys</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dkimConfigured}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">DomainKeys Identified Mail</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">DMARC Policy</CardTitle>
//             <Server className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {dmarcConfigured}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">Domain-based Authentication</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Verified Domains</CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {verifiedDomains}/{totalDomains}
//             </div>
//             <p className="text-xs text-muted-foreground">Fully Configured</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Setup Tabs */}
//       <Tabs defaultValue="domain" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="domain">Domain Setup</TabsTrigger>
//           <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
//           <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
//           <TabsTrigger value="status">Verification Status</TabsTrigger>
//         </TabsList>

//         <TabsContent value="domain" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Add Your Domain</CardTitle>
//               <CardDescription>
//                 Start by adding your sending domain. We'll generate the DNS records you need to configure.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <DomainSetupWizard />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="dns" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>DNS Configuration Guide</CardTitle>
//               <CardDescription>
//                 Follow these step-by-step instructions to configure SPF, DKIM, DMARC, and MX records for your domain.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <DNSVerificationGuide />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="accounts" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Connect Sending Accounts</CardTitle>
//               <CardDescription>
//                 Add email accounts to send from. Each account must be from a verified domain with proper DNS setup.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <SendingAccountWizard />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="status" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Email Authentication Status</CardTitle>
//               <CardDescription>
//                 Real-time verification status of your domains and email authentication records.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <EmailAuthStatus />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { redirect } from "next/navigation"
// import { GuidedEmailWizard } from "@/components/email-setup/guided-email-wizard"

// export default async function EmailSetupPage() {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) redirect("/sign-in")

//   const domains = await db.domain.findMany({
//     where: { userId: user.id },
//     include: { deliverabilityHealth: true },
//   })

//   // Calculate overall DNS status
//   const totalDomains = domains.length
//   const verifiedDomains = domains.filter((d) => d.isVerified).length
//   const spfConfigured = domains.filter((d) => d.deliverabilityHealth?.spfStatus === "VALID").length
//   const dkimConfigured = domains.filter((d) => d.deliverabilityHealth?.dkimStatus === "VALID").length
//   const dmarcConfigured = domains.filter((d) => d.deliverabilityHealth?.dmarcStatus === "VALID").length
//   const mxConfigured = domains.filter((d) => d.deliverabilityHealth?.mxRecordsValid).length

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
//         <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
//       </div>

//       {/* Main Setup Tabs */}
//       <GuidedEmailWizard />
//     </div>
//   )
// }


// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { redirect } from "next/navigation"
// import { GuidedEmailWizard } from "@/components/email-setup/guided-email-wizard"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CheckCircle2, Clock } from "lucide-react"

// export default async function EmailSetupPage() {
//   const { userId } = await auth()
//   if (!userId) redirect("/sign-in")

//   const user = await db.user.findUnique({ where: { clerkId: userId } })
//   if (!user) redirect("/sign-in")

//   const domains = await db.domain.findMany({
//     where: { userId: user.id },
//     include: {
//       deliverabilityHealth: true,
//       sendingAccounts: true,
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   const unconfiguredDomains = domains.filter((d) => !d.isVerified)
//   const configuredDomains = domains.filter((d) => d.isVerified)

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
//         <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
//       </div>

//       {domains.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Domains</CardTitle>
//             <CardDescription>Select a domain to configure or view its status</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {unconfiguredDomains.length > 0 && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-muted-foreground">Needs Configuration</h4>
//                 {unconfiguredDomains.map((domain) => (
//                   <div
//                     key={domain.id}
//                     className="flex items-center justify-between p-3 border border-amber-200 rounded-lg bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Clock className="h-5 w-5 text-amber-600" />
//                       <div>
//                         <p className="font-medium">{domain.domain}</p>
//                         <p className="text-xs text-muted-foreground">
//                           DNS configuration incomplete - Resume setup below
//                         </p>
//                       </div>
//                     </div>
//                     <Badge variant="outline" className="border-amber-600 text-amber-600">
//                       Pending
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {configuredDomains.length > 0 && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-muted-foreground">Verified & Active</h4>
//                 {configuredDomains.map((domain) => (
//                   <div
//                     key={domain.id}
//                     className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50 dark:border-green-900 dark:bg-green-950"
//                   >
//                     <div className="flex items-center gap-3">
//                       <CheckCircle2 className="h-5 w-5 text-green-600" />
//                       <div>
//                         <p className="font-medium">{domain.domain}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {domain.sendingAccounts.length} sending account
//                           {domain.sendingAccounts.length !== 1 ? "s" : ""} connected
//                         </p>
//                       </div>
//                     </div>
//                     <Badge variant="default" className="bg-green-600">
//                       Verified
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Main Setup Wizard */}
//       <GuidedEmailWizard existingDomains={domains} />
//     </div>
//   )
// }


import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { GuidedEmailWizard } from "@/components/email-setup/guided-email-wizard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Settings } from "lucide-react"

export default async function EmailSetupPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect("/sign-in")

  const domains = await db.domain.findMany({
    where: { userId: user.id },
    include: {
      deliverabilityHealth: true,
      sendingAccounts: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const unconfiguredDomains = domains.filter((d) => !d.isVerified)
  const configuredDomains = domains.filter((d) => d.isVerified)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
        <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
      </div>

      {domains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
            <CardDescription>Select a domain to configure or view its status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {unconfiguredDomains.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Needs Configuration</h4>
                {unconfiguredDomains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-3 border border-amber-200 rounded-lg bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium">{domain.domain}</p>
                        <p className="text-xs text-muted-foreground">
                          {domain.verificationAttempts > 0
                            ? `${domain.verificationAttempts} verification attempt${domain.verificationAttempts !== 1 ? "s" : ""} - Click to resume`
                            : "DNS configuration needed"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-amber-600 text-amber-600">
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {configuredDomains.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Verified & Active</h4>
                {configuredDomains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50 dark:border-green-900 dark:bg-green-950"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{domain.domain}</p>
                        <p className="text-xs text-muted-foreground">
                          {domain.sendingAccounts.length} sending account
                          {domain.sendingAccounts.length !== 1 ? "s" : ""} connected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        Verified
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <a href="/dashboard/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Setup Wizard */}
      <GuidedEmailWizard existingDomains={domains} />
    </div>
  )
}
