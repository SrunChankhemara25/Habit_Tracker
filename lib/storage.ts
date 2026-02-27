import { User, Habit, HabitLog } from './types'

const USERS_KEY = 'habit_tracker_users'
const CURRENT_USER_KEY = 'habit_tracker_current_user'
const HABITS_KEY = 'habit_tracker_habits'
const HABIT_LOGS_KEY = 'habit_tracker_logs'

// Initialize with demo data if needed
const initializeStorage = () => {
  if (typeof window === 'undefined') return

  const users = localStorage.getItem(USERS_KEY)
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]))
  }

  const habits = localStorage.getItem(HABITS_KEY)
  if (!habits) {
    localStorage.setItem(HABITS_KEY, JSON.stringify([]))
  }

  const logs = localStorage.getItem(HABIT_LOGS_KEY)
  if (!logs) {
    localStorage.setItem(HABIT_LOGS_KEY, JSON.stringify([]))
  }
}

// User Management
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User) => {
  if (typeof window === 'undefined') return
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// Habit Management
export const getHabits = (userId: string): Habit[] => {
  if (typeof window === 'undefined') return []
  const habits = localStorage.getItem(HABITS_KEY)
  const allHabits = habits ? JSON.parse(habits) : []
  return allHabits.filter((h: Habit) => h.user_id === userId)
}

export const saveHabit = (habit: Habit) => {
  if (typeof window === 'undefined') return
  const habits = localStorage.getItem(HABITS_KEY)
  const allHabits = habits ? JSON.parse(habits) : []
  const existingIndex = allHabits.findIndex((h: Habit) => h.id === habit.id)
  if (existingIndex >= 0) {
    allHabits[existingIndex] = habit
  } else {
    allHabits.push(habit)
  }
  localStorage.setItem(HABITS_KEY, JSON.stringify(allHabits))
}

export const deleteHabit = (habitId: string) => {
  if (typeof window === 'undefined') return
  const habits = localStorage.getItem(HABITS_KEY)
  const allHabits = habits ? JSON.parse(habits) : []
  const filtered = allHabits.filter((h: Habit) => h.id !== habitId)
  localStorage.setItem(HABITS_KEY, JSON.stringify(filtered))
}

export const getHabitById = (habitId: string): Habit | null => {
  if (typeof window === 'undefined') return null
  const habits = localStorage.getItem(HABITS_KEY)
  const allHabits = habits ? JSON.parse(habits) : []
  return allHabits.find((h: Habit) => h.id === habitId) || null
}

// Habit Log Management
export const getHabitLogs = (habitId: string): HabitLog[] => {
  if (typeof window === 'undefined') return []
  const logs = localStorage.getItem(HABIT_LOGS_KEY)
  const allLogs = logs ? JSON.parse(logs) : []
  return allLogs.filter((l: HabitLog) => l.habit_id === habitId)
}

export const getHabitLogByDate = (habitId: string, date: string): HabitLog | null => {
  const logs = getHabitLogs(habitId)
  return logs.find((l) => l.date === date) || null
}

export const saveHabitLog = (log: HabitLog) => {
  if (typeof window === 'undefined') return
  const logs = localStorage.getItem(HABIT_LOGS_KEY)
  const allLogs = logs ? JSON.parse(logs) : []
  const existingIndex = allLogs.findIndex((l: HabitLog) => l.id === log.id)
  if (existingIndex >= 0) {
    allLogs[existingIndex] = log
  } else {
    allLogs.push(log)
  }
  localStorage.setItem(HABIT_LOGS_KEY, JSON.stringify(allLogs))
}

export const getTodaysHabits = (userId: string): Habit[] => {
  const habits = getHabits(userId)
  return habits.filter((h) => h.status === 'active')
}

export const getStreakCount = (habitId: string): number => {
  const logs = getHabitLogs(habitId)
  if (logs.length === 0) return 0

  const sortedLogs = logs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((l) => l.status === 'completed')

  if (sortedLogs.length === 0) return 0

  let streak = 0
  const today = new Date()
  let currentDate = new Date(today)

  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date)
    const expectedDate = new Date(currentDate)
    expectedDate.setDate(expectedDate.getDate() - i)

    if (logDate.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export const calculateCompletionPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export { initializeStorage }
