"use client"

import { MailfraChatProvider } from "./mailfra-chat-provider"
import { MailfraChatWidget } from "./mailfra-chat-widget"

export function MailfraDashboardWrapper({ isPaidUser }: { isPaidUser: boolean }) {
    return (
        <MailfraChatProvider isPaidUser={isPaidUser}>
            <MailfraChatWidget />
        </MailfraChatProvider>
    )
}
