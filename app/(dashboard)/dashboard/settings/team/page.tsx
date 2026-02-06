import { TeamSettings } from "@/components/settings/team-settings"
import { getUserSettings } from "@/lib/actions/settings"

export default async function TeamSettingsPage() {
    const settings = await getUserSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team</h1>
                <p className="text-muted-foreground">Manage your team members and permissions</p>
            </div>
            <TeamSettings members={settings.teamMembers} />
        </div>
    )
}
