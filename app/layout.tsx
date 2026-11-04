import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CycleSense - Period Tracking & Predictions",
  description: "A modern period tracking app with predictions, symptom logging, and insights",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="phone-stage">
            <div className="phone-frame" id="phone-frame">
              <div className="phone-screen">
                <ToastProvider>{children}</ToastProvider>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
