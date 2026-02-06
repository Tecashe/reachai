import { ResearchSettings } from "@/components/settings/research-settings"

export default function ResearchSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Research Settings</h1>
                <p className="text-muted-foreground">Configure your research and data enrichment preferences</p>
            </div>
            <ResearchSettings />
        </div>
    )
}
