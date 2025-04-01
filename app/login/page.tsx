"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { AuthButton } from "@/components/auth-button";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://v0-patient-dashboard-nine.vercel.app/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error logging in with Google:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the EMT Vision Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <AuthButton
              provider="google"
              label="Continue with Google"
              icon={<FaGoogle className="mr-2 h-4 w-4" />}
              onClick={handleGoogleLogin}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

