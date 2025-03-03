"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Activity, Calendar, Clock, Home, LogOut, Settings, User, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Patient {
  PatientID: string
  PatientName: string
  Age: string
  Gender: string
  HomeAddress: string
  City: string
  Country: string
  State: string
  ZIPCode: string
  Time: string
  InitialAcuity?: string
  FinalPatientAcuity?: string
}

// Helper function to get acuity badge variant
function getAcuityBadgeVariant(acuity: string | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (!acuity) return "default"
  const acuityLower = acuity.toLowerCase()
  if (acuityLower.includes("critical") || acuityLower.includes("severe")) {
    return "destructive"
  } else if (acuityLower.includes("moderate")) {
    return "secondary"
  } else if (acuityLower.includes("minor") || acuityLower.includes("low")) {
    return "outline"
  }
  return "default"
}

export function SidebarNav() {
  const pathname = usePathname()
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch patients")
        }

        setPatients(data)
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }

    fetchPatients()

    // Set up polling instead of real-time subscription
    const pollInterval = setInterval(fetchPatients, 5000) // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
  }

<<<<<<< HEAD
  // Group patients by hour
  const groupPatientsByHour = (patients: Patient[]) => {
    const groups: { [key: string]: Patient[] } = {}
=======
  // Group patients by date and hour
  const groupPatientsByDateAndHour = (patients: Patient[]) => {
    const groups: { [key: string]: { [key: string]: Patient[] } } = {};
    
    patients.forEach(patient => {
      const date = new Date(patient.Time);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toLocaleDateString('en-US'); // Get the date string
      const hour = formatTime(patient.Time);
      const dateKey = `${day}, ${dateString}`; // Combine abbreviated day and date

      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }
      if (!groups[dateKey][hour]) {
        groups[dateKey][hour] = [];
      }
      groups[dateKey][hour].push(patient);
    });
>>>>>>> 9323d6a1f59191b9d3d5682b82780286bed30233

    patients.forEach((patient) => {
      const hour = formatTime(patient.Time || new Date().toISOString())
      if (!groups[hour]) {
        groups[hour] = []
      }
      groups[hour].push(patient)
    })

    return groups
  }

  return (
    <div className="w-64 bg-card border-r h-screen flex flex-col">
      {/* Logo and Header */}
      <div className="p-4 flex flex-col items-center">
        <Link href="/" className="flex items-center justify-center mb-2">
          {/* Logo */}
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary">EMT Vision</span>
            <span className="text-xs text-muted-foreground">Healthcare Dashboard</span>
          </div>
        </Link>
        <Separator className="my-2" />
      </div>

      {/* Navigation */}
      <div className="px-3 py-2">
        <div className="space-y-1">
<<<<<<< HEAD
          <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={pathname === "/dashboard/analytics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/analytics">
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Patients List */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Recent Patients</h3>
          <Badge variant="outline" className="text-xs">
            {patients.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 space-y-1">
          {Object.entries(groupPatientsByHour(patients)).map(([hour, hourPatients]) => (
            <div key={hour} className="mb-2">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>{hour}</span>
              </div>
              {hourPatients.map((patient) => (
                <Button
                  key={patient.PatientID}
                  asChild
                  variant={pathname === `/dashboard/patient/${patient.PatientID}` ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto py-2 px-3 mb-1"
                  size="sm"
                >
                  <Link href={`/dashboard/patient/${patient.PatientID}`}>
                    <div className="flex flex-col items-start text-left w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium truncate">{patient.PatientName}</span>
                        {(patient.InitialAcuity || patient.FinalPatientAcuity) && (
                          <Badge
                            variant={getAcuityBadgeVariant(patient.FinalPatientAcuity || patient.InitialAcuity)}
                            className="ml-1 text-[10px] h-5"
                          >
                            {patient.FinalPatientAcuity || patient.InitialAcuity}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{patient.Age} yrs</span>
                        {patient.Gender && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{patient.Gender}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </Button>
=======
          {Object.entries(groupPatientsByDateAndHour(patients)).map(([dateKey, hours]) => (
            <div key={dateKey}>
              <div className="font-bold text-lg">{dateKey}</div>
              {Object.entries(hours).map(([hour, hourPatients]) => (
                <div key={hour}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 border-t">
                    {hour}
                  </div>
                  {hourPatients.map((patient) => (
                    <Button
                      key={patient.PatientID}
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-col items-start h-auto py-2",
                        pathname === `/dashboard/patient/${patient.PatientID}` && "bg-accent"
                      )}
                    >
                      <Link href={`/dashboard/patient/${patient.PatientID}`}>
                        <div className="font-medium">{patient.PatientName}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {patient.PatientID}</div>
                      </Link>
                    </Button>
                  ))}
                </div>
>>>>>>> 9323d6a1f59191b9d3d5682b82780286bed30233
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t p-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Dr. John Smith</p>
            <p className="text-xs text-muted-foreground">Emergency Medicine</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

