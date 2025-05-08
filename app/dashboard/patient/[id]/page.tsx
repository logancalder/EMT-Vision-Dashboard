"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  AlertCircle,
  Clipboard,
  FileText,
  Heart,
  Home,
  Info,
  Pill,
  User,
  Stethoscope,
  Thermometer,
  Droplets,
  TreesIcon as Lungs,
  Brain,
  Ambulance,
  Pencil,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { generatePatientPDF } from "@/utils/pdf-generator"
import { PatientEditModal } from "@/components/patient-edit-modal"
import { MedicationHistory } from "@/components/medication-history"
import { Patient } from "@/types/patient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatValue, formatList, formatName, formatAddress, formatMedicalCondition, formatMedicalConditions } from "@/utils/format"

// Helper function to get acuity badge color
function getAcuityBadgeVariant(acuity: string): "default" | "secondary" | "destructive" | "outline" {
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

// Add this helper function at the top level
function MissingField({ value, children }: { value: any, children: React.ReactNode }) {
  return (
    <span className={!value ? 'text-destructive' : ''}>
      {children}
    </span>
  )
}

export default function PatientPage() {
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Function to fetch patient data
  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patient?id=${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch patients")
      }

      setPatient(data.length > 0 ? data[0] : null)
    } catch (err) {
      console.error("Caught error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchPatient()

    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(fetchPatient, 5000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [params.id])

  const handlePatientUpdated = (updatedPatient: Patient) => {
    setPatient(updatedPatient)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "severe":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "mild":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "discharged":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "severe":
        return <Activity className="h-4 w-4" />
      case "moderate":
        return <Heart className="h-4 w-4" />
      case "mild":
        return <CheckCircle2 className="h-4 w-4" />
      case "discharged":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading patient information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10 mx-auto max-w-3xl mt-8">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Patient Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/dashboard'}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!patient) {
    return (
      <Card className="border-muted bg-muted/10 mx-auto max-w-3xl mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            Patient Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested patient record could not be found.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{formatName(patient.PatientName)}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {formatValue(patient.Age)} years • {formatValue(patient.Gender)} • Incident #{formatValue(patient.IncidentNumber)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => patient && generatePatientPDF(patient)}>
            <FileText className="mr-2 h-4 w-4" />
            Print Record
          </Button>
          <Button onClick={() => setEditModalOpen(true)}>
            <Clipboard className="mr-2 h-4 w-4" />
            Edit Record
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      {patient && (
        <PatientEditModal
          patient={patient}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onPatientUpdated={handlePatientUpdated}
        />
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="incident">Incident Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vital Signs Card */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-500" />
                      <span>Heart Rate</span>
                    </div>
                    <span className="font-semibold">{formatValue(patient.HeartRate)}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Blood Pressure</span>
                    </div>
                    <span className="font-semibold">{formatValue(patient.BloodPressure)}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Lungs className="h-5 w-5 mr-2 text-green-500" />
                      <span>Respiratory Rate</span>
                    </div>
                    <span className="font-semibold">{formatValue(patient.RespiratoryRate)}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2 text-purple-500" />
                      <span>SPO2</span>
                    </div>
                    <span className="font-semibold">{formatValue(patient.SPO2)}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                      <span>Temperature</span>
                    </div>
                    <span className="font-semibold">{formatValue(patient.Temperature)}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>Glucose</span>
                    </div>
                    <span className="font-semibold">{formatValue(patient.Glucose)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information Card */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Demographics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Age</span>
                        <span className={`font-medium ${!patient.Age ? 'text-destructive' : ''}`}>{formatValue(patient.Age)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gender</span>
                        <span className={`font-medium ${!patient.Gender ? 'text-destructive' : ''}`}>{formatValue(patient.Gender)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Race</span>
                        <span className={`font-medium ${!patient.Race ? 'text-destructive' : ''}`}>{formatValue(patient.Race)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight</span>
                        <span className={`font-medium ${!patient.WeightKg ? 'text-destructive' : ''}`}>{patient.WeightKg ? `${formatValue(patient.WeightKg)} kg` : "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Home className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className={`font-medium ${!patient.HomeAddress ? 'text-destructive' : ''}`}>{formatAddress(patient.HomeAddress)}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">City:</span>
                              <span className={`ml-2 ${!patient.City ? 'text-destructive' : ''}`}>{formatValue(patient.City)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">State:</span>
                              <span className={`ml-2 ${!patient.State ? 'text-destructive' : ''}`}>{formatValue(patient.State)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">ZIP:</span>
                              <span className={`ml-2 ${!patient.ZIPCode ? 'text-destructive' : ''}`}>{formatValue(patient.ZIPCode)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">County:</span>
                              <span className={`ml-2 ${!patient.County ? 'text-destructive' : ''}`}>{formatValue(patient.County)}</span>
                            </div>
                          </div>
                          {patient.ContactInfo && (
                            <div className="mt-2">
                              <span className="text-muted-foreground">Contact:</span>
                              <span className={`ml-2 ${!patient.ContactInfo ? 'text-destructive' : ''}`}>{formatValue(patient.ContactInfo)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Medical History</h3>
                    <div className="space-y-3 mt-2">
                      <div>
                        <p className="font-medium">Past Medical History</p>
                        <p className="text-sm">{formatMedicalConditions(patient.PastMedicalHistory)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Current Medications</p>
                        <p className="text-sm">{formatMedicalConditions(patient.CurrentMedications)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Allergies</p>
                        <p className="text-sm">{formatMedicalConditions(patient.MedicationAllergies)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Advance Directives</p>
                        <p className="text-sm">{formatMedicalCondition(patient.AdvanceDirectives)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Primary Complaint & Impression */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                Primary Complaint & Impression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Primary Complaint</h3>
                  <p className="text-lg font-medium">{formatMedicalCondition(patient.PrimaryComplaint)}</p>
                  {patient.Duration && patient.TimeUnits && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Duration: {formatValue(patient.Duration)} {formatValue(patient.TimeUnits)}
                    </p>
                  )}
                  {patient.PrimarySymptom && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Primary Symptom</h4>
                      <p>{formatMedicalCondition(patient.PrimarySymptom)}</p>
                    </div>
                  )}
                  {patient.OtherSymptoms && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Other Symptoms</h4>
                      <p>{formatMedicalConditions(patient.OtherSymptoms)}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Primary Impression</h3>
                  <p className="text-lg font-medium">{formatMedicalCondition(patient.PrimaryImpression)}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-sm font-medium">Current Acuity</h4>
                      <Badge variant={getAcuityBadgeVariant(patient.Severity || "")}>
                        {formatMedicalCondition(patient.Severity)}
                      </Badge>
                    </div>
                    {patient.CardiacArrest && (
                      <div>
                        <h4 className="text-sm font-medium">Cardiac Arrest</h4>
                        <p>{formatMedicalCondition(patient.CardiacArrest)}</p>
                      </div>
                    )}
                    {patient.PossibleInjury && (
                      <div>
                        <h4 className="text-sm font-medium">Possible Injury</h4>
                        <p>{formatMedicalCondition(patient.PossibleInjury)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          {/* GCS Assessment */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Glasgow Coma Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Eye</h3>
                  <p className={`text-2xl font-bold mt-2 ${!patient.GCS_Eye ? 'text-destructive' : ''}`}>
                    {patient.GCS_Eye || "N/A"}
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Verbal</h3>
                  <p className={`text-2xl font-bold mt-2 ${!patient.GCS_Verbal ? 'text-destructive' : ''}`}>
                    {patient.GCS_Verbal || "N/A"}
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Motor</h3>
                  <p className={`text-2xl font-bold mt-2 ${!patient.GCS_Motor ? 'text-destructive' : ''}`}>
                    {patient.GCS_Motor || "N/A"}
                  </p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-primary">Total Score</h3>
                  <p className={`text-2xl font-bold mt-2 ${!patient.GCS_Score ? 'text-destructive' : ''}`}>
                    {patient.GCS_Score || "N/A"}
                  </p>
                  {patient.GCS_Qualifier && <p className="text-xs mt-2">{patient.GCS_Qualifier}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Examination */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                Physical Examination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mental Status</h3>
                    <p className={`font-medium mt-1 ${!patient.MentalStatus ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.MentalStatus)}
                    </p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Chest Exam</h3>
                    <p className={`font-medium mt-1 ${!patient.ChestExam ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.ChestExam)}
                    </p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Abdomen Exam</h3>
                    <p className={`font-medium mt-1 ${!patient.AbdomenExam ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.AbdomenExam)}
                    </p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Lung Exam</h3>
                    <p className={`font-medium mt-1 ${!patient.LungExam ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.LungExam)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Skin Assessment</h3>
                    <p className={`font-medium mt-1 ${!patient.SkinAssessment ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.SkinAssessment)}
                    </p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Back/Spine Exam</h3>
                    <p className={`font-medium mt-1 ${!patient.BackSpineExam ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.BackSpineExam)}
                    </p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Extremities Exam</h3>
                    <p className={`font-medium mt-1 ${!patient.ExtremitiesExam ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.ExtremitiesExam)}
                    </p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Eye Exam</h3>
                    <p className={`font-medium mt-1 ${!patient.EyeExam_Bilateral && !patient.EyeExam_Left && !patient.EyeExam_Right ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.EyeExam_Bilateral) ||
                        (patient.EyeExam_Left && patient.EyeExam_Right
                          ? `Left: ${formatMedicalCondition(patient.EyeExam_Left)}, Right: ${formatMedicalCondition(patient.EyeExam_Right)}`
                          : "Not assessed")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          {/* Procedures */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                Procedures
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.Procedure ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Procedure</h3>
                      <p className={`font-medium mt-1 ${!patient.Procedure ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient.Procedure)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <p className={`font-medium mt-1 ${!patient.ProcLocation ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient.ProcLocation)}
                      </p>
                      {patient.IVLocation && (
                        <p className={`text-sm ${!patient.IVLocation ? 'text-destructive' : ''}`}>
                          IV Location: {formatMedicalCondition(patient.IVLocation)}
                        </p>
                      )}
                    </div>

                    {patient.Size && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                        <p className={`font-medium mt-1 ${!patient.Size ? 'text-destructive' : ''}`}>
                          {formatValue(patient.Size)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                      <p className={`font-medium mt-1 ${!patient.ProcTime ? 'text-destructive' : ''}`}>
                        {patient.ProcTime || "Not recorded"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Attempts/Success</h3>
                      <p className={`font-medium mt-1 ${!patient.Attempts && !patient.Successful ? 'text-destructive' : ''}`}>
                        {patient.Attempts ? `${patient.Attempts} attempts` : "Not recorded"}
                        {patient.Successful && ` • ${patient.Successful}`}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Response</h3>
                      <p className={`font-medium mt-1 ${!patient.ProcResponse ? 'text-destructive' : ''}`}>
                        {patient.ProcResponse || "Not recorded"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-destructive">
                  <Stethoscope className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No procedures performed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disposition */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Ambulance className="mr-2 h-5 w-5 text-primary" />
                Disposition & Transport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Transport Disposition</h3>
                    <p className={`font-medium mt-1 ${!patient.TransportDisposition ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.TransportDisposition)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Level of Care</h3>
                    <p className={`font-medium mt-1 ${!patient.LevelOfCareProvided ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.LevelOfCareProvided)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Transport Agency/Unit</h3>
                    <p className={`font-medium mt-1 ${!patient.TransportAgency && !patient.TransportUnit ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.TransportAgency)}
                      {patient.TransportUnit && ` • Unit: ${formatValue(patient.TransportUnit)}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Final Patient Acuity</h3>
                    <p className="font-medium mt-1">
                      <Badge variant={getAcuityBadgeVariant(patient.Severity || "")}>
                        {formatMedicalCondition(patient.Severity)}
                      </Badge>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Primary Care Provider</h3>
                    <p className={`font-medium mt-1 ${!patient.EMSPrimaryCareProvider ? 'text-destructive' : ''}`}>
                      {formatName(patient.EMSPrimaryCareProvider)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Transport Reason</h3>
                    <p className={`font-medium mt-1 ${!patient.TransportReason ? 'text-destructive' : ''}`}>
                      {formatMedicalCondition(patient.TransportReason)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationHistory patientId={patient.PatientID} />
        </TabsContent>

        <TabsContent value="incident" className="space-y-6">
          {/* Incident Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                Incident Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Incident Number</h3>
                    <p className={`font-medium mt-1 ${!patient.IncidentNumber ? 'text-destructive' : ''}`}>
                      {patient.IncidentNumber || "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Service Requested</h3>
                    <p className={`font-medium mt-1 ${!patient.ServiceRequested ? 'text-destructive' : ''}`}>
                      {patient.ServiceRequested || "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Primary Role</h3>
                    <p className={`font-medium mt-1 ${!patient.PrimaryRole ? 'text-destructive' : ''}`}>
                      {patient.PrimaryRole || "Not recorded"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Response Mode</h3>
                    <p className={`font-medium mt-1 ${!patient.ResponseMode ? 'text-destructive' : ''}`}>
                      {patient.ResponseMode || "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">EMS Shift</h3>
                    <p className={`font-medium mt-1 ${!patient.EMSShift ? 'text-destructive' : ''}`}>
                      {patient.EMSShift || "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Scene Type</h3>
                    <p className={`font-medium mt-1 ${!patient.SceneType ? 'text-destructive' : ''}`}>
                      {patient.SceneType || "Not recorded"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className={`font-medium mt-1 ${!patient.Category ? 'text-destructive' : ''}`}>
                      {patient.Category || "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Back In Service</h3>
                    <p className={`font-medium mt-1 ${!patient.BackInService ? 'text-destructive' : ''}`}>
                      {patient.BackInService || "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Crew Members</h3>
                    <p className={`font-medium mt-1 ${!patient.CrewMembers ? 'text-destructive' : ''}`}>
                      {patient.CrewMembers || "Not recorded"}
                    </p>
                    {patient.NumberOfCrew && (
                      <p className={`text-sm ${!patient.NumberOfCrew ? 'text-destructive' : ''}`}>
                        Number: {patient.NumberOfCrew}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Home className="mr-2 h-5 w-5 text-primary" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Dispatch Location</h3>
                  <div className="space-y-2">
                    {patient.DispatchCity && (
                      <p>
                        <span className="font-medium">City:</span>{" "}
                        <span className={!patient.DispatchCity ? 'text-destructive' : ''}>
                          {formatValue(patient.DispatchCity)}
                        </span>
                      </p>
                    )}
                    {patient.DispatchState && (
                      <p>
                        <span className="font-medium">State:</span>{" "}
                        <span className={!patient.DispatchState ? 'text-destructive' : ''}>
                          {formatValue(patient.DispatchState)}
                        </span>
                      </p>
                    )}
                    {patient.DispatchZIP && (
                      <p>
                        <span className="font-medium">ZIP:</span>{" "}
                        <span className={!patient.DispatchZIP ? 'text-destructive' : ''}>
                          {formatValue(patient.DispatchZIP)}
                        </span>
                      </p>
                    )}
                    {patient.DispatchCounty && (
                      <p>
                        <span className="font-medium">County:</span>{" "}
                        <span className={!patient.DispatchCounty ? 'text-destructive' : ''}>
                          {formatValue(patient.DispatchCounty)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Timing Information</h3>
                  <div className="space-y-2">
                    {patient.ArrivedOnScene && (
                      <p>
                        <span className="font-medium">Arrived On Scene:</span>{" "}
                        <span className={!patient.ArrivedOnScene ? 'text-destructive' : ''}>
                          {patient.ArrivedOnScene}
                        </span>
                      </p>
                    )}
                    {patient.FirstOnScene && (
                      <p>
                        <span className="font-medium">First On Scene:</span>{" "}
                        <span className={!patient.FirstOnScene ? 'text-destructive' : ''}>
                          {patient.FirstOnScene}
                        </span>
                      </p>
                    )}
                    {patient.PatientContactMade && (
                      <p>
                        <span className="font-medium">Patient Contact Made:</span>{" "}
                        <span className={!patient.PatientContactMade ? 'text-destructive' : ''}>
                          {patient.PatientContactMade}
                        </span>
                      </p>
                    )}
                    {patient.StagePriorToContact && (
                      <p>
                        <span className="font-medium">Stage Prior To Contact:</span>{" "}
                        <span className={!patient.StagePriorToContact ? 'text-destructive' : ''}>
                          {patient.StagePriorToContact}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold tracking-tight flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {patient.OtherAgencies && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Other Agencies</h3>
                      <p className={`font-medium mt-1 ${!patient.OtherAgencies ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient.OtherAgencies)}
                      </p>
                    </div>
                  )}

                  {patient.OtherAgencyOnScene && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Other Agency On Scene</h3>
                      <p className={`font-medium mt-1 ${!patient.OtherAgencyOnScene ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient.OtherAgencyOnScene)}
                      </p>
                    </div>
                  )}

                  {patient.NumberOfPatients && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Number Of Patients</h3>
                      <p className={`font-medium mt-1 ${!patient.NumberOfPatients ? 'text-destructive' : ''}`}>
                        {formatValue(patient.NumberOfPatients)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {patient.AlcoholDrugUse && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Alcohol/Drug Use</h3>
                      <p className={`font-medium mt-1 ${!patient.AlcoholDrugUse ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient.AlcoholDrugUse)}
                      </p>
                    </div>
                  )}

                  {patient.SignsOfAbuse && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Signs Of Abuse</h3>
                      <p className={`font-medium mt-1 ${!patient.SignsOfAbuse ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient.SignsOfAbuse)}
                      </p>
                    </div>
                  )}

                  {patient["5150Hold"] && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">5150 Hold</h3>
                      <p className={`font-medium mt-1 ${!patient["5150Hold"] ? 'text-destructive' : ''}`}>
                        {formatMedicalCondition(patient["5150Hold"])}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

