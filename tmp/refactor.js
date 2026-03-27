const fs = require('fs');

let content = fs.readFileSync('app/dashboard/patient/[id]/page.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  'import { Patient } from "@/types/patient"',
  `import { Patient } from "@/types/patient"\nimport { Input } from "@/components/ui/input"\nimport { Textarea } from "@/components/ui/textarea"\nimport { useToast } from "@/components/ui/use-toast"\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"\nimport { Loader2, Save, X } from "lucide-react"`
);

// 2. Add EditableField component
const editableComponent = `
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const EditableField = ({ isEditing, value, onChange, placeholder = "--", className = "", type = "text" }: { isEditing: boolean, value: any, onChange: (v: string) => void, placeholder?: string, className?: string, type?: string }) => {
  if (isEditing) {
    return <Input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={\`h-7 py-0 px-2 text-xs font-mono rounded-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary border-primary/30 \${className}\`} />
  }
  return <span className={className}>{value || placeholder}</span>
}

const EditableTextarea = ({ isEditing, value, onChange, placeholder = "None recorded", className = "" }: { isEditing: boolean, value: any, onChange: (v: string) => void, placeholder?: string, className?: string }) => {
  if (isEditing) {
    return <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={\`min-h-[60px] p-2 text-xs font-mono rounded-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary border-primary/30 \${className}\`} />
  }
  return <span className={className}>{value || placeholder}</span>
}
`
content = content.replace('export default function PatientPage() {', editableComponent + '\nexport default function PatientPage() {');

// 3. Inject State and save handler
const newStateBlock = `
  const params = useParams()
  const { privacyMode, formatPatientName } = usePrivacy()
  const { toast } = useToast()
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edits
      setEditedPatient(JSON.parse(JSON.stringify(patient)))
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }
  
  const handleInputChange = (field: keyof Patient, value: any) => {
    if (!editedPatient) return
    setEditedPatient({ ...editedPatient, [field]: value })
  }
  
  const handleSave = async () => {
    if (!editedPatient) return
    setSaving(true)
    try {
      const response = await fetch('/api/patient', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPatient),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to update record")

      setPatient(editedPatient)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Patient record updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save record",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
`
content = content.replace(/const params \= useParams\(\)[\s\S]*?const \[editModalOpen\, setEditModalOpen\] \= useState\(false\)/, newStateBlock);

// Inject initial editedPatient state sync
content = content.replace(
  'setPatient(data.length > 0 ? data[0] : null)', 
  'setPatient(data.length > 0 ? data[0] : null)\n        setEditedPatient(data.length > 0 ? JSON.parse(JSON.stringify(data[0])) : null)'
);

// 4. Update the buttons in Header
const headerButtons = `        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={() => patient && generatePatientPDF(patient)}>
                <FileText className="mr-2 h-3 w-3" />
                Print
              </Button>
              <Button className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={handleEditToggle}>
                <Clipboard className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={handleEditToggle} disabled={saving}>
                <X className="mr-2 h-3 w-3" />
                Cancel
              </Button>
              <Button className="rounded-sm font-bold uppercase tracking-wider text-xs h-9" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                Save
              </Button>
            </>
          )}
        </div>`;
content = content.replace(/<div className="flex gap-2">\s*<Button variant="outline"[\s\S]*?<\/div>/, headerButtons);

// 5. Remove `<PatientEditModal.../>`
content = content.replace(/\{\/\* Edit Modal \*\/\}\s*\{patient && \(\s*<PatientEditModal[\s\S]*?\/>\s*\)\}/, '');

// Remove unused function
content = content.replace(/const handlePatientUpdated = \(updatedPatient: Patient\) => \{[\s\S]*?\}/, '');

// 6. Replace string fields with EditableField.
content = content.replace(/{patient\.([A-Za-z0-9_]+) \|\| ("[^"]+")}/g, '<EditableField isEditing={isEditing} value={editedPatient?.$1} onChange={(v) => handleInputChange("$1", v)} placeholder={$2} />');
content = content.replace(/{patient\.([A-Za-z0-9_]+) \? \`\${patient\.([A-Za-z0-9_]+)} kg\` : "--"}/g, '<EditableField type="number" isEditing={isEditing} value={editedPatient?.$1} onChange={(v) => handleInputChange("$1", v ? parseFloat(v) : null)} placeholder="--" />');
content = content.replace(/{privacyMode \? "\*\*" : \(patient\.Age \|\| "--"\)}/g, '<EditableField type="number" isEditing={isEditing} value={editedPatient?.Age} onChange={(v) => handleInputChange("Age", v ? parseInt(v) : null)} placeholder="--" />');

content = content.replace(/{formatList\(patient\.([A-Za-z0-9_]+)\) \|\| "None recorded"}/g, '<EditableTextarea isEditing={isEditing} value={editedPatient?.$1} onChange={(v) => handleInputChange("$1", v)} />');

content = content.replace(/{privacyMode \? "Obscured" : \(patient\.HomeAddress \|\| "--"\)}/g, '<EditableField isEditing={isEditing} value={editedPatient?.HomeAddress} onChange={(v) => handleInputChange("HomeAddress", v)} />');
content = content.replace(/{privacyMode \? "\*\*\*, \*\*" : \`\${patient\.City \|\| "--"}, \${patient\.State \|\| "--"}\`}/g, '{isEditing ? <div className="flex gap-2"><EditableField isEditing={isEditing} value={editedPatient?.City} onChange={(v) => handleInputChange("City", v)} placeholder="City" /><EditableField isEditing={isEditing} value={editedPatient?.State} onChange={(v) => handleInputChange("State", v)} placeholder="State" className="w-16" /></div> : (privacyMode ? "***, **" : `${patient.City || "--"}, ${patient.State || "--"}`)}');
content = content.replace(/{privacyMode \? "\*\*\*\*\*" : \`\${patient\.ZIPCode \|\| "--"} \/ \${patient\.County \|\| "--"}\`}/g, '{isEditing ? <div className="flex gap-2"><EditableField isEditing={isEditing} value={editedPatient?.ZIPCode} onChange={(v) => handleInputChange("ZIPCode", v)} placeholder="ZIP" className="w-20" /><span>/</span><EditableField isEditing={isEditing} value={editedPatient?.County} onChange={(v) => handleInputChange("County", v)} placeholder="County" /></div> : (privacyMode ? "*****" : `${patient.ZIPCode || "--"} / ${patient.County || "--"}`)}');
content = content.replace(/{privacyMode \? "\(\*\*\*\) \*\*\*-\*\*\*\*" : \(patient\.ContactInfo \|\| "--"\)}/g, '<EditableField isEditing={isEditing} value={editedPatient?.ContactInfo} onChange={(v) => handleInputChange("ContactInfo", v)} placeholder="--" />');

content = content.replace(/<span>\{privacyMode \? "\*\*" : patient\.Age\} YRS<\/span>/, '<span>{isEditing ? <EditableField type="number" isEditing={isEditing} value={editedPatient?.Age} onChange={(v) => handleInputChange("Age", v ? parseInt(v) : null)} className="w-12 h-5 text-center" /> : (privacyMode ? "**" : patient.Age)} YRS</span>');
content = content.replace(/<span>\{patient\.Gender\}<\/span>/, '<span><EditableField isEditing={isEditing} value={editedPatient?.Gender} onChange={(v) => handleInputChange("Gender", v)} className="w-16 h-5 text-center" /></span>');
content = content.replace(/<span className="text-primary font-bold">INC #\{patient\.IncidentNumber\}<\/span>/, '<span className="text-primary font-bold flex items-center gap-1">INC #<EditableField isEditing={isEditing} value={editedPatient?.IncidentNumber} onChange={(v) => handleInputChange("IncidentNumber", v)} className="w-24 h-5" /></span>');

content = content.replace(/{patient\.([A-Za-z0-9_]+) \|\| "-"}/g, '<EditableField isEditing={isEditing} value={editedPatient?.$1} onChange={(v) => handleInputChange("$1", v)} placeholder="-" />');
content = content.replace(/{patient\.([A-Za-z0-9_]+) \|\| "--\/--"}/g, '<EditableField isEditing={isEditing} value={editedPatient?.$1} onChange={(v) => handleInputChange("$1", v)} placeholder="--/--" />');

content = content.replace(
  '<h1 className="text-3xl font-bold font-mono tracking-tight uppercase">{formatPatientName(patient.PatientName, patient.PatientID)}</h1>',
  `{isEditing ? (
              <Input 
                className="h-10 text-xl font-bold font-mono tracking-tight uppercase rounded-sm border-primary/30 min-w-[300px]" 
                value={editedPatient?.PatientName || ""} 
                onChange={(e) => handleInputChange("PatientName", e.target.value)} 
              />
            ) : (
              <h1 className="text-3xl font-bold font-mono tracking-tight uppercase">{formatPatientName(patient.PatientName, patient.PatientID)}</h1>
            )}`
);

content = content.replace(/{patient\.([A-Za-z0-9_]+) \? \`\${patient\.([A-Za-z0-9_]+)} \${patient\.([A-Za-z0-9_]+)}\` : "--"}/g, '{patient.$1 ? `${patient.$2} ${patient.$3}` : "--"}'); // Simplify complex badges

fs.writeFileSync('app/dashboard/patient/[id]/page.tsx', content);
console.log("Refactor complete.");
