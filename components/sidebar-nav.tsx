"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"

interface Patient {
  PatientID: string
  PatientName: string
  Age: string
  Gender: string
  HomeAddress: string
  City: string
  Country: string
  State: string
  ZIPCode: string
 
}
export function SidebarNav() {
  const pathname = usePathname()
  const [patients, setPatients] = useState<Patient[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("PatientData")
        .select("*")
        .order("PatientName")

      if (error) {
        console.error("Error fetching patients:", error)
      } else if (!data) {
        console.error("No data received")
      } else {
        console.log("Received data:", data)
        setPatients(data)
      }
    }

    fetchPatients()

    const channel = supabase
      .channel("patients_channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "patients" }, fetchPatients)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <nav className="w-64 bg-secondary p-4 overflow-hidden flex flex-col">
      <Link href="/" className="mb-6">
        <Image
          src="/emtvisionlogo.png"  // Make sure to add your logo file to the public directory
          alt="Home"
          width={150}
          height={150}
          className="hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="font-bold mb-4">Patients</div>
      <ScrollArea className="flex-1 rounded-md transition-all duration-200">
        <div className="space-y-1">
          {patients.map((patient) => (
            <Button
              key={patient.PatientID}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                pathname === `/dashboard/patient/${patient.PatientID}` && "bg-accent"
              )}
            >
              <Link href={`/dashboard/patient/${patient.PatientID}`}>{patient.PatientName}</Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}

