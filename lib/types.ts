export type FlowIntensity = 0 | 1 | 2 | 3

export interface Period {
  start: string
  end: string
  flow: number[]
}

export interface Predictions {
  nextPeriod: string
  ovulation: string
  fertileWindow: string[]
  confidence: number
}

export interface Symptom {
  date: string
  cramps: number
  mood: "happy" | "neutral" | "irritable" | "anxious"
  sleep: number
  water: number
  fatigue: number
  headache: number
  exercise?: boolean
  intercourse?: boolean
  libido?: number
}

export interface UserData {
  user: {
    id: number
    name: string
    goal: string
  }
  cycle: {
    periods: Period[]
    predictions: Predictions
  }
  symptoms: Symptom[]
  settings: {
    notifications: boolean
    partnerMode: boolean
    reminderTime: string
  }
}

export const flowLabels: Record<FlowIntensity, string> = {
  0: "Spotting",
  1: "Light",
  2: "Medium",
  3: "Heavy",
}
