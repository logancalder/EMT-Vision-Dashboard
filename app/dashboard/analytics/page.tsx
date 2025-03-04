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
            <CardTitle>Monthly Calls</CardTitle>
            <CardDescription>Patient calls over the last 6 months</CardDescription>
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
            <CardTitle>Call Genre</CardTitle>
            <CardDescription>Genre of calls over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: "Cardiology", rate: 32 },
                { dept: "Neurology", rate: 2 },
                { dept: "General", rate: 47 },
                { dept: "Pediatrics", rate: 9 },
                { dept: "Orthopedics", rate: 10 },
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

    </div>
  )
}

