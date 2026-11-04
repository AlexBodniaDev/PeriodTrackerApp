"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { flowLabels, type FlowIntensity, type Period } from "@/lib/types"
import { useToast } from "@/components/ui/toast"

interface LogPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (period: Period) => void
}

export function LogPeriodModal({ isOpen, onClose, onSave }: LogPeriodModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>(2)
  const { addToast } = useToast()

  const handleSave = () => {
    if (!startDate) {
      addToast({
        title: "Error",
        description: "Please select a start date",
        variant: "error",
      })
      return
    }

    const formatDate = (date: Date) => {
      // локальна дата (toISOString зсувала день у часових поясах east of UTC)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    }

    const start = formatDate(startDate)
    const end = endDate && endDate >= startDate ? formatDate(endDate) : start

    // Calculate flow array based on duration
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    const days = Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1

    // Create flow array with varying intensities
    const flow = Array.from({ length: days }, (_, i) => {
      if (i === 0) return Math.max(1, flowIntensity - 1)
      if (i === days - 1) return Math.max(0, flowIntensity - 2)
      return flowIntensity
    })

    const period: Period = {
      start,
      end,
      flow,
    }

    onSave(period)

    addToast({
      title: "Period Logged",
      description: "Your period has been successfully logged",
      variant: "success",
    })

    // Reset form
    setStartDate(new Date())
    setEndDate(undefined)
    setFlowIntensity(2)
    onClose()
  }

  const DropletIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-4 h-4 ${filled ? "fill-current" : ""}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90%] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">Log Period</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Start Date</label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-lg border border-border bg-card"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">End Date (Optional)</label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => (startDate ? date < startDate : false)}
                className="rounded-lg border border-border bg-card"
              />
            </div>
          </div>

          {/* Flow Intensity */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Flow Intensity</label>
            <div className="grid grid-cols-4 gap-3">
              {([0, 1, 2, 3] as FlowIntensity[]).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setFlowIntensity(intensity)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    flowIntensity === intensity
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-950/50"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: intensity + 1 }).map((_, i) => (
                        <DropletIcon key={i} filled={flowIntensity === intensity} />
                      ))}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        flowIntensity === intensity ? "text-pink-600 dark:text-pink-400" : "text-muted-foreground"
                      }`}
                    >
                      {flowLabels[intensity]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white">
              Save Period
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
