"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Plus, Search, User, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full bg-background dark:bg-background">
      <div className="flex items-center justify-between space-y-2 pb-6">
        <h2 className="text-3xl font-bold tracking-tight">Medical Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground dark:text-foreground" />
            <Input type="search" placeholder="Search patients..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>

        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-foreground dark:text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+18 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
                <Heart className="h-4 w-4 text-foreground dark:text-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">-2 from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Patients you've seen recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Alex Thompson", age: 42, status: "Stable", lastVisit: "Today" },
                    { name: "Maria Garcia", age: 35, status: "Improving", lastVisit: "Yesterday" },
                    { name: "James Wilson", age: 58, status: "Critical", lastVisit: "2 days ago" },
                    { name: "Sophia Lee", age: 29, status: "Stable", lastVisit: "3 days ago" },
                  ].map((patient, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={patient.name} />
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Age: {patient.age} • Last visit: {patient.lastVisit}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        <Badge
                          variant={
                            patient.status === "Critical"
                              ? "destructive"
                              : patient.status === "Improving"
                                ? "outline"
                                : "secondary"
                          }
                          className="mr-2"
                        >
                          {patient.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Stats</CardTitle>
                <CardDescription>Patient distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] w-full flex items-center justify-center bg-muted/20 dark:bg-muted/10 rounded-md">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto text-foreground dark:text-foreground" />
                    <span className="block mt-2 text-sm text-muted-foreground">Department Chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="h-[400px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Users className="h-10 w-10 mx-auto mb-4 text-foreground dark:text-foreground" />
            <h3 className="text-lg font-medium">Patient Directory</h3>
            <p>Select the Patients tab to view and manage your patient records.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

