"use client"

export function GradientBentoSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful features at your fingertips</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run successful email campaigns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[240px]">
          {/* Large Feature - Email Volume - Spans 4 columns, 2 rows */}
          <div className="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 opacity-90" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-white font-medium text-sm">Lightning Fast</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Send 10,000 emails per day</h3>
                <p className="text-white/90 text-lg max-w-md">
                  Scale your outreach without limits. Our infrastructure handles massive volumes while maintaining
                  perfect deliverability.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white text-sm">
                  99.9% Uptime
                </div>
                <div className="px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white text-sm">
                  Auto-scaling
                </div>
                <div className="px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm text-white text-sm">
                  Email Rotation
                </div>
              </div>
            </div>
          </div>

          {/* Tall Feature - AI Personalization - Spans 2 columns, 2 rows */}
          <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <svg className="w-12 h-12 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Personalization</h3>
                <p className="text-white/90 text-base mb-6">
                  Craft unique messages for every prospect using advanced AI that understands context and tone.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Dynamic merge tags</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Tone adjustment</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Smart variables</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wide Feature - Multi-channel - Spans 6 columns, 1 row */}
          <div className="md:col-span-6 md:row-span-1 group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 opacity-90" />
            <div className="relative z-10 h-full flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Multi-channel Outreach</h3>
                <p className="text-white/80 text-lg">Email, LinkedIn, and phone - all orchestrated in one place</p>
              </div>
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
