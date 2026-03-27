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
        <header className="border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="w-full flex justify-between items-center py-4 px-4 md:px-8">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground font-bold text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest">EMT Vision</span>
              <h1 className="text-xl font-bold font-mono tracking-tight text-primary uppercase">Patient Dashboard v04d08y25a</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              {/* <Link href="/login">
                <Button variant="outline" className="hover:bg-gray-200">Logout</Button>
              </Link> */}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

