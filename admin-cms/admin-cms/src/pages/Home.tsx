import { useEffect, useState } from 'react'
import { Package, Tag, MessageSquare, FolderOpen } from 'lucide-react'
import client from '@/lib/api'

interface Stats {
  products: number
  categories: number
  inquiries: number
  projects: number
}

interface Inquiry {
  id: number
  name: string
  email: string
  subject: string
  form_type: string
  created_at: string
  is_read: number
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, inquiries: 0, projects: 0 })
  const [recent, setRecent] = useState<Inquiry[]>([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, c, i, pr] = await Promise.all([
          client.get('/api/products?per_page=1'),
          client.get('/api/categories?flat=1'),
          client.get('/api/inquiries?per_page=1'),
          client.get('/api/projects?per_page=1'),
        ])
        setStats({
          products: p.data.meta?.total ?? 0,
          categories: (c.data.data ?? []).length,
          inquiries: i.data.meta?.total ?? 0,
          projects: pr.data.meta?.total ?? 0,
        })
        const latest = await client.get('/api/inquiries?per_page=5')
        setRecent(latest.data.data ?? [])
      } catch {}
    }
    fetchAll()
  }, [])

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-purple-500' },
    { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`${color} p-3 rounded-lg`}>
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Recent Inquiries</h2>
        {recent.length === 0 ? (
          <p className="text-slate-400 text-sm">No inquiries yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map(inq => (
              <div key={inq.id} className="py-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{inq.name}</p>
                  <p className="text-xs text-slate-500">{inq.email} · {inq.form_type}</p>
                  {inq.subject && <p className="text-xs text-slate-600 mt-0.5">{inq.subject}</p>}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${inq.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700 font-semibold'}`}>
                    {inq.is_read ? 'Read' : 'New'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{new Date(inq.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
