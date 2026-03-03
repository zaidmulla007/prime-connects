import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Profile() {
  const { user, login, userToken } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingProfile(true)
      const res = await client.put('/api/me', { name, email })
      login({ token: userToken!, user: res.data.data })
      toast.success('Profile updated.')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingPass(true)
      await client.put('/api/me/password', { current_password: currentPass, new_password: newPass })
      toast.success('Password changed.')
      setCurrentPass('')
      setNewPass('')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to change password.')
    } finally {
      setSavingPass(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Profile Information</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" variant="outline" disabled={savingPass}>
            {savingPass ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
