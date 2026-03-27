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
      <Card className="shadow-sm rounded-sm border-t-4 border-t-primary">
        <CardHeader className="p-2 bg-muted/40 border-b">
          <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
            <Pill className="mr-2 h-4 w-4 text-primary" />
            Medication History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-center py-6 text-muted-foreground bg-muted/5 font-mono text-xs">
            <Pill className="h-6 w-6 mx-auto mb-2 opacity-30" />
            <p className="uppercase tracking-widest font-sans font-bold text-[10px]">No medications have been administered</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm rounded-sm border-t-4 border-t-primary">
      <CardHeader className="p-2 bg-muted/40 border-b">
        <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider">
          <Pill className="mr-2 h-4 w-4 text-primary" />
          Medication History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table className="font-mono text-xs">
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="font-sans text-[10px] uppercase text-muted-foreground font-bold">Medication</TableHead>
              <TableHead className="font-sans text-[10px] uppercase text-muted-foreground font-bold">Quantity (mg)</TableHead>
              <TableHead className="font-sans text-[10px] uppercase text-muted-foreground font-bold">Time Administered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.MedicationID} className="hover:bg-muted/30">
                <TableCell className="font-bold text-foreground">{med.MedicationName}</TableCell>
                <TableCell className="font-bold text-foreground">{med.QuantityAdministered}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(med.Timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 