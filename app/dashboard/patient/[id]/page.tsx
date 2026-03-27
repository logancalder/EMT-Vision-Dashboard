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
import { generatePatientPDF } from "@/utils/pdf-generator"

import { MedicationHistory } from "@/components/medication-history"
import { usePrivacy } from "@/components/privacy-provider"
import { Patient } from "@/types/patient"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, X } from "lucide-react"

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


const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const EditableField = ({ isEditing, value, onChange, placeholder = "--", className = "", type = "text" }: { isEditing: boolean, value: any, onChange: (v: string) => void, placeholder?: string, className?: string, type?: string }) => {
  if (isEditing) {
    return <Input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`h-7 py-0 px-2 text-xs font-mono rounded-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary border-primary/30 ${className}`} />
  }
  return <span className={className}>{value || placeholder}</span>
}

const EditableTextarea = ({ isEditing, value, onChange, placeholder = "None recorded", className = "" }: { isEditing: boolean, value: any, onChange: (v: string) => void, placeholder?: string, className?: string }) => {
  if (isEditing) {
    return <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`min-h-[60px] p-2 text-xs font-mono rounded-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary border-primary/30 ${className}`} />
  }
  return <span className={className}>{value || placeholder}</span>
}

export default function PatientPage() {
  
  const params = useParams()
  const { privacyMode, formatPatientName } = usePrivacy()
  const { toast } = useToast()
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edits
      setEditedPatient(JSON.parse(JSON.stringify(patient)))
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }
  
  const handleInputChange = (field: keyof Patient, value: any) => {
    if (!editedPatient) return
    setEditedPatient({ ...editedPatient, [field]: value })
  }
  
  const handleSave = async () => {
    if (!editedPatient) return

    // Validate number fields
    if (editedPatient.Age && isNaN(Number(editedPatient.Age))) {
      toast({ title: "Validation Error", description: "Age must be a valid number.", variant: "destructive" })
      return
    }
    if (editedPatient.WeightKg && isNaN(Number(editedPatient.WeightKg))) {
      toast({ title: "Validation Error", description: "Weight must be a valid number.", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/patient', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPatient),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to update record")

      setPatient(editedPatient)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Patient record updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save record",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }


  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(`/api/patient?id=${params.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch patients")
        }

        setPatient(data.length > 0 ? data[0] : null)
        setEditedPatient(data.length > 0 ? JSON.parse(JSON.stringify(data[0])) : null)
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
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-primary/20 pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {isEditing ? (
              <Input 
                className="h-10 text-xl font-bold font-mono tracking-tight uppercase rounded-sm border-primary/30 min-w-[300px]" 
                value={editedPatient?.PatientName || ""} 
                onChange={(e) => handleInputChange("PatientName", e.target.value)} 
              />
            ) : (
              <h1 className="text-3xl font-bold font-mono tracking-tight uppercase">{formatPatientName(patient.PatientName, patient.PatientID)}</h1>
            )}
            <Badge className="rounded-sm font-mono tracking-widest uppercase text-[10px]" variant={getAcuityBadgeVariant(patient.Severity || patient.InitialAcuity || "")}>
              {patient.Severity || patient.InitialAcuity || "Unknown"}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm tracking-tight flex items-center gap-2 uppercase">
            <span>{isEditing ? <EditableField type="number" isEditing={isEditing} value={editedPatient?.Age} onChange={(v) => handleInputChange("Age", v ? parseInt(v) : null)} className="w-16 h-7 text-center" /> : `${privacyMode ? "**" : patient.Age} YRS`}</span>
            <span className="text-muted-foreground/50">|</span>
            <span><EditableField isEditing={isEditing} value={editedPatient?.Gender} onChange={(v) => handleInputChange("Gender", v)} className="w-16 h-5 text-center" /></span>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-primary font-bold flex items-center gap-1">INC #<EditableField isEditing={isEditing} value={editedPatient?.IncidentNumber} onChange={(v) => handleInputChange("IncidentNumber", v)} className="w-24 h-5" /></span>
          </p>
        </div>
                <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={() => patient && generatePatientPDF(patient)}>
                <FileText className="mr-2 h-3 w-3" />
                Print
              </Button>
              <Button className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={handleEditToggle}>
                <Clipboard className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={handleEditToggle} disabled={saving}>
                <X className="mr-2 h-3 w-3" />
                Cancel
              </Button>
              <Button className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 rounded-sm bg-muted/30 border p-1">
          <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary" value="assessment">Assessment</TabsTrigger>
          <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary" value="medications">Medications</TabsTrigger>
          <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary" value="incident">Incident Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Demographics & Contact Grid */}
            <Card className="md:col-span-2 shadow-sm rounded-sm border-t-4 border-t-primary">
              <CardHeader className="p-2 bg-muted/40 border-b">
                <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2">
                  <div className="border-r">
                    <div className="p-2 bg-muted/20 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Demographics</div>
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-border font-mono tracking-tight">
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground w-1/3">Age</td>
                          <td className="py-1.5 px-3 text-right font-medium"><EditableField type="number" isEditing={isEditing} value={editedPatient?.Age} onChange={(v) => handleInputChange("Age", v ? parseInt(v) : null)} placeholder="--" /></td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground">Gender</td>
                          <td className="py-1.5 px-3 text-right font-medium"><EditableField isEditing={isEditing} value={editedPatient?.Gender} onChange={(v) => handleInputChange("Gender", v)} placeholder={"--"} /></td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground">Race</td>
                          <td className="py-1.5 px-3 text-right font-medium"><EditableField isEditing={isEditing} value={editedPatient?.Race} onChange={(v) => handleInputChange("Race", v)} placeholder={"--"} /></td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground">Weight</td>
                          <td className="py-1.5 px-3 text-right font-medium"><EditableField type="number" isEditing={isEditing} value={editedPatient?.WeightKg} onChange={(v) => handleInputChange("WeightKg", v ? parseFloat(v) : null)} placeholder="--" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="p-2 bg-muted/20 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact Information</div>
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-border font-mono tracking-tight">
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground w-1/3">Address</td>
                          <td className="py-1.5 px-3 text-right font-medium"><EditableField isEditing={isEditing} value={editedPatient?.HomeAddress} onChange={(v) => handleInputChange("HomeAddress", v)} /></td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground">City/State</td>
                          <td className="py-1.5 px-3 text-right font-medium">
                            {isEditing ? (
                              <div className="flex justify-end gap-2">
                                <EditableField isEditing={isEditing} value={editedPatient?.City} onChange={(v) => handleInputChange("City", v)} placeholder="City" className="w-24" />
                                <span>,</span>
                                <EditableField isEditing={isEditing} value={editedPatient?.State} onChange={(v) => handleInputChange("State", v)} placeholder="State" className="w-12" />
                              </div>
                            ) : (
                              privacyMode ? "***, **" : `${patient.City || "--"}, ${patient.State || "--"}`
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground">ZIP / County</td>
                          <td className="py-1.5 px-3 text-right font-medium">
                            {isEditing ? (
                              <div className="flex justify-end gap-2">
                                <EditableField isEditing={isEditing} value={editedPatient?.ZIPCode} onChange={(v) => handleInputChange("ZIPCode", v)} placeholder="ZIP" className="w-20" />
                                <span>/</span>
                                <EditableField isEditing={isEditing} value={editedPatient?.County} onChange={(v) => handleInputChange("County", v)} placeholder="County" className="w-32" />
                              </div>
                            ) : (
                              privacyMode ? "*****" : `${patient.ZIPCode || "--"} / ${patient.County || "--"}`
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/30">
                          <td className="py-1.5 px-3 text-muted-foreground">Phone</td>
                          <td className="py-1.5 px-3 text-right font-medium"><EditableField isEditing={isEditing} value={editedPatient?.ContactInfo} onChange={(v) => handleInputChange("ContactInfo", v)} placeholder="--" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Flowsheet */}
            <Card className="md:col-span-1 shadow-sm rounded-sm border-t-4 border-t-primary">
              <CardHeader className="p-2 bg-muted/40 border-b">
                <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider text-primary">
                  <Activity className="mr-2 h-4 w-4" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-border font-mono tracking-tight">
                    <tr className="hover:bg-muted/30">
                      <td className="py-1.5 px-3 text-muted-foreground"><Heart className="inline h-3 w-3 mr-2 text-muted-foreground" />HR</td>
                      <td className="py-1.5 px-3 text-right font-bold text-foreground"><EditableField isEditing={isEditing} value={editedPatient?.HeartRate} onChange={(v) => handleInputChange("HeartRate", v)} placeholder={"--"} /></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="py-1.5 px-3 text-muted-foreground"><Activity className="inline h-3 w-3 mr-2 text-muted-foreground" />BP</td>
                      <td className="py-1.5 px-3 text-right font-bold text-foreground"><EditableField isEditing={isEditing} value={editedPatient?.BloodPressure} onChange={(v) => handleInputChange("BloodPressure", v)} placeholder={"--/--"} /></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="py-1.5 px-3 text-muted-foreground"><Lungs className="inline h-3 w-3 mr-2 text-muted-foreground" />RR</td>
                      <td className="py-1.5 px-3 text-right font-bold text-foreground"><EditableField isEditing={isEditing} value={editedPatient?.RespiratoryRate} onChange={(v) => handleInputChange("RespiratoryRate", v)} placeholder={"--"} /></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="py-1.5 px-3 text-muted-foreground"><Droplets className="inline h-3 w-3 mr-2 text-muted-foreground" />SPO2</td>
                      <td className="py-1.5 px-3 text-right font-bold text-foreground"><EditableField isEditing={isEditing} value={editedPatient?.SPO2} onChange={(v) => handleInputChange("SPO2", v)} placeholder={"--"} /></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="py-1.5 px-3 text-muted-foreground"><Thermometer className="inline h-3 w-3 mr-2 text-muted-foreground" />Temp</td>
                      <td className="py-1.5 px-3 text-right font-bold text-foreground"><EditableField isEditing={isEditing} value={editedPatient?.Temperature} onChange={(v) => handleInputChange("Temperature", v)} placeholder={"--"} /></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="py-1.5 px-3 text-muted-foreground"><Droplets className="inline h-3 w-3 mr-2 text-muted-foreground" />BGL</td>
                      <td className="py-1.5 px-3 text-right font-bold text-foreground"><EditableField isEditing={isEditing} value={editedPatient?.Glucose} onChange={(v) => handleInputChange("Glucose", v)} placeholder={"--"} /></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Medical History Dense Grid */}
            <Card className="md:col-span-3 shadow-sm rounded-sm border-t-4 border-t-primary">
              <CardHeader className="p-2 bg-muted/40 border-b">
                <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                  <Clipboard className="mr-2 h-4 w-4 text-primary" />
                  Medical History & Allergies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-y md:divide-y-0 text-xs">
                  <div className="p-3 bg-muted/5 hover:bg-muted/10 transition-colors">
                    <h4 className="font-bold text-foreground uppercase tracking-widest text-[10px] mb-2 flex items-center"><AlertCircle className="h-3 w-3 mr-1 text-muted-foreground"/> Allergies</h4>
                    <p className="font-mono tracking-tight text-foreground"><EditableTextarea isEditing={isEditing} value={editedPatient?.MedicationAllergies} onChange={(v) => handleInputChange("MedicationAllergies", v)} /></p>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Past Medical History</h4>
                    <p className="font-mono tracking-tight"><EditableTextarea isEditing={isEditing} value={editedPatient?.PastMedicalHistory} onChange={(v) => handleInputChange("PastMedicalHistory", v)} /></p>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Current Medications</h4>
                    <p className="font-mono tracking-tight"><EditableTextarea isEditing={isEditing} value={editedPatient?.CurrentMedications} onChange={(v) => handleInputChange("CurrentMedications", v)} /></p>
                  </div>
                  <div className="p-3 bg-muted/20">
                    <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Advance Directives</h4>
                    <p className="font-mono tracking-tight font-medium"><EditableField isEditing={isEditing} value={editedPatient?.AdvanceDirectives} onChange={(v) => handleInputChange("AdvanceDirectives", v)} placeholder={"None recorded"} /></p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Primary Impression */}
            <Card className="md:col-span-3 shadow-sm rounded-sm border-t-4 border-t-primary">
              <CardHeader className="p-2 bg-muted/40 border-b">
                <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                  <Stethoscope className="mr-2 h-4 w-4 text-primary" />
                  Primary Complaint & Impression
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 text-xs divide-x">
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Primary Complaint</h4>
                       {patient.Duration && <Badge variant="outline" className="text-[9px] font-mono h-4 py-0">{patient.Duration} {patient.TimeUnits}</Badge>}
                    </div>
                    <p className="text-sm font-bold mb-3"><EditableField isEditing={isEditing} value={editedPatient?.PrimaryComplaint} onChange={(v) => handleInputChange("PrimaryComplaint", v)} placeholder={"---"} /></p>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t font-mono">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold">Primary Symptom</span>
                        <EditableField isEditing={isEditing} value={editedPatient?.PrimarySymptom} onChange={(v) => handleInputChange("PrimarySymptom", v)} placeholder={"--"} />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold">Other Symptoms</span>
                        <EditableField isEditing={isEditing} value={editedPatient?.OtherSymptoms} onChange={(v) => handleInputChange("OtherSymptoms", v)} placeholder={"--"} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Provider Impression</h4>
                    <p className="text-sm font-bold mb-3"><EditableField isEditing={isEditing} value={editedPatient?.PrimaryImpression} onChange={(v) => handleInputChange("PrimaryImpression", v)} placeholder={"---"} /></p>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t font-mono">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold">Severity</span>
                        <Badge variant={getAcuityBadgeVariant(patient.Severity || "")} className="text-[9px] h-4 py-0 mt-1 uppercase tracking-tight">
                          <EditableField isEditing={isEditing} value={editedPatient?.Severity} onChange={(v) => handleInputChange("Severity", v)} placeholder={"--"} />
                        </Badge>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold">Cardiac Arrest</span>
                        <EditableField isEditing={isEditing} value={editedPatient?.CardiacArrest} onChange={(v) => handleInputChange("CardiacArrest", v)} placeholder={"--"} />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold">Trauma/Injury</span>
                        <EditableField isEditing={isEditing} value={editedPatient?.PossibleInjury} onChange={(v) => handleInputChange("PossibleInjury", v)} placeholder={"--"} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GCS Assessment Dense Table */}
            <Card className="md:col-span-1 shadow-sm rounded-sm border-t-4 border-t-primary">
              <CardHeader className="p-2 bg-muted/40 border-b">
                <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                  <Brain className="mr-2 h-4 w-4 text-primary" />
                  GCS (Glasgow Coma Scale)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-center text-xs font-mono">
                  <thead className="bg-muted/20 font-sans text-[10px] uppercase text-muted-foreground border-b">
                    <tr>
                      <th className="py-2">Eye</th>
                      <th className="py-2">Verbal</th>
                      <th className="py-2">Motor</th>
                      <th className="py-2 bg-primary/10 text-primary">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 font-bold text-sm"><EditableField isEditing={isEditing} value={editedPatient?.GCS_Eye} onChange={(v) => handleInputChange("GCS_Eye", v)} placeholder={"-"} /></td>
                      <td className="py-3 font-bold text-sm"><EditableField isEditing={isEditing} value={editedPatient?.GCS_Verbal} onChange={(v) => handleInputChange("GCS_Verbal", v)} placeholder={"-"} /></td>
                      <td className="py-3 font-bold text-sm"><EditableField isEditing={isEditing} value={editedPatient?.GCS_Motor} onChange={(v) => handleInputChange("GCS_Motor", v)} placeholder={"-"} /></td>
                      <td className="py-3 font-bold text-lg bg-primary/5 text-primary"><EditableField isEditing={isEditing} value={editedPatient?.GCS_Score} onChange={(v) => handleInputChange("GCS_Score", v)} placeholder={"-"} /></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Physical Exam Strict Grid */}
            <Card className="md:col-span-2 shadow-sm rounded-sm border-t-4 border-t-primary">
              <CardHeader className="p-2 bg-muted/40 border-b">
                <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                  <Stethoscope className="mr-2 h-4 w-4 text-primary" />
                  Physical Examination
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y border-b text-xs font-mono">
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Mental Status</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.MentalStatus} onChange={(v) => handleInputChange("MentalStatus", v)} placeholder={"Not assessed"} />
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Skin</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.SkinAssessment} onChange={(v) => handleInputChange("SkinAssessment", v)} placeholder={"Not assessed"} />
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Eye Exam</span>
                    {patient.EyeExam_Bilateral || (patient.EyeExam_Left && patient.EyeExam_Right ? `L: ${patient.EyeExam_Left}, R: ${patient.EyeExam_Right}` : "Not assessed")}
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Chest</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.ChestExam} onChange={(v) => handleInputChange("ChestExam", v)} placeholder={"Not assessed"} />
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Lung</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.LungExam} onChange={(v) => handleInputChange("LungExam", v)} placeholder={"Not assessed"} />
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Abdomen</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.AbdomenExam} onChange={(v) => handleInputChange("AbdomenExam", v)} placeholder={"Not assessed"} />
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Back/Spine</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.BackSpineExam} onChange={(v) => handleInputChange("BackSpineExam", v)} placeholder={"Not assessed"} />
                  </div>
                  <div className="p-2">
                    <span className="text-[9px] uppercase font-sans font-bold text-muted-foreground block mb-1">Extremities</span>
                    <EditableField isEditing={isEditing} value={editedPatient?.ExtremitiesExam} onChange={(v) => handleInputChange("ExtremitiesExam", v)} placeholder={"Not assessed"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Treatment tab was removed per user request for layout restructuring */}

        <TabsContent value="medications" className="space-y-6">
          <MedicationHistory patientId={patient.PatientID} />
        </TabsContent>

        <TabsContent value="incident" className="space-y-6">
          {/* Incident Information */}
          <Card className="shadow-sm rounded-sm border-t-4 border-t-primary">
            <CardHeader className="p-2 bg-muted/40 border-b">
              <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                <Info className="mr-2 h-4 w-4 text-primary" />
                Incident Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x text-xs font-mono">
                <div className="p-3 bg-muted/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Service Requested</span>
                    <span className="font-bold text-sm tracking-tight"><EditableField isEditing={isEditing} value={editedPatient?.ServiceRequested} onChange={(v) => handleInputChange("ServiceRequested", v)} placeholder={"--"} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Response Mode</span>
                    <span><EditableField isEditing={isEditing} value={editedPatient?.ResponseMode} onChange={(v) => handleInputChange("ResponseMode", v)} placeholder={"--"} /></span>
                  </div>
                </div>
                <div className="p-3 bg-muted/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Primary Role</span>
                    <span><EditableField isEditing={isEditing} value={editedPatient?.PrimaryRole} onChange={(v) => handleInputChange("PrimaryRole", v)} placeholder={"--"} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">EMS Shift</span>
                    <span><EditableField isEditing={isEditing} value={editedPatient?.EMSShift} onChange={(v) => handleInputChange("EMSShift", v)} placeholder={"--"} /></span>
                  </div>
                </div>
                <div className="p-3 bg-muted/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Scene Type</span>
                    <span><EditableField isEditing={isEditing} value={editedPatient?.SceneType} onChange={(v) => handleInputChange("SceneType", v)} placeholder={"--"} /></span>
                  </div>
                  <div className="mt-4">
                    <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Crew Members</span>
                    <span><EditableField isEditing={isEditing} value={editedPatient?.CrewMembers} onChange={(v) => handleInputChange("CrewMembers", v)} placeholder={"--"} /></span>
                    {patient.NumberOfCrew && <span className="block text-muted-foreground">({patient.NumberOfCrew} total)</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="shadow-sm rounded-sm border-t-4 border-t-primary">
            <CardHeader className="p-2 bg-muted/40 border-b">
              <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                <Home className="mr-2 h-4 w-4 text-primary" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x text-xs font-mono">
                <div className="p-3 bg-muted/5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-2">Dispatch Location</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-muted-foreground">City:</span> <EditableField isEditing={isEditing} value={editedPatient?.DispatchCity} onChange={(v) => handleInputChange("DispatchCity", v)} placeholder={"--"} /></div>
                    <div><span className="text-muted-foreground">State:</span> <EditableField isEditing={isEditing} value={editedPatient?.DispatchState} onChange={(v) => handleInputChange("DispatchState", v)} placeholder={"--"} /></div>
                    <div><span className="text-muted-foreground">ZIP:</span> <EditableField isEditing={isEditing} value={editedPatient?.DispatchZIP} onChange={(v) => handleInputChange("DispatchZIP", v)} placeholder={"--"} /></div>
                    <div><span className="text-muted-foreground">County:</span> <EditableField isEditing={isEditing} value={editedPatient?.DispatchCounty} onChange={(v) => handleInputChange("DispatchCounty", v)} placeholder={"--"} /></div>
                  </div>
                </div>
                <div className="p-3 bg-muted/5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-2">Timing Information</span>
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-muted/50 pb-1"><span className="text-muted-foreground">Arrived On Scene:</span> <span className="font-bold"><EditableField isEditing={isEditing} value={editedPatient?.ArrivedOnScene} onChange={(v) => handleInputChange("ArrivedOnScene", v)} placeholder={"--"} /></span></div>
                    <div className="flex justify-between border-b border-muted/50 pb-1 pt-1"><span className="text-muted-foreground">First On Scene:</span> <span className="font-bold"><EditableField isEditing={isEditing} value={editedPatient?.FirstOnScene} onChange={(v) => handleInputChange("FirstOnScene", v)} placeholder={"--"} /></span></div>
                    <div className="flex justify-between border-b border-muted/50 pb-1 pt-1"><span className="text-muted-foreground">Patient Contact Made:</span> <span className="font-bold"><EditableField isEditing={isEditing} value={editedPatient?.PatientContactMade} onChange={(v) => handleInputChange("PatientContactMade", v)} placeholder={"--"} /></span></div>
                    <div className="flex justify-between pt-1"><span className="text-muted-foreground">Stage Prior To Contact:</span> <span className="font-bold"><EditableField isEditing={isEditing} value={editedPatient?.StagePriorToContact} onChange={(v) => handleInputChange("StagePriorToContact", v)} placeholder={"--"} /></span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="shadow-sm rounded-sm border-t-4 border-t-primary">
            <CardHeader className="p-2 bg-muted/40 border-b">
              <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x text-xs font-mono">
                <div className="p-3 bg-muted/5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Agency Assist</span>
                  <div className="space-y-2 mt-2">
                    <div><span className="text-muted-foreground block text-[10px]">Other Agencies</span> <EditableField isEditing={isEditing} value={editedPatient?.OtherAgencies} onChange={(v) => handleInputChange("OtherAgencies", v)} placeholder={"--"} /></div>
                    <div><span className="text-muted-foreground block text-[10px]">Other Agency On Scene</span> <EditableField isEditing={isEditing} value={editedPatient?.OtherAgencyOnScene} onChange={(v) => handleInputChange("OtherAgencyOnScene", v)} placeholder={"--"} /></div>
                  </div>
                </div>
                <div className="p-3 bg-muted/5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Scene Factors</span>
                  <div className="space-y-2 mt-2">
                    <div><span className="text-muted-foreground block text-[10px]">Alcohol/Drug Use</span> <EditableField isEditing={isEditing} value={editedPatient?.AlcoholDrugUse} onChange={(v) => handleInputChange("AlcoholDrugUse", v)} placeholder={"--"} /></div>
                    <div><span className="text-muted-foreground block text-[10px]">Signs Of Abuse</span> <EditableField isEditing={isEditing} value={editedPatient?.SignsOfAbuse} onChange={(v) => handleInputChange("SignsOfAbuse", v)} placeholder={"--"} /></div>
                  </div>
                </div>
                <div className="p-3 bg-muted/5">
                  <span className="text-[10px] text-muted-foreground uppercase block font-sans font-bold mb-1">Legal / System</span>
                  <div className="space-y-2 mt-2">
                    <div><span className="text-muted-foreground block text-[10px]">5150 Hold</span> {patient["5150Hold"] || "--"}</div>
                    <div><span className="text-muted-foreground block text-[10px]">Number Of Patients</span> <EditableField isEditing={isEditing} value={editedPatient?.NumberOfPatients} onChange={(v) => handleInputChange("NumberOfPatients", v)} placeholder={"--"} /></div>
                    <div><span className="text-muted-foreground block text-[10px]">Back In Service</span> <EditableField isEditing={isEditing} value={editedPatient?.BackInService} onChange={(v) => handleInputChange("BackInService", v)} placeholder={"--"} /></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

