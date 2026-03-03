import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type User = {
  id: number
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  userToken: string | null
  loading: boolean
  login: (data: { token: string; user: User }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    const userData = localStorage.getItem('userData')
    if (token && userData) {
      setUserToken(token)
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = ({ token, user }: { token: string; user: User }) => {
    localStorage.setItem('user_token', token)
    localStorage.setItem('userData', JSON.stringify(user))
    setUserToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('userData')
    setUserToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
