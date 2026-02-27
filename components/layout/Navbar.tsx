'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, LogOut, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-12 h-12">
            <img src="/logo.png" alt="logo" />
          </div>
          <span className="text-xl font-bold text-foreground hidden md:inline">Habitopia</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.full_name || 'User'}</p>
            <p className="text-xs text-foreground/60">{user?.email}</p>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile User Info */}
      {isOpen && (
        <div className="md:hidden px-6 py-3 border-t border-border bg-muted/50">
          <p className="text-sm font-medium text-foreground">{user?.full_name || 'User'}</p>
          <p className="text-xs text-foreground/60">{user?.email}</p>
        </div>
      )}
    </header>
  )
}
