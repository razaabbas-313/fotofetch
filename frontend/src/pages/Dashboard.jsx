import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'
import { formatDateTime, guestLink, toLocalDateTime } from '../lib/format.js'
import usePageTitle from '../lib/usePageTitle.js'
import CopyButton from '../components/CopyButton.jsx'
import Modal from '../components/Modal.jsx'

const EMPTY_FORM = { name: '', description: '', location: '', eventDate: '' }

function CreateEventForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const created = await api.createEvent({
        name: form.name.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        eventDate: toLocalDateTime(form.eventDate),
      })
      onCreated(created)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="ev-name" className="label">
          Event name
        </label>
        <input
          id="ev-name"
          required
          autoFocus
          value={form.name}
          onChange={set('name')}
          className="input"
          placeholder="Ayesha and Bilal's wedding"
        />
      </div>
      <div>
        <label htmlFor="ev-date" className="label">
          Date and time <span className="font-normal text-slate">(optional)</span>
        </label>
        <input id="ev-date" type="datetime-local" value={form.eventDate} onChange={set('eventDate')} className="input" />
      </div>
      <div>
        <label htmlFor="ev-location" className="label">
          Location <span className="font-normal text-slate">(optional)</span>
        </label>
        <input id="ev-location" value={form.location} onChange={set('location')} className="input" />
      </div>
      <div>
        <label htmlFor="ev-desc" className="label">
          Description <span className="font-normal text-slate">(optional)</span>
        </label>
        <textarea id="ev-desc" rows={3} value={form.description} onChange={set('description')} className="input" />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={busy || !form.name.trim()} className="btn btn-primary">
          {busy ? 'Creating…' : 'Create event'}
        </button>
      </div>
    </form>
  )
}

export default function Dashboard() {
  usePageTitle('Your events')
  const { user } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState(null) // null = still loading
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError('')
    api
      .listEvents()
      .then((list) => {
        if (cancelled) return
        // Newest first.
        setEvents([...list].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  function handleCreated(event) {
    setCreating(false)
    navigate(`/events/${event.id}`)
  }

  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Your events</h1>
          <p className="mt-1 text-slate">{firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}</p>
        </div>
        <button type="button" onClick={() => setCreating(true)} className="btn btn-primary">
          New event
        </button>
      </div>

      <div className="mt-8">
        {error ? (
          <div role="alert" className="panel flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="font-medium text-danger">{error}</p>
            <button
              type="button"
              onClick={() => {
                setEvents(null)
                setReloadKey((k) => k + 1)
              }}
              className="btn btn-ghost btn-sm"
            >
              Try again
            </button>
          </div>
        ) : events === null ? (
          <p className="text-slate" role="status">
            Loading your events…
          </p>
        ) : events.length === 0 ? (
          <div className="panel p-8 text-center">
            <h2 className="text-2xl font-bold">No events yet</h2>
            <p className="mx-auto mt-2 max-w-md text-slate">
              Create your first event, upload the photos, then share the guest link.
            </p>
            <button type="button" onClick={() => setCreating(true)} className="btn btn-primary mt-5">
              Create your first event
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <li key={event.id} className="panel flex flex-col justify-between gap-5 p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-bold leading-tight">
                      <Link to={`/events/${event.id}`} className="hover:underline">
                        {event.name}
                      </Link>
                    </h2>
                    <span className="chip shrink-0">{event.active === false ? 'Closed' : 'Active'}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate">{formatDateTime(event.eventDate)}</p>
                  {event.location && <p className="text-sm text-slate">{event.location}</p>}
                  {event.description && <p className="mt-3 line-clamp-2 text-[15px]">{event.description}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm">
                    Manage photos
                  </Link>
                  <CopyButton text={guestLink(event.id)} label="Copy guest link" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="New event">
        <CreateEventForm onCreated={handleCreated} onCancel={() => setCreating(false)} />
      </Modal>
    </div>
  )
}
