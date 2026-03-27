import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Connect to or create local.db in the project root
let dbPath = path.resolve(process.cwd(), 'local.db');

// In production (Vercel), the filesystem is read-only. 
// We must copy the DB to /tmp to make it writable and avoid PRAGMA errors.
if (process.env.NODE_ENV === 'production') {
  const tmpPath = '/tmp/local.db';
  try {
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpPath);
        console.log("Successfully copied local.db to /tmp");
      } else {
        console.warn(`Could not find local.db at ${dbPath}`);
      }
    }
    dbPath = tmpPath;
  } catch (err) {
    console.error('Failed to copy DB to /tmp', err);
  }
}

const db = new Database(dbPath);
try {
  db.pragma('journal_mode = WAL');
} catch (e) {
  console.warn('Could not set WAL mode (might be on read-only fs)', e);
}

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS PatientData (
    PatientID TEXT PRIMARY KEY,
    PatientName TEXT,
    Age TEXT,
    Gender TEXT,
    HomeAddress TEXT,
    City TEXT,
    County TEXT,
    State TEXT,
    ZIPCode TEXT,
    ContactInfo TEXT,
    WeightKg TEXT,
    Race TEXT,
    IncidentNumber TEXT,
    ServiceRequested TEXT,
    OtherAgencies TEXT,
    PrimaryRole TEXT,
    ResponseMode TEXT,
    EMSShift TEXT,
    DispatchCity TEXT,
    DispatchState TEXT,
    DispatchZIP TEXT,
    DispatchCounty TEXT,
    SceneType TEXT,
    Category TEXT,
    BackInService TEXT,
    CrewMembers TEXT,
    NumberOfCrew TEXT,
    OtherAgencyOnScene TEXT,
    NumberOfPatients TEXT,
    PatientContactMade TEXT,
    ArrivedOnScene TEXT,
    FirstOnScene TEXT,
    StagePriorToContact TEXT,
    PrimaryComplaint TEXT,
    Duration TEXT,
    TimeUnits TEXT,
    AlcoholDrugUse TEXT,
    InitialAcuity TEXT,
    CardiacArrest TEXT,
    PossibleInjury TEXT,
    BaseContactMade TEXT,
    SignsOfAbuse TEXT,
    "5150Hold" TEXT,
    PastMedicalHistory TEXT,
    CurrentMedications TEXT,
    MedicationAllergies TEXT,
    AdvanceDirectives TEXT,
    HeartRate TEXT,
    BloodPressure TEXT,
    RespiratoryRate TEXT,
    SPO2 TEXT,
    Temperature TEXT,
    Glucose TEXT,
    GCS_Eye TEXT,
    GCS_Verbal TEXT,
    GCS_Motor TEXT,
    GCS_Score TEXT,
    GCS_Qualifier TEXT,
    MentalStatus TEXT,
    AbdomenExam TEXT,
    ChestExam TEXT,
    LungExam TEXT,
    SkinAssessment TEXT,
    BackSpineExam TEXT,
    ExtremitiesExam TEXT,
    EyeExam_Bilateral TEXT,
    EyeExam_Left TEXT,
    EyeExam_Right TEXT,
    Medication TEXT,
    Dosage TEXT,
    MedUnits TEXT,
    Route TEXT,
    MedTime TEXT,
    MedResponse TEXT,
    MedComplications TEXT,
    Procedure TEXT,
    ProcLocation TEXT,
    IVLocation TEXT,
    Size TEXT,
    ProcTime TEXT,
    Attempts TEXT,
    Successful TEXT,
    ProcResponse TEXT,
    TransportDisposition TEXT,
    LevelOfCareProvided TEXT,
    TransportAgency TEXT,
    TransportUnit TEXT,
    TransportReason TEXT,
    EMSPrimaryCareProvider TEXT,
    Severity TEXT,
    PrimarySymptom TEXT,
    OtherSymptoms TEXT,
    PrimaryImpression TEXT,
    Time TEXT
  );

  CREATE TABLE IF NOT EXISTS Medications (
    MedicationID TEXT PRIMARY KEY,
    MedicationName TEXT,
    QuantityAdministered REAL,
    Timestamp TEXT,
    PatientID TEXT
  );
`);

export default db;
