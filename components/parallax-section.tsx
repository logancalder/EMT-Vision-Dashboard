"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function ParallaxSection({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const scrollPosition = window.scrollY
      // Apply subtle background parallax shift
      ref.current.style.backgroundPositionY = `${scrollPosition * 0.1}px`
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={ref} className={cn("relative overflow-hidden", className)}>
      {children}
    </section>
  )
}
