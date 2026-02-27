'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { HabitForm } from '@/components/habits/HabitForm'
import { getHabitById, saveHabit } from '@/lib/storage'
import { Habit } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditHabitPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const habitId = params.id as string
  const [habit, setHabit] = useState<Habit | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const loadHabit = () => {
      const h = getHabitById(habitId)
      if (!h) {
        setError('Habit not found')
      }
      setHabit(h)
      setPageLoading(false)
    }
    loadHabit()
  }, [habitId])

  const handleSubmit = async (data: Partial<Habit>) => {
    if (!habit || !user) return

    setIsLoading(true)
    setError(null)

    try {
      const updatedHabit: Habit = {
        ...habit,
        ...data,
        updated_at: new Date().toISOString(),
      }

      saveHabit(updatedHabit)
      router.push(`/habits/${habitId}/detail`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update habit')
    } finally {
      setIsLoading(false)
    }
  }

  if (pageLoading) {
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

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/habits/${habitId}/detail`}>
            <Button variant="ghost" className="mb-4 text-foreground/60 hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Habit
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Edit Habit</h1>
            <p className="text-foreground/60 mt-2">{habit.title}</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
            <HabitForm
              initialHabit={habit}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
