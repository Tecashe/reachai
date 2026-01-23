"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, Globe } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ReputationRadarProps {
    stats: {
        riskBuckets: { low: number, medium: number, high: number, critical: number }
        dnsStats: { spf_ok: number, dkim_ok: number, dmarc_ok: number, total: number }
        avgStats: { reputation: number, bounceRate: number, spamRate: number }
        totalAccounts: number
    } | null
}

export function ReputationRadar({ stats }: ReputationRadarProps) {
    if (!stats) return <div>No data</div>

    const { riskBuckets, dnsStats, avgStats, totalAccounts } = stats

    // Avoid div by zero
    const safeTotal = totalAccounts || 1
    const spfPercent = Math.round((dnsStats.spf_ok / safeTotal) * 100)
    const dkimPercent = Math.round((dnsStats.dkim_ok / safeTotal) * 100)
    const dmarcPercent = Math.round((dnsStats.dmarc_ok / safeTotal) * 100)

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* DNS Health Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" /> DNS Authentication
                    </CardTitle>
                    <CardDescription>Protocol compliance across all accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>SPF Records</span>
                            <span className={spfPercent < 100 ? "text-muted-foreground font-bold" : "text-foreground"}>{spfPercent}%</span>
                        </div>
                        <Progress value={spfPercent} className="h-2" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>DKIM Records</span>
                            <span className={dkimPercent < 100 ? "text-muted-foreground font-bold" : "text-foreground"}>{dkimPercent}%</span>
                        </div>
                        <Progress value={dkimPercent} className="h-2 bg-muted" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>DMARC Records</span>
                            <span className={dmarcPercent < 80 ? "text-destructive font-bold" : "text-foreground"}>{dmarcPercent}%</span>
                        </div>
                        <Progress value={dmarcPercent} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Risk Distribution Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-primary" /> Portfolio Risk Profile
                    </CardTitle>
                    <CardDescription>Accounts by calculated risk tier</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-2 rounded bg-primary/10 border border-primary/20">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-sm font-medium">Low Risk</span>
                            </div>
                            <span className="font-bold">{riskBuckets.low}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted border border-border">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                                <span className="text-sm font-medium">Medium Risk</span>
                            </div>
                            <span className="font-bold">{riskBuckets.medium}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-muted/50 border border-border/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-foreground/50" />
                                <span className="text-sm font-medium">High Risk</span>
                            </div>
                            <span className="font-bold">{riskBuckets.high}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-destructive/10 border border-destructive/20">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                <span className="text-sm font-medium">Critical</span>
                            </div>
                            <Badge variant="destructive">{riskBuckets.critical}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Global Averages */}
            <Card className="md:col-span-2 bg-muted/20">
                <CardContent className="py-4 flex justify-around items-center text-center">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Avg Reputation</p>
                        <p className="text-2xl font-bold text-primary">{avgStats.reputation}/100</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Avg Bounce Rate</p>
                        <p className={`text-2xl font-bold ${avgStats.bounceRate > 5 ? 'text-destructive' : 'text-foreground'}`}>
                            {avgStats.bounceRate.toFixed(1)}%
                        </p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Avg Spam Rate</p>
                        <p className={`text-2xl font-bold ${avgStats.spamRate > 0.1 ? 'text-destructive' : 'text-foreground'}`}>
                            {avgStats.spamRate.toFixed(2)}%
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
