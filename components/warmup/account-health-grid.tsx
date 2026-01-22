"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, AlertTriangle, ShieldAlert, Mail } from "lucide-react"

interface Account {
    id: string
    email: string
    provider: string
    stage: string
    healthScore: number
    sentToday: number
    dailyLimit: number
    inboxRate: number
    activeThreads: number
}

interface AccountHealthGridProps {
    accounts: Account[]
}

export function AccountHealthGrid({ accounts }: AccountHealthGridProps) {
    const getHealthColor = (score: number) => {
        if (score >= 90) return "border-green-500/50 bg-green-500/5"
        if (score >= 70) return "border-yellow-500/50 bg-yellow-500/5"
        return "border-red-500/50 bg-red-500/5"
    }

    const getHealthIcon = (score: number) => {
        if (score >= 90) return <ShieldCheck className="w-5 h-5 text-green-500" />
        if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-500" />
        return <ShieldAlert className="w-5 h-5 text-red-500" />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {accounts.map((account) => (
                <Card key={account.id} className={`transition-all hover:shadow-md border-l-4 ${getHealthColor(account.healthScore)}`}>
                    <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                        <div className="overflow-hidden">
                            <CardTitle className="text-sm font-medium truncate" title={account.email}>
                                {account.email}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground capitalize">{account.provider}</p>
                        </div>
                        {getHealthIcon(account.healthScore)}
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                        {/* Health Score */}
                        <div className="flex justify-between items-end">
                            <div className="text-2xl font-bold">{account.healthScore}</div>
                            <div className="text-xs text-muted-foreground mb-1">Health Score</div>
                        </div>

                        {/* Sending Progress */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Daily Limit</span>
                                <span className="text-muted-foreground">{account.sentToday} / {account.dailyLimit}</span>
                            </div>
                            <Progress value={(account.sentToday / account.dailyLimit) * 100} className="h-1.5" />
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase">Inbox Rate</p>
                                <p className={`font-semibold ${account.inboxRate > 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {account.inboxRate}%
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase">Active Threads</p>
                                <p className="font-semibold flex items-center justify-end gap-1">
                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                    {account.activeThreads}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5">{account.stage}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
