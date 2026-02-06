import { ProfileSettings } from "@/components/settings/profile-settings"
import { getUserSettings } from "@/lib/actions/settings"

export default async function ProfileSettingsPage() {
    const settings = await getUserSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your personal profile and preferences</p>
            </div>
            <ProfileSettings user={settings.user} />
        </div>
    )
}
