import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

interface Certificate { id: number; title: string; description?: string; image_url: string; sort_order: number; is_active: number }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const emptyForm = { title: '', description: '', sort_order: '0', is_active: true, image: null as File | null }

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    const res = await client.get('/api/certificates?per_page=50')
    setCerts(res.data.data ?? [])
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (c: Certificate) => {
    setEditing(c)
    setForm({ title: c.title, description: c.description ?? '', sort_order: String(c.sort_order), is_active: !!c.is_active, image: null })
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('sort_order', form.sort_order)
      fd.append('is_active', form.is_active ? '1' : '0')
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await client.put(`/api/certificates/${editing.id}`, fd)
        toast.success('Certificate updated.')
      } else {
        await client.post('/api/certificates', fd)
        toast.success('Certificate created.')
      }
      setOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const remove = async () => {
    if (!deleteId) return
    try { await client.delete(`/api/certificates/${deleteId}`); toast.success('Deleted.'); setDeleteId(null); load() }
    catch { toast.error('Failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} />New Certificate</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {certs.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-32 bg-slate-100">
              {c.image_url && <img src={`${API_BASE}${c.image_url}`} alt={c.title} className="w-full h-full object-contain p-2" />}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={c.is_active ? 'success' : 'secondary'}>{c.is_active ? 'Active' : 'Hidden'}</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit2 size={13} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><Trash2 size={13} className="text-red-400" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {certs.length === 0 && <div className="col-span-4 text-center py-12 text-slate-400">No certificates yet.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing ? 'Edit Certificate' : 'New Certificate'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f=>({...f, title: e.target.value}))} required /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f=>({...f, description: e.target.value}))} rows={2} /></div>
            <div className="space-y-1.5"><Label>Certificate Image</Label><Input type="file" accept="image/*" onChange={e => setForm(f=>({...f, image: e.target.files?.[0] ?? null}))} /></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f=>({...f, is_active: v}))} id="cactive" />
                <Label htmlFor="cactive">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Order:</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f=>({...f, sort_order: e.target.value}))} className="w-20 h-8" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Certificate?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
