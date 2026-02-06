import { EmailAccountsTab } from "@/components/settings/email-accounts-tab"

export default function EmailAccountsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Email Accounts</h1>
                <p className="text-muted-foreground">Manage your connected email accounts</p>
            </div>
            <EmailAccountsTab />
        </div>
    )
}
