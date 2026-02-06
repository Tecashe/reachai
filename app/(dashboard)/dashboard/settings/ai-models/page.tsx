import { AIModelSettings } from "@/components/settings/ai-models-settings"

export default function AIModelsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
                <p className="text-muted-foreground">Configure AI model preferences and API keys</p>
            </div>
            <AIModelSettings />
        </div>
    )
}
