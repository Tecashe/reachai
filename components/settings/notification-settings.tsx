// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"

// export function NotificationSettings() {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Email Notifications</CardTitle>
//           <CardDescription>Choose what email notifications you want to receive</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Campaign Updates</Label>
//               <p className="text-sm text-muted-foreground">Get notified about campaign performance</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>New Replies</Label>
//               <p className="text-sm text-muted-foreground">Get notified when prospects reply to your emails</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Weekly Reports</Label>
//               <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Product Updates</Label>
//               <p className="text-sm text-muted-foreground">Stay informed about new features and improvements</p>
//             </div>
//             <Switch />
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>In-App Notifications</CardTitle>
//           <CardDescription>Manage your in-app notification preferences</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Desktop Notifications</Label>
//               <p className="text-sm text-muted-foreground">Show desktop notifications for important events</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Sound Alerts</Label>
//               <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
//             </div>
//             <Switch />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { useState } from "react"
// import { toast } from "sonner"

// interface NotificationSettingsProps {
//   preferences: {
//     campaignUpdates: boolean
//     newReplies: boolean
//     weeklyReports: boolean
//     productUpdates: boolean
//     desktopNotifications: boolean
//     soundAlerts: boolean
//   }
//   onSave?: (preferences: any) => Promise<void>
// }

// export function NotificationSettings({ preferences: initialPreferences, onSave }: NotificationSettingsProps) {
//   const [preferences, setPreferences] = useState(initialPreferences)
//   const [isSaving, setIsSaving] = useState(false)

//   const handleToggle = async (key: keyof typeof preferences) => {
//     const newPreferences = { ...preferences, [key]: !preferences[key] }
//     setPreferences(newPreferences)

//     if (onSave) {
//       setIsSaving(true)
//       try {
//         await onSave(newPreferences)
//         toast.success("Notification preferences updated")
//       } catch (error) {
//         toast.error("Failed to update preferences")
//         setPreferences(preferences)
//       } finally {
//         setIsSaving(false)
//       }
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Email Notifications</CardTitle>
//           <CardDescription>Choose what email notifications you want to receive</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Campaign Updates</Label>
//               <p className="text-sm text-muted-foreground">Get notified about campaign performance</p>
//             </div>
//             <Switch
//               checked={preferences.campaignUpdates}
//               onCheckedChange={() => handleToggle("campaignUpdates")}
//               disabled={isSaving}
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>New Replies</Label>
//               <p className="text-sm text-muted-foreground">Get notified when prospects reply to your emails</p>
//             </div>
//             <Switch
//               checked={preferences.newReplies}
//               onCheckedChange={() => handleToggle("newReplies")}
//               disabled={isSaving}
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Weekly Reports</Label>
//               <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
//             </div>
//             <Switch
//               checked={preferences.weeklyReports}
//               onCheckedChange={() => handleToggle("weeklyReports")}
//               disabled={isSaving}
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Product Updates</Label>
//               <p className="text-sm text-muted-foreground">Stay informed about new features and improvements</p>
//             </div>
//             <Switch
//               checked={preferences.productUpdates}
//               onCheckedChange={() => handleToggle("productUpdates")}
//               disabled={isSaving}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>In-App Notifications</CardTitle>
//           <CardDescription>Manage your in-app notification preferences</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Desktop Notifications</Label>
//               <p className="text-sm text-muted-foreground">Show desktop notifications for important events</p>
//             </div>
//             <Switch
//               checked={preferences.desktopNotifications}
//               onCheckedChange={() => handleToggle("desktopNotifications")}
//               disabled={isSaving}
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Sound Alerts</Label>
//               <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
//             </div>
//             <Switch
//               checked={preferences.soundAlerts}
//               onCheckedChange={() => handleToggle("soundAlerts")}
//               disabled={isSaving}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { toast } from "sonner"

interface NotificationSettingsProps {
  settings: {
    campaignUpdates: boolean
    newReplies: boolean
    weeklyReports: boolean
    productUpdates: boolean
    desktopNotifications: boolean
    soundAlerts: boolean
  }
  onSave?: (preferences: any) => Promise<void>
}

export function NotificationSettings({ settings: initialPreferences, onSave }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = async (key: keyof typeof preferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] }
    setPreferences(newPreferences)

    if (onSave) {
      setIsSaving(true)
      try {
        await onSave(newPreferences)
        toast.success("Notification preferences updated")
      } catch (error) {
        toast.error("Failed to update preferences")
        setPreferences(preferences)
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what email notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Campaign Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about campaign performance</p>
            </div>
            <Switch
              checked={preferences.campaignUpdates}
              onCheckedChange={() => handleToggle("campaignUpdates")}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Replies</Label>
              <p className="text-sm text-muted-foreground">Get notified when prospects reply to your emails</p>
            </div>
            <Switch
              checked={preferences.newReplies}
              onCheckedChange={() => handleToggle("newReplies")}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
            </div>
            <Switch
              checked={preferences.weeklyReports}
              onCheckedChange={() => handleToggle("weeklyReports")}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates</Label>
              <p className="text-sm text-muted-foreground">Stay informed about new features and improvements</p>
            </div>
            <Switch
              checked={preferences.productUpdates}
              onCheckedChange={() => handleToggle("productUpdates")}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>Manage your in-app notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">Show desktop notifications for important events</p>
            </div>
            <Switch
              checked={preferences.desktopNotifications}
              onCheckedChange={() => handleToggle("desktopNotifications")}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
            </div>
            <Switch
              checked={preferences.soundAlerts}
              onCheckedChange={() => handleToggle("soundAlerts")}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
