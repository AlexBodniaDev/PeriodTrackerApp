"use client"

import { useState, useEffect } from "react"
import { CalendarView } from "@/components/calendar-view"
import { PredictionsCard } from "@/components/predictions-card"
import { SymptomLogger } from "@/components/symptom-logger"
import { InsightsDashboard } from "@/components/insights-dashboard"
import { UserProfile } from "@/components/user-profile"
import { LogPeriodModal } from "@/components/log-period-modal"
import { Calendar, FileText, BarChart3, User } from "lucide-react"
import { loadUserData, saveUserData, calculatePredictions } from "@/lib/storage"
import type { UserData, Period, Symptom } from "@/lib/types"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"calendar" | "log" | "insights" | "profile">("calendar")
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    setUserData(loadUserData())
  }, [])

  useEffect(() => {
    if (userData) {
      saveUserData(userData)
    }
  }, [userData])

  const handleAddPeriod = (period: Period) => {
    if (!userData) return

    const periods = [period, ...userData.cycle.periods]
    const newUserData = {
      ...userData,
      cycle: {
        ...userData.cycle,
        periods,
        predictions: calculatePredictions(periods),
      },
    }
    setUserData(newUserData)
  }

  const handleAddSymptom = (symptom: Symptom) => {
    if (!userData) return

    // Remove existing symptom for the same date if any
    const filteredSymptoms = userData.symptoms.filter((s) => s.date !== symptom.date)

    const newUserData = {
      ...userData,
      symptoms: [symptom, ...filteredSymptoms],
    }
    setUserData(newUserData)
  }

  const handleUpdateSettings = (settings: Partial<UserData["settings"]>) => {
    if (!userData) return

    const newUserData = {
      ...userData,
      settings: {
        ...userData.settings,
        ...settings,
      },
    }
    setUserData(newUserData)
  }

  if (!userData) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl">🌸</span>
          </div>
          <div className="text-lg font-medium">Loading CycleSense...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                CycleSense
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">Hello, {userData.user.name}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 animate-fade-in">
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <PredictionsCard predictions={userData.cycle.predictions} />
            <CalendarView
              periods={userData.cycle.periods}
              predictions={userData.cycle.predictions}
              onLogPeriod={() => setIsLogModalOpen(true)}
            />
          </div>
        )}

        {activeTab === "log" && <SymptomLogger onSave={handleAddSymptom} />}

        {activeTab === "insights" && (
          <InsightsDashboard symptoms={userData.symptoms} periods={userData.cycle.periods} />
        )}

        {activeTab === "profile" && (
          <UserProfile user={userData.user} settings={userData.settings} onUpdateSettings={handleUpdateSettings} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 bg-card border-t border-border z-20 safe-bottom">
        <div className="px-2">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-medium">Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab("log")}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "log" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs font-medium">Log</span>
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "insights" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-medium">Insights</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "profile" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Log Period Modal */}
      <LogPeriodModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} onSave={handleAddPeriod} />
    </div>
  )
}
