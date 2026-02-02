'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Save,
    Play,
    Pause,
    Trash2,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Zap,
    Mail,
    Users,
    Webhook,
    Activity,
    Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface Automation {
    id: string
    name: string
    description: string | null
    status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
    triggerType: string
    triggerConfig: Record<string, unknown>
    conditions: unknown[]
    actions: unknown[]
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    runsThisHour: number
    runsToday: number
    runsPerHour: number
    runsPerDay: number
    lastTriggeredAt: string | null
    createdAt: string
    updatedAt: string
    executions: Execution[]
}

interface Execution {
    id: string
    status: string
    triggerEntityType: string
    triggerEntityId: string
    actionsExecuted: number
    actionsFailed: number
    startedAt: string | null
    completedAt: string | null
    errorMessage: string | null
    createdAt: string
}

interface Log {
    id: string
    level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR'
    message: string
    details: unknown
    executionId: string | null
    actionIndex: number | null
    createdAt: string
}

const TRIGGER_ICONS: Record<string, React.ElementType> = {
    EMAIL_SENT: Mail,
    EMAIL_OPENED: Mail,
    EMAIL_CLICKED: Mail,
    EMAIL_REPLIED: Mail,
    SEQUENCE_ENROLLED: Users,
    SEQUENCE_COMPLETED: CheckCircle,
    WEBHOOK_RECEIVED: Webhook,
    DEFAULT: Zap
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-muted text-muted-foreground border-border',
    ACTIVE: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    PAUSED: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    ARCHIVED: 'bg-destructive/10 text-destructive border-destructive/20'
}

const EXECUTION_STATUS_COLORS: Record<string, string> = {
    PENDING: 'text-muted-foreground',
    RUNNING: 'text-blue-600 dark:text-blue-400',
    WAITING: 'text-amber-600 dark:text-amber-400',
    COMPLETED: 'text-green-600 dark:text-green-400',
    FAILED: 'text-destructive',
    CANCELLED: 'text-muted-foreground'
}

const LOG_LEVEL_COLORS: Record<string, string> = {
    DEBUG: 'text-muted-foreground bg-muted',
    INFO: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
    WARNING: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    ERROR: 'text-destructive bg-destructive/10'
}

export default function AutomationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [automation, setAutomation] = useState<Automation | null>(null)
    const [logs, setLogs] = useState<Log[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        fetchAutomation()
        fetchLogs()
    }, [resolvedParams.id])

    async function fetchAutomation() {
        try {
            const response = await fetch(`/api/automations/${resolvedParams.id}`)
            if (!response.ok) throw new Error('Failed to fetch')
            const data = await response.json()
            setAutomation(data.automation)
        } catch (error) {
            toast.error('Failed to load automation')
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchLogs() {
        try {
            const response = await fetch(`/api/automations/${resolvedParams.id}/logs?limit=50`)
            if (!response.ok) throw new Error('Failed to fetch logs')
            const data = await response.json()
            setLogs(data.logs)
        } catch (error) {
            console.error('Failed to load logs')
        }
    }

    async function handleActivate() {
        try {
            const response = await fetch(`/api/automations/${resolvedParams.id}/activate`, {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to activate')
            toast.success('Automation activated')
            fetchAutomation()
        } catch (error) {
            toast.error('Failed to activate automation')
        }
    }

    async function handlePause() {
        try {
            const response = await fetch(`/api/automations/${resolvedParams.id}/pause`, {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to pause')
            toast.success('Automation paused')
            fetchAutomation()
        } catch (error) {
            toast.error('Failed to pause automation')
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this automation? This cannot be undone.')) return
        try {
            const response = await fetch(`/api/automations/${resolvedParams.id}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete')
            toast.success('Automation deleted')
            router.push('/dashboard/automations')
        } catch (error) {
            toast.error('Failed to delete automation')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="h-12 bg-muted rounded animate-pulse mb-8" />
                    <div className="h-96 bg-muted rounded animate-pulse" />
                </div>
            </div>
        )
    }

    if (!automation) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <Card className="bg-card border-border">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">Automation not found</h2>
                        <Button onClick={() => router.push('/dashboard/automations')} className="mt-4">
                            Back to Automations
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const TriggerIcon = TRIGGER_ICONS[automation.triggerType] || TRIGGER_ICONS.DEFAULT
    const successRate = automation.totalRuns > 0
        ? (automation.successfulRuns / automation.totalRuns * 100).toFixed(1)
        : '0.0'

    return (
        <div className="min-h-screen bg-background">
            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/dashboard/automations')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${automation.status === 'ACTIVE'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                                }`}>
                                <TriggerIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{automation.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className={STATUS_COLORS[automation.status]}>
                                        {automation.status}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {automation.triggerType.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {automation.status === 'ACTIVE' ? (
                            <Button
                                variant="outline"
                                onClick={handlePause}
                                className="border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                            >
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </Button>
                        ) : (
                            <Button
                                onClick={handleActivate}
                                className="bg-green-600 hover:bg-green-500 text-white"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Total Runs</div>
                            <div className="text-2xl font-bold text-foreground">{automation.totalRuns}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Successful</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{automation.successfulRuns}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Failed</div>
                            <div className="text-2xl font-bold text-destructive">{automation.failedRuns}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                            <div className="text-2xl font-bold text-foreground">{successRate}%</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Today</div>
                            <div className="text-2xl font-bold text-foreground">{automation.runsToday}/{automation.runsPerDay}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-muted border border-border">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="executions">Executions</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* Description */}
                        {automation.description && (
                            <Card className="bg-card border-border">
                                <CardContent className="p-4">
                                    <p className="text-foreground">{automation.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Trigger & Actions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-primary" />
                                        Trigger
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/30">
                                        <div className="font-medium text-foreground">
                                            {automation.triggerType.replace(/_/g, ' ')}
                                        </div>
                                        {Object.keys(automation.triggerConfig || {}).length > 0 && (
                                            <pre className="mt-2 text-sm text-muted-foreground overflow-auto">
                                                {JSON.stringify(automation.triggerConfig, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" />
                                        Actions ({(automation.actions as unknown[]).length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {(automation.actions as any[]).map((action, i) => (
                                            <div
                                                key={action.id || i}
                                                className="p-3 rounded-lg bg-primary/5 border border-primary/30 flex items-center gap-3"
                                            >
                                                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                                                    {i + 1}
                                                </Badge>
                                                <div>
                                                    <div className="font-medium text-foreground text-sm">{action.name || action.type}</div>
                                                    {action.delayMinutes > 0 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            <Clock className="inline h-3 w-3 mr-1" />
                                                            Wait {action.delayMinutes}m
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Settings */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">Rate Limit (hourly)</div>
                                        <div className="text-foreground font-medium">{automation.runsPerHour}/hour</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Rate Limit (daily)</div>
                                        <div className="text-foreground font-medium">{automation.runsPerDay}/day</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Last Triggered</div>
                                        <div className="text-foreground font-medium">
                                            {automation.lastTriggeredAt
                                                ? new Date(automation.lastTriggeredAt).toLocaleString()
                                                : 'Never'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Created</div>
                                        <div className="text-foreground font-medium">
                                            {new Date(automation.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="executions" className="mt-6">
                        <Card className="bg-card border-border">
                            <CardContent className="p-0">
                                {automation.executions.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">No executions yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {automation.executions.map((execution) => (
                                            <div key={execution.id} className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`font-medium ${EXECUTION_STATUS_COLORS[execution.status]}`}>
                                                        {execution.status}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {execution.triggerEntityType}: {execution.triggerEntityId.slice(0, 8)}...
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                        <span className="text-foreground">{execution.actionsExecuted}</span>
                                                        {execution.actionsFailed > 0 && (
                                                            <>
                                                                <XCircle className="h-4 w-4 text-destructive ml-2" />
                                                                <span className="text-foreground">{execution.actionsFailed}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {new Date(execution.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logs" className="mt-6">
                        <Card className="bg-card border-border">
                            <CardContent className="p-0">
                                {logs.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">No logs yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border max-h-96 overflow-auto">
                                        {logs.map((log) => (
                                            <div key={log.id} className="p-3 flex items-start gap-3">
                                                <Badge className={`${LOG_LEVEL_COLORS[log.level]} text-xs`}>
                                                    {log.level}
                                                </Badge>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-foreground">{log.message}</p>
                                                    {log.details ? (
                                                        <pre className="mt-1 text-xs text-muted-foreground overflow-auto">
                                                            {JSON.stringify(log.details, null, 2)}
                                                        </pre>
                                                    ) : null}
                                                </div>
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(log.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
