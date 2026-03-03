import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setLoading: (v: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const setLoading = (v: boolean) => setIsLoading(v)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider')
  return ctx
}
