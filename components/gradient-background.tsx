"use client"

import { useEffect, useRef } from "react"

interface GradientBackgroundProps {
  className?: string
}

export function GradientBackground({ className = "" }: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create gradient
    let gradientAngle = 0
    const speed = 0.0005

    const animate = () => {
      if (!ctx || !canvas) return

      gradientAngle += speed
      if (gradientAngle >= 2 * Math.PI) {
        gradientAngle = 0
      }

      // Calculate gradient positions
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.max(canvas.width, canvas.height)

      const x1 = centerX + Math.cos(gradientAngle) * radius
      const y1 = centerY + Math.sin(gradientAngle) * radius
      const x2 = centerX + Math.cos(gradientAngle + Math.PI) * radius
      const y2 = centerY + Math.sin(gradientAngle + Math.PI) * radius

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)

      // Add color stops - using primary color with opacity
      gradient.addColorStop(0, "rgba(0, 122, 255, 0.05)")
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)")
      gradient.addColorStop(1, "rgba(0, 122, 255, 0.05)")

      // Fill canvas
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}
