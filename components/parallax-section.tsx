"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  bgImage?: string
  bgColor?: string
  speed?: number
  className?: string
}

export function ParallaxSection({
  children,
  bgImage,
  bgColor = "bg-background",
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrollPosition = window.scrollY
      const offset = rect.top + scrollPosition
      const windowHeight = window.innerHeight

      if (scrollPosition + windowHeight > offset && scrollPosition < offset + rect.height) {
        const yPos = (scrollPosition - offset) * speed
        bgRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={bgRef}
        className={`absolute inset-0 w-full h-full ${bgColor}`}
        style={
          bgImage
            ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
