"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Moon, Sun, Users, Clock } from "lucide-react"
import { useTheme } from "next-themes"
import type { UserData } from "@/lib/types"
import { useToast } from "@/components/ui/toast"

interface UserProfileProps {
  user: UserData["user"]
  settings: UserData["settings"]
  onUpdateSettings: (settings: Partial<UserData["settings"]>) => void
}

export function UserProfile({ user, settings, onUpdateSettings }: UserProfileProps) {
  const { theme, setTheme } = useTheme()
  const { addToast } = useToast()

  const handleNotificationsChange = (checked: boolean) => {
    onUpdateSettings({ notifications: checked })
    addToast({
      title: checked ? "Notifications Enabled" : "Notifications Disabled",
      description: checked ? "You'll receive period reminders" : "You won't receive reminders",
      variant: "success",
    })
  }

  const handlePartnerModeChange = (checked: boolean) => {
    onUpdateSettings({ partnerMode: checked })
    addToast({
      title: checked ? "Partner Mode Enabled" : "Partner Mode Disabled",
      description: checked ? "Your partner can now view your cycle" : "Partner access removed",
      variant: "success",
    })
  }

  const handleReminderTimeChange = (time: string) => {
    onUpdateSettings({ reminderTime: time })
    addToast({
      title: "Reminder Time Updated",
      description: `Daily reminders set for ${time}`,
      variant: "success",
    })
  }

  const handleShareLink = () => {
    addToast({
      title: "Link Copied",
      description: "Partner access link copied to clipboard",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.goal}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">Avg Cycle</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Cycles Tracked</div>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Settings</h3>
        <div className="space-y-4">
          {/* Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">Get period reminders</div>
              </div>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={handleNotificationsChange} />
          </div>

          {/* Reminder Time */}
          {settings.notifications && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Reminder Time</div>
                  <div className="text-sm text-muted-foreground">Daily notification time</div>
                </div>
              </div>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleReminderTimeChange(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-muted-foreground">{theme === "dark" ? "Dark mode" : "Light mode"}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>
                <Sun className="w-4 h-4" />
              </Button>
              <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
                <Moon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Partner Mode */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Partner Mode</div>
                <div className="text-sm text-muted-foreground">Share read-only access</div>
              </div>
            </div>
            <Switch checked={settings.partnerMode} onCheckedChange={handlePartnerModeChange} />
          </div>

          {settings.partnerMode && (
            <Card className="p-4 bg-muted/50 animate-fade-in">
              <div className="text-sm space-y-2">
                <div className="font-medium">Partner Access Enabled</div>
                <div className="text-muted-foreground">
                  Your partner can view predictions and cycle information in read-only mode.
                </div>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={handleShareLink}>
                  Share Link
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">About CycleSense</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>A modern period tracking app designed to help you understand your cycle better.</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              Privacy Policy
            </Button>
            <Button variant="outline" size="sm">
              Terms of Service
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
