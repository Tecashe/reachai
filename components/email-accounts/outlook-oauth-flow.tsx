"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { WaveLoader } from "@/components/loader/wave-loader"
import {
    CheckCircle2,
    Shield,
    Zap,
    AlertCircle,
    Monitor,
    Globe,
    ChevronRight,
    Clock,
    Settings,
    ToggleRight,
    UserCog,
    Layout,
    MousePointer,
    Search,
    Power,
} from "lucide-react"

interface Props {
    onAccountAdded: () => void
}

type AccountType = "select" | "standard" | "godaddy"

const GODADDY_STEPS = [
    {
        step: 1,
        title: "Log in to Your GoDaddy Account",
        description: "Open your web browser and navigate to GoDaddy's website. Sign in using your GoDaddy account credentials.",
        icon: Globe,
    },
    {
        step: 2,
        title: "Access Your Products Dashboard",
        description: "Once logged in, navigate to the \"My Products\" page where all your GoDaddy services and subscriptions are listed.",
        icon: Layout,
    },
    {
        step: 3,
        title: "Locate Email Services",
        description: "Scroll down through your products list until you find the \"Email and Office\" section containing your Microsoft 365 subscriptions.",
        icon: Search,
    },
    {
        step: 4,
        title: "Open Email Management",
        description: "Click on the \"Manage All\" button within the Email and Office section to view all your email accounts.",
        icon: Settings,
    },
    {
        step: 5,
        title: "Select the Specific User Account",
        description: "From the list of email accounts, locate the specific user account you want to connect and click \"Manage\" next to that user.",
        icon: UserCog,
    },
    {
        step: 6,
        title: "Navigate to Advanced Settings",
        description: "Scroll down on the user management page until you find \"Advanced Settings\" and click on it to reveal additional configuration options.",
        icon: MousePointer,
    },
    {
        step: 7,
        title: "Enable SMTP Authentication",
        description: "Find the \"SMTP Authentication\" toggle and click to enable it. The button should change from gray to green when activated.",
        icon: ToggleRight,
    },
    {
        step: 8,
        title: "Wait for Activation",
        description: "Wait approximately one hour for GoDaddy's systems to fully process and activate the SMTP authentication settings.",
        icon: Clock,
    },
]

export function OutlookOAuthFlow({ onAccountAdded }: Props) {
    const [accountType, setAccountType] = useState<AccountType>("select")
    const [isLoading, setIsLoading] = useState(false)
    const [smtpEnabled, setSmtpEnabled] = useState(false)
    const [expandedStep, setExpandedStep] = useState<number | null>(null)
    const { toast } = useToast()
    const popupRef = useRef<Window | null>(null)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Clean up polling on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current)
        }
    }, [])

    const handleOAuthConnect = useCallback(async () => {
        try {
            setIsLoading(true)

            // Open popup window for OAuth
            const width = 500
            const height = 700
            const left = window.screenX + (window.outerWidth - width) / 2
            const top = window.screenY + (window.outerHeight - height) / 2

            const popup = window.open(
                "/api/oauth/outlook",
                "outlook-oauth",
                `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
            )
            popupRef.current = popup

            if (!popup) {
                toast({
                    title: "Popup blocked",
                    description: "Please allow popups for this site and try again.",
                    variant: "destructive",
                })
                setIsLoading(false)
                return
            }

            // Poll the popup to detect when it closes or lands on our success URL
            pollRef.current = setInterval(() => {
                try {
                    if (!popup || popup.closed) {
                        if (pollRef.current) clearInterval(pollRef.current)
                        setIsLoading(false)

                        // Check if the OAuth was successful by looking for success URL params
                        // The popup will have redirected to our email-accounts page with ?success=outlook_connected
                        // We refresh the parent to pick up the new account
                        toast({
                            title: "Checking connection...",
                            description: "Verifying your Microsoft account was connected.",
                        })

                        // Give a moment for the DB write to complete, then trigger refresh
                        setTimeout(() => {
                            onAccountAdded()
                        }, 1000)
                        return
                    }

                    // Try to read the popup URL to detect success/error
                    const popupUrl = popup.location?.href
                    if (popupUrl && popupUrl.includes("/dashboard/settings/email-accounts")) {
                        const url = new URL(popupUrl)
                        const success = url.searchParams.get("success")
                        const error = url.searchParams.get("error")

                        popup.close()
                        if (pollRef.current) clearInterval(pollRef.current)
                        setIsLoading(false)

                        if (success === "outlook_connected") {
                            toast({
                                title: "Microsoft account connected!",
                                description: "Your account has been successfully linked.",
                            })
                            onAccountAdded()
                        } else if (error) {
                            toast({
                                title: "Connection failed",
                                description: "Failed to connect your Microsoft account. Please try again.",
                                variant: "destructive",
                            })
                        }
                    }
                } catch {
                    // Cross-origin errors are expected while popup is on Microsoft's domain
                    // Just keep polling
                }
            }, 500)
        } catch (error) {
            console.error("[mailfra] Outlook OAuth initiation error:", error)
            toast({
                title: "Error",
                description: "Failed to initiate Microsoft OAuth connection",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }, [onAccountAdded, toast])

    // Account type selection
    if (accountType === "select") {
        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Connect with Microsoft OAuth</h3>
                    <p className="text-sm text-muted-foreground mt-1">Select your Microsoft account type to get started</p>
                </div>

                <Card
                    onClick={() => setAccountType("standard")}
                    className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-sm group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Monitor className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Standard Microsoft Account</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Outlook.com, Hotmail, Live.com, or Microsoft 365 purchased directly
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success font-medium">
                                    One-click setup
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card
                    onClick={() => setAccountType("godaddy")}
                    className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-sm group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                            <Globe className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">Microsoft via GoDaddy</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Microsoft 365 purchased through GoDaddy — requires SMTP setup first
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 font-medium">
                                    Extra step required
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    // Standard Microsoft flow
    if (accountType === "standard") {
        return (
            <div className="space-y-4">
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex gap-3">
                        <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="space-y-1.5">
                            <p className="font-medium text-sm text-foreground">Secure OAuth Connection</p>
                            <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                                <li>• No passwords stored — uses secure Microsoft OAuth tokens</li>
                                <li>• Works with Outlook.com, Hotmail, Live, and Microsoft 365</li>
                                <li>• Grants IMAP read and SMTP send access only</li>
                                <li>• You can revoke access anytime from your Microsoft account</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 bg-card border-border/50">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-sm text-foreground mb-2">What happens next?</h3>
                            <ol className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                                <li className="flex gap-2">
                                    <span className="font-medium text-foreground">1.</span>
                                    <span>You&apos;ll be redirected to Microsoft&apos;s secure login page</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-medium text-foreground">2.</span>
                                    <span>Sign in and select which account to connect</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-medium text-foreground">3.</span>
                                    <span>Grant permission to send and read emails via IMAP/SMTP</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-medium text-foreground">4.</span>
                                    <span>You&apos;ll be redirected back with your account connected</span>
                                </li>
                            </ol>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            <Zap className="h-3.5 w-3.5" />
                            <span>Connection takes less than 30 seconds</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-muted/30 border-border/50">
                    <div className="flex gap-3">
                        <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            This uses standard IMAP/SMTP protocols with OAuth2 authentication. Your credentials are encrypted and
                            stored securely. We never see or store your Microsoft password.
                        </p>
                    </div>
                </Card>

                <Button
                    onClick={handleOAuthConnect}
                    disabled={isLoading}
                    className="w-full h-10 gap-2"
                    size="sm"
                >
                    {isLoading ? (
                        <>
                            <WaveLoader size="sm" color="bg-primary-foreground" />
                            <span>Connecting to Microsoft...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            Connect with Microsoft
                        </>
                    )}
                </Button>
            </div>
        )
    }

    // GoDaddy flow
    return (
        <div className="space-y-4">
            <Card className="p-4 bg-orange-500/5 border-orange-500/20">
                <div className="flex gap-3">
                    <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-foreground">GoDaddy accounts require an extra step</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Microsoft accounts purchased through GoDaddy have SMTP authentication disabled by default. Follow
                            the steps below to enable it before connecting.
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-5 bg-card border-border/50">
                <h4 className="font-semibold text-sm text-foreground mb-4">Enable SMTP Authentication in GoDaddy</h4>
                <div className="space-y-2">
                    {GODADDY_STEPS.map((step) => {
                        const Icon = step.icon
                        const isExpanded = expandedStep === step.step
                        return (
                            <div
                                key={step.step}
                                className="border border-border/50 rounded-lg overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-primary">{step.step}</span>
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-foreground">{step.title}</span>
                                    <Icon className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "text-primary" : ""}`} />
                                </button>
                                {isExpanded && (
                                    <div className="px-3 pb-3 pl-[3.25rem]">
                                        <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Card>

            <Card className="p-4 bg-card border-border/50">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-0.5">
                        <input
                            type="checkbox"
                            checked={smtpEnabled}
                            onChange={(e) => setSmtpEnabled(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            I have enabled SMTP Authentication and waited at least 1 hour
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Confirm that you&apos;ve completed the steps above before connecting
                        </p>
                    </div>
                </label>
            </Card>

            <Button
                onClick={handleOAuthConnect}
                disabled={isLoading || !smtpEnabled}
                className="w-full h-10 gap-2"
                size="sm"
            >
                {isLoading ? (
                    <>
                        <WaveLoader size="sm" color="bg-primary-foreground" />
                        <span>Connecting to Microsoft...</span>
                    </>
                ) : (
                    <>
                        <Power className="h-4 w-4" />
                        Connect with Microsoft
                    </>
                )}
            </Button>

            {!smtpEnabled && (
                <p className="text-center text-xs text-muted-foreground">
                    Please confirm SMTP authentication is enabled before proceeding
                </p>
            )}
        </div>
    )
}
