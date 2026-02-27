'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { CodeVerification } from '@/components/auth/CodeVerification'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { generateVerificationCode } from '@/lib/helpers'
import { getUserByEmail, saveUser } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleForgotPassword = async (inputEmail: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = getUserByEmail(inputEmail)
      if (!user) {
        setError('Email not found')
        return
      }
      setEmail(inputEmail)
      setVerificationCode(generateVerificationCode())
      setStep('verify')
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)
    setError(null)
    try {
      setStep('reset')
    } catch {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (newPassword: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = getUserByEmail(email)
      if (!user) {
        setError('User not found')
        return
      }

      saveUser({ ...user, password: newPassword })

      setTimeout(() => {
        router.push('/signin')
      }, 1200)
    } catch {
      setError('Failed to reset password.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    setVerificationCode(generateVerificationCode())
  }

  const handleBack = () => {
    if (step === 'verify') {
      setStep('email')
      setEmail('')
      setVerificationCode('')
    } else if (step === 'reset') {
      setStep('verify')
    }
    setError(null)
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-6">
      
      <div className="w-full max-w-7xl h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-20 items-center">

          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col h-full py-10">

            {/* Logo */}
            <div>
              <Link href="/" className="inline-flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-14 h-14">
                    <img src="/logo.png" alt="logo" />
                  </div>
                </div>
                <span className="text-3xl font-bold text-foreground">
                  Habitopia
                </span>
              </Link>
            </div>

            {/* Center Text */}
            <div className="flex flex-1 items-center">
              <div>
                <h2 className="text-5xl font-bold leading-tight text-foreground">
                  <span>Get Back to</span>
                  <br />
                  <span className="gradient-text">
                    Your Habits
                  </span>
                </h2>

                <p className="text-xl text-foreground/70 max-w-lg leading-relaxed mt-[20px]">
                  We'll help you recover your account securely.
                  Reset your password and continue your habit journey.
                </p>
              </div>
            </div>


          </div>

          {/* RIGHT SIDE */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">

            <div className="space-y-8">

              {/* Title */}
              <div className="space-y-2">
                {step === 'email' && (
                  <>
                    <h1 className="text-4xl font-bold text-foreground">
                      Reset Password
                    </h1>
                    <p className="text-foreground/60">
                      Enter your email to continue
                    </p>
                  </>
                )}

                {step === 'verify' && (
                  <>
                    <h1 className="text-4xl font-bold text-foreground">
                      Verify Email
                    </h1>
                    <p className="text-foreground/60">
                      Enter the verification code
                    </p>
                  </>
                )}

                {step === 'reset' && (
                  <>
                    <h1 className="text-4xl font-bold text-foreground">
                      New Password
                    </h1>
                    <p className="text-foreground/60">
                      Create a secure new password
                    </p>
                  </>
                )}
              </div>

              {/* Card */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-md">

                {step === 'email' && (
                  <ForgotPasswordForm
                    onSubmit={handleForgotPassword}
                    isLoading={isLoading}
                    error={error}
                  />
                )}

                {step === 'verify' && (
                  <CodeVerification
                    verificationCode={verificationCode}
                    email={email}
                    onSubmit={handleVerifyCode}
                    onResend={handleResendCode}
                    isLoading={isLoading}
                    error={error}
                  />
                )}

                {step === 'reset' && (
                  <ResetPasswordForm
                    email={email}
                    onSubmit={handleResetPassword}
                    isLoading={isLoading}
                    error={error}
                  />
                )}

              </div>

              {/* Back */}
              {step !== 'email' && (
                <Button
                  onClick={handleBack}
                  variant="default"
                  className="w-full text-foreground/70 hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

            </div>
            <div className="text-center space-y-3 mt-10">
                <p className="text-foreground/60 text-sm">
                  Remember your password?{' '}
                  <Link href="/signin" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Sign In
                  </Link>
                </p>

              </div>
          </div>

        </div>
      </div>
    </div>
  )
}
