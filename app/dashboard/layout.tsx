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
        <header className="flex justify-between items-center p-6 bg-secondary shadow-md">
          <h1 className="text-3xl font-bold text-primary">Patient Dashboard v03d31y25</h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline" className="hover:bg-gray-200">Logout</Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}

