'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2, Lock, Trash2, User, Mail } from 'lucide-react'
import { getUserByEmail, saveUser, setCurrentUser } from '@/lib/storage'

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile')

  // Profile state
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [timezone, setTimezone] = useState(user?.timezone || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Timezone options
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Singapore',
    'Australia/Sydney',
  ]

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(false)

    try {
      const updatedUser = { ...user, full_name: fullName, timezone }
      updateUser(updatedUser)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setPasswordError(null)
    setPasswordSuccess(false)

    if (!currentPassword) {
      setPasswordError('Current password is required')
      return
    }

    if (currentPassword !== user.password) {
      setPasswordError('Current password is incorrect')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)

    try {
      const updatedUser = { ...user, password: newPassword }
      updateUser(updatedUser)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      return
    }

    setDeleteLoading(true)

    try {
      // In a real app, this would delete the user from the backend
      logout()
      router.push('/')
    } catch (err) {
      console.error('Failed to delete account')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/60 mt-2">Manage your account and preferences</p>
        </div>

        <div className="max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto">
            {(['profile', 'password', 'danger'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
              >
                {tab === 'profile' && 'Profile'}
                {tab === 'password' && 'Password'}
                {tab === 'danger' && 'Danger Zone'}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-card border border-border rounded-xl p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted border-border"
                  />
                  <p className="text-xs text-foreground/60">Email cannot be changed</p>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={profileLoading}
                    className="bg-input border-border"
                  />
                </div>

                {/* Messages */}
                {profileSuccess && (
                  <div className="flex gap-3 items-start p-3 bg-success/10 border border-success/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-success">Profile updated successfully</p>
                  </div>
                )}

                {profileError && (
                  <div className="flex gap-3 items-start p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{profileError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-card border border-border rounded-xl p-8">
              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-foreground font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={passwordLoading}
                    className="bg-input border-border"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordLoading}
                    placeholder="Minimum 6 characters"
                    className="bg-input border-border"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordLoading}
                    className="bg-input border-border"
                  />
                </div>

                {/* Messages */}
                {passwordSuccess && (
                  <div className="flex gap-3 items-start p-3 bg-success/10 border border-success/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-success">Password changed successfully</p>
                  </div>
                )}

                {passwordError && (
                  <div className="flex gap-3 items-start p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{passwordError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-destructive mb-2">Delete Account</h3>
                  <p className="text-foreground/60">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deleteConfirm" className="text-foreground font-medium">
                    Type "DELETE" to confirm
                  </Label>
                  <Input
                    id="deleteConfirm"
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value.toUpperCase())}
                    placeholder="Type DELETE"
                    className="bg-input border-destructive/30"
                  />
                </div>

                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirm !== 'DELETE'}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}
