"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface AuthButtonProps {
  provider: string
  label: string
  icon: ReactNode
  onClick?: () => Promise<void>
}

export function AuthButton({ provider, label, icon, onClick }: AuthButtonProps) {
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

