import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Trash2, Upload, Save, Edit2 } from 'lucide-react'
import client from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

interface Product { id: number; name: string; slug: string; sku?: string; description?: string; category_id?: number; is_active: number; images: Img[]; specs: Spec[]; category?: { id: number; name: string } }
interface Img { id: number; url: string; alt: string; sort_order: number }
interface Spec { id: number; label: string; value: string; unit?: string; sort_order: number }
interface Category { id: number; name: string; depth: number }

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [editInfo, setEditInfo] = useState(false)
  const [info, setInfo] = useState({ name: '', sku: '', description: '', category_id: '', is_active: true })
  const [deleteProductOpen, setDeleteProductOpen] = useState(false)
  const [newSpec, setNewSpec] = useState({ label: '', value: '', unit: '' })
  const [addingSpec, setAddingSpec] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    try {
      const res = await client.get(`/api/products/${id}`)
      const p = res.data.data
      if (!p) { toast.error('Product not found'); navigate('/products'); return }
      setProduct(p)
      setInfo({ name: p.name, sku: p.sku ?? '', description: p.description ?? '', category_id: p.category_id ? String(p.category_id) : '', is_active: !!p.is_active })
    } catch { toast.error('Failed to load product.') }
  }

  useEffect(() => { load() }, [id])
  useEffect(() => { client.get('/api/categories?flat=1').then(r => setCategories(r.data.data ?? [])) }, [])

  const saveInfo = async () => {
    if (!product) return
    try {
      await client.put(`/api/products/${product.id}`, { ...info, category_id: info.category_id || null })
      toast.success('Saved.')
      setEditInfo(false)
      load()
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed.') }
  }

  const uploadImages = async (files: FileList) => {
    if (!product || !files.length) return
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('images', f))
      await client.post(`/api/products/${product.id}/images/batch`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(`${files.length} image(s) uploaded.`)
      load()
    } catch { toast.error('Upload failed.') } finally { setUploading(false) }
  }

  const deleteImage = async (imgId: number) => {
    if (!product) return
    try { await client.post(`/api/products/${product.id}/images/${imgId}/delete`); toast.success('Image deleted.'); load() }
    catch { toast.error('Failed.') }
  }

  const addSpec = async () => {
    if (!product || !newSpec.label || !newSpec.value) return
    try {
      await client.post(`/api/products/${product.id}/specs`, { specs: [newSpec] })
      toast.success('Spec added.')
      setNewSpec({ label: '', value: '', unit: '' })
      setAddingSpec(false)
      load()
    } catch { toast.error('Failed.') }
  }

  const deleteSpec = async (specId: number) => {
    if (!product) return
    try { await client.delete(`/api/products/${product.id}/specs/${specId}`); toast.success('Spec deleted.'); load() }
    catch { toast.error('Failed.') }
  }

  const deleteProduct = async () => {
    if (!product) return
    try { await client.delete(`/api/products/${product.id}`); toast.success('Product deleted.'); navigate('/products') }
    catch { toast.error('Failed.') }
  }

  if (!product) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" /></div>

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/products')}><ArrowLeft size={18} /></Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-slate-800">{product.name}</h1>
          <p className="text-xs text-slate-400">{product.slug}</p>
        </div>
        <Badge variant={product.is_active ? 'success' : 'secondary'}>{product.is_active ? 'Active' : 'Draft'}</Badge>
        <Button variant="destructive" size="sm" onClick={() => setDeleteProductOpen(true)}><Trash2 size={15} />Delete</Button>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Product Images</h2>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" disabled={uploading}>
              <Upload size={15} />{uploading ? 'Uploading...' : 'Upload Images'}
            </Button>
            <input type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && uploadImages(e.target.files)} />
          </label>
        </div>
        {product.images.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex items-center justify-center text-slate-400 text-sm">
            No images yet. Upload your first image.
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {product.images.map(img => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                <img src={`${API_BASE}${img.url}`} alt={img.alt} className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Base Info Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Product Information</h2>
          {!editInfo ? (
            <Button variant="outline" size="sm" onClick={() => setEditInfo(true)}><Edit2 size={15} />Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditInfo(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={saveInfo}><Save size={15} />Save</Button>
            </div>
          )}
        </div>
        {editInfo ? (
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Product Name</Label><Input value={info.name} onChange={e => setInfo(i=>({...i, name: e.target.value}))} /></div>
            <div className="space-y-1.5"><Label>SKU</Label><Input value={info.sku} onChange={e => setInfo(i=>({...i, sku: e.target.value}))} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={info.description} onChange={e => setInfo(i=>({...i, description: e.target.value}))} rows={4} /></div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={info.category_id || 'none'} onValueChange={v => setInfo(i=>({...i, category_id: v === 'none' ? '' : v}))}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{'— '.repeat(c.depth)}{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={info.is_active} onCheckedChange={v => setInfo(i=>({...i, is_active: v}))} id="isactive" />
              <Label htmlFor="isactive">Active / Published</Label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500">Name:</span> <span className="font-medium">{product.name}</span></div>
            <div><span className="text-slate-500">SKU:</span> <span>{product.sku || '—'}</span></div>
            <div><span className="text-slate-500">Category:</span> <span>{product.category?.name || 'None'}</span></div>
            <div><span className="text-slate-500">Status:</span> <Badge variant={product.is_active ? 'success' : 'secondary'}>{product.is_active ? 'Active' : 'Draft'}</Badge></div>
            {product.description && <div className="col-span-2"><span className="text-slate-500">Description:</span><p className="mt-1 text-slate-700">{product.description}</p></div>}
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Specifications</h2>
          <Button variant="outline" size="sm" onClick={() => setAddingSpec(s => !s)}><Plus size={15} />Add Spec</Button>
        </div>

        {addingSpec && (
          <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>Label</Label><Input value={newSpec.label} onChange={e => setNewSpec(s=>({...s, label: e.target.value}))} placeholder="e.g. Thickness" /></div>
              <div className="space-y-1.5"><Label>Value</Label><Input value={newSpec.value} onChange={e => setNewSpec(s=>({...s, value: e.target.value}))} placeholder="e.g. 35" /></div>
              <div className="space-y-1.5"><Label>Unit</Label><Input value={newSpec.unit} onChange={e => setNewSpec(s=>({...s, unit: e.target.value}))} placeholder="e.g. mm" /></div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAddingSpec(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={addSpec}>Add Spec</Button>
            </div>
          </div>
        )}

        {product.specs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No specifications yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {product.specs.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div className="flex gap-8">
                  <span className="text-sm font-medium text-slate-700 w-40">{s.label}</span>
                  <span className="text-sm text-slate-600">{s.value}{s.unit ? ` ${s.unit}` : ''}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteSpec(s.id)}><Trash2 size={14} className="text-red-400" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Product */}
      <AlertDialog open={deleteProductOpen} onOpenChange={setDeleteProductOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the product and all its images and specifications. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>Delete Product</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
