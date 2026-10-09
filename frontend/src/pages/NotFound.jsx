import { Link } from 'react-router-dom'
import usePageTitle from '../lib/usePageTitle.js'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="font-display text-6xl font-extrabold text-af-deep">404</p>
      <h1 className="mt-3 text-3xl font-bold">We could not find that page</h1>
      <p className="mt-3 text-slate">The link may be wrong, or the page may have moved.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Back to home
      </Link>
    </div>
  )
}
