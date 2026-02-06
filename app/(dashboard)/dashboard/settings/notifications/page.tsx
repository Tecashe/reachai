import { NotificationSettings } from "@/components/settings/notification-settings"
import { getUserSettings } from "@/lib/actions/settings"

export default async function NotificationsSettingsPage() {
    const settings = await getUserSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">Manage your notification preferences</p>
            </div>
            <NotificationSettings settings={settings.notificationSettings} />
        </div>
    )
}
