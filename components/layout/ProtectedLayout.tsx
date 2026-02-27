'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
