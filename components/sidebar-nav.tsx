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
  Time: string
}

export function SidebarNav() {
  const pathname = usePathname()
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch patients')
        }
        
        setPatients(data)
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }

    fetchPatients()

    // Set up polling instead of real-time subscription
    const pollInterval = setInterval(fetchPatients, 5000) // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    });
  }

  // Group patients by date and hour
  const groupPatientsByDateAndHour = (patients: Patient[]) => {
    const groups: { [key: string]: { [key: string]: Patient[] } } = {};
    
    patients.forEach(patient => {
      const date = new Date(patient.Time);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toLocaleDateString('en-US'); // Get the date string
      const hour = formatTime(patient.Time);
      const dateKey = `${day}, ${dateString}`; // Combine abbreviated day and date

      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }
      if (!groups[dateKey][hour]) {
        groups[dateKey][hour] = [];
      }
      groups[dateKey][hour].push(patient);
    });

    return groups;
  }

  return (
    <nav className="w-64 bg-secondary p-4 overflow-hidden flex flex-col">
      <Link href="/" className="mb-6">
        <Image
          src="/emtvisionlogo.png" 
          alt="Home"
          width={150}
          height={150}
          className="hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="font-bold mb-4">Patients</div>
      <ScrollArea className="flex-1 rounded-md transition-all duration-200">
        <div className="space-y-1">
          {Object.entries(groupPatientsByDateAndHour(patients)).map(([dateKey, hours]) => (
            <div key={dateKey}>
              <div className="font-bold text-lg">{dateKey}</div>
              {Object.entries(hours).map(([hour, hourPatients]) => (
                <div key={hour}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 border-t">
                    {hour}
                  </div>
                  {hourPatients.map((patient) => (
                    <Button
                      key={patient.PatientID}
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-col items-start h-auto py-2",
                        pathname === `/dashboard/patient/${patient.PatientID}` && "bg-accent"
                      )}
                    >
                      <Link href={`/dashboard/patient/${patient.PatientID}`}>
                        <div className="font-medium">{patient.PatientName}</div>
                        <div className="text-xs text-gray-500 truncate">ID: {patient.PatientID}</div>
                      </Link>
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Profile section */}
      <div className="mt-auto pt-4 border-t">
        <Link href="/profile" className="flex items-center space-x-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Dr. John Smith</div>
            <div className="text-sm text-gray-500">MD, FACS</div>
          </div>
        </Link>
      </div>
    </nav>
  )
}

