"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { flowLabels, type FlowIntensity } from "@/lib/mock-data"

interface Period {
  start: string
  end: string
  flow: number[]
}

interface Predictions {
  nextPeriod: string
  ovulation: string
  fertileWindow: string[]
  confidence: number
}

interface CalendarViewProps {
  periods: Period[]
  predictions: Predictions
  onLogPeriod: () => void
}

export function CalendarView({ periods, predictions, onLogPeriod }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isPeriodDay = (dateStr: string) => {
    return periods.some((period) => {
      const start = new Date(period.start)
      const end = new Date(period.end)
      const current = new Date(dateStr)
      return current >= start && current <= end
    })
  }

  const isPredictedPeriod = (dateStr: string) => {
    const predictedStart = new Date(predictions.nextPeriod)
    const predictedEnd = new Date(predictedStart)
    predictedEnd.setDate(predictedEnd.getDate() + 5)
    const current = new Date(dateStr)
    return current >= predictedStart && current <= predictedEnd
  }

  const isFertileWindow = (dateStr: string) => {
    const start = new Date(predictions.fertileWindow[0])
    const end = new Date(predictions.fertileWindow[1])
    const current = new Date(dateStr)
    return current >= start && current <= end
  }

  const isToday = (dateStr: string) => {
    const now = new Date()
    return dateStr === formatDate(now.getFullYear(), now.getMonth(), now.getDate())
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getDayInfo = (dateStr: string) => {
    const period = periods.find((p) => {
      const start = new Date(p.start)
      const end = new Date(p.end)
      const current = new Date(dateStr)
      return current >= start && current <= end
    })

    if (period) {
      const start = new Date(period.start)
      const current = new Date(dateStr)
      const dayIndex = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const flowIntensity = period.flow[dayIndex] as FlowIntensity
      return {
        type: "period",
        flow: flowLabels[flowIntensity],
        notes: "Logged period day",
      }
    }

    if (isPredictedPeriod(dateStr)) {
      return {
        type: "predicted",
        notes: "Predicted period",
      }
    }

    if (isFertileWindow(dateStr)) {
      return {
        type: "fertile",
        notes: "Fertile window",
      }
    }

    return null
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth} className="flex-shrink-0 bg-transparent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="flex-shrink-0 bg-transparent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <Button onClick={onLogPeriod} className="ml-2 bg-pink-600 hover:bg-pink-700 text-white flex-shrink-0">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Log Period</span>
              <span className="sm:hidden">Log</span>
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = formatDate(year, month, day)
            const isPeriod = isPeriodDay(dateStr)
            const isPredicted = isPredictedPeriod(dateStr)
            const isFertile = isFertileWindow(dateStr)
            const isCurrentDay = isToday(dateStr)

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all hover:scale-105 ${
                  isCurrentDay ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                } ${
                  isPeriod
                    ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white"
                    : isPredicted
                      ? "bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                      : isFertile
                        ? "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "bg-muted/50 hover:bg-muted text-foreground"
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
                {isPeriod && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white" />}
                {isPredicted && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-pink-400 dark:bg-pink-300" />
                )}
                {isFertile && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-300" />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-pink-500" />
            <span className="text-sm text-muted-foreground">Logged Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-950 border border-pink-200 dark:border-pink-800" />
            <span className="text-sm text-muted-foreground">Predicted Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800" />
            <span className="text-sm text-muted-foreground">Fertile Window</span>
          </div>
        </div>

        {/* Selected Date Info */}
        {selectedDate && getDayInfo(selectedDate) && (
          <Card className="p-4 bg-muted/50 animate-fade-in">
            <div className="space-y-2">
              <div className="font-medium text-foreground">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-sm text-muted-foreground">{getDayInfo(selectedDate)?.notes}</div>
              {getDayInfo(selectedDate)?.flow && (
                <div className="text-sm text-foreground">
                  <span className="font-medium">Flow: </span>
                  {getDayInfo(selectedDate)?.flow}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Card>
  )
}
