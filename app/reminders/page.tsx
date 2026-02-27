'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { getTodaysHabits } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Bell, Check, X } from 'lucide-react'

export default function RemindersPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const todaysHabits = getTodaysHabits(user.id)
    setHabits(todaysHabits)

    // Filter habits with reminders enabled
    const habitReminders = todaysHabits
      .filter((h) => h.reminder_enabled)
      .map((habit) => ({
        ...habit,
        isRead: false,
      }))

    setReminders(habitReminders)
  }, [user])

  const handleMarkAsRead = (habitId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === habitId ? { ...r, isRead: true } : r))
    )
  }

  const handleDismiss = (habitId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== habitId))
  }

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Reminders</h1>
          <p className="text-foreground/60 mt-2">Stay on track with habit reminders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Total Habits</p>
            <p className="text-4xl font-bold text-primary">{habits.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">With Reminders</p>
            <p className="text-4xl font-bold text-accent">{reminders.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Pending</p>
            <p className="text-4xl font-bold text-warning">
              {reminders.filter((r) => !r.isRead).length}
            </p>
          </div>
        </div>

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center">
            <div className="inline-block p-3 bg-muted rounded-lg mb-4">
              <Bell className="w-8 h-8 text-foreground/60" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Reminders Set</h3>
            <p className="text-foreground/60">
              Enable reminders on your habits to get notified when it's time to complete them.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`border rounded-xl p-6 transition-all ${
                  reminder.isRead
                    ? 'bg-card border-border'
                    : 'bg-accent/5 border-accent/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!reminder.isRead && (
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                      )}
                      <h3 className="text-lg font-semibold text-foreground">{reminder.title}</h3>
                      {reminder.reminder_time && (
                        <span className="text-sm px-3 py-1 bg-muted rounded-full text-foreground/60">
                          {reminder.reminder_time}
                        </span>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-foreground/60 text-sm mb-3">{reminder.description}</p>
                    )}
                    <p className="text-xs text-foreground/50">
                      Frequency: <span className="capitalize font-medium">{reminder.frequency}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleMarkAsRead(reminder.id)}
                      size="sm"
                      variant="outline"
                      className="border-border text-foreground hover:bg-success hover:text-success-foreground hover:border-success"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDismiss(reminder.id)}
                      size="sm"
                      variant="outline"
                      className="border-border text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
