import { ApiKeysSettings } from "@/components/settings/api-keys-settings"

export default function ApiKeysSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                <p className="text-muted-foreground">Manage your API keys for external integrations</p>
            </div>
            <ApiKeysSettings />
        </div>
    )
}
