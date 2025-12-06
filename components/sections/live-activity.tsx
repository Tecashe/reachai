// "use client"

// import { useState, useEffect, useRef } from "react"

// const activities = [
//   { type: "sent", company: "Acme Corp", location: "San Francisco, US", count: 247 },
//   { type: "reply", company: "TechStart Inc", location: "Austin, US", count: 1 },
//   { type: "meeting", company: "GlobalTech", location: "London, UK", count: 1 },
//   { type: "sent", company: "Innovation Labs", location: "Berlin, DE", count: 156 },
//   { type: "warmup", company: "DataFlow", location: "Toronto, CA", count: 50 },
//   { type: "reply", company: "ScaleUp Co", location: "Sydney, AU", count: 1 },
//   { type: "sent", company: "NextGen Solutions", location: "Singapore", count: 312 },
//   { type: "meeting", company: "FutureTech", location: "New York, US", count: 1 },
//   { type: "warmup", company: "CloudNine", location: "Amsterdam, NL", count: 75 },
//   { type: "reply", company: "Pioneer Systems", location: "Tokyo, JP", count: 1 },
//   { type: "sent", company: "Quantum Dynamics", location: "Paris, FR", count: 189 },
//   { type: "meeting", company: "Apex Industries", location: "Dubai, UAE", count: 1 },
// ]

// const typeConfig = {
//   sent: { label: "Emails sent", color: "bg-blue-500" },
//   reply: { label: "Reply received", color: "bg-green-500" },
//   meeting: { label: "Meeting booked", color: "bg-purple-500" },
//   warmup: { label: "Warmup emails", color: "bg-orange-500" },
// }

// export function LiveActivity() {
//   const [visibleItems, setVisibleItems] = useState<number[]>([])
//   const [isVisible, setIsVisible] = useState(false)
//   const [totalEmails, setTotalEmails] = useState(47234567)
//   const sectionRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true)
//         }
//       },
//       { threshold: 0.2 },
//     )

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current)
//     }

//     return () => observer.disconnect()
//   }, [])

//   useEffect(() => {
//     if (!isVisible) return

//     // Stagger in activity items
//     activities.forEach((_, index) => {
//       setTimeout(() => {
//         setVisibleItems((prev) => [...prev, index])
//       }, index * 200)
//     })

//     // Animate total counter
//     const interval = setInterval(() => {
//       setTotalEmails((prev) => prev + Math.floor(Math.random() * 50) + 10)
//     }, 2000)

//     return () => clearInterval(interval)
//   }, [isVisible])

//   return (
//     <section ref={sectionRef} className="relative py-32 bg-foreground text-background overflow-hidden">
//       {/* Animated gradient orbs */}
//       <div
//         className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
//         style={{
//           background: "radial-gradient(circle, hsl(var(--background)) 0%, transparent 70%)",
//           animation: "float 8s ease-in-out infinite",
//         }}
//       />
//       <div
//         className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
//         style={{
//           background: "radial-gradient(circle, hsl(var(--background)) 0%, transparent 70%)",
//           animation: "float 10s ease-in-out infinite reverse",
//         }}
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left - Content */}
//           <div
//             className="transition-all duration-1000"
//             style={{
//               opacity: isVisible ? 1 : 0,
//               transform: isVisible ? "translateY(0)" : "translateY(40px)",
//             }}
//           >
//             <span className="text-sm uppercase tracking-[0.2em] text-background/60 mb-4 block">
//               Live Platform Activity
//             </span>
//             <h2 className="text-4xl md:text-6xl font-bold mb-6">
//               Join Thousands of
//               <br />
//               <span className="text-background/60">Active Senders</span>
//             </h2>
//             <p className="text-xl text-background/70 mb-10 max-w-lg">
//               Watch real-time activity from our platform. Every second, businesses are sending emails, booking meetings,
//               and closing deals with Mailfra.
//             </p>

//             {/* Live counter */}
//             <div className="inline-flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-2xl px-8 py-6">
//               <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
//               <div>
//                 <div className="text-sm text-background/60 mb-1">Total emails sent today</div>
//                 <div className="text-4xl font-bold font-mono">{totalEmails.toLocaleString()}</div>
//               </div>
//             </div>
//           </div>

//           {/* Right - Activity Feed */}
//           <div
//             className="relative h-[500px] overflow-hidden transition-all duration-1000 delay-300"
//             style={{
//               opacity: isVisible ? 1 : 0,
//               transform: isVisible ? "translateX(0)" : "translateX(40px)",
//             }}
//           >
//             {/* Gradient fade top */}
//             <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-foreground to-transparent z-10 pointer-events-none" />
//             {/* Gradient fade bottom */}
//             <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-foreground to-transparent z-10 pointer-events-none" />

//             <div className="space-y-4 animate-scroll-up">
//               {[...activities, ...activities].map((activity, index) => {
//                 const config = typeConfig[activity.type as keyof typeof typeConfig]
//                 const isItemVisible = visibleItems.includes(index % activities.length)

//                 return (
//                   <div
//                     key={index}
//                     className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-xl p-4 transition-all duration-500"
//                     style={{
//                       opacity: isItemVisible ? 1 : 0,
//                       transform: isItemVisible ? "translateX(0)" : "translateX(20px)",
//                     }}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className={`w-2 h-2 rounded-full ${config.color}`} />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-medium truncate">{activity.company}</span>
//                           <span className="text-background/40 text-sm">{activity.location}</span>
//                         </div>
//                         <div className="text-sm text-background/60">
//                           {config.label}
//                           {activity.count > 1 && (
//                             <span className="ml-1 text-background/80 font-medium">({activity.count})</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-xs text-background/40">Just now</div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes scroll-up {
//           0% {
//             transform: translateY(0);
//           }
//           100% {
//             transform: translateY(-50%);
//           }
//         }
//         .animate-scroll-up {
//           animation: scroll-up 30s linear infinite;
//         }
//         .animate-scroll-up:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </section>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"

const activities = [
  { type: "sent", company: "Acme Corp", location: "San Francisco, US", count: 247 },
  { type: "reply", company: "TechStart Inc", location: "Austin, US", count: 1 },
  { type: "meeting", company: "GlobalTech", location: "London, UK", count: 1 },
  { type: "sent", company: "Innovation Labs", location: "Berlin, DE", count: 156 },
  { type: "warmup", company: "DataFlow", location: "Toronto, CA", count: 50 },
  { type: "reply", company: "ScaleUp Co", location: "Sydney, AU", count: 1 },
  { type: "sent", company: "NextGen Solutions", location: "Singapore", count: 312 },
  { type: "meeting", company: "FutureTech", location: "New York, US", count: 1 },
  { type: "warmup", company: "CloudNine", location: "Amsterdam, NL", count: 75 },
  { type: "reply", company: "Pioneer Systems", location: "Tokyo, JP", count: 1 },
  { type: "sent", company: "Quantum Dynamics", location: "Paris, FR", count: 189 },
  { type: "meeting", company: "Apex Industries", location: "Dubai, UAE", count: 1 },
]

const typeConfig = {
  sent: { label: "Emails sent", color: "bg-blue-500" },
  reply: { label: "Reply received", color: "bg-green-500" },
  meeting: { label: "Meeting booked", color: "bg-purple-500" },
  warmup: { label: "Warmup emails", color: "bg-orange-500" },
}

export function LiveActivity() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [totalEmails, setTotalEmails] = useState(47234567)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    activities.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index])
      }, index * 200)
    })

    const interval = setInterval(() => {
      setTotalEmails((prev) => prev + Math.floor(Math.random() * 50) + 10)
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section ref={sectionRef} className="relative py-32 bg-foreground text-background overflow-hidden">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--background)) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--background)) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className="transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
            }}
          >
            <span className="text-sm uppercase tracking-[0.2em] text-background/60 mb-4 block">
              Live Platform Activity
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Join Thousands of
              <br />
              <span className="text-background/60">Active Senders</span>
            </h2>
            <p className="text-xl text-background/70 mb-10 max-w-lg">
              Watch real-time activity from our platform. Every second, businesses are sending emails, booking meetings,
              and closing deals with Mailfra.
            </p>

            <div className="inline-flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-2xl px-8 py-6">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <div className="text-sm text-background/60 mb-1">Total emails sent today</div>
                <div className="text-4xl font-bold font-mono">{totalEmails.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div
            className="relative h-[500px] overflow-hidden transition-all duration-1000 delay-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-foreground to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-foreground to-transparent z-10 pointer-events-none" />

            <div className="space-y-4 animate-scroll-up">
              {[...activities, ...activities].map((activity, index) => {
                const config = typeConfig[activity.type as keyof typeof typeConfig]
                const isItemVisible = visibleItems.includes(index % activities.length)

                return (
                  <div
                    key={index}
                    className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-xl p-4 transition-all duration-500"
                    style={{
                      opacity: isItemVisible ? 1 : 0,
                      transform: isItemVisible ? "translateX(0)" : "translateX(20px)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{activity.company}</span>
                          <span className="text-background/40 text-sm">{activity.location}</span>
                        </div>
                        <div className="text-sm text-background/60">
                          {config.label}
                          {activity.count > 1 && (
                            <span className="ml-1 text-background/80 font-medium">({activity.count})</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-background/40">Just now</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }
        .animate-scroll-up:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
