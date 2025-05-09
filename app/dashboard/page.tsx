"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertCircle, Clock, User, Users2, Baby, User2, UserCog } from "lucide-react"
import { RecentPatientsList } from "@/components/recent-patients-list"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { formatMedicalCondition } from "@/utils/format"

interface DashboardStats {
  totalPatients: number
  criticalCases: number
  recentPatients: number
  recentPatientsList: any[]
  demographicStats?: {
    ageRanges: {
      pediatric: number // 0-17
      youngAdult: number // 18-39
      middleAge: number // 40-64
      senior: number // 65+
    }
    gender: {
      male: number
      female: number
      other: number
    }
    averageAge: number
  }
}

// Helper function to get acuity badge variant - matching sidebar
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

// Helper function to categorize age
function categorizeAge(age: string | undefined): string {
  if (!age) return "other"
  const ageNum = parseInt(age)
  if (isNaN(ageNum)) return "other"
  
  if (ageNum < 18) return "pediatric"
  if (ageNum < 40) return "youngAdult"
  if (ageNum < 65) return "middleAge"
  return "senior"
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        console.log('Dashboard received data:', data)
        
        // Calculate demographic stats
        const demographicStats = {
          ageRanges: {
            pediatric: 0,
            youngAdult: 0,
            middleAge: 0,
            senior: 0
          },
          gender: {
            male: 0,
            female: 0,
            other: 0
          },
          averageAge: 0
        }
        
        let totalAge = 0
        let validAgeCount = 0
        
        data.recentPatientsList?.forEach((patient: any) => {
          // Categorize age
          const ageCategory = categorizeAge(patient.Age)
          demographicStats.ageRanges[ageCategory as keyof typeof demographicStats.ageRanges]++
          
          // Calculate average age
          const ageNum = parseInt(patient.Age)
          if (!isNaN(ageNum)) {
            totalAge += ageNum
            validAgeCount++
          }
          
          // Count gender
          const gender = patient.Gender?.toLowerCase() || "other"
          if (gender === "male" || gender === "m") {
            demographicStats.gender.male++
          } else if (gender === "female" || gender === "f") {
            demographicStats.gender.female++
          } else {
            demographicStats.gender.other++
          }
        })
        
        demographicStats.averageAge = validAgeCount > 0 ? Math.round(totalAge / validAgeCount) : 0
        
        setStats({ ...data, demographicStats })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Poll for updates every 5 seconds to match sidebar
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  // Debug render
  console.log('Dashboard rendering with stats:', stats)

  const totalGenderCount = Object.values(stats?.demographicStats?.gender || {}).reduce((a, b) => a + b, 0)

  return (
    <div className="p-5 h-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      <div className="grid gap-6 h-[calc(100vh-8rem)]">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-tight">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-red-700">{stats?.criticalCases || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-tight">Patients Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stats?.recentPatients || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 h-[calc(100%-8rem)]">
          <Card className="col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold tracking-tight">Recent Patients</CardTitle>
              <CardDescription>Patients admitted in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full px-6">
                {stats?.recentPatientsList && stats.recentPatientsList.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentPatientsList.map((patient) => (
                      <div key={patient.PatientID} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{patient.PatientName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {patient.Age} years • {patient.Gender}
                          </p>
                        </div>
                        <Badge variant={getAcuityBadgeVariant(patient.Severity)}>
                          {formatMedicalCondition(patient.Severity)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No recent patients</div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold tracking-tight">Today's Demographics</CardTitle>
              <CardDescription>Patient age and gender distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Baby className="h-4 w-4 text-pink-500" />
                    <div>
                      <p className="text-sm font-medium">Pediatric (0-17)</p>
                      <p className="text-2xl font-bold">{stats?.demographicStats?.ageRanges.pediatric || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User2 className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Adult (18-64)</p>
                      <p className="text-2xl font-bold">
                        {(stats?.demographicStats?.ageRanges.youngAdult || 0) + 
                         (stats?.demographicStats?.ageRanges.middleAge || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCog className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Senior (65+)</p>
                      <p className="text-2xl font-bold">{stats?.demographicStats?.ageRanges.senior || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Avg. Age</p>
                      <p className="text-2xl font-bold">{stats?.demographicStats?.averageAge || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Gender Distribution</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Male</span>
                        <span>{stats?.demographicStats?.gender.male || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500 ease-out"
                          style={{ 
                            width: `${((stats?.demographicStats?.gender.male || 0) / totalGenderCount) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Female</span>
                        <span>{stats?.demographicStats?.gender.female || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500 transition-all duration-500 ease-out"
                          style={{ 
                            width: `${((stats?.demographicStats?.gender.female || 0) / totalGenderCount) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}