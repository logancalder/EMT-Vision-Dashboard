"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthButtonProps {
  provider: "discord" | "google" | "github"
  label: string
  icon: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  disabled?: boolean
}

export function AuthButton({ provider, label, icon, variant = "outline", disabled = false }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    if (disabled) return

    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error signing in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={handleLogin} disabled={isLoading || disabled} className="w-full">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}
      {label}
    </Button>
  )
}

