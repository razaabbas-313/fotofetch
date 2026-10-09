import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from './api.js'

const AuthContext = createContext(null)

// JWTs carry their expiry ("exp", in seconds). Reading it lets us sign the user out
// on page load instead of waiting for the first request to fail.
function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp ? payload.exp * 1000 < Date.now() : false
  } catch {
    return false
  }
}

function initialSession() {
  const stored = api.loadSession()
  if (stored?.token && isExpired(stored.token)) {
    api.saveSession(null)
    return null
  }
  return stored
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(initialSession)

  const logout = useCallback(() => {
    api.saveSession(null)
    setSession(null)
  }, [])

  useEffect(() => {
    window.addEventListener('ff:unauthorized', logout)
    return () => window.removeEventListener('ff:unauthorized', logout)
  }, [logout])

  const start = useCallback((response) => {
    const next = {
      token: response.token,
      name: response.name,
      email: response.email,
      role: response.role,
    }
    api.saveSession(next)
    setSession(next)
  }, [])

  const login = useCallback(async (credentials) => start(await api.login(credentials)), [start])
  const register = useCallback(async (details) => start(await api.register(details)), [start])

  const value = useMemo(
    () => ({ user: session, isSignedIn: Boolean(session?.token), login, register, logout }),
    [session, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
