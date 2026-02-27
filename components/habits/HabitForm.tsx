'use client'

import { useState } from 'react'
import { Habit } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface HabitFormProps {
  initialHabit?: Habit
  onSubmit: (data: Partial<Habit>) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function HabitForm({ initialHabit, onSubmit, isLoading = false, error = null }: HabitFormProps) {
  const [title, setTitle] = useState(initialHabit?.title || '')
  const [description, setDescription] = useState(initialHabit?.description || '')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(
    (initialHabit?.frequency as 'daily' | 'weekly') || 'daily'
  )
  const [reminderTime, setReminderTime] = useState(initialHabit?.reminder_time || '09:00')
  const [reminderEnabled, setReminderEnabled] = useState(initialHabit?.reminder_enabled || false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!title.trim()) {
      setLocalError('Habit title is required')
      return
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      frequency,
      reminder_time: reminderEnabled ? reminderTime : undefined,
      reminder_enabled: reminderEnabled,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground font-medium">
          Habit Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Drink Water, Exercise, Read"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="bg-input border-border"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground font-medium">
          Description (Optional)
        </Label>
        <textarea
          id="description"
          placeholder="Add notes about your habit..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Frequency</Label>
        <div className="flex gap-4">
          {(['daily', 'weekly'] as const).map((freq) => (
            <label key={freq} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value={freq}
                checked={frequency === freq}
                onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
                disabled={isLoading}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground capitalize">{freq}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-foreground font-medium">Enable Reminder</span>
        </label>

        {reminderEnabled && (
          <div className="space-y-2 ml-7">
            <Label htmlFor="reminderTime" className="text-foreground text-sm font-medium">
              Reminder Time
            </Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border"
            />
          </div>
        )}
      </div>

      {/* Errors */}
      {(error || localError) && (
        <div className="flex gap-3 items-start p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error || localError}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium"
        >
          {isLoading ? 'Saving...' : initialHabit ? 'Update Habit' : 'Create Habit'}
        </Button>
      </div>
    </form>
  )
}
