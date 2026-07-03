import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile, changePassword, deleteAccount } from '../api/auth'
import { getSettings, updateSettings, updatePassword } from '../api/settings'
import { useAuthStore } from '../stores/authStore'
import { handleApiError } from '../api/errors'
import { CardSkeleton, EmptyState } from '../components/ui/loading'
import { ErrorState } from '../components/ui/error-state'
import { toast } from 'sonner'
import { Trash2, Loader2, User, Bell, Shield, Download, Monitor, Globe, Camera, ExternalLink, HelpCircle, FileText } from 'lucide-react'
import { useNotification } from '../components/ui/Notification'

function Section({ title, icon: Icon, children }) {
  return (
    <section className="grid gap-8 border-t border-border pt-8 md:grid-cols-[200px_1fr]">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="size-5 text-ink/40" />}
        <h2 className="font-serif text-2xl italic">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, value, action, onAction }) {
  return (
    <div className="grid grid-cols-[160px_1fr_auto] items-center gap-4 border border-border bg-paper px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{label}</div>
      <div className="text-sm">{value}</div>
      {action && <button onClick={onAction} className="text-xs text-accent hover:underline">{action}</button>}
    </div>
  )
}

function Toggle({ label, desc, on, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-6 border border-border bg-paper p-4 transition-micro hover:bg-paper-2 focus-within:border-accent">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-ink/50">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!on)}
        disabled={disabled}
        className={`relative mt-1 h-5 w-9 cursor-pointer rounded-full transition-colors focus-visible-ring ${on ? "bg-accent" : "bg-ink/15"} disabled:cursor-not-allowed`}
        role="switch"
        aria-checked={on}
        aria-label={`Toggle ${label}`}
      >
        <span className={`absolute top-0.5 size-4 rounded-full bg-paper transition-all ${on ? "left-4" : "left-0.5"}`} />
      </button>
    </div>
  )
}

export default function Settings() {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((state) => state.updateUser)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const notification = useNotification()
  const [profileForm, setProfileForm] = useState({ name: '', email: '', headline: '' })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const avatarInputRef = useRef(null)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [notifications, setNotifications] = useState({
    diagnosticComplete: true,
    weeklyDigest: true,
    productUpdates: false,
  })

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

  const profile = profileData?.data

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        headline: profile.headline || '',
      })
      setAvatarUrl(profile.avatarUrl || '')
      setAvatarPreview(profile.avatarUrl || '')
    }
  }, [profileData])

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile({ name: data.name }),
    onSuccess: (data) => {
      updateUser(data.data)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data) => changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password changed successfully!')
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: (data) => updatePassword(data.newPassword),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully!')
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success('Settings updated successfully!')
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully')
      window.location.href = '/'
    },
  })

  useEffect(() => {
    if (settingsData?.data) {
      const prefs = settingsData.data.notificationPreferences || {}
      setNotifications({
        diagnosticComplete: prefs.diagnosticComplete ?? true,
        weeklyDigest: prefs.weeklyDigest ?? true,
        productUpdates: prefs.productUpdates ?? false,
      })
    }
  }, [settingsData])

  const settings = settingsData?.data || {}

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
  }

  const handleNotificationChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    updateSettingsMutation.mutate({ notificationPreferences: { ...notifications, [key]: value } })
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      notification.error('Image must be under 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setAvatarPreview(dataUrl)
      setAvatarUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate({
      name: profileForm.name,
      avatarUrl: avatarUrl || undefined,
    })
  }

  const handleDeleteAccount = () => {
    notification.confirm({
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        deleteAccountMutation.mutate()
      },
    })
  }

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleExportData = async () => {
    try {
      const { getResumes } = await import('../api/resume')
      const { getAnalyses } = await import('../api/analysis')
      const resumesRes = await getResumes({ limit: 100 })
      const analysesRes = await getAnalyses({ limit: 100 })
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        profile: { name: profile?.name, email: profile?.email },
        resumes: resumesRes.data?.data || [],
        analyses: analysesRes.data?.data || [],
        settings: settings,
      }
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resumetrics-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      notification.success('Data exported successfully!')
    } catch (e) {
      notification.error('Failed to export data. Please try again.')
    }
  }

  if (profileLoading || settingsLoading) {
    return (
      <div className="px-8 py-10">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse bg-ink/10" />
        </div>
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Workspace</span>
        <h1 className="mt-2 font-serif text-4xl italic">Settings.</h1>
      </div>

      <div className="space-y-12">
        {/* Profile Section */}
        <Section title="Profile" icon={User}>
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="grid size-16 place-items-center rounded-full border border-border bg-ink font-mono text-xl text-paper overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="size-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border border-border bg-paper hover:bg-paper-2"
                  aria-label="Change avatar"
                >
                  <Camera className="size-3" />
                </button>
              </div>
              <div>
                <div className="font-medium">{profile?.name || 'User'}</div>
                <div className="text-xs text-ink/60">{profile?.email || ''}</div>
                <div className="mt-1 text-xs text-ink/40">JPG, PNG or GIF. Max 2MB.</div>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Full name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Headline</label>
                <input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, headline: e.target.value }))}
                  placeholder="e.g. Senior Product Designer · Design Systems"
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </button>
            </form>
          </div>
        </Section>

        {/* Notifications Section */}
        <Section title="Notification Preferences" icon={Bell}>
          <div className="space-y-3">
            <Toggle
              label="Diagnostic complete"
              desc="Email me when a long analysis finishes."
              on={notifications.diagnosticComplete}
              onChange={(value) => handleNotificationChange('diagnosticComplete', value)}
              disabled={updateSettingsMutation.isPending}
            />
            <Toggle
              label="Weekly digest"
              desc="Score trends and patch suggestions every Monday."
              on={notifications.weeklyDigest}
              onChange={(value) => handleNotificationChange('weeklyDigest', value)}
              disabled={updateSettingsMutation.isPending}
            />
            <Toggle
              label="Product updates"
              desc="New parsers, models and features."
              on={notifications.productUpdates}
              onChange={(value) => handleNotificationChange('productUpdates', value)}
              disabled={updateSettingsMutation.isPending}
            />
          </div>
        </Section>

        {/* Sessions Section */}
        <Section title="Login Sessions" icon={Monitor}>
          <div className="space-y-3">
            <div className="border border-border bg-paper p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="size-5 text-ink/60" />
                  <div>
                    <div className="font-medium">Current Session</div>
                    <div className="mt-1 text-xs text-ink/60">Windows · Chrome · Active now</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs text-emerald-700">Active</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Connected Accounts */}
        <Section title="Connected Accounts" icon={Globe}>
          <div className="border border-border bg-paper p-6">
            <p className="text-sm text-ink/60">Manage your connected social accounts.</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between border border-border bg-paper-2 p-3">
                <div className="flex items-center gap-3">
                  <ExternalLink className="size-4 text-ink/40" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </div>
                <span className="text-xs text-emerald-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between border border-border bg-paper-2 p-3">
                <div className="flex items-center gap-3">
                  <ExternalLink className="size-4 text-ink/40" />
                  <span className="text-sm font-medium">Google</span>
                </div>
                <span className="text-xs text-emerald-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Security Section */}
        <Section title="Security" icon={Shield}>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Current password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">New password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Confirm new password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updatePasswordMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Update password
            </button>
          </form>
        </Section>

        {/* Data Export */}
        <Section title="Data" icon={Download}>
          <div className="border border-border bg-paper p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export your data</h3>
                <p className="mt-1 text-sm text-ink/60">Download all your resumes, analyses, and settings.</p>
              </div>
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 border border-border bg-paper px-4 py-2 text-sm hover:bg-paper-2"
              >
                <Download className="size-4" />
                Export
              </button>
            </div>
          </div>
        </Section>

        {/* Help */}
        <Section title="Help & Support" icon={HelpCircle}>
          <div className="space-y-3">
            <a href="/help" className="flex items-center justify-between border border-border bg-paper p-4 hover:border-ink/20">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-ink/40" />
                <div>
                  <div className="text-sm font-medium">Help Center</div>
                  <div className="text-xs text-ink/50">FAQs, guides, and support</div>
                </div>
              </div>
              <ExternalLink className="size-3 text-ink/40" />
            </a>
          </div>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger zone" icon={Trash2}>
          <div className="space-y-4">
            <div className="border border-red-200 bg-red-50 p-4">
              <h3 className="font-medium text-red-900">Delete account</h3>
              <p className="mt-1 text-sm text-red-700">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-4 inline-flex items-center gap-2 border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Delete account
                </button>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountMutation.isPending}
                    className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleteAccountMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                    Yes, delete my account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
