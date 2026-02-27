'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Lock } from 'lucide-react'

interface ResetPasswordFormProps {
  email: string
  onSubmit: (newPassword: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function ResetPasswordForm({
  email,
  onSubmit,
  isLoading = false,
  error = null,
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    await onSubmit(newPassword)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Info */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-foreground/70">Resetting password for: <span className="font-semibold text-foreground">{email}</span></p>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-foreground font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Minimum 6 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input border-border"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input border-border"
        />
      </div>

      {/* Errors */}
      {(error || passwordError) && (
        <div className="flex gap-3 items-start p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error || passwordError}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium"
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  )
}
