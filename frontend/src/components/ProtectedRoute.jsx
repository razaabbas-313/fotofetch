import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

// Sends signed-out visitors to the login page and brings them back afterwards.
export default function ProtectedRoute() {
  const { isSignedIn } = useAuth()
  const location = useLocation()
  if (!isSignedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
