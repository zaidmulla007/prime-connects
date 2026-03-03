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

interface Project { id: number; title: string; slug: string; description: string; image_url: string; location: string; year: string; sort_order: number; is_active: number }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const emptyForm = { title: '', description: '', location: '', year: '', sort_order: '0', is_active: true, image: null as File | null }

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [total, setTotal] = useState(0)

  const load = async () => {
    const res = await client.get('/api/projects?per_page=50')
    setProjects(res.data.data ?? []); setTotal(res.data.meta?.total ?? 0)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({ title: p.title, description: p.description ?? '', location: p.location ?? '', year: p.year ?? '', sort_order: String(p.sort_order), is_active: !!p.is_active, image: null })
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null && k !== 'image') fd.append(k, String(v)) })
      fd.set('is_active', form.is_active ? '1' : '0')
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await client.put(`/api/projects/${editing.id}`, fd)
        toast.success('Project updated.')
      } else {
        await client.post('/api/projects', fd)
        toast.success('Project created.')
      }
      setOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const remove = async () => {
    if (!deleteId) return
    try { await client.delete(`/api/projects/${deleteId}`); toast.success('Deleted.'); setDeleteId(null); load() }
    catch { toast.error('Failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} projects</p>
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} />New Project</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Image</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Year</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  {p.image_url && <img src={`${API_BASE}${p.image_url}`} alt={p.title} className="h-10 w-14 object-cover rounded" />}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.location}</td>
                <td className="px-4 py-3 text-slate-600">{p.year}</td>
                <td className="px-4 py-3"><Badge variant={p.is_active ? 'success' : 'secondary'}>{p.is_active ? 'Active' : 'Hidden'}</Badge></td>
                <td className="px-4 py-3 text-right flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit2 size={15} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 size={15} className="text-red-400" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="text-slate-400 text-sm text-center py-12">No projects yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f=>({...f, title: e.target.value}))} required /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f=>({...f, description: e.target.value}))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f=>({...f, location: e.target.value}))} /></div>
              <div className="space-y-1.5"><Label>Year</Label><Input value={form.year} onChange={e => setForm(f=>({...f, year: e.target.value}))} placeholder="2024" /></div>
            </div>
            <div className="space-y-1.5"><Label>Image</Label><Input type="file" accept="image/*" onChange={e => setForm(f=>({...f, image: e.target.files?.[0] ?? null}))} /></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f=>({...f, is_active: v}))} id="pactive" />
                <Label htmlFor="pactive">Active</Label>
              </div>
              <div className="space-y-1.5"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f=>({...f, sort_order: e.target.value}))} className="w-24" /></div>
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
          <AlertDialogHeader><AlertDialogTitle>Delete Project?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
