import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../lib/api.js'
import { formatDateTime } from '../lib/format.js'
import usePageTitle from '../lib/usePageTitle.js'
import Bracket from '../components/Bracket.jsx'
import DemoNotice from '../components/DemoNotice.jsx'
import PhotoGrid from '../components/PhotoGrid.jsx'
import SelfieInput from '../components/SelfieInput.jsx'

export default function FindPhotos() {
  const { eventId } = useParams()

  const [event, setEvent] = useState(undefined) // undefined = loading, null = not found
  const [selfie, setSelfie] = useState(null)
  const [status, setStatus] = useState('idle') // idle | searching | done | error
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  // Bumped to remount the selfie picker when the guest starts over.
  const [round, setRound] = useState(0)

  usePageTitle(event?.name ? `Find your photos: ${event.name}` : 'Find my photos')

  useEffect(() => {
    let cancelled = false
    setEvent(undefined)
    setStatus('idle')
    setResults([])
    api
      .getGuestEvent(eventId)
      .then((e) => {
        if (!cancelled) setEvent(e)
      })
      .catch((err) => {
        if (cancelled) return
        // A 404 means the event does not exist. Anything else we still let the guest try.
        setEvent(err.status === 404 ? null : { id: eventId, name: 'This event' })
      })
    return () => {
      cancelled = true
    }
  }, [eventId])

  async function handleSearch() {
    if (!selfie) return
    setError('')
    setStatus('searching')
    try {
      const found = await api.searchBySelfie(eventId, selfie)
      setResults(found)
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  function startOver() {
    setSelfie(null)
    setResults([])
    setStatus('idle')
    setRound((r) => r + 1)
  }

  if (event === undefined) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-12 text-slate sm:px-6" role="status">
        Loading event…
      </p>
    )
  }
  if (event === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold">We could not find that event</h1>
        <p className="mt-2 text-slate">Check the link with your photographer and try again.</p>
        <Link to="/find" className="btn btn-primary mt-5">
          Enter a different link
        </Link>
      </div>
    )
  }

  const searching = status === 'searching'
  const showResults = status === 'done'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-af-deep">Find your photos</p>
      <h1 className="mt-1 text-4xl font-bold sm:text-5xl">{event.name}</h1>
      {(event.eventDate || event.location) && (
        <p className="mt-2 text-slate">
          {event.eventDate ? formatDateTime(event.eventDate) : ''}
          {event.eventDate && event.location ? ' · ' : ''}
          {event.location || ''}
        </p>
      )}

      <div className="mt-6">
        <DemoNotice>
          Face matching is simulated until the backend has it, so results are random sample photos, not
          matches for your face.
        </DemoNotice>
      </div>

      {!showResults && (
        <section className="mx-auto mt-8 max-w-xl" aria-labelledby="selfie-heading">
          <h2 id="selfie-heading" className="mb-3 text-2xl font-bold">
            1. Add a selfie
          </h2>
          <Bracket className="p-3" size={20}>
            <SelfieInput key={round} onSelect={setSelfie} disabled={searching} />
          </Bracket>

          <button
            type="button"
            onClick={handleSearch}
            disabled={!selfie || searching}
            className="btn btn-find mt-6 w-full py-3 text-base"
          >
            {searching ? 'Searching the event photos…' : '2. Find my photos'}
          </button>
          <div aria-live="polite" className="mt-3 min-h-5 text-sm">
            {searching && <p className="text-slate">Checking every photo for your face. This can take a moment.</p>}
            {status === 'error' && <p className="font-medium text-danger">{error}</p>}
          </div>
        </section>
      )}

      {showResults && (
        <section className="mt-8" aria-labelledby="results-heading" aria-live="polite">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="results-heading" className="text-2xl font-bold">
              {results.length === 0
                ? 'No matches found'
                : `We found ${results.length} ${results.length === 1 ? 'photo' : 'photos'} of you`}
            </h2>
            <button type="button" onClick={startOver} className="btn btn-ghost btn-sm">
              Try another selfie
            </button>
          </div>
          {results.length === 0 ? (
            <p className="max-w-xl text-slate">
              Try a clearer, front-facing photo in good light. If you were at the event, the photographer
              may not have uploaded every photo yet.
            </p>
          ) : (
            <PhotoGrid photos={results} highlight />
          )}
        </section>
      )}
    </div>
  )
}
