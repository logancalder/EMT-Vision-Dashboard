"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Patient } from "@/types/patient"
import { ClipboardEdit } from "lucide-react"

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const SEVERITY_LEVELS = [
  { level: "Critical", color: "bg-red-500" },
  { level: "Severe", color: "bg-orange-500" },
  { level: "Moderate", color: "bg-yellow-500" },
  { level: "Minor", color: "bg-green-500" },
  { level: "Low", color: "bg-blue-500" },
  { level: "None", color: "bg-slate-500" }
];

interface PatientEditModalProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientUpdated: (patient: Patient) => void
}

export function PatientEditModal({
  patient,
  open,
  onOpenChange,
  onPatientUpdated,
}: PatientEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [editedPatient, setEditedPatient] = useState<Patient>(patient)
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      setLoading(true)
      console.log('Original patient ID:', patient.PatientID)
      console.log('Attempting to save patient data:', editedPatient)
      
      const updateData = {
        ...editedPatient,
        PatientID: patient.PatientID // Ensure PatientID is included
      }

      console.log('Sending update with data:', updateData)

      const response = await fetch('/api/patient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update patient')
      }

      console.log('Successfully updated patient in database:', data)
      toast({
        title: "Success",
        description: "Patient record updated successfully",
      })
      onPatientUpdated(data[0]) // Use the returned data instead of editedPatient
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating patient:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update patient record",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Patient, value: string) => {
    setEditedPatient((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[700px] max-h-[90vh] overflow-y-auto border-t-8 border-t-primary rounded-sm p-6 sm:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest flex items-center gap-3">
            <ClipboardEdit className="h-6 w-6 text-primary" />
            Edit Patient Record
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 rounded-sm bg-muted/30 border p-1">
            <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary" value="basic">Basic Info</TabsTrigger>
            <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary" value="vitals">Vitals</TabsTrigger>
            <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary" value="assessment">Assessment</TabsTrigger>
            <TabsTrigger className="rounded-sm text-xs uppercase tracking-wider font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary" value="treatment">Treatment</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="PatientName">Patient Name</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="PatientName"
                  value={editedPatient.PatientName}
                  onChange={(e) => handleInputChange("PatientName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Age">Age</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Age"
                  value={editedPatient.Age}
                  onChange={(e) => handleInputChange("Age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Gender">Gender</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Gender"
                  value={editedPatient.Gender}
                  onChange={(e) => handleInputChange("Gender", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="IncidentNumber">Incident Number</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary text-primary"
                  id="IncidentNumber"
                  value={editedPatient.IncidentNumber}
                  onChange={(e) => handleInputChange("IncidentNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="HomeAddress">Address</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="HomeAddress"
                  value={editedPatient.HomeAddress}
                  onChange={(e) => handleInputChange("HomeAddress", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="City">City</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="City"
                  value={editedPatient.City}
                  onChange={(e) => handleInputChange("City", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="State">State</Label>
                <Select
                  value={editedPatient.State || ""}
                  onValueChange={(value) => handleInputChange("State", value)}
                >
                  <SelectTrigger id="State" className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus:ring-primary">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {US_STATES.map((state) => (
                      <SelectItem className="font-mono text-xs rounded-sm" key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="ZIPCode">ZIP Code</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="ZIPCode"
                  value={editedPatient.ZIPCode}
                  onChange={(e) => handleInputChange("ZIPCode", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="County">County</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="County"
                  value={editedPatient.County}
                  onChange={(e) => handleInputChange("County", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="ContactInfo">Contact Information</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="ContactInfo"
                  value={editedPatient.ContactInfo}
                  onChange={(e) => handleInputChange("ContactInfo", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="HeartRate">Heart Rate</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="HeartRate"
                  value={editedPatient.HeartRate}
                  onChange={(e) => handleInputChange("HeartRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="BloodPressure">Blood Pressure</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="BloodPressure"
                  value={editedPatient.BloodPressure}
                  onChange={(e) => handleInputChange("BloodPressure", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="RespiratoryRate">Respiratory Rate</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="RespiratoryRate"
                  value={editedPatient.RespiratoryRate}
                  onChange={(e) => handleInputChange("RespiratoryRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="SPO2">SPO2</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="SPO2"
                  value={editedPatient.SPO2}
                  onChange={(e) => handleInputChange("SPO2", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Temperature">Temperature</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Temperature"
                  value={editedPatient.Temperature}
                  onChange={(e) => handleInputChange("Temperature", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Glucose">Glucose</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Glucose"
                  value={editedPatient.Glucose}
                  onChange={(e) => handleInputChange("Glucose", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Severity">Severity (Triage Level)</Label>
                <Select
                  value={editedPatient.Severity || ""}
                  onValueChange={(value) => handleInputChange("Severity", value)}
                >
                  <SelectTrigger id="Severity" className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus:ring-primary">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {SEVERITY_LEVELS.map((item) => (
                      <SelectItem className="font-mono text-xs rounded-sm uppercase tracking-wider" key={item.level} value={item.level}>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-none ${item.color} mr-2 shrink-0`} />
                          {item.level}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="PrimaryComplaint">Primary Complaint</Label>
                <Textarea
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary min-h-[80px]"
                  id="PrimaryComplaint"
                  value={editedPatient.PrimaryComplaint}
                  onChange={(e) => handleInputChange("PrimaryComplaint", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="PastMedicalHistory">Past Medical History</Label>
                <Textarea
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary min-h-[80px]"
                  id="PastMedicalHistory"
                  value={editedPatient.PastMedicalHistory}
                  onChange={(e) => handleInputChange("PastMedicalHistory", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="CurrentMedications">Current Medications</Label>
                <Textarea
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary min-h-[80px]"
                  id="CurrentMedications"
                  value={editedPatient.CurrentMedications}
                  onChange={(e) => handleInputChange("CurrentMedications", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="MedicationAllergies">Medication Allergies</Label>
                <Textarea
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary min-h-[80px]"
                  id="MedicationAllergies"
                  value={editedPatient.MedicationAllergies}
                  onChange={(e) => handleInputChange("MedicationAllergies", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Medication">Medication</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Medication"
                  value={editedPatient.Medication}
                  onChange={(e) => handleInputChange("Medication", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Dosage">Dosage</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Dosage"
                  value={editedPatient.Dosage}
                  onChange={(e) => handleInputChange("Dosage", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Route">Route</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Route"
                  value={editedPatient.Route}
                  onChange={(e) => handleInputChange("Route", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="Procedure">Procedure</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="Procedure"
                  value={editedPatient.Procedure}
                  onChange={(e) => handleInputChange("Procedure", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground" htmlFor="TransportDisposition">Transport Disposition</Label>
                <Input
                  className="rounded-sm font-mono text-sm shadow-none border-primary/20 focus-visible:ring-primary"
                  id="TransportDisposition"
                  value={editedPatient.TransportDisposition}
                  onChange={(e) => handleInputChange("TransportDisposition", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-primary/10">
          <Button className="rounded-sm uppercase font-bold tracking-wider text-xs h-9" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="rounded-sm uppercase font-bold tracking-wider text-xs h-9" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 