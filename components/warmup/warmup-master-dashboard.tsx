"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Zap, Activity, Filter, Rocket, BarChart3, ShieldCheck, Server, AlertTriangle, CloudRain, Inbox, MailWarning, PauseCircle, PlayCircle } from "lucide-react"
import { AccountHealthGrid } from "./account-health-grid"
import { ThreadVisualizer } from "./thread-visualizer"
import { DeliverabilityHeatmap } from "./charts/deliverability-heatmap"
import { ProviderTrendChart } from "./charts/provider-trend-chart"
import { ReputationRadar } from "./charts/reputation-radar"
import { PlacementFunnel } from "./charts/placement-funnel"
import { VolumeTrendChart } from "./charts/volume-trend-chart"
import { AddAccountDialog } from "./actions/add-account-dialog"
import { WaveLoader } from "@/components/loader/wave-loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

export function WarmupMasterDashboard() {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState("overview")
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const [data, setData] = useState({
        accounts: [],
        threads: [],
        activity: [],
        heatmap: [],
        trends: [],
        reputation: null
    })

    const fetchAllData = async () => {
        try {
            setRefreshing(true)
            const [accountsRes, threadsRes, activityRes, heatmapRes, trendsRes, repRes] = await Promise.all([
                fetch("/api/warmup/accounts"),
                fetch("/api/warmup/threads"),
                fetch("/api/warmup/activity"),
                fetch("/api/warmup/analytics/heatmap"),
                fetch("/api/warmup/analytics/provider-trends"),
                fetch("/api/warmup/analytics/reputation")
            ])

            const accounts = await accountsRes.json()
            const threads = await threadsRes.json()
            const activity = await activityRes.json()
            const heatmap = await heatmapRes.json()
            const trends = await trendsRes.json()
            const reputation = await repRes.json()

            setData({
                accounts: accounts.accounts || [],
                threads: threads.threads || [],
                activity: activity.activity || [],
                heatmap: heatmap.heatmap || [],
                trends: trends.trends || [],
                reputation: reputation || null
            })
        } catch (error) {
            console.error("Failed to fetch dashboard data", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (user) fetchAllData()
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAllData, 30000)
        return () => clearInterval(interval)
    }, [user])

    const handleAction = async (accountId: string, action: 'pause' | 'resume') => {
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
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <WaveLoader color="bg-primary" size="lg" speed="normal" />
                <p className="text-muted-foreground text-sm">Initializing Mission Control...</p>
            </div>
        )
    }

    // Calculate Spam Rescue Metrics
    // We derive this from activity where landedInSpam is true
    const spamRescuedCount = data.activity.filter((a: any) => a.spam).length
    const spamRescueLog = data.activity.filter((a: any) => a.spam).slice(0, 5)

    const kpiStats = [
        { label: "Active Accounts", value: data.accounts.filter((a: any) => a.stage !== 'PAUSED').length, sub: `of ${data.accounts.length} total`, icon: <Rocket className="w-4 h-4 text-primary" /> },
        { label: "Daily Volume", value: data.accounts.reduce((acc, curr: any) => acc + curr.sentToday, 0), sub: "Emails Sent Today", icon: <Zap className="w-4 h-4 text-yellow-500" /> },
        { label: "Spam Rescued", value: spamRescuedCount, sub: "Last 50 interactions", icon: <MailWarning className="w-4 h-4 text-orange-500" /> },
        { label: "Active Threads", value: data.threads.length, sub: "Peer-to-Peer", icon: <Activity className="w-4 h-4 text-green-500" /> },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Warmup Mission Control</h2>
                    <p className="text-muted-foreground text-sm">
                        Real-time monitoring of peer-to-peer network and account health.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <AddAccountDialog userId={user?.id || null} onSuccess={fetchAllData} />
                    <Button variant="outline" size="sm" onClick={fetchAllData} disabled={refreshing}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* KPI Row - Dense */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {kpiStats.map((stat, i) => (
                    <Card key={i} className="shadow-sm">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
                                </div>
                            </div>
                            <div className="p-2 bg-muted/50 rounded-lg">
                                {stat.icon}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border border-border/50 grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="gap-2 text-xs font-medium">
                        <Rocket className="w-4 h-4" /> Control Center
                    </TabsTrigger>
                    <TabsTrigger value="deliverability" className="gap-2 text-xs font-medium">
                        <BarChart3 className="w-4 h-4" /> Deliverability Lab
                    </TabsTrigger>
                    <TabsTrigger value="reputation" className="gap-2 text-xs font-medium">
                        <ShieldCheck className="w-4 h-4" /> Reputation
                    </TabsTrigger>
                    <TabsTrigger value="ops" className="gap-2 text-xs font-medium">
                        <Server className="w-4 h-4" /> Live Ops
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: OVERVIEW / CONTROL CENTER */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-[1fr_300px] gap-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <ShieldCheckIcon className="w-5 h-5 text-primary" />
                                    Account Matrix
                                </h3>
                            </div>
                            {/* Enhanced Account Grid with Actions */}
                            <AccountHealthGrid
                                accounts={data.accounts}
                                onAction={handleAction}
                            />

                            {/* Volume Trend Chart */}
                            <VolumeTrendChart trends={data.trends} />
                        </div>

                        {/* Sidebar: Spam Rescue & Alerts */}
                        <div className="space-y-4">
                            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Spam Rescue Ops
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">
                                        {spamRescuedCount} <span className="text-xs font-normal opacity-70">emails recovered</span>
                                    </div>
                                    <p className="text-xs text-orange-600/80 mt-1">
                                        System automatically detected and moved these emails to inbox.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Rescue Log</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[250px] px-4 pb-4">
                                        {spamRescueLog.length > 0 ? (
                                            <div className="divide-y text-xs">
                                                {spamRescueLog.map((log: any) => (
                                                    <div key={log.id} className="py-2">
                                                        <div className="flex justify-between font-medium">
                                                            <span>{log.actor}</span>
                                                            <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                        </div>
                                                        <p className="text-muted-foreground truncate">{log.subject}</p>
                                                        <Badge variant="outline" className="mt-1 text-[10px] border-orange-200 text-orange-600 bg-orange-50">Rescued from Spam</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground py-4 text-center">No spam incidents recently.</p>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: DELIVERABILITY LAB */}
                <TabsContent value="deliverability" className="space-y-6">
                    <div className="grid gap-6">
                        <DeliverabilityHeatmap data={data.heatmap} />
                        <div className="grid md:grid-cols-2 gap-6">
                            <ProviderTrendChart data={data.trends} />
                            {/* Real Placement Chart */}
                            <PlacementFunnel trends={data.trends} />
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 3: REPUTATION CENTER */}
                <TabsContent value="reputation" className="space-y-6">
                    <ReputationRadar stats={data.reputation} />
                </TabsContent>

                {/* TAB 4: LIVE OPS */}
                <TabsContent value="ops" className="space-y-6">
                    <div className="grid md:grid-cols-[350px_1fr] gap-6">
                        {/* Live Feed - Denser */}
                        <Card className="md:h-[600px] flex flex-col">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Zap className="w-4 h-4 text-yellow-500" /> Live Feed
                                </CardTitle>
                                <CardDescription>Real-time event stream</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0 bg-muted/5">
                                <ScrollArea className="h-full">
                                    <div className="divide-y">
                                        {data.activity.map((item: any) => (
                                            <div key={item.id} className="p-3 text-sm hover:bg-muted/40 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-2">
                                                        {item.type === 'SENT' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                                        {item.type === 'RECEIVED' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                                                        {item.type === 'REPLIED' && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                                        <span className="font-semibold text-xs">{item.type}</span>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                        {new Date(item.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-1">
                                                    <span className="text-xs truncate font-medium">{item.actor}</span>
                                                    <span className="text-[10px] text-muted-foreground">To: {item.target}</span>
                                                </div>
                                                {item.spam && (
                                                    <Badge variant="destructive" className="mt-2 text-[10px] h-4">Spam Detected</Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Thread Visualizer */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Active Peer Conversations</h3>
                                <Badge variant="secondary">{data.threads.length} Threads</Badge>
                            </div>
                            <ThreadVisualizer threads={data.threads} />
                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}

function ShieldCheckIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg> }
