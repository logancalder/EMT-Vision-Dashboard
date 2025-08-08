import type React from "react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Inter } from "next/font/google"
import { Building2, Home } from "lucide-react"

// Load Inter font - Apple-like typography
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`flex h-screen bg-background ${inter.variable}`}>
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-8 py-4 bg-background border-b">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight">Patient Dashboard</h1>
              <p className="text-sm text-muted-foreground">Santa Clara Valley Medical Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <ModeToggle />
            {/* <Link href="/login">
              <Button variant="outline" className="hover:bg-gray-200">Logout</Button>
            </Link> */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

