import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Patient } from '@/types/patient';

export function generatePatientPDF(patient: Patient) {
  // Create a new PDF document with A4 size
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set margins
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (2 * margin);
  
  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 1.2); // Return height used
  };
  
  // Helper function to add a section
  const addSection = (title: string, content: string[], startY: number, fontSize: number = 12) => {
    // Add section title
    doc.setFontSize(fontSize + 2);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, startY);
    
    // Add content
    doc.setFont('helvetica', 'normal');
    let currentY = startY + 8;
    
    for (const line of content) {
      const height = addWrappedText(line, margin, currentY, contentWidth, fontSize);
      currentY += height + 2;
      
      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 10;
      }
    }
    
    return currentY + 5; // Return the Y position after this section
  };
  
  // Add header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Medical Record', pageWidth / 2, margin, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin, margin, { align: 'right' });
  
  let currentY = margin + 15;
  
  // Add patient basic info
  const basicInfo = [
    `Patient Name: ${patient.PatientName}`,
    `Age: ${patient.Age} years`,
    `Gender: ${patient.Gender}`,
    `Incident Number: ${patient.IncidentNumber}`
  ];
  currentY = addSection('Patient Information', basicInfo, currentY);
  
  // Add vital signs
  const vitalSigns = [
    `Heart Rate: ${patient.HeartRate || 'N/A'}`,
    `Blood Pressure: ${patient.BloodPressure || 'N/A'}`,
    `Respiratory Rate: ${patient.RespiratoryRate || 'N/A'}`,
    `SPO2: ${patient.SPO2 || 'N/A'}`,
    `Temperature: ${patient.Temperature || 'N/A'}`,
    `Glucose: ${patient.Glucose || 'N/A'}`
  ];
  currentY = addSection('Vital Signs', vitalSigns, currentY);
  
  // Add medical history
  const medicalHistory = [
    `Past Medical History: ${patient.PastMedicalHistory || 'None recorded'}`,
    `Current Medications: ${patient.CurrentMedications || 'None recorded'}`,
    `Allergies: ${patient.MedicationAllergies || 'None recorded'}`,
    `Advance Directives: ${patient.AdvanceDirectives || 'None recorded'}`
  ];
  currentY = addSection('Medical History', medicalHistory, currentY);
  
  // Add primary complaint and assessment
  const complaintAssessment = [
    `Primary Complaint: ${patient.PrimaryComplaint || 'Not specified'}`,
    `Duration: ${patient.Duration || 'N/A'} ${patient.TimeUnits || ''}`,
    `Initial Acuity: ${patient.InitialAcuity || 'Not specified'}`,
    `Mental Status: ${patient.MentalStatus || 'Not assessed'}`
  ];
  currentY = addSection('Primary Complaint & Assessment', complaintAssessment, currentY);
  
  // Add physical examination
  const physicalExam = [
    `Chest Exam: ${patient.ChestExam || 'Not assessed'}`,
    `Abdomen Exam: ${patient.AbdomenExam || 'Not assessed'}`,
    `Lung Exam: ${patient.LungExam || 'Not assessed'}`,
    `Skin Assessment: ${patient.SkinAssessment || 'Not assessed'}`
  ];
  currentY = addSection('Physical Examination', physicalExam, currentY);
  
  // Add treatment information if available
  if (patient.Medication || patient.Procedure) {
    const treatmentInfo = [];
    
    if (patient.Medication) {
      treatmentInfo.push(
        `Medication: ${patient.Medication}`,
        `Dosage: ${patient.Dosage} ${patient.MedUnits || ''}`,
        `Route: ${patient.Route || 'Not specified'}`,
        `Time: ${patient.MedTime || 'Not recorded'}`,
        `Response: ${patient.MedResponse || 'Not recorded'}`
      );
    }
    
    if (patient.Procedure) {
      treatmentInfo.push(
        `Procedure: ${patient.Procedure}`,
        `Location: ${patient.ProcLocation || 'Not specified'}`,
        `Time: ${patient.ProcTime || 'Not recorded'}`,
        `Response: ${patient.ProcResponse || 'Not recorded'}`
      );
    }
    
    currentY = addSection('Treatment Information', treatmentInfo, currentY);
  }
  
  // Add disposition information
  const disposition = [
    `Transport Disposition: ${patient.TransportDisposition || 'Not recorded'}`,
    `Level of Care: ${patient.LevelOfCareProvided || 'Not recorded'}`,
    `Transport Agency: ${patient.TransportAgency || 'Not recorded'}`,
    `Transport Unit: ${patient.TransportUnit || 'Not recorded'}`
  ];
  currentY = addSection('Disposition', disposition, currentY);
  
  // Add footer with page numbers
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`${patient.PatientName.replace(/\s+/g, '_')}_Medical_Record.pdf`);
} 