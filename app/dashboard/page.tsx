"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, AlertCircle, Users, ExternalLink } from "lucide-react"
import { usePrivacy } from "@/components/privacy-provider"
import Link from "next/link"

interface DashboardStats {
  totalPatients: number
  criticalCases: number
  recentPatients: number
  recentPatientsList: any[]
}

// Helper function to color coordinate the grid acuity
function getAcuityBadgeVariant(acuity: string | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (!acuity) return "default"
  const a = acuity.toLowerCase()
  if (a.includes("critical") || a.includes("severe")) return "destructive"
  if (a.includes("moderate")) return "secondary"
  if (a.includes("minor") || a.includes("low")) return "outline"
  return "default"
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { privacyMode, formatPatientName } = usePrivacy()

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Activity className="h-8 w-8 animate-pulse text-muted-foreground opacity-50" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col gap-4">
      {/* Top Dense KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className="rounded-sm border-l-4 border-l-blue-500 shadow-sm bg-card/50">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total System Patients</p>
              <h2 className="text-xl font-bold font-mono tracking-tight">{stats?.totalPatients || 0}</h2>
            </div>
            <Users className="h-5 w-5 text-muted-foreground opacity-30" />
          </CardContent>
        </Card>
        <Card className="rounded-sm border-l-4 border-l-red-500 shadow-sm bg-card/50">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Critical / Severe Admits</p>
              <h2 className="text-xl font-bold font-mono tracking-tight text-red-500">{stats?.criticalCases || 0}</h2>
            </div>
            <AlertCircle className="h-5 w-5 text-red-500 opacity-30" />
          </CardContent>
        </Card>
        <Card className="rounded-sm border-l-4 border-l-green-500 shadow-sm bg-card/50">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Recent Admits (24H)</p>
              <h2 className="text-xl font-bold font-mono tracking-tight">{stats?.recentPatients || 0}</h2>
            </div>
            <Clock className="h-5 w-5 text-green-500 opacity-30" />
          </CardContent>
        </Card>
      </div>

      {/* Main ePCR Data Grid */}
      <div className="flex-1 border rounded-md bg-card overflow-hidden flex flex-col shadow-sm">
        <div className="bg-muted/80 px-4 py-2 border-b flex justify-between items-center shrink-0">
          <h2 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">Active Dispatch Queue</h2>
          <Badge variant="outline" className="font-mono text-[10px] tabular-nums rounded-sm">
            {stats?.recentPatientsList?.length || 0} RECORDS
          </Badge>
        </div>
        
        <div className="overflow-auto flex-1 h-0">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-muted/30 sticky top-0 border-b backdrop-blur-sm shadow-sm z-10 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-bold tracking-wider w-20">Time</th>
                <th className="px-3 py-2 font-bold tracking-wider w-24">Unit / Inc #</th>
                <th className="px-3 py-2 font-bold tracking-wider">Patient (MRN)</th>
                <th className="px-3 py-2 font-bold tracking-wider text-center w-16">Age/Sex</th>
                <th className="px-3 py-2 font-bold tracking-wider w-24">Acuity</th>
                <th className="px-3 py-2 font-bold tracking-wider w-48">Chief Complaint</th>
                <th className="px-3 py-2 font-bold tracking-wider w-36">Vitals</th>
                <th className="px-3 py-2 font-bold tracking-wider text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats?.recentPatientsList?.map((p) => {
                const date = new Date(p.Time)
                const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
                
                return (
                <tr key={p.PatientID} className="hover:bg-muted/40 transition-colors group">
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{timeStr}</td>
                  <td className="px-3 py-2 font-mono text-[11px] font-medium">{p.IncidentNumber || "---"}</td>
                  <td className="px-3 py-2 font-semibold text-xs tracking-tight">
                    {formatPatientName(p.PatientName, p.PatientID)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-[11px] text-muted-foreground">
                    {privacyMode ? "**" : p.Age}/{p.Gender ? p.Gender.charAt(0).toUpperCase() : "U"}
                  </td>
                  <td className="px-3 py-2">
                    {p.Severity ? (
                      <Badge variant={getAcuityBadgeVariant(p.Severity)} className="text-[9px] h-4 rounded-sm px-1.5 py-0 uppercase tracking-tighter">
                        {p.Severity}
                      </Badge>
                    ) : <span className="text-muted-foreground text-xs">-</span>}
                  </td>
                  <td className="px-3 py-2 text-xs truncate max-w-[200px]" title={p.PrimaryComplaint}>
                    {p.PrimaryComplaint || "---"}
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] tracking-tight">
                    <span className="text-red-500 mr-2">HR:{p.HeartRate || "--"}</span>
                    <span className="text-primary">BP:{p.BloodPressure || "--/--"}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                      <Link href={`/dashboard/patient/${p.PatientID}`}>
                        Chart <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              )})}
              {!stats?.recentPatientsList?.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No active patients in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}