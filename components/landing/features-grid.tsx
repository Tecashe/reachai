"use client"

import { Search, Sparkles, Mail, Shield, BarChart, Zap, Users, Database, Lock } from "lucide-react"

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-gradient-to-br from-indigo-50 via-purple-50/80 to-pink-50/60 p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/60">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everything you need to scale outreach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From lead generation to delivery monitoring, mailfra handles your entire email workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
            {/* Lead Discovery - Large Card (spans 2 columns, 2 rows) */}
            <div className="md:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-6">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Lead Discovery with Apollo</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find your ideal customers with Apollo integration and advanced filters. Search by industry, company
                  size, job title, and more.
                </p>
                <div className="mt-auto aspect-video rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden shadow-inner">
                  <img
                    src="/apollo-lead-discovery-dashboard-interface.jpg"
                    alt="Lead Discovery Dashboard"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Email Enrichment - Medium Card (1 column, 1 row) */}
            <div className="lg:col-span-1 group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mb-6">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Email Enrichment</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Automatically enrich leads with verified contact data and insights
                </p>
                <div className="mt-auto aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden shadow-inner">
                  <img
                    src="/email-enrichment-data-visualization.jpg"
                    alt="Email Enrichment"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* AI Personalization - Medium Tall Card (1 column, 2 rows) */}
            <div className="lg:col-span-1 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Personalization</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Generate unique, personalized emails for each prospect with advanced AI that understands context
                </p>
                <div className="mt-auto flex-1 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 overflow-hidden shadow-inner">
                  <img
                    src="/ai-writing-personalized-email-interface.jpg"
                    alt="AI Personalization"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Email Warmup - Small Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Email Warmup</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gradually increase sending volume to establish reputation
                </p>
              </div>
            </div>

            {/* DKIM Setup - Wide Card (spans 2 columns) */}
            <div className="md:col-span-2 lg:col-span-2 group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex items-center gap-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex-shrink-0">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">DKIM & Domain Setup</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Secure email authentication with automatic DKIM configuration and DNS management
                  </p>
                </div>
                <div className="hidden lg:block w-40 h-40 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden shadow-inner flex-shrink-0">
                  <img
                    src="/security-shield-checkmark.jpg"
                    alt="DKIM Security"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Email Rotation - Small Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Email Rotation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rotate between accounts for optimal deliverability
                </p>
              </div>
            </div>

            {/* Open Tracking - Medium Card */}
            <div className="lg:col-span-1 group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg mb-6">
                  <BarChart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Open Tracking</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Real-time insights on opens, clicks, and replies
                </p>
                <div className="mt-auto aspect-square rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden shadow-inner">
                  <img
                    src="/analytics-dashboard.png"
                    alt="Open Tracking Analytics"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Health Monitoring - Wide Card */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex items-center gap-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg flex-shrink-0">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Health Monitoring</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get instant alerts when your email health score drops with proactive recommendations
                  </p>
                </div>
                <div className="hidden lg:block w-40 h-40 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 overflow-hidden shadow-inner flex-shrink-0">
                  <img
                    src="/health-monitoring-alert-dashboard.jpg"
                    alt="Health Monitoring"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Smart Delivery - Small Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full p-8 flex flex-col">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Smart Delivery</h3>
                <p className="text-gray-600 text-sm leading-relaxed">AI-optimized send times for maximum engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
