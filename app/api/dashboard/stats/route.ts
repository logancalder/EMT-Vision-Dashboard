import { supabase } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { count: totalPatients, error: countError } = await supabase
      .from('PatientData')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    // Log time calculations for critical cases
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // Gets YYYY-MM-DD

    // Get critical cases (patients with critical/severe acuity from today)
    const { data: criticalCases, error: criticalError } = await supabase
      .from('PatientData')
      .select('PatientID')
      .or('Severity.ilike.%Critical%,Severity.ilike.%Severe%')
      .gte('Time', `${todayDateString} 00:00:00`)
      .lte('Time', `${todayDateString} 23:59:59`)

    if (criticalError) throw criticalError

    // Log time calculations for recent patients
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log('Recent Patients Time Range:', {
      from: yesterday.toISOString(),
      currentTime: new Date().toISOString()
    });

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