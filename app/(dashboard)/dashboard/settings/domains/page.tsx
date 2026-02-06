import { DomainVerification } from "@/components/settings/domain-verification-settings"

export default function DomainsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Domain Verification</h1>
                <p className="text-muted-foreground">Verify and manage your sending domains</p>
            </div>
            <DomainVerification />
        </div>
    )
}
