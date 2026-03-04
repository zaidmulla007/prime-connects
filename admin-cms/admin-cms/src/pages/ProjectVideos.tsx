import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2, Play } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

interface ProjectVideo { id: number; title: string; video_url: string; thumbnail_url: string | null; sort_order: number; is_active: number }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const emptyForm = { title: '', sort_order: '0', is_active: true, video: null as File | null, thumbnail: null as File | null }

export default function ProjectVideos() {
  const [videos, setVideos] = useState<ProjectVideo[]>([])
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectVideo | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [previewId, setPreviewId] = useState<number | null>(null)

  const load = async () => {
    try {
      const res = await client.get('/api/project-videos?per_page=50')
      setVideos(res.data.data ?? []); setTotal(res.data.meta?.total ?? 0)
    } catch { toast.error('Failed to load videos.') }
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (v: ProjectVideo) => {
    setEditing(v)
    setForm({ title: v.title, sort_order: String(v.sort_order), is_active: !!v.is_active, video: null, thumbnail: null })
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('sort_order', form.sort_order)
      fd.append('is_active', form.is_active ? '1' : '0')
      if (form.video) fd.append('video', form.video)
      if (form.thumbnail) fd.append('thumbnail', form.thumbnail)

      if (editing) {
        await client.put(`/api/project-videos/${editing.id}`, fd)
        toast.success('Video updated.')
      } else {
        await client.post('/api/project-videos', fd)
        toast.success('Video added.')
      }
      setOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const remove = async () => {
    if (!deleteId) return
    try { await client.delete(`/api/project-videos/${deleteId}`); toast.success('Deleted.'); setDeleteId(null); load() }
    catch { toast.error('Failed.') }
  }

  const previewVideo = videos.find(v => v.id === previewId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{total} project videos</p>
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} />New Video</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Preview</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Sort</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {videos.map(v => (
              <tr key={v.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <button
                    onClick={() => setPreviewId(v.id)}
                    className="relative h-10 w-16 rounded overflow-hidden bg-slate-900 flex items-center justify-center group"
                  >
                    {v.thumbnail_url
                      ? <img src={`${API_BASE}${v.thumbnail_url}`} alt="" className="w-full h-full object-cover" />
                      : <video src={`${API_BASE}${v.video_url}`} className="w-full h-full object-cover" muted preload="metadata"
                          onLoadedData={(e) => { (e.target as HTMLVideoElement).currentTime = 1 }} />
                    }
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play size={14} className="text-white" />
                    </div>
                  </button>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{v.title}</td>
                <td className="px-4 py-3 text-slate-500">{v.sort_order}</td>
                <td className="px-4 py-3"><Badge variant={v.is_active ? 'success' : 'secondary'}>{v.is_active ? 'Active' : 'Hidden'}</Badge></td>
                <td className="px-4 py-3 text-right flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Edit2 size={15} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(v.id)}><Trash2 size={15} className="text-red-400" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {videos.length === 0 && <p className="text-slate-400 text-sm text-center py-12">No project videos yet.</p>}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Video' : 'New Project Video'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f=>({...f, title: e.target.value}))} required /></div>
            <div className="space-y-1.5">
              <Label>Video File {editing ? '(leave blank to keep existing)' : '*'}</Label>
              <Input type="file" accept="video/*" onChange={e => setForm(f=>({...f, video: e.target.files?.[0] ?? null}))} required={!editing} />
              {editing && <p className="text-xs text-slate-400 truncate">{editing.video_url}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Thumbnail (optional)</Label>
              <Input type="file" accept="image/*" onChange={e => setForm(f=>({...f, thumbnail: e.target.files?.[0] ?? null}))} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f=>({...f, is_active: v}))} id="vactive" />
                <Label htmlFor="vactive">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f=>({...f, sort_order: e.target.value}))} className="w-24" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreviewId(null)}>
          <div className="w-full max-w-3xl rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <video src={`${API_BASE}${previewVideo.video_url}`} controls autoPlay className="w-full max-h-[80vh]" />
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Video?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
