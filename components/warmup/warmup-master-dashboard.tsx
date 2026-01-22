"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Zap, Activity, Filter, Rocket, BarChart3, ShieldCheck, Server } from "lucide-react"
import { AccountHealthGrid } from "./account-health-grid"
import { ThreadVisualizer } from "./thread-visualizer"
import { DeliverabilityHeatmap } from "./charts/deliverability-heatmap"
import { ProviderTrendChart } from "./charts/provider-trend-chart"
import { ReputationRadar } from "./charts/reputation-radar"
import { WaveLoader } from "@/components/loader/wave-loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function WarmupMasterDashboard() {
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
        fetchAllData()
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAllData, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <WaveLoader color="bg-primary" size="lg" speed="normal" />
                <p className="text-muted-foreground text-sm">Initializing Mission Control...</p>
            </div>
        )
    }

    const kpiStats = [
        { label: "Active Accounts", value: data.accounts.length, icon: <Rocket className="w-4 h-4 text-primary" /> },
        { label: "Emails Today", value: data.accounts.reduce((acc, curr: any) => acc + curr.sentToday, 0), icon: <Zap className="w-4 h-4 text-yellow-500" /> },
        { label: "Active Threads", value: data.threads.length, icon: <Activity className="w-4 h-4 text-green-500" /> },
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
                    <Button variant="outline" size="sm" onClick={fetchAllData} disabled={refreshing}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh Operations
                    </Button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpiStats.map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-full">
                                {stat.icon}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border border-border/50 grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="gap-2">
                        <Rocket className="w-4 h-4" /> Control Center
                    </TabsTrigger>
                    <TabsTrigger value="deliverability" className="gap-2">
                        <BarChart3 className="w-4 h-4" /> Deliverability Lab
                    </TabsTrigger>
                    <TabsTrigger value="reputation" className="gap-2">
                        <ShieldCheck className="w-4 h-4" /> Reputation
                    </TabsTrigger>
                    <TabsTrigger value="ops" className="gap-2">
                        <Server className="w-4 h-4" /> Live Ops
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: OVERVIEW / CONTROL CENTER */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ShieldCheckIcon className="w-5 h-5 text-primary" />
                                Account Health Matrix
                            </h3>
                        </div>
                        <AccountHealthGrid accounts={data.accounts} />
                    </div>
                </TabsContent>

                {/* TAB 2: DELIVERABILITY LAB */}
                <TabsContent value="deliverability" className="space-y-6">
                    <div className="grid gap-6">
                        <DeliverabilityHeatmap data={data.heatmap} />
                        <div className="grid md:grid-cols-2 gap-6">
                            <ProviderTrendChart data={data.trends} />
                            {/* Placeholder for future detailed placement stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Placement Funnel</CardTitle>
                                    <CardDescription>Metrics coming soon...</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
                                    Stats loading...
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 3: REPUTATION CENTER */}
                <TabsContent value="reputation" className="space-y-6">
                    <ReputationRadar stats={data.reputation} />
                </TabsContent>

                {/* TAB 4: LIVE OPS */}
                <TabsContent value="ops" className="space-y-6">
                    <div className="grid md:grid-cols-[300px_1fr] gap-6">
                        {/* Live Feed */}
                        <Card className="md:h-[600px] flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-500" /> Live Feed
                                </CardTitle>
                                <CardDescription>Real-time event stream</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full px-4 pb-4">
                                    <div className="space-y-3 pt-2">
                                        {data.activity.map((item: any) => (
                                            <div key={item.id} className="text-sm p-2 rounded border border-border/40 bg-muted/20">
                                                <div className="flex justify-between items-start mb-1">
                                                    <Badge variant="outline" className="text-[10px] h-4 px-1">{item.type}</Badge>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(item.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-xs truncate mb-1">{item.actor}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">To: {item.target}</p>
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
