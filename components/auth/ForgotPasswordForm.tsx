'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Mail } from 'lucide-react'

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function ForgotPasswordForm({ onSubmit, isLoading = false, error = null }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(email)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Info */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-foreground/70">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input border-border"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 items-start p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium"
      >
        {isLoading ? 'Sending Code...' : 'Send Verification Code'}
      </Button>
    </form>
  )
}
