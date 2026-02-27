'use client'

import React, { createContext, useState, useCallback, useEffect } from 'react'
import { User, AuthState } from '../types'
import { getCurrentUser, setCurrentUser, getUserByEmail, saveUser } from '../storage'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, fullName: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const existingUser = getUserByEmail(email)
      if (!existingUser) {
        setError('User not found')
        return false
      }

      if (existingUser.password !== password) {
        setError('Invalid password')
        return false
      }

      setUser(existingUser)
      setCurrentUser(existingUser)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      return false
    }
  }, [])

  const signup = useCallback(
    async (email: string, fullName: string, password: string): Promise<boolean> => {
      setError(null)
      try {
        const existingUser = getUserByEmail(email)
        if (existingUser) {
          setError('Email already registered')
          return false
        }

        const newUser: User = {
          id: `user_${Date.now()}`,
          email,
          full_name: fullName,
          password,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          created_at: new Date().toISOString(),
          is_active: true,
        }

        saveUser(newUser)
        setUser(newUser)
        setCurrentUser(newUser)
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Signup failed')
        return false
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    setCurrentUser(null)
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
    setCurrentUser(updatedUser)
    saveUser(updatedUser)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
