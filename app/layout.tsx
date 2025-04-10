import type React from "react"
import "@/app/landing.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

// Load Inter font - Apple-like typography
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "EMT Vision - Advanced Emergency Medical Technology",
  description: "Empowering first responders with cutting-edge technology for emergency medical services.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'