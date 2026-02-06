import { SendingAccountsSettings } from "@/components/settings/sending-accounts-settings"

export default function SendingAccountsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sending Accounts</h1>
                <p className="text-muted-foreground">Manage your email sending accounts and configuration</p>
            </div>
            <SendingAccountsSettings />
        </div>
    )
}
