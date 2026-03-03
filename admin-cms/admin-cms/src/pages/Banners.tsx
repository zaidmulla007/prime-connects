import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

interface Banner { id: number; image_url: string; title?: string; is_permanent: number; from_date?: string; to_date?: string; is_active: number; sort_order: number }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const emptyForm = { title: '', subtitle: '', link_url: '', is_permanent: true, from_date: '', to_date: '', is_active: true, sort_order: '0', image: null as File | null }

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    const res = await client.get('/api/banners?per_page=50')
    setBanners(res.data.data ?? [])
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (b: Banner) => {
    setEditing(b)
    setForm({ title: b.title ?? '', subtitle: '', link_url: '', is_permanent: !!b.is_permanent, from_date: b.from_date ?? '', to_date: b.to_date ?? '', is_active: !!b.is_active, sort_order: String(b.sort_order), image: null })
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('subtitle', form.subtitle)
      fd.append('link_url', form.link_url)
      fd.append('is_permanent', form.is_permanent ? '1' : '0')
      fd.append('is_active', form.is_active ? '1' : '0')
      fd.append('sort_order', form.sort_order)
      if (!form.is_permanent) { fd.append('from_date', form.from_date); fd.append('to_date', form.to_date) }
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await client.put(`/api/banners/${editing.id}`, fd)
        toast.success('Banner updated.')
      } else {
        await client.post('/api/banners', fd)
        toast.success('Banner created.')
      }
      setOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const remove = async () => {
    if (!deleteId) return
    try { await client.delete(`/api/banners/${deleteId}`); toast.success('Deleted.'); setDeleteId(null); load() }
    catch { toast.error('Failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} />New Banner</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="relative h-40 bg-slate-100">
              <img src={`${API_BASE}${b.image_url}`} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="secondary" size="icon" onClick={() => openEdit(b)}><Edit2 size={14} /></Button>
                <Button variant="destructive" size="icon" onClick={() => setDeleteId(b.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800 truncate">{b.title || 'Untitled'}</p>
                <Badge variant={b.is_active ? 'success' : 'secondary'}>{b.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">{b.is_permanent ? 'Permanent' : `${b.from_date} → ${b.to_date}`} · Order: {b.sort_order}</p>
            </div>
          </div>
        ))}
        {banners.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400">No banners yet.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Banner' : 'New Banner'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5"><Label>Image {!editing && '*'}</Label><Input type="file" accept="image/*" onChange={e => setForm(f=>({...f, image: e.target.files?.[0] ?? null}))} /></div>
            <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f=>({...f, title: e.target.value}))} /></div>
            <div className="space-y-1.5"><Label>Link URL</Label><Input value={form.link_url} onChange={e => setForm(f=>({...f, link_url: e.target.value}))} /></div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_permanent} onCheckedChange={v => setForm(f=>({...f, is_permanent: v}))} id="perm" />
              <Label htmlFor="perm">Permanent (no date limit)</Label>
            </div>
            {!form.is_permanent && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>From</Label><Input type="date" value={form.from_date} onChange={e => setForm(f=>({...f, from_date: e.target.value}))} /></div>
                <div className="space-y-1.5"><Label>To</Label><Input type="date" value={form.to_date} onChange={e => setForm(f=>({...f, to_date: e.target.value}))} /></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f=>({...f, is_active: v}))} id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="space-y-1.5"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f=>({...f, sort_order: e.target.value}))} /></div>
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
          <AlertDialogHeader><AlertDialogTitle>Delete Banner?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
