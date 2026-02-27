'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { CodeVerification } from '@/components/auth/CodeVerification'
import { generateVerificationCode } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const { signup, error } = useAuth()
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [verificationCode, setVerificationCode] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const handleSignUp = async (email: string, fullName: string, password: string) => {
    setIsLoading(true)
    setEmail(email)
    const code = generateVerificationCode()
    setVerificationCode(code)
    setStep('verify')
    setIsLoading(false)
  }

  const handleVerifyCode = async () => {
    setVerifyError(null)
    setIsLoading(true)
    try {
      const result = await signup(email, '', '')
      if (result) {
        setTimeout(() => router.push('/dashboard'), 1200)
      } else {
        setVerifyError('Sign up failed. Please try again.')
      }
    } catch {
      setVerifyError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => setVerificationCode(generateVerificationCode())

  const handleBack = () => {
    setStep('form')
    setEmail('')
    setVerificationCode('')
    setVerifyError(null)
  }

  if (step === 'verify') {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Verify Email</h1>
            <p className="text-foreground/60 mt-3">We sent a verification code to {email}</p>
          </div>

          {/* Verification Form */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm backdrop-blur-sm">
            <CodeVerification
              verificationCode={verificationCode}
              email={email}
              onSubmit={handleVerifyCode}
              onResend={handleResendCode}
              isLoading={isLoading}
              error={verifyError}
            />
          </div>

          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="default"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-foreground/60 text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-6">
      <div className="w-full max-w-7xl h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-20">

          {/* LEFT COLUMN */}
          <div className="hidden lg:flex flex-col h-full py-10">
            {/* Logo Top */}
            <div>
              <Link href="/" className="inline-flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-14 h-14">
                    <img src="/logo.png" alt="logo" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  Habitopia
                </span>
              </Link>
            </div>

            {/* Centered Text */}
            <div className="flex flex-1 items-center">
              <div>
                <h2 className="text-5xl font-bold leading-tight text-foreground">
                  Build Better <span className="gradient-text">Habits,</span>
                  <span className="block mt-5">
                    Transform Your Life
                  </span>
                </h2>

                <p className="text-lg text-foreground/60 max-w-md mt-6 leading-relaxed">
                  Join thousands of users who are building consistent habits and achieving their goals. Start your journey today.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full max-w-md mx-auto lg:mx-0 flex items-center">
            <div className="w-full space-y-6">

              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                <p className="text-foreground/60 text-sm">Join and start building your first habit</p>
              </div>

              {/* Form */}
              <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm backdrop-blur-sm">
                <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} error={error} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/30"></div>
                <span className="text-foreground/40 text-xs uppercase font-medium">or</span>
                <div className="flex-1 h-px bg-border/30"></div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-foreground/60 text-sm">
                  Already have an account?{' '}
                  <Link href="/signin" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
