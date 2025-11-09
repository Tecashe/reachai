import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DomainSetupWizard } from "@/components/email-setup/domain-setup-wizard"
import { SendingAccountWizard } from "@/components/email-setup/sending-account-wizard"
import { DNSVerificationGuide } from "@/components/email-setup/dns-verification-guide"
import { EmailAuthStatus } from "@/components/email-setup/email-auth-status"
import { Shield, Mail, Server, CheckCircle2 } from "lucide-react"

export default async function EmailSetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email & Domain Setup</h1>
        <p className="text-muted-foreground">Configure your domains and email accounts for maximum deliverability</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SPF Records</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Setup Required</div>
            <p className="text-xs text-muted-foreground">Sender Policy Framework</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DKIM Keys</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Not Configured</div>
            <p className="text-xs text-muted-foreground">DomainKeys Identified Mail</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DMARC Policy</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Not Set</div>
            <p className="text-xs text-muted-foreground">Domain-based Authentication</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MX Records</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pending</div>
            <p className="text-xs text-muted-foreground">Mail Exchange</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Setup Tabs */}
      <Tabs defaultValue="domain" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="domain">Domain Setup</TabsTrigger>
          <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
          <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
          <TabsTrigger value="status">Verification Status</TabsTrigger>
        </TabsList>

        <TabsContent value="domain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Your Domain</CardTitle>
              <CardDescription>
                Start by adding your sending domain. We'll generate the DNS records you need to configure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DomainSetupWizard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Configuration Guide</CardTitle>
              <CardDescription>
                Follow these step-by-step instructions to configure SPF, DKIM, DMARC, and MX records for your domain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DNSVerificationGuide />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Sending Accounts</CardTitle>
              <CardDescription>
                Add email accounts to send from. Each account must be from a verified domain with proper DNS setup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SendingAccountWizard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Authentication Status</CardTitle>
              <CardDescription>
                Real-time verification status of your domains and email authentication records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailAuthStatus />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
