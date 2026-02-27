'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { getTodaysHabits, getHabitLogs } from '@/lib/storage'
import { getMonthDays } from '@/lib/helpers'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [days, setDays] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const habits = getTodaysHabits(user.id)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const monthDays = getMonthDays(year, month)
    const calendarDays = monthDays.map((date) => {
      let completedCount = 0
      let totalCount = habits.length

      habits.forEach((habit) => {
        const logs = getHabitLogs(habit.id)
        const log = logs.find((l) => l.date === date)
        if (log?.status === 'completed') {
          completedCount++
        }
      })

      return {
        date,
        day: new Date(date + 'T00:00:00').getDate(),
        completedCount,
        totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      }
    })

    setDays(calendarDays)
  }, [user, currentDate])

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getBackgroundColor = (percentage: number) => {
    if (percentage === 0) return 'bg-muted/30'
    if (percentage < 33) return 'bg-warning/30'
    if (percentage < 66) return 'bg-accent/30'
    return 'bg-success/30'
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Calendar</h1>
          <p className="text-foreground/60 mt-2">View your habit completion history</p>
        </div>

        {/* Calendar */}
        <div className="bg-card border border-border rounded-xl p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{monthName}</h2>
            <div className="flex gap-2">
              <Button onClick={previousMonth} variant="outline" size="icon" className="border-border">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button onClick={nextMonth} variant="outline" size="icon" className="border-border">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-4 gap-2 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/30 rounded" />
              <span className="text-foreground/60">0%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning/30 rounded" />
              <span className="text-foreground/60">1-33%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent/30 rounded" />
              <span className="text-foreground/60">34-66%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success/30 rounded" />
              <span className="text-foreground/60">67-100%</span>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-foreground/60 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {days.length > 0 && (
              <>
                {Array(new Date(days[0].date + 'T00:00:00').getDay())
                  .fill(0)
                  .map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                {/* Calendar days */}
                {days.map((day) => (
                  <div
                    key={day.date}
                    className={`aspect-square p-2 rounded-lg border border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all ${getBackgroundColor(
                      day.percentage
                    )}`}
                    title={`${day.day}: ${day.completedCount}/${day.totalCount} habits`}
                  >
                    <p className="font-semibold text-foreground text-sm">{day.day}</p>
                    <p className="text-xs text-foreground/60 mt-1">{day.percentage}%</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
