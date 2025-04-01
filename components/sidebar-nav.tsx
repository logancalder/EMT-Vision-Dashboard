"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Activity, Calendar, Clock, Home, LogOut, Settings, User, Users, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  Severity?: string
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

// Helper function to format lists and capitalize
function formatList(list: string | null | undefined): string {
  if (!list) return "";
  
  try {
    // Check if it's a JSON array
    const parsed = JSON.parse(list);
    if (Array.isArray(parsed)) {
      return parsed
        .map(item => typeof item === 'string' ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item)
        .join(', ');
    }
  } catch (e) {
    // Not a JSON array, treat as string
  }
  
  // If it's a comma-separated string
  return list
    .split(',')
    .map(item => item.trim().charAt(0).toUpperCase() + item.trim().slice(1).toLowerCase())
    .join(', ');
}

export function SidebarNav() {
  const pathname = usePathname()
  const [patients, setPatients] = useState<Patient[]>([])
  const [openDates, setOpenDates] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClientComponentClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserProfile({
          name: session.user.user_metadata.full_name,
          organization: session.user.user_metadata.email,
          avatar: session.user.user_metadata.avatar_url
        })
      }
    }

    fetchUserProfile()
  }, [])

  // Helper function to format date and time
  const formatDateTime = (timeString: string) => {
    const date = new Date(timeString)
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
    return { formattedDate, formattedTime }
  }

  // Group patients by date and hour
  const groupPatientsByDateAndHour = (patients: Patient[]) => {
    const groups: { [key: string]: { [key: string]: Patient[] } } = {}

    patients.forEach((patient) => {
      const { formattedDate, formattedTime } = formatDateTime(patient.Time || new Date().toISOString())
      if (!groups[formattedDate]) {
        groups[formattedDate] = {}
      }
      if (!groups[formattedDate][formattedTime]) {
        groups[formattedDate][formattedTime] = []
      }
      groups[formattedDate][formattedTime].push(patient)
    })

    return groups
  }

  // Helper function to toggle date open/close
  const toggleDate = (date: string) => {
    setOpenDates((prev) => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    )
  }

  // Get today's date in the format used for grouping
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="w-64 bg-card border-r h-screen flex flex-col">
      {/* Logo and Header */}
      <div className="p-4 flex flex-col items-center">
        <Link href="/" className="flex items-center justify-center mb-2">
        <div className="relative w-10 h-10 mr-2">
      {/* Balance Scale SVG */}
      <svg viewBox="0 0 128 128" className="text-primary w-full h-full">
        <path
          transform="matrix(0.13470488,0,0,0.13470488,3874.9859,-1363.2471)"
          fill="currentColor"
          d="M-28134.268,10198.376c-9.904-0.278-20.645,1.116-32.361,4.885c-27.758,8.652-46.59,26.516-56.771,48.009
          c-9.764,20.934-13.111,68.803-13.111,68.803l-112.848,0.418c0,0-3.348-48.148-13.25-69.221
          c-9.904-21.493-28.875-39.775-56.494-48.009c-11.02-3.21-22.457-5.163-32.5-4.885c-29.57,0.697-311.477,65.313-314.824,70.896
          c-1.256,2.094,37.662,39.495,96.805,82.619l56.633-56.661l23.434,23.445l-52.588,52.614c17.855,12.002,36.826,24.144,56.771,35.867
          l56.074-56.104l23.436,23.446l-49.24,49.265c17.297,9.211,35.15,17.863,53.285,25.4l56.213-56.243l23.434,23.446l-45.752,43.848
          c52.17,17.725,105.035,13.005,152.461,13.005h45.195c44.914,0,94.154-4.492,143.252-21.379l-37.383-36.438l23.436-22.965
          l47.982,48.25c18.414-7.536,36.408-15.79,54.123-24.442l-41.848-41.808l23.434-23.416l49.24,49.28
          c20.504-11.164,40.033-22.74,58.445-34.185l-47.426-47.447l23.434-23.443l52.447,52.476
          c61.793-41.031,102.943-76.339,101.549-78.433C-27822.791,10263.689-28104.695,10199.073-28134.268,10198.376z
          M-28319.648,10488.487l4.498,565.808v0.419c0,4.744,3.027,8.513,7.77,8.513c4.604-0.14,7.49-4.048,7.49-8.513v-0.419
          l33.527-565.808H-28319.648z M-28293.006,10127.48c-34.453,0-62.49,27.074-62.49,61.545c0,22.19,11.717,36.919,29.293,47.805
          l1.953,68.459h62.49l1.953-68.459c17.574-10.886,29.291-25.019,29.291-47.349
          C-28230.516,10155.15-28258.553,10127.48-28293.006,10127.48z M-28320.205,10933.854c-7.812-2.372-14.506-5.304-20.086-8.932
          c-11.16-7.536-15.764-15.771-15.764-23.446s4.604-15.91,15.764-23.306c4.881-3.35,11.018-6.421,18.271-8.514
          c-0.418-13.956-0.836-27.912-1.256-42.007c-15.482-3.489-29.012-9.072-39.613-16.189c-16.879-11.583-24.83-25.261-24.83-39.217
          c0-13.677,7.951-27.632,24.83-39.216c10.043-6.698,22.318-12.142,36.406-15.491c-0.279-13.956-0.559-27.912-0.977-41.728
          c-23.852-4.467-44.914-12.979-60.957-24.144c-23.572-16.05-35.848-36.426-35.848-57.499c-0.279-38.658,26.084-31.4,52.867-39.355
          c12.553-3.769,22.875-8.653,30.686-16.189c3.906-3.768,8.51-8.933,8.789-17.724c-2.65-22.609-25.527-26.237-41.707-26.099
          c-7.254,0.279-13.252,1.257-15.484,1.396c-50.354,7.396-67.791,68.245-69.047,97.971c0,35.448,20.924,66.012,51.193,86.945
          c10.182,6.979,21.48,12.979,33.617,17.725c-2.791,1.535-5.58,3.35-8.23,5.163c-23.434,15.909-40.174,40.193-40.174,68.244
          c0,28.331,16.74,52.335,40.174,68.245c5.998,4.047,12.555,7.815,19.389,11.024c-16.6,11.724-28.316,29.448-28.316,49.963
          c0,21.911,13.391,40.333,31.246,52.057c11.576,7.815,25.107,13.117,40.172,16.188
          C-28319.508,10957.72-28319.926,10945.856-28320.205,10933.854z M-28370.002,10505.406c8.787,0,15.762,3.908,15.762,8.793
          c0,4.745-6.975,8.652-15.762,8.652c-8.789,0-15.764-3.907-15.764-8.652
          C-28385.766,10509.314-28378.791,10505.406-28370.002,10505.406z M-28127.852,10594.167c-1.256-29.726-18.691-90.714-69.047-97.971
          c-6.555-0.698-13.111-1.396-18.551-1.396c-15.902,0.279-35.988,4.886-38.639,26.099c0.418,8.791,4.881,13.956,8.787,17.724
          c7.951,7.536,18.133,12.421,30.688,16.189c26.781,7.955,53.285,0.697,52.865,39.355c0,21.073-12.273,41.449-35.848,57.499
          c-16.041,11.164-37.104,19.677-60.957,24.144c-0.418,13.815-0.836,27.771-1.254,41.728c13.809,3.35,21.131,8.513,30.756,15.073
          c17.016,11.164,20.711,24.98,20.711,38.657c0,0,0,0.14,0,0.419v0.558c0,13.956-2.998,27.634-19.875,39.217
          c-10.461,7.117-21.654,12.979-37.137,16.329c-0.42,13.955,0.609,27.911,0.191,41.867c6.695,2.093,8.828,4.885,13.709,8.094
          c11.438,7.397,12.594,15.492,12.594,23.028v0.697c0,7.676-0.014,15.91-11.172,23.446c-5.301,3.628-10.26,6.56-18.07,8.932
          c-0.279,12.002,0.658,23.865,0.24,35.867c14.926-3.071,22.855-8.373,34.154-16.188c17.715-11.444,25.365-29.588,25.365-50.939
          v-1.117c0,0,0-0.278,0-0.418v-1.257c0-19.817-5.926-36.844-21.828-48.288c6.975-3.209,9.713-6.978,15.852-11.024
          c23.293-15.91,36.494-39.774,36.494-67.407v-2.931c0-27.772-11.002-51.219-34.576-66.988c-2.371-1.396-1.246-2.931-3.617-4.188
          c12.414-4.884,25.111-10.885,35.154-17.863C-28150.592,10660.179-28127.852,10629.615-28127.852,10594.167z M-28210.848,10522.852
          c-8.787,0-15.762-3.907-15.762-8.652c0-4.885,6.975-8.793,15.762-8.793c8.789,0,15.762,3.908,15.762,8.793
          C-28195.086,10518.944-28202.059,10522.852-28210.848,10522.852z"
        />
      </svg>
      {/* End of Balance Scale SVG */}
    </div>
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
            {/* <Link href="/dashboard/analytics">
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </Link> */}
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Patients List */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Total Patients</h3>
          <Badge variant="outline" className="text-xs">
            {patients.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 space-y-1">
          {/* Today's patients section */}
          {Object.entries(groupPatientsByDateAndHour(patients))
            .filter(([date]) => date === today)
            .map(([date, hours]) => (
              <div key={date} className="mb-2">
                <div className="font-bold text-sm text-primary mb-1">Today</div>
                <div>
                  {Object.entries(hours).map(([hour, hourPatients]) => (
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
                                {(patient.InitialAcuity || patient.Severity) && (
                                  <Badge
                                    variant={getAcuityBadgeVariant(patient.Severity || patient.InitialAcuity)}
                                    className="ml-1 text-[10px] h-5"
                                  >
                                    {patient.Severity || patient.InitialAcuity}
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
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Other days patients section */}
          {Object.entries(groupPatientsByDateAndHour(patients))
            .filter(([date]) => date !== today)
            .map(([date, hours]) => (
              <div key={date} className="mb-2">
                <div className="flex items-center justify-between mb-1 cursor-pointer" onClick={() => toggleDate(date)}>
                  <span className="font-bold text-sm text-muted-foreground">{date}</span>
                  {openDates.includes(date) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {openDates.includes(date) && (
                  <div>
                    {Object.entries(hours).map(([hour, hourPatients]) => (
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
                                  {(patient.InitialAcuity || patient.Severity) && (
                                    <Badge
                                      variant={getAcuityBadgeVariant(patient.Severity || patient.InitialAcuity)}
                                      className="ml-1 text-[10px] h-5"
                                    >
                                      {patient.Severity || patient.InitialAcuity}
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
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t p-3">
        <div className="flex items-center space-x-3">
          {userProfile?.avatar ? (
            <img 
              src={userProfile.avatar} 
              alt="Profile" 
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{userProfile?.name || 'Loading...'}</p>
            <p className="text-xs text-muted-foreground">{userProfile?.organization || 'Loading...'}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive"
            onClick={async () => {
              const supabase = createClientComponentClient()
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

