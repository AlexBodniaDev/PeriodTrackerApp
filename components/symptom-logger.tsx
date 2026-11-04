"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Activity, Brain, Heart, Moon, Smile, Frown, Meh } from "lucide-react"
import type { Symptom } from "@/lib/types"
import { useToast } from "@/components/ui/toast"

interface SymptomLoggerProps {
  onSave: (symptom: Symptom) => void
}

export function SymptomLogger({ onSave }: SymptomLoggerProps) {
  const { addToast } = useToast()
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  const [symptoms, setSymptoms] = useState<Omit<Symptom, "date">>({
    cramps: 0,
    fatigue: 0,
    headache: 0,
    mood: "neutral",
    sleep: 7,
    water: 5,
    exercise: false,
    intercourse: false,
    libido: 2,
  })

  const handleSave = () => {
    const symptomData: Symptom = {
      ...symptoms,
      date: today,
    }

    onSave(symptomData)

    addToast({
      title: "Symptoms Logged",
      description: "Your symptoms have been successfully saved",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Log Symptoms</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track how you're feeling today -{" "}
              {new Date(today).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Tabs defaultValue="physical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="physical" className="text-xs sm:text-sm">
                Physical
              </TabsTrigger>
              <TabsTrigger value="mood" className="text-xs sm:text-sm">
                Mood
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="text-xs sm:text-sm">
                Lifestyle
              </TabsTrigger>
              <TabsTrigger value="sexual" className="text-xs sm:text-sm whitespace-normal leading-tight py-2">
                Sexual Health
              </TabsTrigger>
            </TabsList>

            {/* Physical Symptoms */}
            <TabsContent value="physical" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Cramps</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.cramps === 0
                        ? "None"
                        : symptoms.cramps === 1
                          ? "Mild"
                          : symptoms.cramps === 2
                            ? "Moderate"
                            : "Severe"}
                    </span>
                  </div>
                  <Slider
                    value={[symptoms.cramps]}
                    onValueChange={([value]) => setSymptoms({ ...symptoms, cramps: value })}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Fatigue</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.fatigue === 0
                        ? "None"
                        : symptoms.fatigue === 1
                          ? "Mild"
                          : symptoms.fatigue === 2
                            ? "Moderate"
                            : "Severe"}
                    </span>
                  </div>
                  <Slider
                    value={[symptoms.fatigue]}
                    onValueChange={([value]) => setSymptoms({ ...symptoms, fatigue: value })}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Headache</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.headache === 0
                        ? "None"
                        : symptoms.headache === 1
                          ? "Mild"
                          : symptoms.headache === 2
                            ? "Moderate"
                            : "Severe"}
                    </span>
                  </div>
                  <Slider
                    value={[symptoms.headache]}
                    onValueChange={([value]) => setSymptoms({ ...symptoms, headache: value })}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Mood */}
            <TabsContent value="mood" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setSymptoms({ ...symptoms, mood: "happy" })}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    symptoms.mood === "happy"
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border bg-card"
                  }`}
                >
                  <Smile
                    className={`w-8 h-8 mx-auto mb-2 ${symptoms.mood === "happy" ? "text-green-500" : "text-muted-foreground"}`}
                  />
                  <div className="text-sm font-medium">Happy</div>
                </button>

                <button
                  onClick={() => setSymptoms({ ...symptoms, mood: "neutral" })}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    symptoms.mood === "neutral"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-border bg-card"
                  }`}
                >
                  <Meh
                    className={`w-8 h-8 mx-auto mb-2 ${symptoms.mood === "neutral" ? "text-blue-500" : "text-muted-foreground"}`}
                  />
                  <div className="text-sm font-medium">Neutral</div>
                </button>

                <button
                  onClick={() => setSymptoms({ ...symptoms, mood: "irritable" })}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    symptoms.mood === "irritable"
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                      : "border-border bg-card"
                  }`}
                >
                  <Frown
                    className={`w-8 h-8 mx-auto mb-2 ${symptoms.mood === "irritable" ? "text-orange-500" : "text-muted-foreground"}`}
                  />
                  <div className="text-sm font-medium">Irritable</div>
                </button>

                <button
                  onClick={() => setSymptoms({ ...symptoms, mood: "anxious" })}
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                    symptoms.mood === "anxious"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                      : "border-border bg-card"
                  }`}
                >
                  <Brain
                    className={`w-8 h-8 mx-auto mb-2 ${symptoms.mood === "anxious" ? "text-purple-500" : "text-muted-foreground"}`}
                  />
                  <div className="text-sm font-medium">Anxious</div>
                </button>
              </div>
            </TabsContent>

            {/* Lifestyle */}
            <TabsContent value="lifestyle" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Sleep Hours
                    </label>
                    <span className="text-sm text-muted-foreground">{symptoms.sleep}h</span>
                  </div>
                  <Slider
                    value={[symptoms.sleep]}
                    onValueChange={([value]) => setSymptoms({ ...symptoms, sleep: value })}
                    min={0}
                    max={12}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Water Intake (glasses)</label>
                    <span className="text-sm text-muted-foreground">{symptoms.water}</span>
                  </div>
                  <Slider
                    value={[symptoms.water]}
                    onValueChange={([value]) => setSymptoms({ ...symptoms, water: value })}
                    min={0}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={() => setSymptoms({ ...symptoms, exercise: !symptoms.exercise })}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    symptoms.exercise ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity
                        className={`w-5 h-5 ${symptoms.exercise ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span className="font-medium">Exercise Today</span>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${symptoms.exercise ? "bg-green-500" : "bg-muted"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${symptoms.exercise ? "translate-x-6" : "translate-x-0.5"} mt-0.5`}
                      />
                    </div>
                  </div>
                </button>
              </div>
            </TabsContent>

            {/* Sexual Health */}
            <TabsContent value="sexual" className="space-y-6 mt-6">
              <div className="space-y-4">
                <button
                  onClick={() => setSymptoms({ ...symptoms, intercourse: !symptoms.intercourse })}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    symptoms.intercourse ? "border-pink-500 bg-pink-50 dark:bg-pink-950" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart
                        className={`w-5 h-5 ${symptoms.intercourse ? "text-pink-500" : "text-muted-foreground"}`}
                      />
                      <span className="font-medium">Sexual Activity</span>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${symptoms.intercourse ? "bg-pink-500" : "bg-muted"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${symptoms.intercourse ? "translate-x-6" : "translate-x-0.5"} mt-0.5`}
                      />
                    </div>
                  </div>
                </button>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Libido Level</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.libido === 0
                        ? "Low"
                        : symptoms.libido === 1
                          ? "Medium-Low"
                          : symptoms.libido === 2
                            ? "Medium"
                            : symptoms.libido === 3
                              ? "Medium-High"
                              : "High"}
                    </span>
                  </div>
                  <Slider
                    value={[symptoms.libido || 2]}
                    onValueChange={([value]) => setSymptoms({ ...symptoms, libido: value })}
                    min={0}
                    max={4}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSave} className="w-full" size="lg">
            Save Symptoms
          </Button>
        </div>
      </Card>
    </div>
  )
}
