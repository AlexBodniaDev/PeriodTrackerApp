import { Card } from "@/components/ui/card"
import { TrendingUp, Calendar, Activity, Brain } from "lucide-react"
import type { Symptom, Period } from "@/lib/types"

interface InsightsDashboardProps {
  symptoms: Symptom[]
  periods: Period[]
}

export function InsightsDashboard({ symptoms, periods }: InsightsDashboardProps) {
  const calculateStats = () => {
    if (periods.length < 2) {
      return {
        avgCycleLength: 28,
        avgPeriodDuration: 5,
        regularity: 85,
      }
    }

    // Calculate average cycle length
    const sortedPeriods = [...periods].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

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

    // Calculate average period duration
    const totalDuration = periods.reduce((sum, period) => {
      const start = new Date(period.start)
      const end = new Date(period.end)
      return sum + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }, 0)

    const avgPeriodDuration = Math.round(totalDuration / periods.length)

    // Calculate regularity (based on cycle length variance)
    const variance =
      cycleCount > 1
        ? sortedPeriods.slice(0, -1).reduce((sum, _, i) => {
            const current = new Date(sortedPeriods[i].start)
            const previous = new Date(sortedPeriods[i + 1].start)
            const cycleLength = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))
            return sum + Math.abs(cycleLength - avgCycleLength)
          }, 0) / cycleCount
        : 0

    const regularity = Math.max(50, Math.min(95, 95 - variance * 5))

    return {
      avgCycleLength,
      avgPeriodDuration,
      regularity: Math.round(regularity),
    }
  }

  const getTopSymptom = () => {
    if (symptoms.length === 0) return "None"

    const symptomCounts = {
      cramps: 0,
      fatigue: 0,
      headache: 0,
    }

    symptoms.forEach((s) => {
      if (s.cramps > 0) symptomCounts.cramps++
      if (s.fatigue > 0) symptomCounts.fatigue++
      if (s.headache > 0) symptomCounts.headache++
    })

    const max = Math.max(symptomCounts.cramps, symptomCounts.fatigue, symptomCounts.headache)
    if (max === 0) return "None"

    if (symptomCounts.fatigue === max) return "Fatigue"
    if (symptomCounts.cramps === max) return "Cramps"
    return "Headache"
  }

  const stats = calculateStats()
  const topSymptom = getTopSymptom()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">Your cycle analytics and patterns</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="text-sm text-muted-foreground">Avg Cycle</div>
          </div>
          <div className="text-3xl font-bold">{stats.avgCycleLength}</div>
          <div className="text-sm text-muted-foreground mt-1">days</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-sm text-muted-foreground">Period Length</div>
          </div>
          <div className="text-3xl font-bold">{stats.avgPeriodDuration}</div>
          <div className="text-sm text-muted-foreground mt-1">days</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-sm text-muted-foreground">Top Symptom</div>
          </div>
          <div className="text-2xl font-bold">{topSymptom}</div>
          <div className="text-sm text-muted-foreground mt-1">most frequent</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-sm text-muted-foreground">Regularity</div>
          </div>
          <div className="text-3xl font-bold">{stats.regularity}%</div>
          <div className="text-sm text-muted-foreground mt-1">consistent</div>
        </Card>
      </div>

      {/* Correlation Insight */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Pattern Detected</h3>
            <p className="text-foreground/80 dark:text-foreground/90">
              {symptoms.length > 0
                ? "You're tracking your symptoms consistently. Keep it up to discover more patterns!"
                : "Start logging symptoms to discover patterns in your cycle."}
            </p>
          </div>
        </div>
      </Card>

      {/* Phase Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <h3 className="font-bold">Menstrual Phase</h3>
            </div>
            <p className="text-sm text-foreground/80 dark:text-foreground/90">
              Rest and hydrate. Your body is shedding the uterine lining. Focus on gentle movement and self-care.
            </p>
            <div className="text-xs text-muted-foreground">Days 1-5</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h3 className="font-bold">Follicular Phase</h3>
            </div>
            <p className="text-sm text-foreground/80 dark:text-foreground/90">
              Boost your workouts. Rising estrogen levels give you more energy. Great time for challenging activities.
            </p>
            <div className="text-xs text-muted-foreground">Days 6-14</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h3 className="font-bold">Ovulation Phase</h3>
            </div>
            <p className="text-sm text-foreground/80 dark:text-foreground/90">
              Peak fertility window. You may feel more social and energetic. Estrogen is at its highest.
            </p>
            <div className="text-xs text-muted-foreground">Days 14-16</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <h3 className="font-bold">Luteal Phase</h3>
            </div>
            <p className="text-sm text-foreground/80 dark:text-foreground/90">
              PMS symptoms may appear. Progesterone rises then falls. Focus on stress management and nutrition.
            </p>
            <div className="text-xs text-muted-foreground">Days 17-28</div>
          </div>
        </Card>
      </div>

      {/* Symptom Heatmap */}
      {symptoms.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Recent Symptom Tracking</h3>
          <div className="space-y-3">
            {symptoms.slice(0, 5).map((symptom, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground w-20 flex-shrink-0">
                  {new Date(symptom.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-xs text-muted-foreground w-14 flex-shrink-0">Cramps</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`w-2 h-6 rounded ${i < symptom.cramps ? "bg-pink-500" : "bg-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-xs text-muted-foreground w-14 flex-shrink-0">Fatigue</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 rounded ${i < symptom.fatigue ? "bg-blue-500" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-xs text-muted-foreground w-14 flex-shrink-0">Mood</div>
                    <div className="text-xs font-medium capitalize text-foreground truncate">{symptom.mood}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
