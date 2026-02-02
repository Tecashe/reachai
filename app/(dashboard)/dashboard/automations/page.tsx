'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Play,
    Pause,
    Trash2,
    Copy,
    Zap,
    Mail,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Webhook
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    lastTriggeredAt: string | null
    createdAt: string
    _count: {
        executions: number
        logs: number
    }
}

const TRIGGER_ICONS: Record<string, React.ElementType> = {
    EMAIL_SENT: Mail,
    EMAIL_OPENED: Mail,
    EMAIL_CLICKED: Mail,
    EMAIL_REPLIED: Mail,
    SEQUENCE_ENROLLED: Users,
    SEQUENCE_COMPLETED: CheckCircle,
    WEBHOOK_RECEIVED: Webhook,
    SCHEDULE_TRIGGERED: Clock,
    PROSPECT_CREATED: Users,
    DEFAULT: Zap
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-muted text-muted-foreground border-border',
    ACTIVE: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    PAUSED: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    ARCHIVED: 'bg-destructive/10 text-destructive border-destructive/20'
}

export default function AutomationsPage() {
    const router = useRouter()
    const [automations, setAutomations] = useState<Automation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        fetchAutomations()
    }, [statusFilter])

    async function fetchAutomations() {
        try {
            setIsLoading(true)
            const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : ''
            const response = await fetch(`/api/automations?${statusParam}`)
            if (!response.ok) throw new Error('Failed to fetch')
            const data = await response.json()
            setAutomations(data.automations)
        } catch (error) {
            toast.error('Failed to load automations')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleActivate(id: string) {
        try {
            const response = await fetch(`/api/automations/${id}/activate`, {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to activate')
            toast.success('Automation activated')
            fetchAutomations()
        } catch (error) {
            toast.error('Failed to activate automation')
        }
    }

    async function handlePause(id: string) {
        try {
            const response = await fetch(`/api/automations/${id}/pause`, {
                method: 'POST'
            })
            if (!response.ok) throw new Error('Failed to pause')
            toast.success('Automation paused')
            fetchAutomations()
        } catch (error) {
            toast.error('Failed to pause automation')
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this automation?')) return
        try {
            const response = await fetch(`/api/automations/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete')
            toast.success('Automation deleted')
            fetchAutomations()
        } catch (error) {
            toast.error('Failed to delete automation')
        }
    }

    async function handleDuplicate(automation: Automation) {
        try {
            const response = await fetch(`/api/automations/${automation.id}`)
            if (!response.ok) throw new Error('Failed to fetch')
            const { automation: fullAutomation } = await response.json()

            const createResponse = await fetch('/api/automations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${automation.name} (Copy)`,
                    description: fullAutomation.description,
                    triggerType: fullAutomation.triggerType,
                    triggerConfig: fullAutomation.triggerConfig,
                    conditions: fullAutomation.conditions,
                    actions: fullAutomation.actions
                })
            })
            if (!createResponse.ok) throw new Error('Failed to duplicate')
            toast.success('Automation duplicated')
            fetchAutomations()
        } catch (error) {
            toast.error('Failed to duplicate automation')
        }
    }

    const filteredAutomations = automations.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: automations.length,
        active: automations.filter(a => a.status === 'ACTIVE').length,
        paused: automations.filter(a => a.status === 'PAUSED').length,
        totalRuns: automations.reduce((sum, a) => sum + a.totalRuns, 0),
        successRate: automations.reduce((sum, a) => sum + a.successfulRuns, 0) /
            Math.max(automations.reduce((sum, a) => sum + a.totalRuns, 0), 1) * 100
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 shadow-lg shadow-primary/10">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            Automations
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Create powerful workflows to automate your outreach
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/dashboard/automations/new')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Automation
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Total Automations</div>
                            <div className="text-2xl font-bold text-foreground mt-1">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Active</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Total Runs</div>
                            <div className="text-2xl font-bold text-foreground mt-1">{stats.totalRuns.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                            <div className="text-2xl font-bold text-foreground mt-1">{stats.successRate.toFixed(1)}%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search automations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                        <TabsList className="bg-muted border border-border">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                            <TabsTrigger value="PAUSED">Paused</TabsTrigger>
                            <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Automations List */}
                {isLoading ? (
                    <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="bg-card border-border animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                                    <div className="h-4 bg-muted rounded w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredAutomations.length === 0 ? (
                    <Card className="bg-card border-border border-dashed">
                        <CardContent className="p-12 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Zap className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No automations yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Create your first automation to start automating your outreach
                            </p>
                            <Button
                                onClick={() => router.push('/dashboard/automations/new')}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Automation
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredAutomations.map((automation) => {
                            const TriggerIcon = TRIGGER_ICONS[automation.triggerType] || TRIGGER_ICONS.DEFAULT
                            return (
                                <Card
                                    key={automation.id}
                                    className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
                                    onClick={() => router.push(`/dashboard/automations/${automation.id}`)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl ${automation.status === 'ACTIVE'
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted text-muted-foreground'
                                                    }`}>
                                                    <TriggerIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {automation.name}
                                                    </h3>
                                                    {automation.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">{automation.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <Badge className={STATUS_COLORS[automation.status]}>
                                                            {automation.status}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {automation.triggerType.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                        <span className="text-foreground">{automation.successfulRuns}</span>
                                                        <XCircle className="h-4 w-4 text-destructive ml-2" />
                                                        <span className="text-foreground">{automation.failedRuns}</span>
                                                    </div>
                                                    {automation.lastTriggeredAt && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Last run: {new Date(automation.lastTriggeredAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-popover border-border">
                                                        {automation.status === 'ACTIVE' ? (
                                                            <DropdownMenuItem
                                                                onClick={(e) => { e.stopPropagation(); handlePause(automation.id) }}
                                                                className="text-amber-600 dark:text-amber-400"
                                                            >
                                                                <Pause className="h-4 w-4 mr-2" />
                                                                Pause
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={(e) => { e.stopPropagation(); handleActivate(automation.id) }}
                                                                className="text-green-600 dark:text-green-400"
                                                            >
                                                                <Play className="h-4 w-4 mr-2" />
                                                                Activate
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            onClick={(e) => { e.stopPropagation(); handleDuplicate(automation) }}
                                                        >
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-border" />
                                                        <DropdownMenuItem
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(automation.id) }}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
