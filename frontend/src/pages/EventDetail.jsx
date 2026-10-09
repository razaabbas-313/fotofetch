import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../lib/api.js'
import { formatDateTime, guestLink } from '../lib/format.js'
import usePageTitle from '../lib/usePageTitle.js'
import CopyButton from '../components/CopyButton.jsx'
import DemoNotice from '../components/DemoNotice.jsx'
import Dropzone from '../components/Dropzone.jsx'
import PhotoGrid from '../components/PhotoGrid.jsx'

export default function EventDetail() {
  const { eventId } = useParams()

  const [event, setEvent] = useState(undefined) // undefined = loading, null = not found
  const [loadError, setLoadError] = useState('')
  const [photos, setPhotos] = useState(null)
  const [photosError, setPhotosError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadedCount, setUploadedCount] = useState(0)

  usePageTitle(event?.name || 'Event')

  // The backend has no "get one event" endpoint yet, so find it in the photographer's list.
  useEffect(() => {
    let cancelled = false
    setEvent(undefined)
    setLoadError('')
    api
      .listEvents()
      .then((list) => {
        if (!cancelled) setEvent(list.find((e) => e.id === eventId) || null)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [eventId])

  const loadPhotos = useCallback(async () => {
    setPhotosError('')
    try {
      setPhotos(await api.listPhotos(eventId))
    } catch (err) {
      setPhotosError(err.message)
    }
  }, [eventId])

  useEffect(() => {
    if (event) loadPhotos()
  }, [event, loadPhotos])

  async function handleFiles(files) {
    setUploadError('')
    setUploadedCount(0)
    setUploading(true)
    try {
      await api.uploadPhotos(eventId, files)
      setUploadedCount(files.length)
      await loadPhotos()
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p role="alert" className="font-medium text-danger">
          {loadError}
        </p>
        <Link to="/dashboard" className="btn btn-ghost mt-4">
          Back to events
        </Link>
      </div>
    )
  }
  if (event === undefined) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-12 text-slate sm:px-6" role="status">
        Loading event…
      </p>
    )
  }
  if (event === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold">Event not found</h1>
        <p className="mt-2 text-slate">It may belong to another account, or the link is wrong.</p>
        <Link to="/dashboard" className="btn btn-ghost mt-4">
          Back to events
        </Link>
      </div>
    )
  }

  const link = guestLink(event.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/dashboard" className="text-sm font-medium text-slate hover:text-ink">
        ← All events
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{event.name}</h1>
          <p className="mt-1 text-slate">
            {formatDateTime(event.eventDate)}
            {event.location ? ` · ${event.location}` : ''}
          </p>
          {event.description && <p className="mt-3 max-w-2xl">{event.description}</p>}
        </div>
      </div>

      <section className="panel mt-8 p-5" aria-labelledby="share-heading">
        <h2 id="share-heading" className="text-xl font-bold">
          Guest link
        </h2>
        <p className="mt-1 text-sm text-slate">Send this to guests. They take a selfie and see only their photos.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input readOnly value={link} aria-label="Guest link" className="input" onFocus={(e) => e.target.select()} />
          <CopyButton text={link} label="Copy link" className="btn btn-primary shrink-0" />
        </div>
      </section>

      <section className="mt-8" aria-labelledby="photos-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="photos-heading" className="text-2xl font-bold">
            Photos{photos ? ` (${photos.length})` : ''}
          </h2>
        </div>

        <div className="mb-5 space-y-3">
          <DemoNotice>
            The backend has no photo storage or face search yet, so photos here are kept in your browser and
            disappear when you refresh. Everything else on this page is real.
          </DemoNotice>
          <Dropzone onFiles={handleFiles} disabled={uploading} />
          <div aria-live="polite" className="min-h-5 text-sm">
            {uploading && <p className="text-slate">Uploading…</p>}
            {!uploading && uploadedCount > 0 && (
              <p className="font-medium text-af-deep">
                Added {uploadedCount} {uploadedCount === 1 ? 'photo' : 'photos'}.
              </p>
            )}
            {uploadError && <p className="font-medium text-danger">{uploadError}</p>}
          </div>
        </div>

        {photosError ? (
          <div role="alert" className="flex flex-wrap items-center gap-3">
            <p className="font-medium text-danger">{photosError}</p>
            <button type="button" onClick={loadPhotos} className="btn btn-ghost btn-sm">
              Try again
            </button>
          </div>
        ) : photos === null ? (
          <p className="text-slate" role="status">
            Loading photos…
          </p>
        ) : photos.length === 0 ? (
          <p className="text-slate">No photos yet. Drop some above to get started.</p>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </section>
    </div>
  )
}
