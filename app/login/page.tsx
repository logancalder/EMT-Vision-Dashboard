"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { AuthButton } from "@/components/auth-button";

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error logging in with Google:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      <AuthButton
        provider="discord"
        label="Continue with Discord"
        icon={<FaDiscord className="mr-2 h-4 w-4" />}
        disabled={envError}
      />
      <AuthButton
        provider="google"
        label="Continue with Google"
        icon={<FaGoogle className="mr-2 h-4 w-4" />}
        disabled={envError}
      />
    </div>
  )
}

