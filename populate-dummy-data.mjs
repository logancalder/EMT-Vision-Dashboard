import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'local.db');
const db = new Database(dbPath);

console.log('Clearing existing patients...');
db.exec('DELETE FROM PatientData');

console.log('Inserting fully populated clinical dummy data...');

const insertStmt = db.prepare(`
  INSERT INTO PatientData (
    PatientID, PatientName, Age, Gender, HomeAddress, City, County, State, ZIPCode, ContactInfo, WeightKg, Race,
    IncidentNumber, ServiceRequested, PrimaryComplaint, Duration, TimeUnits, PrimarySymptom, OtherSymptoms,
    PrimaryImpression, InitialAcuity, Severity, CardiacArrest, PossibleInjury,
    PastMedicalHistory, CurrentMedications, MedicationAllergies, AdvanceDirectives,
    HeartRate, BloodPressure, RespiratoryRate, SPO2, Temperature, Glucose,
    GCS_Eye, GCS_Verbal, GCS_Motor, GCS_Score, GCS_Qualifier,
    MentalStatus, AbdomenExam, ChestExam, LungExam, SkinAssessment, BackSpineExam, ExtremitiesExam, EyeExam_Bilateral,
    Time
  ) VALUES (
    @PatientID, @PatientName, @Age, @Gender, @HomeAddress, @City, @County, @State, @ZIPCode, @ContactInfo, @WeightKg, @Race,
    @IncidentNumber, @ServiceRequested, @PrimaryComplaint, @Duration, @TimeUnits, @PrimarySymptom, @OtherSymptoms,
    @PrimaryImpression, @InitialAcuity, @Severity, @CardiacArrest, @PossibleInjury,
    @PastMedicalHistory, @CurrentMedications, @MedicationAllergies, @AdvanceDirectives,
    @HeartRate, @BloodPressure, @RespiratoryRate, @SPO2, @Temperature, @Glucose,
    @GCS_Eye, @GCS_Verbal, @GCS_Motor, @GCS_Score, @GCS_Qualifier,
    @MentalStatus, @AbdomenExam, @ChestExam, @LungExam, @SkinAssessment, @BackSpineExam, @ExtremitiesExam, @EyeExam_Bilateral,
    @Time
  )
`);

const patients = [
  {
    PatientID: 'P-100452',
    PatientName: 'John Doe',
    Age: '45',
    Gender: 'Male',
    HomeAddress: '123 Fake Street',
    City: 'Los Angeles',
    County: 'Los Angeles',
    State: 'CA',
    ZIPCode: '90001',
    ContactInfo: '(555) 123-4567',
    WeightKg: '85',
    Race: 'Caucasian',
    IncidentNumber: 'INC-260301',
    ServiceRequested: '911 Response',
    PrimaryComplaint: 'Severe Chest Pain',
    Duration: '45',
    TimeUnits: 'Minutes',
    PrimarySymptom: 'Crushing pain radiating to left arm',
    OtherSymptoms: 'Diaphoresis, Nausea',
    PrimaryImpression: 'Myocardial Infarction',
    InitialAcuity: 'Critical',
    Severity: 'Critical',
    CardiacArrest: 'No',
    PossibleInjury: 'No',
    PastMedicalHistory: 'Hypertension, Type 2 Diabetes',
    CurrentMedications: 'Lisinopril, Metformin',
    MedicationAllergies: 'Penicillin',
    AdvanceDirectives: 'Full Code',
    HeartRate: '115',
    BloodPressure: '160/95',
    RespiratoryRate: '22',
    SPO2: '94',
    Temperature: '98.6°F',
    Glucose: '145 mg/dL',
    GCS_Eye: '4',
    GCS_Verbal: '5',
    GCS_Motor: '6',
    GCS_Score: '15',
    GCS_Qualifier: '',
    MentalStatus: 'Alert and Oriented x4, Anxious',
    AbdomenExam: 'Soft, non-tender',
    ChestExam: 'No trauma, equal rise',
    LungExam: 'Clear bilaterally',
    SkinAssessment: 'Pale, diaphoretic',
    BackSpineExam: 'Unremarkable',
    ExtremitiesExam: 'Cap refill < 2s, pulses strong',
    EyeExam_Bilateral: 'PERRLA 4mm',
    Time: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    PatientID: 'P-883210',
    PatientName: 'Jane Smith',
    Age: '62',
    Gender: 'Female',
    HomeAddress: '456 Oak Lane',
    City: 'Pasadena',
    County: 'Los Angeles',
    State: 'CA',
    ZIPCode: '91101',
    ContactInfo: '(555) 987-6543',
    WeightKg: '68',
    Race: 'African American',
    IncidentNumber: 'INC-260302',
    ServiceRequested: '911 Response',
    PrimaryComplaint: 'Shortness of Breath',
    Duration: '2',
    TimeUnits: 'Hours',
    PrimarySymptom: 'Difficulty breathing',
    OtherSymptoms: 'Wheezing, Productive cough',
    PrimaryImpression: 'COPD Exacerbation',
    InitialAcuity: 'Moderate',
    Severity: 'Moderate',
    CardiacArrest: 'No',
    PossibleInjury: 'No',
    PastMedicalHistory: 'COPD, Asthma',
    CurrentMedications: 'Albuterol Inhaler, Symbicort',
    MedicationAllergies: 'Sulfa Drugs',
    AdvanceDirectives: 'DNR',
    HeartRate: '98',
    BloodPressure: '135/85',
    RespiratoryRate: '28',
    SPO2: '88',
    Temperature: '99.1°F',
    Glucose: '110 mg/dL',
    GCS_Eye: '4',
    GCS_Verbal: '5',
    GCS_Motor: '6',
    GCS_Score: '15',
    GCS_Qualifier: '',
    MentalStatus: 'Alert and Oriented x4',
    AbdomenExam: 'Soft, non-tender',
    ChestExam: 'Accessory muscle use',
    LungExam: 'Expiratory wheezes bilaterally',
    SkinAssessment: 'Warm, dry, appropriate',
    BackSpineExam: 'Unremarkable',
    ExtremitiesExam: 'No pedal edema',
    EyeExam_Bilateral: 'PERRLA 3mm',
    Time: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    PatientID: 'P-502914',
    PatientName: 'Unknown Male',
    Age: '30',
    Gender: 'Male',
    HomeAddress: 'Transient',
    City: 'Los Angeles',
    County: 'Los Angeles',
    State: 'CA',
    ZIPCode: '90013',
    ContactInfo: 'N/A',
    WeightKg: '75',
    Race: 'Hispanic',
    IncidentNumber: 'INC-260303',
    ServiceRequested: '911 Response',
    PrimaryComplaint: 'Fall/Trauma',
    Duration: '10',
    TimeUnits: 'Minutes',
    PrimarySymptom: 'Head laceration, altered mental status',
    OtherSymptoms: 'Amnesia to event',
    PrimaryImpression: 'Traumatic Brain Injury',
    InitialAcuity: 'Critical',
    Severity: 'Critical',
    CardiacArrest: 'No',
    PossibleInjury: 'Yes - Head/Neck',
    PastMedicalHistory: 'Unknown',
    CurrentMedications: 'Unknown',
    MedicationAllergies: 'Unknown',
    AdvanceDirectives: 'Unknown',
    HeartRate: '65',
    BloodPressure: '190/110',
    RespiratoryRate: '14',
    SPO2: '97',
    Temperature: '97.8°F',
    Glucose: '85 mg/dL',
    GCS_Eye: '2',
    GCS_Verbal: '3',
    GCS_Motor: '5',
    GCS_Score: '10',
    GCS_Qualifier: '',
    MentalStatus: 'Altered, confused',
    AbdomenExam: 'Soft, non-tender',
    ChestExam: 'No trauma',
    LungExam: 'Clear bilaterally',
    SkinAssessment: 'Warm, dry',
    BackSpineExam: 'C-Spine precautions taken. No gross stepoffs.',
    ExtremitiesExam: 'Moves all extremities to pain',
    EyeExam_Bilateral: 'Sluggish, L 4mm R 5mm',
    Time: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

const insertMany = db.transaction((pats) => {
  for (const pat of pats) {
    insertStmt.run(pat);
  }
});

insertMany(patients);
console.log('Dummy data successfully inserted!');
