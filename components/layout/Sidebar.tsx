'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Plus,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/habits/add', label: 'Add Habit', icon: Plus },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/reminders', label: 'Reminders', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="p-6 border-t border-sidebar-border space-y-2">
        <Link href="/settings">
          <Button variant="red" className="w-full justify-start ">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </Link>
      </div>
    </aside>
  )
}
