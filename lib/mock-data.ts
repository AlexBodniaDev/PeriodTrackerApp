export const mockData = {
  user: {
    id: 1,
    name: "Ava",
    goal: "Track Health",
  },
  cycle: {
    periods: [
      {
        start: "2025-10-02",
        end: "2025-10-07",
        flow: [2, 3, 3, 2, 1],
      },
      {
        start: "2025-09-04",
        end: "2025-09-09",
        flow: [1, 3, 3, 2, 1],
      },
    ],
    predictions: {
      nextPeriod: "2025-11-03",
      ovulation: "2025-10-20",
      fertileWindow: ["2025-10-15", "2025-10-20"],
      confidence: 0.85,
    },
  },
  symptoms: [
    {
      date: "2025-10-25",
      cramps: 2,
      mood: "irritable",
      sleep: 7,
      water: 5,
      fatigue: 3,
      headache: 1,
    },
    {
      date: "2025-10-24",
      cramps: 1,
      mood: "happy",
      sleep: 8,
      water: 6,
      fatigue: 1,
      headache: 0,
    },
    {
      date: "2025-10-23",
      cramps: 0,
      mood: "anxious",
      sleep: 6,
      water: 4,
      fatigue: 2,
      headache: 2,
    },
  ],
}

export type FlowIntensity = 0 | 1 | 2 | 3

export const flowLabels = {
  0: "Spotting",
  1: "Light",
  2: "Medium",
  3: "Heavy",
}
