import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import Logo from './Logo.jsx'

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-[15px] font-medium transition-colors hover:bg-paper ${
    isActive ? 'text-ink' : 'text-slate'
  }`

export default function Navbar() {
  const { user, isSignedIn, logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-line">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6"
        aria-label="Main"
      >
        <Link to="/" className="flex items-center gap-2.5 rounded-md" aria-label="FotoFetch home">
          <Logo />
          <span className="font-display text-xl font-extrabold tracking-tight">FotoFetch</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/find" className={linkClass}>
            Find my photos
          </NavLink>
          {isSignedIn ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Events
              </NavLink>
              <span className="hidden px-2 text-sm text-slate sm:inline" title={user?.email}>
                {user?.name}
              </span>
              <button type="button" onClick={handleSignOut} className="btn btn-ghost btn-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign in
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Create account
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
