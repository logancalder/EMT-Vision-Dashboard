"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"

// ... existing code ...
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
  FinalPatientAcuity: string
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
// ... existing code ...

export default function PatientPage() {
  const params = useParams()
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatient() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("PatientData")
          .select("*")
          .eq("PatientID", params.id)
          .single();
    
        console.log("Fetched data:", data);
        console.log("Error:", error);
    
        if (error) {
          setError(error.message);
          return;
        }
    
        if (!data) {
          setError("Patient not found.");
          return;
        }
    
        setPatient(data);
      } catch (err) {
        console.error("Caught error:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!patient) {
    return <div>Patient not found</div>
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold">Patient Information</h2>
      
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">Name:</span> {patient.PatientName}</p>
          <p><span className="font-semibold">Age:</span> {patient.Age}</p>
          <p><span className="font-semibold">Gender:</span> {patient.Gender}</p>
          <p><span className="font-semibold">Race:</span> {patient.Race}</p>
          <p><span className="font-semibold">Weight:</span> {patient.WeightKg} kg</p>
          <div className="col-span-2">
            <p><span className="font-semibold">Address:</span> {patient.HomeAddress}</p>
            <p>{patient.City}, {patient.State} {patient.ZIPCode}</p>
            <p><span className="font-semibold">County:</span> {patient.County}</p>
          </div>
        </CardContent>
      </Card>

      {/* Incident Details */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">Incident Number:</span> {patient.IncidentNumber}</p>
          <p><span className="font-semibold">Service Requested:</span> {patient.ServiceRequested}</p>
          <p><span className="font-semibold">Primary Role:</span> {patient.PrimaryRole}</p>
          <p><span className="font-semibold">Response Mode:</span> {patient.ResponseMode}</p>
          <p><span className="font-semibold">EMS Shift:</span> {patient.EMSShift}</p>
          <p><span className="font-semibold">Scene Type:</span> {patient.SceneType}</p>
          <p><span className="font-semibold">Category:</span> {patient.Category}</p>
          <p><span className="font-semibold">Back In Service:</span> {patient.BackInService}</p>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">Heart Rate:</span> {patient.HeartRate}</p>
          <p><span className="font-semibold">Blood Pressure:</span> {patient.BloodPressure}</p>
          <p><span className="font-semibold">Respiratory Rate:</span> {patient.RespiratoryRate}</p>
          <p><span className="font-semibold">SPO2:</span> {patient.SPO2}</p>
          <p><span className="font-semibold">Temperature:</span> {patient.Temperature}</p>
          <p><span className="font-semibold">Glucose:</span> {patient.Glucose}</p>
        </CardContent>
      </Card>

      {/* Medical Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Assessment</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Glasgow Coma Scale</h3>
            <div className="grid grid-cols-2 gap-4 ml-4">
              <p><span className="font-semibold">Eye:</span> {patient.GCS_Eye}</p>
              <p><span className="font-semibold">Verbal:</span> {patient.GCS_Verbal}</p>
              <p><span className="font-semibold">Motor:</span> {patient.GCS_Motor}</p>
              <p><span className="font-semibold">Total Score:</span> {patient.GCS_Score}</p>
              <p><span className="font-semibold">Qualifier:</span> {patient.GCS_Qualifier}</p>
            </div>
          </div>
          <div className="col-span-2 mt-4">
            <h3 className="font-semibold mb-2">Physical Examination</h3>
            <div className="grid grid-cols-2 gap-4 ml-4">
              <p><span className="font-semibold">Mental Status:</span> {patient.MentalStatus}</p>
              <p><span className="font-semibold">Abdomen:</span> {patient.AbdomenExam}</p>
              <p><span className="font-semibold">Chest:</span> {patient.ChestExam}</p>
              <p><span className="font-semibold">Back/Spine:</span> {patient.BackSpineExam}</p>
              <p><span className="font-semibold">Skin:</span> {patient.SkinAssessment}</p>
              <p><span className="font-semibold">Lungs:</span> {patient.LungExam}</p>
              <p><span className="font-semibold">Extremities:</span> {patient.ExtremitiesExam}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><span className="font-semibold">Past Medical History:</span> {patient.PastMedicalHistory}</p>
          <p><span className="font-semibold">Current Medications:</span> {patient.CurrentMedications}</p>
          <p><span className="font-semibold">Medication Allergies:</span> {patient.MedicationAllergies}</p>
          <p><span className="font-semibold">Advance Directives:</span> {patient.AdvanceDirectives}</p>
        </CardContent>
      </Card>

      {/* Treatment */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Medication Given</h3>
            <div className="grid grid-cols-2 gap-4 ml-4">
              <p><span className="font-semibold">Time:</span> {patient.MedTime}</p>
              <p><span className="font-semibold">Medication:</span> {patient.Medication}</p>
              <p><span className="font-semibold">Dosage:</span> {patient.Dosage} {patient.MedUnits}</p>
              <p><span className="font-semibold">Route:</span> {patient.Route}</p>
              <p><span className="font-semibold">Response:</span> {patient.MedResponse}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Procedures</h3>
            <div className="grid grid-cols-2 gap-4 ml-4">
              <p><span className="font-semibold">Time:</span> {patient.ProcTime}</p>
              <p><span className="font-semibold">Procedure:</span> {patient.Procedure}</p>
              <p><span className="font-semibold">Location:</span> {patient.ProcLocation}</p>
              <p><span className="font-semibold">Response:</span> {patient.ProcResponse}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disposition */}
      <Card>
        <CardHeader>
          <CardTitle>Disposition</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">Crew Disposition:</span> {patient.CrewDisposition}</p>
          <p><span className="font-semibold">Transport Disposition:</span> {patient.TransportDisposition}</p>
          <p><span className="font-semibold">Level of Care:</span> {patient.LevelOfCareProvided}</p>
          <p><span className="font-semibold">Final Acuity:</span> {patient.FinalPatientAcuity}</p>
          <p><span className="font-semibold">Transport Agency:</span> {patient.TransportAgency}</p>
          <p><span className="font-semibold">Transport Unit:</span> {patient.TransportUnit}</p>
          <p><span className="font-semibold">Primary Care Provider:</span> {patient.EMSPrimaryCareProvider}</p>
        </CardContent>
      </Card>
    </div>
  )
}
