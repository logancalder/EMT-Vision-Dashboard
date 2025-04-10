"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Patient } from "@/types/patient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Activity, Heart, CheckCircle2 } from "lucide-react"

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
      
      // First, verify the patient exists
      const { data: existingPatient, error: fetchError } = await supabase
        .from("PatientData")
        .select()
        .eq("PatientID", patient.PatientID)
        .single()

      console.log('Existing patient check:', { existingPatient, fetchError })

      if (fetchError) {
        console.error('Error fetching existing patient:', fetchError)
        throw fetchError
      }

      if (!existingPatient) {
        throw new Error('Patient not found in database')
      }

      // Prepare the update data
      const updateData = {
        ...editedPatient,
        PatientID: patient.PatientID // Ensure PatientID is included
      }

      console.log('Sending update with data:', updateData)

      const { data, error } = await supabase
        .from("PatientData")
        .update(updateData)
        .eq("PatientID", patient.PatientID)
        .select()

      console.log('Supabase update response:', { data, error })

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after update')
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient Record</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="PatientName">Patient Name</Label>
                <Input
                  id="PatientName"
                  value={editedPatient.PatientName}
                  onChange={(e) => handleInputChange("PatientName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Age">Age</Label>
                <Input
                  id="Age"
                  value={editedPatient.Age}
                  onChange={(e) => handleInputChange("Age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Gender">Gender</Label>
                <Input
                  id="Gender"
                  value={editedPatient.Gender}
                  onChange={(e) => handleInputChange("Gender", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="IncidentNumber">Incident Number</Label>
                <Input
                  id="IncidentNumber"
                  value={editedPatient.IncidentNumber}
                  onChange={(e) => handleInputChange("IncidentNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="HomeAddress">Address</Label>
                <Input
                  id="HomeAddress"
                  value={editedPatient.HomeAddress}
                  onChange={(e) => handleInputChange("HomeAddress", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="City">City</Label>
                <Input
                  id="City"
                  value={editedPatient.City}
                  onChange={(e) => handleInputChange("City", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="State">State</Label>
                <Input
                  id="State"
                  value={editedPatient.State}
                  onChange={(e) => handleInputChange("State", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ZIPCode">ZIP Code</Label>
                <Input
                  id="ZIPCode"
                  value={editedPatient.ZIPCode}
                  onChange={(e) => handleInputChange("ZIPCode", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="County">County</Label>
                <Input
                  id="County"
                  value={editedPatient.County}
                  onChange={(e) => handleInputChange("County", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ContactInfo">Contact Information</Label>
                <Input
                  id="ContactInfo"
                  value={editedPatient.ContactInfo}
                  onChange={(e) => handleInputChange("ContactInfo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  defaultValue={patient.Severity}
                  onValueChange={(value) => setEditedPatient({ ...editedPatient, Severity: value })}
                >
                  <SelectTrigger className={`w-full ${getSeverityColor(editedPatient.Severity)}`}>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(editedPatient.Severity)}
                      <SelectValue placeholder="Select severity" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="vitals" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="HeartRate">Heart Rate</Label>
                <Input
                  id="HeartRate"
                  value={editedPatient.HeartRate}
                  onChange={(e) => handleInputChange("HeartRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="BloodPressure">Blood Pressure</Label>
                <Input
                  id="BloodPressure"
                  value={editedPatient.BloodPressure}
                  onChange={(e) => handleInputChange("BloodPressure", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="RespiratoryRate">Respiratory Rate</Label>
                <Input
                  id="RespiratoryRate"
                  value={editedPatient.RespiratoryRate}
                  onChange={(e) => handleInputChange("RespiratoryRate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="SPO2">SPO2</Label>
                <Input
                  id="SPO2"
                  value={editedPatient.SPO2}
                  onChange={(e) => handleInputChange("SPO2", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Temperature">Temperature</Label>
                <Input
                  id="Temperature"
                  value={editedPatient.Temperature}
                  onChange={(e) => handleInputChange("Temperature", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Glucose">Glucose</Label>
                <Input
                  id="Glucose"
                  value={editedPatient.Glucose}
                  onChange={(e) => handleInputChange("Glucose", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="assessment" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="PrimaryComplaint">Primary Complaint</Label>
                <Textarea
                  id="PrimaryComplaint"
                  value={editedPatient.PrimaryComplaint}
                  onChange={(e) => handleInputChange("PrimaryComplaint", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="PastMedicalHistory">Past Medical History</Label>
                <Textarea
                  id="PastMedicalHistory"
                  value={editedPatient.PastMedicalHistory}
                  onChange={(e) => handleInputChange("PastMedicalHistory", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="CurrentMedications">Current Medications</Label>
                <Textarea
                  id="CurrentMedications"
                  value={editedPatient.CurrentMedications}
                  onChange={(e) => handleInputChange("CurrentMedications", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="MedicationAllergies">Medication Allergies</Label>
                <Textarea
                  id="MedicationAllergies"
                  value={editedPatient.MedicationAllergies}
                  onChange={(e) => handleInputChange("MedicationAllergies", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="treatment" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="Medication">Medication</Label>
                <Input
                  id="Medication"
                  value={editedPatient.Medication}
                  onChange={(e) => handleInputChange("Medication", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Dosage">Dosage</Label>
                <Input
                  id="Dosage"
                  value={editedPatient.Dosage}
                  onChange={(e) => handleInputChange("Dosage", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Route">Route</Label>
                <Input
                  id="Route"
                  value={editedPatient.Route}
                  onChange={(e) => handleInputChange("Route", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Procedure">Procedure</Label>
                <Input
                  id="Procedure"
                  value={editedPatient.Procedure}
                  onChange={(e) => handleInputChange("Procedure", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="TransportDisposition">Transport Disposition</Label>
                <Input
                  id="TransportDisposition"
                  value={editedPatient.TransportDisposition}
                  onChange={(e) => handleInputChange("TransportDisposition", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 