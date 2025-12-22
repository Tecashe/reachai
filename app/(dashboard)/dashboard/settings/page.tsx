
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ProfileSettings } from "@/components/settings/profile-settings"
// import { EmailSettings } from "@/components/settings/email-settings"
// import { ApiKeysSettings } from "@/components/settings/api-keys-settings"
// import { TeamSettings } from "@/components/settings/team-settings"
// import { NotificationSettings } from "@/components/settings/notification-settings"
// import { SendingAccountsSettings } from "@/components/settings/sending-accounts-settings"
// import { DeliverabilityDashboard } from "@/components/settings/deliverability-dashboard"
// import { ComplianceDashboard } from "@/components/settings/compliance-dashboard"
// import { ResearchSettings } from "@/components/settings/research-settings"
// import { AIModelSettings } from "@/components/settings/ai-models-settings"
// import { DomainVerification } from "@/components/settings/domain-verification-settings"
// import { getUserSettings } from "@/lib/actions/settings"

// export default async function SettingsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ tab?: string }>
// }) {
//   const settings = await getUserSettings()
//   const { tab } = await searchParams
//   const defaultTab = tab || "profile"

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//         <p className="text-muted-foreground">Manage your account settings and preferences</p>
//       </div>

//       <Tabs defaultValue={defaultTab} className="space-y-6">
//         <TabsList className="flex-wrap h-auto gap-1">
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="email">Email</TabsTrigger>
//           <TabsTrigger value="research">Research</TabsTrigger>
//           <TabsTrigger value="ai-models">AI Models</TabsTrigger>
//           <TabsTrigger value="domains">Domains</TabsTrigger>
//           <TabsTrigger value="sending">Sending Accounts</TabsTrigger>
//           <TabsTrigger value="deliverability">Deliverability</TabsTrigger>
//           <TabsTrigger value="compliance">Compliance</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//           <TabsTrigger value="api">API Keys</TabsTrigger>
//           <TabsTrigger value="team">Team</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <ProfileSettings user={settings.user} />
//         </TabsContent>

//         <TabsContent value="email">
//           <EmailSettings settings={settings.emailSettings} />
//         </TabsContent>

//         <TabsContent value="research">
//           <ResearchSettings />
//         </TabsContent>

//         <TabsContent value="ai-models">
//           <AIModelSettings />
//         </TabsContent>

//         <TabsContent value="domains">
//           <DomainVerification />
//         </TabsContent>

//         <TabsContent value="sending">
//           <SendingAccountsSettings />
//         </TabsContent>

//         <TabsContent value="deliverability">
//           <DeliverabilityDashboard />
//         </TabsContent>

//         <TabsContent value="compliance">
//           <ComplianceDashboard />
//         </TabsContent>

//         <TabsContent value="notifications">
//           <NotificationSettings settings={settings.notificationSettings} />
//         </TabsContent>

//         <TabsContent value="api">
//           <ApiKeysSettings />
//         </TabsContent>

//         <TabsContent value="team">
//           <TeamSettings members={settings.teamMembers} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { EmailSettings } from "@/components/settings/email-settings"
import { ApiKeysSettings } from "@/components/settings/api-keys-settings"
import { TeamSettings } from "@/components/settings/team-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SendingAccountsSettings } from "@/components/settings/sending-accounts-settings"
import { DeliverabilityDashboard } from "@/components/settings/deliverability-dashboard"
import { ComplianceDashboard } from "@/components/settings/compliance-dashboard"
import { ResearchSettings } from "@/components/settings/research-settings"
import { getUserSettings } from "@/lib/actions/settings"
import { AIModelSettings } from "@/components/settings/ai-models-settings"
import { DomainVerification } from "@/components/settings/domain-verification-settings"

import { Badge } from "@/components/ui/badge"

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const settings = await getUserSettings()
  const { tab } = await searchParams
  const defaultTab = tab || "profile"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="sending">Sending Accounts</TabsTrigger>
          <TabsTrigger value="deliverability">Deliverability</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            API Keys
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              NEW
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={settings.user} />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings settings={settings.emailSettings} />
        </TabsContent>

        <TabsContent value="research">
          <ResearchSettings />
        </TabsContent>

        <TabsContent value="ai-models">
          <AIModelSettings />
        </TabsContent>

        <TabsContent value="domains">
          <DomainVerification />
        </TabsContent>

        <TabsContent value="sending">
          <SendingAccountsSettings />
        </TabsContent>

        <TabsContent value="deliverability">
          <DeliverabilityDashboard />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDashboard />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings settings={settings.notificationSettings} />
        </TabsContent>

        <TabsContent value="api">
          <ApiKeysSettings />
        </TabsContent>

        <TabsContent value="team">
          <TeamSettings members={settings.teamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
