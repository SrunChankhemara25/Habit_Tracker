'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import { SignInForm } from '@/components/auth/SignInForm'
import { CodeVerification } from '@/components/auth/CodeVerification'
import { generateVerificationCode } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const { login, error } = useAuth()
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [verificationCode, setVerificationCode] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    setEmail(email)
    const result = await login(email, password)
    if (result) {
      setVerificationCode(generateVerificationCode())
      setStep('verify')
    }
    setIsLoading(false)
  }

  const handleVerifyCode = async () => {
    setVerifyError(null)
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1200)
  }

  const handleResendCode = () => {
    setVerificationCode(generateVerificationCode())
  }

  const handleBack = () => {
    setStep('form')
    setEmail('')
    setVerificationCode('')
    setVerifyError(null)
  }

  if (step === 'verify') {
    return (
      <div className="h-screen overflow-hidden bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center space-y-4">

            <h1 className="text-4xl font-bold text-foreground">
              Verify Now
            </h1>
            <p className="text-foreground/60">
              Check your email for the code
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
            <CodeVerification
              verificationCode={verificationCode}
              email={email}
              onSubmit={handleVerifyCode}
              onResend={handleResendCode}
              isLoading={isLoading}
              error={verifyError}
            />
          </div>

          <Button
            onClick={handleBack}
            variant="default"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-6">
      
      <div className="w-full max-w-7xl h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-20">

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
                <span className="text-2xl font-bold text-foreground">
                  Habitopia
                </span>
              </Link>
            </div>

            {/* Center Text */}
            <div className="flex flex-1 items-center">
              <div>
                <h2 className="text-5xl font-bold leading-tight text-foreground">
                  Pick Up Where You
                  <br />
                  <span className="gradient-text block mt-3">
                    Left Off
                  </span>
                </h2>

                <p className="text-lg text-foreground/60 max-w-md mt-6 leading-relaxed">
                  Continue tracking your habits, maintain your streaks,
                  and keep building the consistency that transforms lives.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="w-full max-w-md mx-auto lg:mx-0 flex items-center">
            <div className="w-full space-y-6">

              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome Back
                </h1>
                <p className="text-foreground/60 text-sm">
                  Sign in to continue tracking your habits
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
                <SignInForm
                  onSubmit={handleSignIn}
                  isLoading={isLoading}
                  error={error}
                />

                <div className="text-center mt-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <p className="text-foreground/60 text-sm">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign Up
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
