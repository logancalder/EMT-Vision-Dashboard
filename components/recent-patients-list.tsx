import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronDown, ChevronUp } from "lucide-react"

interface Patient {
  PatientID: string
  PatientName: string
  Age: string
  Gender: string
  Time: string
  InitialAcuity?: string
  FinalPatientAcuity?: string
}

interface RecentPatientsListProps {
  patients: Patient[]
  variant?: "sidebar" | "card"
  showDate?: boolean
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

export function RecentPatientsList({ patients, variant = "sidebar", showDate = true }: RecentPatientsListProps) {
  const pathname = usePathname()
  
  // Group patients by date and hour
  const groupPatientsByDateAndHour = (patients: Patient[]) => {
    const groups: { [key: string]: { [key: string]: Patient[] } } = {}

    patients.forEach((patient) => {
      const date = new Date(patient.Time)
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      })

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

  const groupedPatients = groupPatientsByDateAndHour(patients)
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className={variant === "card" ? "space-y-4" : "space-y-1"}>
      {Object.entries(groupedPatients).map(([date, hours]) => (
        <div key={date} className="space-y-2">
          {showDate && (
            <div className={`font-bold text-sm ${date === today ? "text-primary" : "text-muted-foreground"}`}>
              {date === today ? "Today" : date}
            </div>
          )}
          {Object.entries(hours).map(([hour, hourPatients]) => (
            <div key={hour} className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{hour}</span>
              </div>
              {hourPatients.map((patient) => (
                <Button
                  key={patient.PatientID}
                  asChild
                  variant={pathname === `/dashboard/patient/${patient.PatientID}` ? "secondary" : "ghost"}
                  className={`w-full justify-start h-auto py-2 px-3 ${variant === "card" ? "mb-2" : "mb-1"}`}
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
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
} 