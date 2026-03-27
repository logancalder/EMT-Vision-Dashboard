import type React from "react"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PrivacyProvider } from "@/components/privacy-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "Patient Dashboard",
  description: "Medical professional dashboard for patient information",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans tabular-nums`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PrivacyProvider>
            {children}
          </PrivacyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

