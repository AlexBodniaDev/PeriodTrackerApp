import { Card } from "@/components/ui/card"

interface PredictionsCardProps {
  predictions: {
    nextPeriod: string
    ovulation: string
    fertileWindow: string[]
    confidence: number
  }
}

export function PredictionsCard({ predictions }: PredictionsCardProps) {
  const nextPeriodDate = new Date(predictions.nextPeriod)
  const now = new Date()
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const daysUntil = Math.round((nextPeriodDate.getTime() - todayUTC) / (1000 * 60 * 60 * 24))

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 border-pink-200 dark:border-gray-800">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Predictions</h2>
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-green-500 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(predictions.confidence * 100)}% Confidence
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Next Period */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-pink-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span className="text-sm font-medium">Next Period</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{daysUntil} days</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {nextPeriodDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>

          {/* Ovulation */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
              </svg>
              <span className="text-sm font-medium">Ovulation</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Date(predictions.ovulation).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expected date</div>
          </div>

          {/* Fertile Window */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-sm font-medium">Fertile Window</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {new Date(predictions.fertileWindow[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" - "}
              {new Date(predictions.fertileWindow[1]).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">5-day window</div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">Prediction Accuracy</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(predictions.confidence * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-600 rounded-full transition-all"
              style={{ width: `${predictions.confidence * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
