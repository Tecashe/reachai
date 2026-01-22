"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Zap, Activity, Filter } from "lucide-react"
import { AccountHealthGrid } from "./account-health-grid"
import { ThreadVisualizer } from "./thread-visualizer"
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
        activity: []
    })

    const fetchAllData = async () => {
        try {
            setRefreshing(true)
            const [accountsRes, threadsRes, activityRes] = await Promise.all([
                fetch("/api/warmup/accounts"),
                fetch("/api/warmup/threads"),
                fetch("/api/warmup/activity")
            ])

            const accounts = await accountsRes.json()
            const threads = await threadsRes.json()
            const activity = await activityRes.json()

            setData({
                accounts: accounts.accounts || [],
                threads: threads.threads || [],
                activity: activity.activity || []
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

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border border-border/50">
                    <TabsTrigger value="overview" className="gap-2">
                        <Activity className="w-4 h-4" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="threads" className="gap-2">
                        <Filter className="w-4 h-4" /> Active Threads
                        <Badge variant="secondary" className="ml-1 px-1.5 h-5 text-[10px]">{data.threads.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="live" className="gap-2">
                        <Zap className="w-4 h-4" /> Live Feed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Account Matrix */}
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

                <TabsContent value="threads" className="space-y-6">
                    <div className="grid md:grid-cols-[250px_1fr] gap-6">
                        {/* Thread filters could go here */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Filter Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50 font-medium">
                                    <span>All Threads</span>
                                    <span>{data.threads.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/30 cursor-pointer">
                                    <span>Active</span>
                                    <span>{data.threads.filter((t: any) => t.status === 'ACTIVE').length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/30 cursor-pointer">
                                    <span>Completed</span>
                                    <span>{data.threads.filter((t: any) => t.status === 'COMPLETED').length}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <ThreadVisualizer threads={data.threads} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="live" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Network Activity</CardTitle>
                            <CardDescription>Real-time stream of all warmup interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-4">
                                    {data.activity.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground">No recent activity</div>
                                    ) : (
                                        data.activity.map((item: any) => (
                                            <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                                                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                                   ${item.type === 'SENT' ? 'bg-blue-500/10 text-blue-500' :
                                                        item.type === 'RECEIVED' ? 'bg-green-500/10 text-green-500' :
                                                            item.type === 'REPLIED' ? 'bg-purple-500/10 text-purple-500' :
                                                                'bg-orange-500/10 text-orange-500'}`}>
                                                    {item.type === 'SENT' && <MailIcon className="w-4 h-4" />}
                                                    {item.type === 'RECEIVED' && <InboxIcon className="w-4 h-4" />}
                                                    {item.type === 'REPLIED' && <ReplyIcon className="w-4 h-4" />}
                                                    {item.type === 'SCHEDULED' && <ClockIcon className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-medium text-sm">
                                                            {item.actor} <span className="text-muted-foreground font-normal">➔</span> {item.target}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                            {new Date(item.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate mt-0.5">{item.subject}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                                                        {item.inbox && <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 hover:bg-green-500/20">INBOX</Badge>}
                                                        {item.spam && <Badge variant="destructive" className="text-[10px]">SPAM</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Simple icons for local usage
function MailIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> }
function InboxIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg> }
function ReplyIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg> }
function ClockIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
function ShieldCheckIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg> }
