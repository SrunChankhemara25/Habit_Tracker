export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

export const formatDateDisplay = (date: string): string => {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const getToday = (): string => {
  return formatDate(new Date())
}

export const calculateCompletionPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export const getDayOfWeek = (date: string): number => {
  const d = new Date(date + 'T00:00:00')
  return d.getDay()
}

export const getWeekStart = (date: string): string => {
  const d = new Date(date + 'T00:00:00')
  const day = d.getDay()
  const diff = d.getDate() - day
  return formatDate(new Date(d.setDate(diff)))
}

export const getLastNDays = (n: number): string[] => {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(formatDate(date))
  }
  return days
}

export const getMonthDays = (year: number, month: number): string[] => {
  const days: string[] = []
  const lastDay = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day)
    days.push(formatDate(date))
  }
  return days
}
