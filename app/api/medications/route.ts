import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('patientId')

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
  }

  try {
    const data = db.prepare('SELECT * FROM Medications WHERE PatientID = ? ORDER BY Timestamp DESC').all(patientId)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 