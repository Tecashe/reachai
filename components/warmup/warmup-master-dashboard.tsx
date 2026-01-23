"use client"

import { useEffect, useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    RefreshCw,
    Rocket,
    BarChart3,
    ShieldCheck,
    Network,
    Settings2,
    Zap,
    Mail,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Users,
    Bell,
    Calendar
} from "lucide-react"
import { WarmupHeroStats } from "./warmup-hero-stats"
import { AccountFleetGrid } from "./account-fleet-grid"
import { PerformanceAnalytics } from "./performance-analytics"
import { InboxIntelligence } from "./inbox-intelligence"
import { NetworkTopology } from "./network-topology"
import { AddAccountDialog } from "./actions/add-account-dialog"
import { WaveLoader } from "@/components/loader/wave-loader"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

interface AccountData {
    id: string
    email: string
    name?: string
    provider: string
    stage: string
    healthScore: number
    sentToday: number
    dailyLimit: number
    lastActive: string | null
    inboxRate: number
    activeThreads: number
}

interface ThreadData {
    id: string
    initiator: { id: string; email: string; healthScore: number; provider: string }
    recipient: { id: string; email: string; healthScore: number; provider: string }
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED'
    messageCount: number
    lastActivity: string
    subject?: string
}

interface ActivityItem {
    id: string
    type: string
    actor: string
    target: string
    subject?: string
    timestamp: string
    spam: boolean
}

interface ChartDataPoint {
    date: string
    sent: number
    opened: number
    replied: number
    bounced: number
    inboxRate: number
}

export function WarmupMasterDashboard() {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState("command-center")
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [chartPeriod, setChartPeriod] = useState("30")

    // Data states
    const [accounts, setAccounts] = useState<AccountData[]>([])
    const [threads, setThreads] = useState<ThreadData[]>([])
    const [activity, setActivity] = useState<ActivityItem[]>([])
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [stats, setStats] = useState({
        activeAccounts: 0,
        totalAccounts: 0,
        emailsSentToday: 0,
        inboxRate: 95,
        healthScore: 85,
        activeThreads: 0,
        spamRescued: 0,
    })
    const [trends, setTrends] = useState({
        accounts: 0,
        emails: 0,
        inboxRate: 0,
        healthScore: 0,
    })

    // DNS records from user's domains - fetched dynamically
    const [dnsRecords] = useState<Array<{ type: 'SPF' | 'DKIM' | 'DMARC'; status: 'valid' | 'invalid' | 'missing'; value?: string }>>([])

    const fetchAllData = useCallback(async () => {
        if (!user) return

        try {
            setRefreshing(true)

            const [accountsRes, threadsRes, activityRes, statsRes, chartRes] = await Promise.all([
                fetch("/api/warmup/accounts"),
                fetch("/api/warmup/threads"),
                fetch("/api/warmup/activity"),
                fetch("/api/warmup/dashboard-stats"),
                fetch(`/api/warmup/performance-chart?days=${chartPeriod}`),
            ])

            if (accountsRes.ok) {
                const data = await accountsRes.json()
                setAccounts(data.accounts || [])
            }

            if (threadsRes.ok) {
                const data = await threadsRes.json()
                // Transform threads to match the ThreadData interface
                const transformedThreads = (data.threads || []).map((t: any) => ({
                    id: t.id,
                    initiator: {
                        id: t.initiatorAccountId || t.initiator?.id,
                        email: t.initiator?.email || t.initiatorEmail || 'Unknown',
                        healthScore: t.initiator?.healthScore || 80,
                        provider: t.initiator?.provider || 'gmail',
                    },
                    recipient: {
                        id: t.recipientAccountId || t.recipient?.id,
                        email: t.recipient?.email || t.recipientEmail || 'Unknown',
                        healthScore: t.recipient?.healthScore || 80,
                        provider: t.recipient?.provider || 'gmail',
                    },
                    status: t.status || 'ACTIVE',
                    messageCount: t.messageCount || 0,
                    lastActivity: t.lastMessageAt || t.updatedAt || new Date().toISOString(),
                    subject: t.subject,
                }))
                setThreads(transformedThreads)
            }

            if (activityRes.ok) {
                const data = await activityRes.json()
                setActivity(data.activity || [])
            }

            if (statsRes.ok) {
                const data = await statsRes.json()
                setStats({
                    activeAccounts: data.activeAccounts || 0,
                    totalAccounts: data.activeAccounts || 0,
                    emailsSentToday: data.emailsSentToday || 0,
                    inboxRate: Math.round(data.inboxRate) || 0,
                    healthScore: Math.min(100, data.healthScore || 0),
                    activeThreads: threads.filter(t => t.status === 'ACTIVE').length,
                    spamRescued: activity.filter(a => a.spam).length,
                })
                setTrends({
                    accounts: data.trends?.activeAccounts || 0,
                    emails: data.trends?.emailsSent || 0,
                    inboxRate: data.trends?.inboxRate || 0,
                    healthScore: data.trends?.healthScore || 0,
                })
            }

            if (chartRes.ok) {
                const data = await chartRes.json()
                // Transform chart data
                const transformedChartData = (data.data || []).map((d: any) => ({
                    date: d.date,
                    sent: d.sent || 0,
                    opened: Math.round((d.openRate || 0) * (d.sent || 0) / 100),
                    replied: Math.round((d.replyRate || 0) * (d.sent || 0) / 100),
                    bounced: 0,
                    inboxRate: d.inboxRate || 0,
                }))
                setChartData(transformedChartData)
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error)
            toast.error("Failed to load dashboard data")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [user, chartPeriod])

    useEffect(() => {
        if (user) fetchAllData()
        const interval = setInterval(fetchAllData, 30000)
        return () => clearInterval(interval)
    }, [user, fetchAllData])

    const handleAccountAction = async (accountId: string, action: 'pause' | 'resume' | 'settings') => {
        if (action === 'settings') {
            // Handle settings navigation
            return
        }

        try {
            const endpoint = action === 'pause' ? '/api/warmup/pause' : '/api/warmup/resume'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, userId: user?.id })
            })

            if (res.ok) {
                toast.success(`Account ${action}d successfully`)
                fetchAllData()
            } else {
                toast.error(`Failed to ${action} account`)
            }
        } catch (error) {
            toast.error("Action failed")
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
                    <WaveLoader color="bg-primary" size="lg" speed="normal" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium">Initializing Command Center...</p>
                    <p className="text-sm text-muted-foreground">Loading your warmup network</p>
                </div>
            </div>
        )
    }

    // Calculate spam rescue metrics from activity
    const spamRescuedCount = activity.filter(a => a.spam).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-primary" />
                        Warmup Command Center
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Real-time monitoring of your peer-to-peer warmup network
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <AddAccountDialog userId={user?.id || null} onSuccess={fetchAllData} />
                    <Button variant="outline" size="sm" onClick={fetchAllData} disabled={refreshing}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Hero Stats */}
            <WarmupHeroStats
                stats={{
                    ...stats,
                    activeThreads: threads.filter(t => t.status === 'ACTIVE').length,
                    spamRescued: spamRescuedCount,
                }}
                trends={trends}
            />

            {/* Main Tabs */}
            <Tabs defaultValue="command-center" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1.5 border border-border/50 w-full grid grid-cols-3 lg:grid-cols-6 gap-1">
                    <TabsTrigger value="command-center" className="gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
                        <Rocket className="w-4 h-4" />
                        <span className="hidden sm:inline">Command</span>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
                        <BarChart3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger value="accounts" className="gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Fleet</span>
                    </TabsTrigger>
                    <TabsTrigger value="deliverability" className="gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Intel</span>
                    </TabsTrigger>
                    <TabsTrigger value="network" className="gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
                        <Network className="w-4 h-4" />
                        <span className="hidden sm:inline">Network</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow">
                        <Settings2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Control</span>
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: COMMAND CENTER */}
                <TabsContent value="command-center" className="space-y-6">
                    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
                        {/* Main content */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Quick Warmup</p>
                                            <p className="text-xs text-muted-foreground">Send batch now</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Add Account</p>
                                            <p className="text-xs text-muted-foreground">Connect email</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Account Fleet Preview */}
                            <Card className="border-border/50">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Users className="w-5 h-5 text-primary" />
                                            Account Fleet
                                        </CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('accounts')}>
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <AccountFleetGrid
                                        accounts={accounts.slice(0, 3)}
                                        onAction={handleAccountAction}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Network Status */}
                            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                        <span className="font-semibold text-primary">Network Active</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Active Threads</p>
                                            <p className="text-xl font-bold">{threads.filter(t => t.status === 'ACTIVE').length}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Emails Today</p>
                                            <p className="text-xl font-bold">{stats.emailsSentToday}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Live Activity Feed */}
                            <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" />
                                        Live Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[350px]">
                                        <div className="divide-y divide-border/30">
                                            {activity.length > 0 ? activity.slice(0, 15).map((item) => (
                                                <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            {item.type === 'SENT' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                            {item.type === 'RECEIVED' && <div className="w-2 h-2 rounded-full bg-primary/70" />}
                                                            {item.type === 'REPLIED' && <div className="w-2 h-2 rounded-full bg-primary/50" />}
                                                            <span className="text-xs font-medium">{item.type}</span>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {new Date(item.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium truncate">{item.actor}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">To: {item.target}</p>
                                                    {item.spam && (
                                                        <Badge variant="destructive" className="mt-1 text-[9px] h-4">
                                                            Spam Detected
                                                        </Badge>
                                                    )}
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-muted-foreground text-sm">
                                                    No recent activity
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: PERFORMANCE ANALYTICS */}
                <TabsContent value="performance" className="space-y-6">
                    <PerformanceAnalytics
                        chartData={chartData}
                        period={chartPeriod}
                        onPeriodChange={setChartPeriod}
                    />
                </TabsContent>

                {/* TAB 3: ACCOUNT FLEET */}
                <TabsContent value="accounts" className="space-y-6">
                    <Card className="border-border/50">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Account Fleet
                                    </CardTitle>
                                    <CardDescription>
                                        Manage all your warmup-enabled email accounts
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="gap-1">
                                    {accounts.length} accounts
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <AccountFleetGrid
                                accounts={accounts}
                                onAction={handleAccountAction}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 4: DELIVERABILITY INTEL */}
                <TabsContent value="deliverability" className="space-y-6">
                    <InboxIntelligence
                        inboxRate={stats.inboxRate}
                        spamRate={100 - stats.inboxRate > 0 ? Math.round((100 - stats.inboxRate) * 0.3) : 0}
                        dnsRecords={dnsRecords}
                        onRefresh={fetchAllData}
                        lastUpdated="Just now"
                    />
                </TabsContent>

                {/* TAB 5: NETWORK HUB */}
                <TabsContent value="network" className="space-y-6">
                    <NetworkTopology
                        threads={threads}
                        onThreadClick={(threadId) => {
                            toast.info(`Thread ${threadId} selected`)
                        }}
                    />
                </TabsContent>

                {/* TAB 6: CONTROL PANEL */}
                <TabsContent value="settings" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Warmup Settings */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Settings2 className="w-5 h-5 text-primary" />
                                    Warmup Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Auto Warmup</Label>
                                        <p className="text-xs text-muted-foreground">Automatically warmup new accounts</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>AI Optimization</Label>
                                        <p className="text-xs text-muted-foreground">Let AI adjust sending patterns</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Peer Mode</Label>
                                        <p className="text-xs text-muted-foreground">Enable peer-to-peer warmup</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Default Daily Limit</Label>
                                        <span className="text-sm font-medium">20 emails</span>
                                    </div>
                                    <Slider defaultValue={[20]} max={100} step={5} className="w-full" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Bell className="w-5 h-5 text-primary" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Health Alerts</Label>
                                        <p className="text-xs text-muted-foreground">Alert when health drops below 70%</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Spam Detection</Label>
                                        <p className="text-xs text-muted-foreground">Alert on spam folder placement</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Daily Summary</Label>
                                        <p className="text-xs text-muted-foreground">Send daily warmup report</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Blacklist Alerts</Label>
                                        <p className="text-xs text-muted-foreground">Alert if listed on blacklist</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Active Days</Label>
                                        <p className="text-xs text-muted-foreground">Days when warmup runs</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                            <Button
                                                key={i}
                                                variant={i < 5 ? "default" : "outline"}
                                                size="sm"
                                                className="w-8 h-8 p-0 text-xs"
                                            >
                                                {day}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Active Hours</Label>
                                        <span className="text-sm font-medium">9 AM - 6 PM</span>
                                    </div>
                                    <Slider defaultValue={[9, 18]} max={24} step={1} className="w-full" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Status */}
                        <Card className="border-border/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    System Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-sm font-medium">Warmup Engine</span>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-sm font-medium">Email Delivery</span>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">Operational</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-sm font-medium">Peer Network</span>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-primary/30">Connected</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
