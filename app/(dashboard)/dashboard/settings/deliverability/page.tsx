import { DeliverabilityDashboard } from "@/components/settings/deliverability-dashboard"

export default function DeliverabilitySettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Deliverability</h1>
                <p className="text-muted-foreground">Monitor and improve your email deliverability</p>
            </div>
            <DeliverabilityDashboard />
        </div>
    )
}
