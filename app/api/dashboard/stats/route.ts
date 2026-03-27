import db from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const totalPatientsRow = db.prepare('SELECT COUNT(*) as count FROM PatientData').get() as { count: number };
    const totalPatients = totalPatientsRow.count;

    // Log time calculations for critical cases
    const today = new Date();
    // Create UTC boundaries for today
    const startOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)).toISOString();
    const endOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)).toISOString();

    // Get critical cases (patients with critical/severe acuity from today)
    const criticalCasesRows = db.prepare(`
      SELECT PatientID FROM PatientData 
      WHERE (Severity LIKE '%Critical%' OR Severity LIKE '%Severe%') 
      AND Time >= ? AND Time <= ?
    `).all(startOfToday, endOfToday);

    // Get recent patients (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentPatients = db.prepare('SELECT * FROM PatientData WHERE Time >= ? ORDER BY Time DESC').all(yesterday);

    // Calculate Department stats based on primary complaint
    const allPatients = db.prepare('SELECT PrimaryComplaint FROM PatientData').all() as any[];
    
    const deptCounts: Record<string, number> = {
      'Cardiology': 0,
      'Trauma': 0,
      'Pulmonology': 0,
      'Neurology': 0,
      'Other': 0
    };

    allPatients.forEach((p) => {
      const complaint = (p.PrimaryComplaint || '').toLowerCase();
      if (complaint.includes('chest') || complaint.includes('heart') || complaint.includes('mi')) {
        deptCounts['Cardiology']++;
      } else if (complaint.includes('fall') || complaint.includes('injury') || complaint.includes('trauma') || complaint.includes('bleeding')) {
        deptCounts['Trauma']++;
      } else if (complaint.includes('breath') || complaint.includes('asthma') || complaint.includes('copd')) {
        deptCounts['Pulmonology']++;
      } else if (complaint.includes('stroke') || complaint.includes('seizure') || complaint.includes('headache')) {
        deptCounts['Neurology']++;
      } else {
        deptCounts['Other']++;
      }
    });

    const departmentStats = Object.entries(deptCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(stat => stat.value > 0);

    return NextResponse.json({
      totalPatients,
      criticalCases: criticalCasesRows.length,
      recentPatients: recentPatients.length,
      recentPatientsList: recentPatients,
      departmentStats
    })
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
} 