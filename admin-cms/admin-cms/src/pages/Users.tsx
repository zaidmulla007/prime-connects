import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Plus, Search } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useAuth } from '@/context/AuthContext'

interface User { id: number; name: string; email: string; role: string; created_at: string }

export default function Users() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' })

  const load = async () => {
    try {
      const res = await client.get('/api/users', { params: { q: q || undefined, per_page: 50 } })
      setUsers(res.data.data ?? [])
      setTotal(res.data.meta?.total ?? 0)
    } catch { toast.error('Failed to load users.') }
  }

  useEffect(() => { load() }, [q])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await client.post('/api/users', form)
      toast.success('User created.')
      setCreateOpen(false)
      setForm({ name: '', email: '', password: '', role: 'editor' })
      load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const remove = async () => {
    if (!deleteId) return
    try {
      await client.delete(`/api/users/${deleteId}`)
      toast.success('User deleted.')
      setDeleteId(null)
      load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} users total</p>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
            <Input className="pl-8 w-52" placeholder="Search users..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> New User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  {u.id !== me?.id && (
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(u.id)}>
                      <Trash2 size={16} className="text-red-400" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create User</DialogTitle></DialogHeader>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required /></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} required minLength={6} /></div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({...f, role: v}))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
