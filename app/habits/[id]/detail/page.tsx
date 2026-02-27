'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { getHabitById, getHabitLogs, getStreakCount } from '@/lib/storage'
import { Habit, HabitLog } from '@/lib/types'
import { getLastNDays, formatDateDisplay } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit2, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function HabitDetailPage() {
  const params = useParams()
  const habitId = params.id as string
  const [habit, setHabit] = useState<Habit | null>(null)
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const h = getHabitById(habitId)
    if (h) {
      setHabit(h)
      const habitLogs = getHabitLogs(habitId)
      setLogs(habitLogs)
      setStreak(getStreakCount(habitId))
    }
    setLoading(false)
  }, [habitId])

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground/60">Loading habit...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (!habit) {
    return (
      <ProtectedLayout>
        <div className="flex-1 p-6 overflow-auto">
          <div className="text-center space-y-4 py-12">
            <h2 className="text-2xl font-bold text-foreground">Habit not found</h2>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  // Calculate stats
  const last7Days = getLastNDays(7)
  const chartData = last7Days.map((date) => {
    const log = logs.find((l) => l.date === date)
    return {
      date: formatDateDisplay(date),
      completed: log?.status === 'completed' ? 1 : 0,
    }
  })

  const completionRate = logs.filter((l) => l.status === 'completed').length
  const totalLogs = logs.length
  const completionPercentage = totalLogs > 0 ? Math.round((completionRate / totalLogs) * 100) : 0

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 text-foreground/60 hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{habit.title}</h1>
              {habit.description && (
                <p className="text-foreground/60 mt-2">{habit.description}</p>
              )}
            </div>
            <Link href={`/habits/${habitId}/edit`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-primary">
              {streak}
              <span className="text-2xl ml-2">🔥</span>
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Completion Rate</p>
            <p className="text-4xl font-bold text-accent">{completionPercentage}%</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Total Completed</p>
            <p className="text-4xl font-bold text-success">{completionRate}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Frequency</p>
            <p className="text-2xl font-bold text-foreground capitalize">{habit.frequency}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Last 7 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '8px',
                  color: 'var(--color-foreground)',
                }}
              />
              <Bar dataKey="completed" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* History */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">History</h3>
          {logs.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">No history yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                  >
                    <span className="text-foreground">{formatDateDisplay(log.date)}</span>
                    <div className="flex items-center gap-2">
                      {log.status === 'completed' ? (
                        <>
                          <span className="text-sm font-medium text-success">Completed</span>
                          <span className="text-lg">✓</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-foreground/60">Skipped</span>
                          <span className="text-lg text-foreground/40">✕</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}
