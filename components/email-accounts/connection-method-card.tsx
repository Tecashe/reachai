"use client"

import { ArrowRight } from "lucide-react"

interface Provider {
  id: string
  name: string
  provider: string
  icon: string
  color: string
  description: string
}

interface Props {
  provider: Provider
  onClick: () => void
}

export function ConnectionMethodCard({ provider, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:shadow-2xl active:scale-95"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 group-hover:border-white/40 transition-all" />

      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${provider.color}`}
        style={{ opacity: 0.05 }}
      />

      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Top: Logo and name */}
        <div className="flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${provider.color} text-white font-bold text-2xl shadow-lg`}
          >
            {provider.icon}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>

        {/* Provider info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{provider.name}</h3>
          <p className="text-sm text-muted-foreground">{provider.provider}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{provider.description}</p>
      </div>
    </button>
  )
}
