import { EmailSettings } from "@/components/settings/email-settings"
import { getUserSettings } from "@/lib/actions/settings"

export default async function EmailSettingsPage() {
    const settings = await getUserSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
                <p className="text-muted-foreground">Configure your email preferences and templates</p>
            </div>
            <EmailSettings settings={settings.emailSettings} />
        </div>
    )
}
