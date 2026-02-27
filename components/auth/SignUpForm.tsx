'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Mail, User, Lock } from 'lucide-react'

interface SignUpFormProps {
  onSubmit: (email: string, fullName: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export function SignUpForm({ onSubmit, isLoading = false, error = null }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    await onSubmit(email, fullName, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground font-medium flex items-center gap-2">
          <User className="w-4 h-4" />
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          required
          className="bg-input border-border"
        />
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
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
        disabled={isLoading || !email || !fullName || !password || !confirmPassword}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
