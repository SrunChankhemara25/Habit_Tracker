'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { getTodaysHabits, getHabitLogs } from '@/lib/storage'
import { getLastNDays, formatDateDisplay } from '@/lib/helpers'
import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [stats, setStats] = useState({ completed: 0, skipped: 0, total: 0, rate: 0 })
  const [topHabits, setTopHabits] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const habits = getTodaysHabits(user.id)

    // Weekly data
    const last7Days = getLastNDays(7)
    const weekData = last7Days.map((date) => {
      let completed = 0
      let total = 0
      habits.forEach((habit) => {
        const logs = getHabitLogs(habit.id)
        const log = logs.find((l) => l.date === date)
        total++
        if (log?.status === 'completed') completed++
      })
      return {
        date: formatDateDisplay(date),
        completed,
        skipped: total - completed,
        total,
      }
    })
    setWeeklyData(weekData)

    // Monthly data (last 30 days)
    const last30Days = getLastNDays(30)
    const monthData = last30Days.map((date) => {
      let completed = 0
      habits.forEach((habit) => {
        const logs = getHabitLogs(habit.id)
        const log = logs.find((l) => l.date === date)
        if (log?.status === 'completed') completed++
      })
      return {
        date: new Date(date + 'T00:00:00').getDate(),
        completed,
      }
    })
    setMonthlyData(monthData)

    // Overall stats
    let totalCompleted = 0
    let totalSkipped = 0
    let totalLogs = 0

    habits.forEach((habit) => {
      const logs = getHabitLogs(habit.id)
      logs.forEach((log) => {
        totalLogs++
        if (log.status === 'completed') {
          totalCompleted++
        } else {
          totalSkipped++
        }
      })
    })

    const rate = totalLogs > 0 ? Math.round((totalCompleted / totalLogs) * 100) : 0
    setStats({ completed: totalCompleted, skipped: totalSkipped, total: totalLogs, rate })

    // Top habits
    const habitStats = habits.map((habit) => {
      const logs = getHabitLogs(habit.id)
      const completed = logs.filter((l) => l.status === 'completed').length
      return { name: habit.title, completed, rate: logs.length > 0 ? Math.round((completed / logs.length) * 100) : 0 }
    })
    habitStats.sort((a, b) => b.rate - a.rate)
    setTopHabits(habitStats.slice(0, 5))
  }, [user])

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
          <p className="text-foreground/60 mt-2">Track your habit performance and progress</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Overall Rate</p>
            <p className="text-4xl font-bold text-primary">{stats.rate}%</p>
            <p className="text-xs text-foreground/60 mt-2">All time completion</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-success">{stats.completed}</p>
            <p className="text-xs text-foreground/60 mt-2">Total habits done</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Skipped</p>
            <p className="text-4xl font-bold text-warning">{stats.skipped}</p>
            <p className="text-xs text-foreground/60 mt-2">Total habits missed</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground/60 text-sm mb-2">Total Logs</p>
            <p className="text-4xl font-bold text-accent">{stats.total}</p>
            <p className="text-xs text-foreground/60 mt-2">All records</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Weekly Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
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
                <Bar dataKey="completed" fill="var(--color-primary)" name="Completed" />
                <Bar dataKey="skipped" fill="var(--color-warning)" name="Skipped" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Monthly Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--color-primary)"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Habits */}
        {topHabits.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Top Habits</h3>
            <div className="space-y-3">
              {topHabits.map((habit, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{habit.name}</p>
                    <p className="text-sm text-foreground/60">{habit.completed} completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{habit.rate}%</p>
                    <p className="text-xs text-foreground/60">completion rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
