'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle2, RotateCcw } from 'lucide-react'

interface CodeVerificationProps {
  verificationCode: string
  email?: string
  onSubmit: (code: string) => Promise<void>
  onResend: () => void
  isLoading?: boolean
  error?: string | null
}

export function CodeVerification({
  verificationCode,
  email,
  onSubmit,
  onResend,
  isLoading = false,
  error = null,
}: CodeVerificationProps) {
  const [codes, setCodes] = useState<string[]>(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCodes = [...codes]
    newCodes[index] = value.slice(-1)
    setCodes(newCodes)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCodes = text.split('').concat(Array(6 - text.length).fill(''))
    setCodes(newCodes.slice(0, 6))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = codes.join('')
    
    if (fullCode.length !== 6) return

    setIsSubmitting(true)
    try {
      await onSubmit(fullCode)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fullCode = codes.join('')
  const isComplete = fullCode.length === 6

  return (
    <div className="space-y-6">
      {/* Email Display */}
      {email && (
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-foreground/70">Verifying: <span className="font-semibold text-foreground">{email}</span></p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-foreground font-medium text-base">
            Enter 6-Digit Code
          </Label>
          
          {/* 6-Column Code Input */}
          <div className="flex gap-3 justify-center md:justify-start">
            {codes.map((code, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isSubmitting || isLoading}
                className="w-12 h-14 text-center text-lg font-bold font-mono rounded-lg border-2 border-border/50 bg-card hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex gap-3 items-center p-3 bg-success/10 border border-success/30 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            <p className="text-sm text-success">Verification successful!</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || isLoading || !isComplete}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Code'}
        </Button>
      </form>

      {/* Resend Code */}
      <div className="flex flex-col gap-3 pt-2">
        <p className="text-center text-sm text-foreground/60">Didn't receive the code?</p>
        <Button
          type="button"
          onClick={onResend}
          disabled={isLoading || isSubmitting}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Resend Code
        </Button>
      </div>
    </div>
  )
}
