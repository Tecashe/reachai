import { ComplianceDashboard } from "@/components/settings/compliance-dashboard"

export default function ComplianceSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
                <p className="text-muted-foreground">Ensure your campaigns comply with email regulations</p>
            </div>
            <ComplianceDashboard />
        </div>
    )
}
