import db from "@/lib/db"
import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('id')

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
  }

  try {
    const data = db.prepare('SELECT * FROM PatientData WHERE PatientID = ? ORDER BY Time DESC').all(patientId)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 

export async function PUT(request: Request) {
  try {
    const updateData = await request.json();
    const { PatientID, ...fieldsToUpdate } = updateData;

    if (!PatientID) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const setClauses = Object.keys(fieldsToUpdate).map(key => `"${key}" = ?`).join(', ');
    const values = Object.values(fieldsToUpdate);

    db.prepare(`UPDATE PatientData SET ${setClauses} WHERE PatientID = ?`).run(...values, PatientID);

    const updatedPatient = db.prepare('SELECT * FROM PatientData WHERE PatientID = ?').get(PatientID);
    return NextResponse.json([updatedPatient]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}