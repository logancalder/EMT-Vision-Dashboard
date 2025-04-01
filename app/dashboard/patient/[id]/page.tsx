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
} from "lucide-react"

interface Patient {
  PatientID: string
  PatientName: string
  Age: string
  Gender: string
  HomeAddress: string
  City: string
  County: string
  State: string
  ZIPCode: string
  WeightKg: string
  Race: string
  IncidentNumber: string
  ServiceRequested: string
  OtherAgencies: string
  PrimaryRole: string
  ResponseMode: string
  EMSShift: string
  DispatchCity: string
  DispatchState: string
  DispatchZIP: string
  DispatchCounty: string
  SceneType: string
  Category: string
  BackInService: string
  CrewMembers: string
  NumberOfCrew: string
  OtherAgencyOnScene: string
  NumberOfPatients: string
  PatientContactMade: string
  ArrivedOnScene: string
  FirstOnScene: string
  StagePriorToContact: string
  PrimaryComplaint: string
  Duration: string
  TimeUnits: string
  AlcoholDrugUse: string
  InitialAcuity: string
  CardiacArrest: string
  PossibleInjury: string
  BaseContactMade: string
  SignsOfAbuse: string
  "5150Hold": string
  PastMedicalHistory: string
  CurrentMedications: string
  MedicationAllergies: string
  AdvanceDirectives: string
  HeartRate: string
  BloodPressure: string
  RespiratoryRate: string
  SPO2: string
  Temperature: string
  Glucose: string
  GCS_Eye: string
  GCS_Verbal: string
  GCS_Motor: string
  GCS_Score: string
  GCS_Qualifier: string
  MentalStatus: string
  AbdomenExam: string
  ChestExam: string
  BackSpineExam: string
  SkinAssessment: string
  EyeExam_Bilateral: string
  EyeExam_Left: string
  EyeExam_Right: string
  LungExam: string
  ExtremitiesExam: string
  PrimaryImpression: string
  PrimarySymptom: string
  OtherSymptoms: string
  SymptomOnset: string
  TypeOfPatient: string
  MedTime: string
  MedCrewID: string
  Medication: string
  Dosage: string
  MedUnits: string
  Route: string
  MedResponse: string
  MedComplications: string
  ProcTime: string
  ProcCrewID: string
  Procedure: string
  ProcLocation: string
  IVLocation: string
  Size: string
  Attempts: string
  Successful: string
  ProcResponse: string
  PatientEvaluationCare: string
  CrewDisposition: string
  TransportDisposition: string
  LevelOfCareProvided: string
  TransferredCareAt: string
  Severity: string
  TurnaroundDelay: string
  TransportAgency: string
  TransportUnit: string
  LevelOfTransport: string
  EMSPrimaryCareProvider: string
  TransportReason: string
  CrewSignature: string
  CrewMember_PPE: string
  PPEUsed: string
  SuspectedExposure: string
  MonitorTime: string
  MonitorEventType: string
}

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

export default function PatientPage() {
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatient() {
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

    fetchPatient()
  }, [params.id])

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
            <h1 className="text-3xl font-bold">{patient.PatientName}</h1>
            <Badge variant={getAcuityBadgeVariant(patient.Severity || patient.InitialAcuity || "")}>
              {patient.Severity || patient.InitialAcuity || "Unknown Acuity"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {patient.Age} years • {patient.Gender} • Incident #{patient.IncidentNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" />
            Print Record
          </Button>
          <Button>
            <Clipboard className="mr-2 h-4 w-4" />
            Edit Record
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
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
                    <span className="font-semibold">{patient.HeartRate || "N/A"}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Blood Pressure</span>
                    </div>
                    <span className="font-semibold">{patient.BloodPressure || "N/A"}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Lungs className="h-5 w-5 mr-2 text-green-500" />
                      <span>Respiratory Rate</span>
                    </div>
                    <span className="font-semibold">{patient.RespiratoryRate || "N/A"}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2 text-purple-500" />
                      <span>SPO2</span>
                    </div>
                    <span className="font-semibold">{patient.SPO2 || "N/A"}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                      <span>Temperature</span>
                    </div>
                    <span className="font-semibold">{patient.Temperature || "N/A"}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>Glucose</span>
                    </div>
                    <span className="font-semibold">{patient.Glucose || "N/A"}</span>
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
                        <span className="font-medium">{patient.Age || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gender</span>
                        <span className="font-medium">{patient.Gender || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Race</span>
                        <span className="font-medium">{patient.Race || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight</span>
                        <span className="font-medium">{patient.WeightKg ? `${patient.WeightKg} kg` : "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Home className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{patient.HomeAddress || "No address on file"}</p>
                          {patient.City && patient.State && patient.ZIPCode && (
                            <p>
                              {patient.City}, {patient.State} {patient.ZIPCode}
                            </p>
                          )}
                          {patient.County && <p>County: {patient.County}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Medical History</h3>
                    <div className="space-y-3 mt-2">
                      <div>
                        <p className="font-medium">Past Medical History</p>
                        <p className="text-sm">{formatList(patient.PastMedicalHistory) || "None recorded"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Current Medications</p>
                        <p className="text-sm">{formatList(patient.CurrentMedications) || "None recorded"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Allergies</p>
                        <p className="text-sm">{formatList(patient.MedicationAllergies) || "None recorded"}</p>
                      </div>
                      <div>
                        <p className="font-medium">Advance Directives</p>
                        <p className="text-sm">{patient.AdvanceDirectives || "None recorded"}</p>
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
              <CardTitle className="text-lg flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                Primary Complaint & Impression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Primary Complaint</h3>
                  <p className="text-lg font-medium">{patient.PrimaryComplaint || "Not specified"}</p>
                  {patient.Duration && patient.TimeUnits && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Duration: {patient.Duration} {patient.TimeUnits}
                    </p>
                  )}
                  {patient.PrimarySymptom && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Primary Symptom</h4>
                      <p>{patient.PrimarySymptom}</p>
                    </div>
                  )}
                  {patient.OtherSymptoms && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Other Symptoms</h4>
                      <p>{patient.OtherSymptoms}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Primary Impression</h3>
                  <p className="text-lg font-medium">{patient.PrimaryImpression || "Not specified"}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-sm font-medium">Current Acuity</h4>
                      <Badge variant={getAcuityBadgeVariant(patient.Severity || "")}>
                        {patient.Severity || "Not recorded"}
                      </Badge>
                    </div>
                    {patient.CardiacArrest && (
                      <div>
                        <h4 className="text-sm font-medium">Cardiac Arrest</h4>
                        <p>{patient.CardiacArrest}</p>
                      </div>
                    )}
                    {patient.PossibleInjury && (
                      <div>
                        <h4 className="text-sm font-medium">Possible Injury</h4>
                        <p>{patient.PossibleInjury}</p>
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
                  <p className="text-2xl font-bold mt-2">{patient.GCS_Eye || "N/A"}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Verbal</h3>
                  <p className="text-2xl font-bold mt-2">{patient.GCS_Verbal || "N/A"}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Motor</h3>
                  <p className="text-2xl font-bold mt-2">{patient.GCS_Motor || "N/A"}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-primary">Total Score</h3>
                  <p className="text-2xl font-bold mt-2">{patient.GCS_Score || "N/A"}</p>
                  {patient.GCS_Qualifier && <p className="text-xs mt-2">{patient.GCS_Qualifier}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Examination */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                Physical Examination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mental Status</h3>
                    <p className="font-medium mt-1">{patient.MentalStatus || "Not assessed"}</p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Chest Exam</h3>
                    <p className="font-medium mt-1">{patient.ChestExam || "Not assessed"}</p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Abdomen Exam</h3>
                    <p className="font-medium mt-1">{patient.AbdomenExam || "Not assessed"}</p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Lung Exam</h3>
                    <p className="font-medium mt-1">{patient.LungExam || "Not assessed"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Skin Assessment</h3>
                    <p className="font-medium mt-1">{patient.SkinAssessment || "Not assessed"}</p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Back/Spine Exam</h3>
                    <p className="font-medium mt-1">{patient.BackSpineExam || "Not assessed"}</p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Extremities Exam</h3>
                    <p className="font-medium mt-1">{patient.ExtremitiesExam || "Not assessed"}</p>
                  </div>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Eye Exam</h3>
                    <p className="font-medium mt-1">
                      {patient.EyeExam_Bilateral ||
                        (patient.EyeExam_Left && patient.EyeExam_Right
                          ? `Left: ${patient.EyeExam_Left}, Right: ${patient.EyeExam_Right}`
                          : "Not assessed")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          {/* Medication */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Pill className="mr-2 h-5 w-5 text-primary" />
                Medication
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.Medication ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Medication</h3>
                      <p className="font-medium mt-1">{patient.Medication}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Dosage</h3>
                      <p className="font-medium mt-1">
                        {patient.Dosage} {patient.MedUnits}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Route</h3>
                      <p className="font-medium mt-1">{patient.Route || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                      <p className="font-medium mt-1">{patient.MedTime || "Not recorded"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Response</h3>
                      <p className="font-medium mt-1">{patient.MedResponse || "Not recorded"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Complications</h3>
                      <p className="font-medium mt-1">{patient.MedComplications || "None"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Pill className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No medications administered</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                      <p className="font-medium mt-1">{patient.Procedure}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                      <p className="font-medium mt-1">{patient.ProcLocation || "Not specified"}</p>
                      {patient.IVLocation && <p className="text-sm">IV Location: {patient.IVLocation}</p>}
                    </div>

                    {patient.Size && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Size</h3>
                        <p className="font-medium mt-1">{patient.Size}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                      <p className="font-medium mt-1">{patient.ProcTime || "Not recorded"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Attempts/Success</h3>
                      <p className="font-medium mt-1">
                        {patient.Attempts ? `${patient.Attempts} attempts` : "Not recorded"}
                        {patient.Successful && ` • ${patient.Successful}`}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Response</h3>
                      <p className="font-medium mt-1">{patient.ProcResponse || "Not recorded"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
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
                    <p className="font-medium mt-1">{patient.TransportDisposition || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Level of Care</h3>
                    <p className="font-medium mt-1">{patient.LevelOfCareProvided || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Transport Agency/Unit</h3>
                    <p className="font-medium mt-1">
                      {patient.TransportAgency || "Not recorded"}
                      {patient.TransportUnit && ` • Unit: ${patient.TransportUnit}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Final Patient Acuity</h3>
                    <p className="font-medium mt-1">
                      <Badge variant={getAcuityBadgeVariant(patient.Severity || "")}>
                        {patient.Severity || "Not recorded"}
                      </Badge>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Primary Care Provider</h3>
                    <p className="font-medium mt-1">{patient.EMSPrimaryCareProvider || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Transport Reason</h3>
                    <p className="font-medium mt-1">{patient.TransportReason || "Not recorded"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <p className="font-medium mt-1">{patient.IncidentNumber || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Service Requested</h3>
                    <p className="font-medium mt-1">{patient.ServiceRequested || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Primary Role</h3>
                    <p className="font-medium mt-1">{patient.PrimaryRole || "Not recorded"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Response Mode</h3>
                    <p className="font-medium mt-1">{patient.ResponseMode || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">EMS Shift</h3>
                    <p className="font-medium mt-1">{patient.EMSShift || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Scene Type</h3>
                    <p className="font-medium mt-1">{patient.SceneType || "Not recorded"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className="font-medium mt-1">{patient.Category || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Back In Service</h3>
                    <p className="font-medium mt-1">{patient.BackInService || "Not recorded"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Crew Members</h3>
                    <p className="font-medium mt-1">{patient.CrewMembers || "Not recorded"}</p>
                    {patient.NumberOfCrew && <p className="text-sm">Number: {patient.NumberOfCrew}</p>}
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
                        <span className="font-medium">City:</span> {patient.DispatchCity}
                      </p>
                    )}
                    {patient.DispatchState && (
                      <p>
                        <span className="font-medium">State:</span> {patient.DispatchState}
                      </p>
                    )}
                    {patient.DispatchZIP && (
                      <p>
                        <span className="font-medium">ZIP:</span> {patient.DispatchZIP}
                      </p>
                    )}
                    {patient.DispatchCounty && (
                      <p>
                        <span className="font-medium">County:</span> {patient.DispatchCounty}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Timing Information</h3>
                  <div className="space-y-2">
                    {patient.ArrivedOnScene && (
                      <p>
                        <span className="font-medium">Arrived On Scene:</span> {patient.ArrivedOnScene}
                      </p>
                    )}
                    {patient.FirstOnScene && (
                      <p>
                        <span className="font-medium">First On Scene:</span> {patient.FirstOnScene}
                      </p>
                    )}
                    {patient.PatientContactMade && (
                      <p>
                        <span className="font-medium">Patient Contact Made:</span> {patient.PatientContactMade}
                      </p>
                    )}
                    {patient.StagePriorToContact && (
                      <p>
                        <span className="font-medium">Stage Prior To Contact:</span> {patient.StagePriorToContact}
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
              <CardTitle className="text-lg flex items-center">
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
                      <p className="font-medium mt-1">{patient.OtherAgencies}</p>
                    </div>
                  )}

                  {patient.OtherAgencyOnScene && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Other Agency On Scene</h3>
                      <p className="font-medium mt-1">{patient.OtherAgencyOnScene}</p>
                    </div>
                  )}

                  {patient.NumberOfPatients && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Number Of Patients</h3>
                      <p className="font-medium mt-1">{patient.NumberOfPatients}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {patient.AlcoholDrugUse && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Alcohol/Drug Use</h3>
                      <p className="font-medium mt-1">{patient.AlcoholDrugUse}</p>
                    </div>
                  )}

                  {patient.SignsOfAbuse && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Signs Of Abuse</h3>
                      <p className="font-medium mt-1">{patient.SignsOfAbuse}</p>
                    </div>
                  )}

                  {patient["5150Hold"] && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">5150 Hold</h3>
                      <p className="font-medium mt-1">{patient["5150Hold"]}</p>
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

