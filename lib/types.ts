export interface User {
  id: string
  email: string
  full_name: string
  password: string
  timezone: string
  created_at: string
  is_active: boolean
}

export interface Habit {
  id: string
  user_id: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly'
  reminder_enabled: boolean
  reminder_time?: string
  status: 'active' | 'paused'
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  date: string
  status: 'completed' | 'skipped'
  streak_count: number
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface VerificationState {
  step: 'input' | 'verify'
  sentCode: string
  email?: string
  userType?: 'signup' | 'signin' | 'forgot-password'
}
