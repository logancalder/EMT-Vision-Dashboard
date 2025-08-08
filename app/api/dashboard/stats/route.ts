import { supabase } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get total patients count
    const { count: totalPatients, error: countError } = await supabase
      .from('PatientData')
      .select('PatientID', { count: 'exact', head: true })

    if (countError) throw countError

    // Get recent patients - last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const { data: recentPatients, error: recentError } = await supabase
      .from('PatientData')
      .select('PatientID, PatientName, Age, Gender, Severity, Time')
      .gte('Time', twentyFourHoursAgo.toISOString())
      .order('Time', { ascending: false })

    if (recentError) throw recentError

    // Calculate critical cases from recent patients
    const criticalCases = recentPatients?.filter(patient => 
      patient.Severity?.toLowerCase() === 'critical'
    ) || []

    // Debug logs
    console.log('Dashboard Stats Query:', {
      twentyFourHoursAgo: twentyFourHoursAgo.toISOString(),
      recentPatientsQuery: {
        timeRange: `${twentyFourHoursAgo.toISOString()} to now`
      }
    })

    console.log('Dashboard Stats Results:', {
      totalPatients,
      criticalCasesCount: criticalCases.length,
      recentPatientsCount: recentPatients?.length || 0,
      sampleCriticalCase: criticalCases[0],
      sampleRecentPatient: recentPatients?.[0]
    })

    return NextResponse.json({
      totalPatients: totalPatients || 0,
      criticalCases: criticalCases.length,
      recentPatients: recentPatients?.length || 0,
      recentPatientsList: recentPatients || []
    })
    
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
} 