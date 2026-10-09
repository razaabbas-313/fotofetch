import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import usePageTitle from '../lib/usePageTitle.js'

export default function Register() {
  usePageTitle('Create account')
  const { register, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isSignedIn && !busy) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    // Same rule as the backend (@Size(min = 6)), checked first for a quicker message.
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setBusy(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold">Create your account</h1>
      <p className="mt-2 text-slate">Set up events and upload photos for your guests.</p>

      <form onSubmit={handleSubmit} className="panel mt-8 space-y-5 p-6" noValidate>
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            aria-describedby="password-hint"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <p id="password-hint" className="mt-1.5 text-sm text-slate">
            At least 6 characters.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !name.trim() || !email || !password}
          className="btn btn-primary w-full"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}
