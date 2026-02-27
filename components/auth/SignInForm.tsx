'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Mail, Lock } from 'lucide-react'

interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function SignInForm({ onSubmit, isLoading = false, error = null }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input border-border"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        disabled={isLoading || !email || !password}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  )
}
