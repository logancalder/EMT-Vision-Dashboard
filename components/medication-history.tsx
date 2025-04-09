"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pill } from "lucide-react"

interface MedicationRecord {
  MedicationID: string
  MedicationName: string
  QuantityAdministered: number
  Timestamp: string
  PatientID: string
}

interface MedicationHistoryProps {
  patientId: string
}

export function MedicationHistory({ patientId }: MedicationHistoryProps) {
  const [medications, setMedications] = useState<MedicationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedications() {
      try {
        const response = await fetch(`/api/medications?patientId=${patientId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch medications")
        }

        setMedications(data)
      } catch (err) {
        console.error("Error fetching medications:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMedications()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            Error Loading Medication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (medications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Pill className="mr-2 h-5 w-5 text-primary" />
            Medication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Pill className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No medications have been administered</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Pill className="mr-2 h-5 w-5 text-primary" />
          Medication History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Quantity (mg)</TableHead>
              <TableHead>Time Administered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.MedicationID}>
                <TableCell className="font-medium">{med.MedicationName}</TableCell>
                <TableCell>{med.QuantityAdministered}</TableCell>
                <TableCell>{new Date(med.Timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 