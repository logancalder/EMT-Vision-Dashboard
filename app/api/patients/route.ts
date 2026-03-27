import db from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const data = db.prepare('SELECT * FROM PatientData ORDER BY Time DESC').all();
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 