
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  Zap,
  Users,
  BarChart3,
  Shield,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Building2,
  Mail,
  TrendingUp,
  Clock,
  Database,
} from "lucide-react"
import { WaveLoader } from "../loader/wave-loader"

interface CrmIntegrationSetupProps {
  onSuccess?: () => void
}

const crmProviders = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Complete CRM platform with marketing, sales, and service hubs",
    logoSrc: "/hubspot.png",
    features: ["Marketing Automation", "Sales Pipeline", "Service Tickets", "Free CRM"],
    users: "194,000+",
    category: "All-in-One",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise-grade CRM trusted by Fortune 500 companies worldwide",
    logoSrc: "/salesforce.png",
    features: ["Enterprise Scale", "AppExchange", "Einstein AI", "Custom Objects"],
    users: "150,000+",
    category: "Enterprise",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sales-focused CRM designed by salespeople, for salespeople",
    logoSrc: "/pipedrive.png",
    features: ["Visual Pipeline", "Activity Tracking", "Email Integration", "Smart Docs"],
    users: "100,000+",
    category: "Sales-First",
  },
]

const benefits = [
  {
    icon: Sparkles,
    title: "AI Deal Scoring",
    description: "Automatically score leads based on engagement and fit",
  },
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    description: "Bi-directional sync keeps data fresh across platforms",
  },
  {
    icon: Mail,
    title: "Smart Sequences",
    description: "Trigger personalized email campaigns from CRM events",
  },
  {
    icon: BarChart3,
    title: "Unified Analytics",
    description: "See campaign performance alongside deal metrics",
  },
]

const stats = [
  { label: "Average sync time", value: "< 30s", icon: Clock },
  { label: "Contacts supported", value: "Unlimited", icon: Database },
  { label: "Engagement boost", value: "+47%", icon: TrendingUp },
]

export function CrmIntegrationSetup({ onSuccess }: CrmIntegrationSetupProps) {
  const { toast } = useToast()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (crmType: "hubspot" | "salesforce" | "pipedrive") => {
    setConnecting(crmType)
    try {
      const response = await fetch("/api/integrations/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crmType }),
      })

      if (!response.ok) throw new Error("Connection failed")

      const data = await response.json()
      window.location.href = data.authUrl

      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error("[CRM] Connect error:", error)
      toast({ title: "Error", description: "Failed to connect CRM", variant: "destructive" })
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-foreground/[0.02]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01]" />

        <div className="relative p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Content */}
            <div className="space-y-6">
              <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-border/50">
                <Zap className="w-3 h-3 mr-1" />
                CRM Integration
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Connect Your CRM</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sync your leads directly from your CRM for AI-powered deal scoring, personalized email sequences, and
                unified analytics across your entire sales pipeline.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-foreground/5">
                      <stat.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Benefits grid */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-border/50 hover:bg-background/70 transition-all duration-300"
                >
                  <div className="p-2 rounded-lg bg-foreground/5 w-fit mb-3 group-hover:bg-foreground/10 transition-colors">
                    <benefit.icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <p className="text-sm font-medium mb-1">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CRM Provider Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {crmProviders.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="h-full"
          >
            <Card className="group relative overflow-hidden h-full bg-card/50 backdrop-blur-xl border-border/50 hover:border-border hover:shadow-xl hover:shadow-foreground/[0.03] hover:-translate-y-1 transition-all duration-300">
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="relative p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="relative h-14 w-14 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 p-2 shadow-lg shadow-foreground/[0.02]">
                    <Image
                      src={provider.logoSrc || "/placeholder.svg"}
                      alt={provider.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <Badge variant="secondary" className="bg-foreground/5 text-foreground/70 border-0">
                    {provider.category}
                  </Badge>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{provider.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Features</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="bg-background/40 backdrop-blur-sm border-border/50 text-xs font-normal"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1 text-foreground/50" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 py-4 border-t border-border/30 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{provider.users} companies</span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={() => handleConnect(provider.id as "hubspot" | "salesforce" | "pipedrive")}
                  disabled={connecting !== null}
                  className="w-full group/btn relative overflow-hidden"
                  size="lg"
                >
                  {connecting === provider.id ? (
                    <>
                      {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                      <WaveLoader size="sm" bars={8} gap="tight" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect {provider.name}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-foreground/5">
            <Shield className="w-5 h-5 text-foreground/70" />
          </div>
          <div>
            <p className="font-medium">Secure OAuth Connection</p>
            <p className="text-sm text-muted-foreground">
              We never store your CRM credentials. All connections use secure OAuth 2.0.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Trusted by 10,000+ sales teams</span>
        </div>
      </motion.div>
    </div>
  )
}
