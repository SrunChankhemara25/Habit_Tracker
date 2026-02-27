'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { HabitForm } from '@/components/habits/HabitForm'
import { saveHabit } from '@/lib/storage'
import { generateId } from '@/lib/helpers'
import { Habit } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddHabitPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: Partial<Habit>) => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const newHabit: Habit = {
        id: generateId(),
        user_id: user.id,
        title: data.title || '',
        description: data.description,
        frequency: data.frequency || 'daily',
        reminder_enabled: data.reminder_enabled || false,
        reminder_time: data.reminder_time,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      saveHabit(newHabit)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create habit')
    } finally {
      setIsLoading(false)
    }
  }

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
          <div>
            <h1 className="text-4xl font-bold text-foreground">Create New Habit</h1>
            <p className="text-foreground/60 mt-2">Start tracking a new habit today</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
            <HabitForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
