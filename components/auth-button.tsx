"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ReactNode } from "react"

type Provider = "google" | "github" | "discord"

interface AuthButtonProps {
  provider: Provider
  label: string
  icon: ReactNode
  onClick?: () => Promise<void>
}

export function AuthButton({ provider, label, icon, onClick }: AuthButtonProps) {
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
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  )
}

