import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractEventId } from '../lib/format.js'
import usePageTitle from '../lib/usePageTitle.js'

// Guests normally arrive through the link the photographer sent. This page is for
// anyone who only has the link text or the event ID and needs somewhere to paste it.
export default function FindEntry() {
  usePageTitle('Find my photos')
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const id = extractEventId(value)
    if (!id) {
      setError('That does not look like an event link. Paste the full link the photographer sent you.')
      return
    }
    navigate(`/find/${id}`)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Find my photos</h1>
      <p className="mt-3 text-lg text-slate">
        Paste the event link your photographer sent you. Then take a selfie and we will find the photos
        you are in.
      </p>

      <form onSubmit={handleSubmit} className="panel mt-8 p-6" noValidate>
        <label htmlFor="event-link" className="label">
          Event link
        </label>
        <input
          id="event-link"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'event-link-error' : undefined}
          className="input"
          placeholder="https://…/find/…"
          autoComplete="off"
          spellCheck={false}
        />
        {error && (
          <p id="event-link-error" role="alert" className="mt-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        <button type="submit" disabled={!value.trim()} className="btn btn-find mt-5 w-full">
          Continue
        </button>
      </form>
    </div>
  )
}
