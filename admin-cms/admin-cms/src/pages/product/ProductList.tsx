import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Search, Package, X, Images } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface Product { id: number; name: string; slug: string; sku?: string; category_name?: string; image_url?: string; image_count?: number; is_active: number; created_at: string }
interface Category { id: number; name: string; depth: number }

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export default function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', category_id: '' })
  const perPage = 24

  const load = useCallback(async () => {
    try {
      const res = await client.get('/api/products', { params: { page, per_page: perPage, q: q || undefined, category_id: categoryId || undefined } })
      setProducts(res.data.data ?? [])
      setTotal(res.data.meta?.total ?? 0)
    } catch { toast.error('Failed to load products.') }
  }, [page, q, categoryId])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    client.get('/api/categories?flat=1').then(r => setCategories(r.data.data ?? []))
  }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await client.post('/api/products', form)
      toast.success('Product created.')
      setCreateOpen(false)
      setForm({ name: '', sku: '', category_id: '' })
      navigate(`/product/${res.data.data.id}`)
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const pages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <p className="text-sm text-slate-500">{total} products{categoryId ? ` in "${categories.find(c => String(c.id) === categoryId)?.name ?? ''}"` : ''}</p>
        <div className="flex flex-wrap gap-2">
          {/* Category filter */}
          <Select value={categoryId || 'all'} onValueChange={v => { setCategoryId(v === 'all' ? '' : v); setPage(1) }}>
            <SelectTrigger className="w-52 h-9 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>{'— '.repeat(c.depth)}{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
            <Input className="pl-8 w-48 h-9" placeholder="Search..." value={q} onChange={e => { setQ(e.target.value); setPage(1) }} />
            {q && <button onClick={() => { setQ(''); setPage(1) }} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
          </div>
          {/* Clear filters */}
          {(categoryId || q) && (
            <Button variant="ghost" size="sm" onClick={() => { setCategoryId(''); setQ(''); setPage(1) }}>Clear</Button>
          )}
          <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={16} />New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="h-36 bg-slate-100 flex items-center justify-center relative">
              {p.image_url ? (
                <img src={`${API_BASE}${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={32} className="text-slate-300" />
              )}
              {(p.image_count ?? 0) > 1 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  <Images size={10} />
                  {p.image_count}
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-800 line-clamp-2">{p.name}</p>
              {p.sku && <p className="text-xs text-slate-400 mt-0.5">SKU: {p.sku}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">{p.category_name || 'Uncategorized'}</span>
                <Badge variant={p.is_active ? 'success' : 'secondary'} className="text-xs">{p.is_active ? 'Active' : 'Draft'}</Badge>
              </div>
            </div>
          </button>
        ))}
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400">
          <Package size={40} className="mx-auto mb-2 opacity-30" />
          <p>No products yet. Create your first one!</p>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-slate-500">Page {page} of {pages}</span>
          <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>New Product</DialogTitle></DialogHeader>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-1.5"><Label>Product Name *</Label><Input value={form.name} onChange={e => setForm(f=>({...f, name: e.target.value}))} placeholder="e.g. WPC Door 800x2100" required /></div>
            <div className="space-y-1.5"><Label>SKU (optional)</Label><Input value={form.sku} onChange={e => setForm(f=>({...f, sku: e.target.value}))} placeholder="e.g. WPC-800" /></div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category_id || 'none'} onValueChange={v => setForm(f=>({...f, category_id: v === 'none' ? '' : v}))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{'— '.repeat(c.depth)}{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Create & Edit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
