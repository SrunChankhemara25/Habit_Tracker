'use client'

import { Habit, HabitLog } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/helpers'
import { saveHabitLog, getHabitLogByDate, getStreakCount } from '@/lib/storage'
import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HabitCardProps {
  habit: Habit
  onDelete: (id: string) => void
  onUpdate: () => void
}

export function HabitCard({ habit, onDelete, onUpdate }: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const today = formatDate(new Date())
    const log = getHabitLogByDate(habit.id, today)
    setIsCompleted(log?.status === 'completed')
    setStreak(getStreakCount(habit.id))
  }, [habit.id])

  const handleToggleComplete = async () => {
    const today = formatDate(new Date())
    const newStatus = isCompleted ? 'skipped' : 'completed'
    
    const log: HabitLog = {
      id: `log_${Date.now()}`,
      habit_id: habit.id,
      date: today,
      status: newStatus as 'completed' | 'skipped',
      streak_count: newStatus === 'completed' ? streak + 1 : Math.max(0, streak - 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveHabitLog(log)
    setIsCompleted(newStatus === 'completed')
    onUpdate()
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${habit.title}"?`)) {
      onDelete(habit.id)
    }
  }

  return (
    <div className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{habit.title}</h3>
          {habit.description && (
            <p className="text-sm text-foreground/60 mt-1">{habit.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/habits/${habit.id}/edit`}>
            <Button size="sm" variant="ghost" className="text-foreground/60 hover:text-foreground">
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="text-destructive/60 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xs text-foreground/60">Current Streak</p>
              <p className="text-lg font-bold text-foreground">{streak} days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-foreground/60">Frequency</p>
            <p className="text-sm font-semibold text-foreground capitalize">{habit.frequency}</p>
          </div>
        </div>

        {/* Complete Button */}
        <Button
          onClick={handleToggleComplete}
          className={cn(
            'w-full transition-all',
            isCompleted
              ? 'bg-success hover:bg-success/90 text-success-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          )}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed Today
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 mr-2" />
              Mark Complete
            </>
          )}
        </Button>

        {/* View Details */}
        <Link href={`/habits/${habit.id}/detail`}>
          <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
