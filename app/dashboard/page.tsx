'use client'

import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useAuth } from '@/lib/context/AuthContext'
import { getTodaysHabits, deleteHabit, getHabits, getHabitLogs, calculateCompletionPercentage } from '@/lib/storage'
import { HabitCard } from '@/components/dashboard/HabitCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<any[]>([])
  const [completedToday, setCompletedToday] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (user) {
      loadHabits()
    }
  }, [user, refreshKey])

  const loadHabits = () => {
    if (!user) return
    
    const todaysHabits = getTodaysHabits(user.id)
    setHabits(todaysHabits)

    // Calculate completed count
    const today = new Date().toISOString().split('T')[0]
    let completed = 0
    todaysHabits.forEach((habit) => {
      const logs = getHabitLogs(habit.id)
      const todayLog = logs.find((l) => l.date === today)
      if (todayLog?.status === 'completed') {
        completed++
      }
    })
    setCompletedToday(completed)
  }

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId)
    setRefreshKey((prev) => prev + 1)
  }

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const completionPercentage = calculateCompletionPercentage(completedToday, habits.length)

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Welcome Back!</h1>
            <p className="text-foreground/60 mt-2">Track your habits and build consistency</p>
          </div>
          <Link href="/habits/add">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground md:w-auto w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Habit
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Today's Progress</p>
                <p className="text-4xl font-bold text-primary mt-2">{completionPercentage}%</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Completed Today</p>
                <p className="text-4xl font-bold text-success mt-2">
                  {completedToday}/{habits.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Total Habits</p>
                <p className="text-4xl font-bold text-accent mt-2">{habits.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center">
            <div className="inline-block p-3 bg-muted rounded-lg mb-4">
              <Plus className="w-8 h-8 text-foreground/60" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Habits Yet</h3>
            <p className="text-foreground/60 mb-6">Create your first habit to get started on your journey!</p>
            <Link href="/habits/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Habit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onDelete={handleDeleteHabit}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
