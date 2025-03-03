"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full bg-background dark:bg-background">
      <div className="flex items-center justify-between space-y-2 pb-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground dark:text-foreground" />
            <Input type="search" placeholder="Search analytics..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>
          <UserNav />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
            <CardDescription>Age distribution of patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { age: "0-18", percentage: 15, color: "bg-red-500" },
                { age: "19-35", percentage: 30, color: "bg-yellow-500" },
                { age: "36-50", percentage: 25, color: "bg-green-500" },
                { age: "51-65", percentage: 20, color: "bg-blue-500" },
                { age: "65+", percentage: 10, color: "bg-purple-500" },
              ].map((group, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{group.age}</span>
                    <span>{group.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`${group.color} h-2 rounded-full`} style={{ width: `${group.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Visits</CardTitle>
            <CardDescription>Patient visits over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {[
                { month: "Jan", visits: 120, percentage: 60 },
                { month: "Feb", visits: 150, percentage: 75 },
                { month: "Mar", visits: 90, percentage: 45 },
                { month: "Apr", visits: 180, percentage: 90 },
                { month: "May", visits: 130, percentage: 65 },
                { month: "Jun", visits: 200, percentage: 100 },
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 bg-primary rounded-t-md" style={{ height: `${data.percentage}%` }}></div>
                  <div className="mt-2 text-xs text-muted-foreground">{data.month}</div>
                  <div className="text-xs font-medium">{data.visits}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treatment Success Rate</CardTitle>
            <CardDescription>Success rates by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: "Cardiology", rate: 92 },
                { dept: "Neurology", rate: 87 },
                { dept: "Oncology", rate: 78 },
                { dept: "Pediatrics", rate: 95 },
                { dept: "Orthopedics", rate: 89 },
              ].map((dept, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{dept.dept}</span>
                    <span className="font-medium">{dept.rate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${dept.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Insurance Distribution</CardTitle>
            <CardDescription>Patient insurance types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-[200px] h-[200px] rounded-full border-8 border-muted relative flex items-center justify-center">
                {[
                  { type: "Private", percentage: 45, color: "border-blue-500", rotation: 0 },
                  { type: "Medicare", percentage: 30, color: "border-green-500", rotation: 162 },
                  { type: "Medicaid", percentage: 15, color: "border-yellow-500", rotation: 270 },
                  { type: "Self-Pay", percentage: 10, color: "border-red-500", rotation: 324 },
                ].map((insurance, index) => (
                  <div
                    key={index}
                    className={`absolute w-full h-full rounded-full border-8 ${insurance.color}`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((insurance.rotation * Math.PI) / 180)}% ${
                        50 + 50 * Math.sin((insurance.rotation * Math.PI) / 180)
                      }%)`,
                      transform: `rotate(${insurance.rotation}deg)`,
                    }}
                  ></div>
                ))}
                <div className="w-[150px] h-[150px] rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">1,248</div>
                    <div className="text-xs text-muted-foreground">Total Patients</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { type: "Private", percentage: 45, color: "bg-blue-500" },
                  { type: "Medicare", percentage: 30, color: "bg-green-500" },
                  { type: "Medicaid", percentage: 15, color: "bg-yellow-500" },
                  { type: "Self-Pay", percentage: 10, color: "bg-red-500" },
                ].map((insurance, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${insurance.color}`}></div>
                    <div className="text-xs">
                      <span className="font-medium">{insurance.type}</span>
                      <span className="text-muted-foreground ml-1">({insurance.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Patient satisfaction ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Dr. Sarah Johnson", role: "Cardiologist", rating: 4.8, patients: 42 },
                { name: "Dr. Michael Chen", role: "Neurologist", rating: 4.6, patients: 38 },
                { name: "Dr. Emily Davis", role: "Oncologist", rating: 4.9, patients: 35 },
                { name: "Dr. Robert Wilson", role: "Pediatrician", rating: 4.7, patients: 45 },
                { name: "Dr. Lisa Thompson", role: "Orthopedist", rating: 4.5, patients: 40 },
              ].map((doctor, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.role} • {doctor.patients} patients
                    </p>
                    <div className="flex items-center mt-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(doctor.rating) ? "text-yellow-500" : "text-muted"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      <span className="ml-1 text-xs font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

