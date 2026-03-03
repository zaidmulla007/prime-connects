import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { useLoading } from '@/context/LoadingContext'
import AppSidebar from '@/components/Common/AppSidebar'
import TopNavbar from '@/components/Common/TopNavbar'
import LoadingAnimation from '@/components/Common/LoadingAnimation'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Users from '@/pages/Users'
import Profile from '@/pages/Profile'
import Categories from '@/pages/Categories'
import Banners from '@/pages/Banners'
import Inquiries from '@/pages/Inquiries'
import Projects from '@/pages/Projects'
import Certificates from '@/pages/Certificates'
import ProductList from '@/pages/product/ProductList'
import ProductDetails from '@/pages/product/ProductDetails'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/banners': 'Banners',
  '/inquiries': 'Inquiries',
  '/projects': 'Projects',
  '/certificates': 'Certificates',
  '/users': 'Users',
  '/profile': 'Profile',
}

function ProtectedLayout() {
  const { isLoading } = useLoading()
  const path = window.location.pathname
  const title = pageTitles[path] ?? 'Prime Connects Admin'

  return (
    <div className="flex h-screen bg-slate-50">
      {isLoading && <LoadingAnimation />}
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TopNavbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingAnimation />

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/*"
          element={user ? <ProtectedLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  )
}
