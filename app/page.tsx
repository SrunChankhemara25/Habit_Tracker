'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, TrendingUp, Zap, Target } from 'lucide-react'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14">
                    <img src="/logo.png" alt="logo" />
                  </div>
              <h1 className="text-2xl font-bold text-foreground">Habitopia</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
                Features
              </a>
              <a href="/signin" className="text-foreground/70 hover:text-foreground transition-colors">
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <p className="text-sm font-medium text-accent">Build better habits daily</p>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Transform Your Life,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                One Habit at a Time
              </span>
            </h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Track your daily habits, build powerful streaks, and achieve your goals with our intelligent habit tracking platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-4xl font-bold text-foreground">Powerful Features</h3>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to build and maintain lasting habits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CheckCircle2,
              title: 'Daily Tracking',
              description: 'Mark habits complete and track your progress daily'
            },
            {
              icon: TrendingUp,
              title: 'Streak System',
              description: 'Build unbroken streaks and stay motivated'
            },
            {
              icon: Zap,
              title: 'Smart Reminders',
              description: 'Never forget your habits with timely notifications'
            },
            {
              icon: Target,
              title: 'Analytics',
              description: 'Visualize your progress with detailed statistics'
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="group p-6 rounded-xl border border-border bg-card hover:bg-card/50 transition-all hover:border-primary/50">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-foreground/60">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-foreground">Ready to Build Better Habits?</h3>
            <p className="text-lg text-foreground/60">Start your journey today with HabitFlow</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="border-t border-border mt-12">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    <div className="flex items-center justify-between">
      
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10">
          <img src="/logo.png" alt="logo" />
        </div>
        <h4 className="font-bold text-foreground">Habitopia</h4>
      </div>

      {/* Center - Links */}
      <div className="flex items-center space-x-6 text-sm text-foreground/70">
        <a href="/privacy" className="hover:text-foreground transition">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:text-foreground transition">
          Terms of Use
        </a>
      </div>

      {/* Right - Copyright */}
      <p className="text-sm text-foreground/60">
        © 2026 Habitopia. All rights reserved.
      </p>

    </div>

  </div>
</footer>

    </div>
  )
}
