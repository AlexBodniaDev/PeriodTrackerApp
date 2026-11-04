import type { UserData, Period, Predictions } from "./types"
import { mockData } from "./mock-data"

const STORAGE_KEY = "cyclesense_data"

export function loadUserData(): UserData {
  if (typeof window === "undefined") return getDefaultData()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Error loading data:", error)
  }

  return getDefaultData()
}

export function saveUserData(data: UserData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("[v0] Error saving data:", error)
  }
}

function getDefaultData(): UserData {
  return {
    user: mockData.user,
    cycle: mockData.cycle,
    symptoms: mockData.symptoms,
    settings: {
      notifications: true,
      partnerMode: false,
      reminderTime: "09:00",
    },
  }
}

export function calculatePredictions(periods: Period[]): Predictions {
  if (periods.length === 0) {
    const today = new Date()
    const nextPeriod = new Date(today)
    nextPeriod.setUTCDate(nextPeriod.getUTCDate() + 28)

    const ovulation = new Date(nextPeriod)
    ovulation.setUTCDate(ovulation.getUTCDate() - 14)

    const fertileStart = new Date(ovulation)
    fertileStart.setUTCDate(fertileStart.getUTCDate() - 5)

    return {
      nextPeriod: nextPeriod.toISOString().split("T")[0],
      ovulation: ovulation.toISOString().split("T")[0],
      fertileWindow: [fertileStart.toISOString().split("T")[0], ovulation.toISOString().split("T")[0]],
      confidence: 0.5,
    }
  }

  // Sort periods by start date
  const sortedPeriods = [...periods].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

  // Calculate average cycle length
  let totalCycleLength = 0
  let cycleCount = 0

  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const current = new Date(sortedPeriods[i].start)
    const previous = new Date(sortedPeriods[i + 1].start)
    const cycleLength = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))

    if (cycleLength > 0 && cycleLength < 60) {
      totalCycleLength += cycleLength
      cycleCount++
    }
  }

  const avgCycleLength = cycleCount > 0 ? Math.round(totalCycleLength / cycleCount) : 28
  const confidence = Math.min(0.5 + cycleCount * 0.1, 0.95)

  // Predict next period
  const lastPeriod = new Date(sortedPeriods[0].start)
  const nextPeriod = new Date(lastPeriod)
  nextPeriod.setUTCDate(nextPeriod.getUTCDate() + avgCycleLength)

  // Calculate ovulation (typically 14 days before next period)
  const ovulation = new Date(nextPeriod)
  ovulation.setUTCDate(ovulation.getUTCDate() - 14)

  // Fertile window (5 days before ovulation to ovulation day)
  const fertileStart = new Date(ovulation)
  fertileStart.setUTCDate(fertileStart.getUTCDate() - 5)

  return {
    nextPeriod: nextPeriod.toISOString().split("T")[0],
    ovulation: ovulation.toISOString().split("T")[0],
    fertileWindow: [fertileStart.toISOString().split("T")[0], ovulation.toISOString().split("T")[0]],
    confidence,
  }
}
