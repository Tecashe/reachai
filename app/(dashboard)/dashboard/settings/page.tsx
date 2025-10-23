// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ProfileSettings } from "@/components/settings/profile-settings"
// import { EmailSettings } from "@/components/settings/email-settings"
// import { ApiKeysSettings } from "@/components/settings/api-keys-settings"
// import { TeamSettings } from "@/components/settings/team-settings"
// import { NotificationSettings } from "@/components/settings/notification-settings"

// export default function SettingsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//         <p className="text-muted-foreground">Manage your account settings and preferences</p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="email">Email</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//           <TabsTrigger value="api">API Keys</TabsTrigger>
//           <TabsTrigger value="team">Team</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <ProfileSettings />
//         </TabsContent>

//         <TabsContent value="email">
//           <EmailSettings />
//         </TabsContent>

//         <TabsContent value="notifications">
//           <NotificationSettings />
//         </TabsContent>

//         <TabsContent value="api">
//           <ApiKeysSettings />
//         </TabsContent>

//         <TabsContent value="team">
//           <TeamSettings />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ProfileSettings } from "@/components/settings/profile-settings"
// import { EmailSettings } from "@/components/settings/email-settings"
// import { ApiKeysSettings } from "@/components/settings/api-keys-settings"
// import { TeamSettings } from "@/components/settings/team-settings"
// import { NotificationSettings } from "@/components/settings/notification-settings"
// import { getUserSettings } from "@/lib/actions/settings"

// export default async function SettingsPage() {
//   const settings = await getUserSettings()

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//         <p className="text-muted-foreground">Manage your account settings and preferences</p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="email">Email</TabsTrigger>
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



// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ProfileSettings } from "@/components/settings/profile-settings"
// import { EmailSettings } from "@/components/settings/email-settings"
// import { ApiKeysSettings } from "@/components/settings/api-keys-settings"
// import { TeamSettings } from "@/components/settings/team-settings"
// import { NotificationSettings } from "@/components/settings/notification-settings"
// import { SendingAccountsSettings } from "@/components/settings/sending-accounts-settings"
// import { getUserSettings } from "@/lib/actions/settings"

// export default async function SettingsPage() {
//   const settings = await getUserSettings()

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//         <p className="text-muted-foreground">Manage your account settings and preferences</p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="email">Email</TabsTrigger>
//           <TabsTrigger value="sending">Sending Accounts</TabsTrigger>
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

//         <TabsContent value="sending">
//           <SendingAccountsSettings />
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
import { getUserSettings } from "@/lib/actions/settings"

export default async function SettingsPage() {
  const settings = await getUserSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sending">Sending Accounts</TabsTrigger>
          <TabsTrigger value="deliverability">Deliverability</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={settings.user} />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings settings={settings.emailSettings} />
        </TabsContent>

        <TabsContent value="sending">
          <SendingAccountsSettings />
        </TabsContent>

        <TabsContent value="deliverability">
          <DeliverabilityDashboard />
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
