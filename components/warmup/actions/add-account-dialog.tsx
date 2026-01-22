"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Mail, Plus, Shield } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Account {
    id: string
    email: string
    provider: string
    warmupEnabled: boolean
    isActive: boolean
}

interface AddAccountDialogProps {
    onSuccess: () => void
    userId: string | null
}

export function AddAccountDialog({ onSuccess, userId }: AddAccountDialogProps) {
    const [open, setOpen] = useState(false)
    const [accounts, setAccounts] = useState<Account[]>([])
    const [loading, setLoading] = useState(false)
    const [enrolling, setEnrolling] = useState<string | null>(null)

    const fetchAccounts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/settings/sending-accounts")
            const data = await res.json()
            // Filter only accounts NOT in warmup
            const eligible = Array.isArray(data) ? data.filter((a: Account) => !a.warmupEnabled && a.isActive) : []
            setAccounts(eligible)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load accounts")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) fetchAccounts()
    }, [open])

    const handleEnroll = async (accountId: string) => {
        if (!userId) return

        try {
            setEnrolling(accountId)
            const res = await fetch("/api/warmup/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, userId })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Account enrolled in warmup", {
                    description: data.message
                })
                setAccounts(prev => prev.filter(a => a.id !== accountId))
                onSuccess()
                setOpen(false)
            } else {
                toast.error(data.error || "Failed to enroll")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setEnrolling(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Warmup
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enroll Account</DialogTitle>
                    <DialogDescription>
                        Select a sending account to add to the warmup pool.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No eligible accounts found.</p>
                            <p className="text-xs mt-1">Add more accounts in Settings.</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-3">
                                {accounts.map((acc) => (
                                    <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{acc.email}</p>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="text-[10px] h-4 px-1">{acc.provider}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleEnroll(acc.id)}
                                            disabled={!!enrolling}
                                        >
                                            {enrolling === acc.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <span className="text-xs">Enroll</span>
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
