import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2, ChevronRight } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

interface Category { id: number; name: string; slug: string; parent_id: number | null; depth: number; sort_order: number; type: string; description: string; image_url: string; children?: Category[] }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function CategoryNode({ cat, flat, onEdit, onDelete }: { cat: Category; flat: Category[]; onEdit: (c: Category) => void; onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false)
  const children = flat.filter(c => c.parent_id === cat.id)
  return (
    <div className={`${cat.depth > 0 ? 'ml-6 border-l border-slate-200' : ''}`}>
      <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg group">
        {children.length > 0 && (
          <button onClick={() => setOpen(o => !o)} className="text-slate-400">
            <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        )}
        {children.length === 0 && <span className="w-4" />}
        {cat.image_url && <img src={`${API_BASE}${cat.image_url}`} alt="" className="h-7 w-7 rounded object-cover" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{cat.name}</p>
          <p className="text-xs text-slate-400">{cat.slug} · {cat.type}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(cat)}><Edit2 size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(cat.id)}><Trash2 size={14} className="text-red-400" /></Button>
        </div>
      </div>
      {open && children.map(c => <CategoryNode key={c.id} cat={c} flat={flat} onEdit={onEdit} onDelete={onDelete} />)}
    </div>
  )
}

const emptyForm = { name: '', description: '', parent_id: '', type: 'category', sort_order: '0', image: null as File | null }

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    const res = await client.get('/api/categories?flat=1')
    setCats(res.data.data ?? [])
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true) }
  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description ?? '', parent_id: cat.parent_id ? String(cat.parent_id) : '', type: cat.type, sort_order: String(cat.sort_order), image: null })
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('parent_id', form.parent_id)
      fd.append('type', form.type)
      fd.append('sort_order', form.sort_order)
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await client.post(`/api/categories/${editing.id}/update`, fd)
        toast.success('Category updated.')
      } else {
        await client.post('/api/categories', fd)
        toast.success('Category created.')
      }
      setOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const remove = async () => {
    if (!deleteId) return
    try { await client.delete(`/api/categories/${deleteId}`); toast.success('Deleted.'); setDeleteId(null); load() }
    catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const roots = cats.filter(c => !c.parent_id)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} />New Category</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        {roots.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No categories yet.</p>
        ) : (
          roots.map(cat => <CategoryNode key={cat.id} cat={cat} flat={cats} onEdit={openEdit} onDelete={setDeleteId} />)
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f=>({...f, name: e.target.value}))} required /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f=>({...f, description: e.target.value}))} rows={2} /></div>
            <div className="space-y-1.5">
              <Label>Parent Category</Label>
              <Select value={form.parent_id || 'none'} onValueChange={v => setForm(f=>({...f, parent_id: v === 'none' ? '' : v}))}>
                <SelectTrigger><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {cats.filter(c => !editing || c.id !== editing.id).map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{'— '.repeat(c.depth)}{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f=>({...f, type: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f=>({...f, sort_order: e.target.value}))} /></div>
            </div>
            <div className="space-y-1.5"><Label>Image</Label><Input type="file" accept="image/*" onChange={e => setForm(f=>({...f, image: e.target.files?.[0] ?? null}))} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Category?</AlertDialogTitle><AlertDialogDescription>This will also affect child categories and products.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
