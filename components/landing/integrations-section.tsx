"use client"

export function IntegrationsSection() {
  const integrations = [
    { name: "Apollo", logo: "/logos/apollo.svg" },
    { name: "Gmail", logo: "/logos/gmail.svg" },
    { name: "Outlook", logo: "/logos/outlook.svg" },
    { name: "HubSpot", logo: "/logos/hubspot.svg" },
    { name: "Salesforce", logo: "/logos/salesforce.svg" },
    { name: "Slack", logo: "/logos/slack.svg" },
    { name: "Zapier", logo: "/logos/zapier.svg" },
    { name: "LinkedIn", logo: "/logos/linkedin.svg" },
    { name: "Google Workspace", logo: "/logos/google-workspace.svg" },
    { name: "Microsoft 365", logo: "/logos/microsoft-365.svg" },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-green-50 via-yellow-50 to-green-50 rounded-[3rem] p-12 sm:p-16 lg:p-20 shadow-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Integrates with your stack</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect Reachai with the tools you already use every day
            </p>
          </div>

          <div className="relative mb-8 overflow-hidden">
            <div className="flex gap-8 animate-scroll-left">
              {[...integrations.slice(0, 5), ...integrations.slice(0, 5)].map((integration, index) => (
                <div
                  key={`left-${index}`}
                  className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-8 w-48 h-32 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/50"
                >
                  <img
                    src={integration.logo || "/placeholder.svg"}
                    alt={integration.name}
                    className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-8 animate-scroll-right">
              {[...integrations.slice(5), ...integrations.slice(5)].map((integration, index) => (
                <div
                  key={`right-${index}`}
                  className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl p-8 w-48 h-32 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/50"
                >
                  <img
                    src={integration.logo || "/placeholder.svg"}
                    alt={integration.name}
                    className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-10 text-center border border-green-200/50 shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Need a custom integration?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our API makes it easy to connect Reachai with any tool in your workflow
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              View API Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
