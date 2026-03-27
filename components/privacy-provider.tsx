"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface PrivacyContextType {
  privacyMode: boolean
  togglePrivacyMode: () => void
  setPrivacyMode: (enabled: boolean) => void
  // Helper to format patient names based on privacy state
  formatPatientName: (name: string, patientId?: string) => string
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

export function PrivacyProvider({ children }: { children: ReactNode }) {
  // Default to OFF as requested for hospital nurses
  const [privacyMode, setPrivacyMode] = useState(false)

  const togglePrivacyMode = () => setPrivacyMode(prev => !prev)

  // Formats "John Doe" into "Doe, J. (MRN: ...1234)" if Privacy Mode is active
  const formatPatientName = (name: string, patientId?: string) => {
    if (!name) return "Unknown Patient"
    
    if (!privacyMode) {
      return name
    }

    const parts = name.trim().split(" ")
    const lastName = parts.length > 1 ? parts[parts.length - 1] : name
    const firstName = parts.length > 1 ? parts[0] : ""
    
    const initial = firstName ? `${firstName.charAt(0)}.` : ""
    const privacyName = `${lastName}, ${initial}`.trim()
    
    if (patientId) {
      const shortId = patientId.substring(0, 4).toUpperCase()
      return `${privacyName} (MRN: ${shortId})`
    }
    
    return privacyName;
  }

  return (
    <PrivacyContext.Provider value={{ privacyMode, togglePrivacyMode, setPrivacyMode, formatPatientName }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider")
  }
  return context
}
