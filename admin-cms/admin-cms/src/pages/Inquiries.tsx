import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Search, Mail, Phone, Building2 } from 'lucide-react'
import client from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useAuth } from '@/context/AuthContext'

interface Inquiry {
  id: number; name: string; email: string; phone?: string; subject?: string
  message: string; company?: string; product_name?: string
  form_type: string; is_read: number; created_at: string
}

export default function Inquiries() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [q, setQ] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [total, setTotal] = useState(0)

  const load = async () => {
    try {
      const res = await client.get('/api/inquiries', { params: { q: q || undefined, per_page: 50 } })
      setInquiries(res.data.data ?? [])
      setTotal(res.data.meta?.total ?? 0)
    } catch { toast.error('Failed to load inquiries.') }
  }

  useEffect(() => { load() }, [q])

  const markRead = async (inq: Inquiry) => {
    setSelected(inq)
    if (!inq.is_read) {
      await client.post(`/api/inquiries/${inq.id}/read`)
      setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, is_read: 1 } : i))
    }
  }

  const remove = async () => {
    if (!deleteId) return
    try {
      await client.delete(`/api/inquiries/${deleteId}`)
      toast.success('Deleted.')
      setDeleteId(null)
      if (selected?.id === deleteId) setSelected(null)
      load()
    } catch { toast.error('Failed.') }
  }

  const typeColor: Record<string, 'default' | 'secondary' | 'success'> = {
    inquiry: 'default', consultation: 'success', contact: 'secondary'
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* List panel */}
      <div className="w-80 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-200">
          <p className="text-xs text-slate-500 mb-2">{total} inquiries</p>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <Input className="pl-8 text-xs h-8" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {inquiries.map(inq => (
            <button
              key={inq.id}
              onClick={() => markRead(inq)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${selected?.id === inq.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm truncate ${!inq.is_read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{inq.name}</p>
                <Badge variant={typeColor[inq.form_type] ?? 'secondary'} className="shrink-0 text-xs">{inq.form_type}</Badge>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">{inq.subject || inq.message.slice(0, 40)}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(inq.created_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-y-auto">
        {selected ? (
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selected.name}</h2>
                <Badge variant={typeColor[selected.form_type] ?? 'secondary'}>{selected.form_type}</Badge>
              </div>
              {user?.role === 'admin' && (
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(selected.id)}>
                  <Trash2 size={16} className="text-red-400" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Mail size={14} />{selected.email}</div>
              {selected.phone && <div className="flex items-center gap-2 text-slate-600"><Phone size={14} />{selected.phone}</div>}
              {selected.company && <div className="flex items-center gap-2 text-slate-600"><Building2 size={14} />{selected.company}</div>}
              {selected.product_name && <div className="text-slate-600"><span className="font-medium">Product:</span> {selected.product_name}</div>}
            </div>
            {selected.subject && <p className="text-sm font-medium text-slate-700 mb-1">Subject: {selected.subject}</p>}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.message}</p>
            </div>
            <p className="text-xs text-slate-400 mt-3">{new Date(selected.created_at).toLocaleString()}</p>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="text-center"><Mail size={40} className="mx-auto mb-2 opacity-30" /><p>Select an inquiry to view</p></div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Inquiry?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
