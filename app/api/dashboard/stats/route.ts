import { supabase } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get total patients count
    const { count: totalPatients, error: countError } = await supabase
      .from('PatientData')
      .select('PatientID', { count: 'exact', head: true })

    if (countError) throw countError

    // Get today's date in YYYY-MM-DD format
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Get critical cases - exact match for "Critical" in Severity
    const { data: criticalCases, error: criticalError } = await supabase
      .from('PatientData')
      .select('Severity')
      .eq('Severity', 'Critical')
      // .gte('Time', `${todayStr} 00:00:00`)
      // .lte('Time', `${todayStr} 23:59:59`)

    if (criticalError) throw criticalError

    // Get recent patients - last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const twentyFourHoursAgoStr = twentyFourHoursAgo.toISOString().replace('T', ' ').slice(0, 19)

    const { data: recentPatients, error: recentError } = await supabase
      .from('PatientData')
      .select('PatientID, PatientName, Age, Gender, Severity, Time')
      .gte('Time', twentyFourHoursAgoStr)
      .order('Time', { ascending: false })

    if (recentError) throw recentError

    // Debug logs
    console.log('Dashboard Stats Query:', {
      todayStr,
      twentyFourHoursAgoStr,
      criticalCasesQuery: {
        severity: 'Critical',
        timeRange: `${todayStr} 00:00:00 to ${todayStr} 23:59:59`
      },
      recentPatientsQuery: {
        timeRange: `${twentyFourHoursAgoStr} to now`
      }
    })

    console.log('Dashboard Stats Results:', {
      totalPatients,
      criticalCasesCount: criticalCases?.length || 0,
      recentPatientsCount: recentPatients?.length || 0,
      sampleCriticalCase: criticalCases?.[0],
      sampleRecentPatient: recentPatients?.[0]
    })

    return NextResponse.json({
      totalPatients: totalPatients || 0,
      criticalCases: criticalCases?.length || 0,
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