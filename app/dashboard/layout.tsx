import type React from "react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-secondary">
          <h1 className="text-2xl font-bold">Patient Dashboard v02d20y25</h1>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline">Logout</Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

