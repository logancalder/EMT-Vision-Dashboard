import { supabase } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get total patients count
    const { count: totalPatients, error: countError } = await supabase
      .from('PatientData')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    // Get critical cases (patients with critical/severe acuity)
    const { data: criticalCases, error: criticalError } = await supabase
      .from('PatientData')
      .select('PatientID')
      .or('InitialAcuity.ilike.%critical%,InitialAcuity.ilike.%severe%,FinalPatientAcuity.ilike.%critical%,FinalPatientAcuity.ilike.%severe%')

    if (criticalError) throw criticalError

    // Get recent patients (last 24 hours)
    const { data: recentPatients, error: recentError } = await supabase
      .from('PatientData')
      .select('*')
      .gte('Time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('Time', { ascending: false })

    if (recentError) throw recentError

    return NextResponse.json({
      totalPatients,
      criticalCases: criticalCases.length,
      recentPatients: recentPatients.length,
      recentPatientsList: recentPatients
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
} 