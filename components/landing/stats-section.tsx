"use client"

import { useEffect, useRef } from "react"

export function StatsSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Define network paths with start and end points
    const paths = [
      // Top row - left to right
      { startX: 50, startY: 100, endX: 350, endY: 100, delay: 0, duration: 3000 },
      { startX: 50, startY: 150, endX: 350, endY: 150, delay: 800, duration: 2800 },
      // Middle diagonal paths
      { startX: 50, startY: 200, endX: 350, endY: 250, delay: 400, duration: 3200 },
      { startX: 50, startY: 250, endX: 350, endY: 200, delay: 1200, duration: 2900 },
      // Bottom row
      { startX: 50, startY: 300, endX: 350, endY: 300, delay: 600, duration: 3100 },
      { startX: 50, startY: 350, endX: 350, endY: 350, delay: 1000, duration: 2700 },
    ]

    const particles: Array<{
      path: (typeof paths)[0]
      progress: number
      startTime: number
    }> = []

    // Initialize particles with delays
    paths.forEach((path) => {
      particles.push({
        path,
        progress: 0,
        startTime: Date.now() + path.delay,
      })
    })

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const currentTime = Date.now()

      // Clear canvas
      ctx.clearRect(0, 0, w, h)

      // Draw paths and particles
      particles.forEach((particle, index) => {
        const { path, startTime } = particle
        const elapsed = currentTime - startTime

        if (elapsed < 0) return // Not started yet

        // Calculate progress (0 to 1)
        const progress = Math.min((elapsed % path.duration) / path.duration, 1)
        particle.progress = progress

        // Calculate current position
        const x = path.startX + (path.endX - path.startX) * progress
        const y = path.startY + (path.endY - path.startY) * progress

        // Draw the static path line
        ctx.strokeStyle = "rgba(59, 130, 246, 0.15)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(path.startX, path.startY)
        ctx.lineTo(path.endX, path.endY)
        ctx.stroke()

        // Draw start node
        ctx.fillStyle = "rgba(59, 130, 246, 0.4)"
        ctx.beginPath()
        ctx.arc(path.startX, path.startY, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw end node
        ctx.fillStyle = "rgba(34, 197, 94, 0.4)"
        ctx.beginPath()
        ctx.arc(path.endX, path.endY, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw glowing particle
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12)
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)")
        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.4)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fill()

        // Draw glowing trail
        const trailLength = 40
        for (let i = 1; i <= 10; i++) {
          const trailProgress = Math.max(0, progress - i / trailLength)
          const trailX = path.startX + (path.endX - path.startX) * trailProgress
          const trailY = path.startY + (path.endY - path.startY) * trailProgress
          const opacity = (10 - i) / 10

          ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.3})`
          ctx.beginPath()
          ctx.arc(trailX, trailY, 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw "Delivered" text when particle reaches end
        if (progress > 0.95) {
          ctx.font = "bold 12px sans-serif"
          ctx.fillStyle = "rgba(34, 197, 94, 0.9)"
          ctx.fillText("Delivered", path.endX + 10, path.endY + 5)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <section className="relative py-32 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 text-balance">
            Trusted by growth teams everywhere
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Join thousands of companies scaling their outreach with Reachai
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: "10,000+", label: "Active Users" },
            { value: "50M+", label: "Emails Sent" },
            { value: "98%", label: "Deliverability" },
            { value: "5x", label: "Avg Response Rate" },
          ].map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 text-center border border-white/40 hover:bg-white/70 transition-all duration-300 shadow-lg"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-700">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
