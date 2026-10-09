// All calls to the Spring Boot backend live here, so pages never build URLs by hand.
//
// REAL endpoints (exist in your backend today):
//   POST /api/v1/auth/register   { name, email, password }  -> { token, tokenType, name, email, role }
//   POST /api/v1/auth/login      { email, password }        -> same as above
//   GET  /api/v1/events                                      -> [EventResponse]
//   POST /api/v1/events          { name, description, location, eventDate } -> EventResponse
//
// PLANNED endpoints (not in the backend yet, see README for the full contract):
//   GET  /api/v1/events/{id}/photos
//   POST /api/v1/events/{id}/photos            multipart, field "files" (many)
//   GET  /api/v1/guest/events/{id}
//   POST /api/v1/guest/events/{id}/search      multipart, field "selfie"

import * as mock from './mockPhotos.js'

const BASE = import.meta.env.VITE_API_URL || ''
export const USE_MOCK_PHOTOS = (import.meta.env.VITE_MOCK_PHOTOS ?? 'true') !== 'false'

const SESSION_KEY = 'ff.session'

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function saveSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* storage blocked: the user simply has to sign in again next visit */
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

function friendlyMessage(status) {
  if (status === 400) return 'Some details are missing or invalid. Check the form and try again.'
  if (status === 401 || status === 403) return 'You are not signed in, or your session has expired.'
  if (status === 404) return 'We could not find that.'
  if (status >= 500) return 'The server hit a problem handling that request.'
  return 'Something went wrong. Try again.'
}

async function request(path, { method = 'GET', json, form, auth = true } = {}) {
  const headers = {}
  const session = loadSession()
  if (auth && session?.token) headers.Authorization = `Bearer ${session.token}`

  let body
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (form) {
    body = form // the browser sets the multipart boundary itself
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body })
  } catch {
    throw new ApiError(
      'Cannot reach the server. Check that the Spring Boot app is running on port 8080.',
      0,
    )
  }

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    // Spring Security answers 403 when a token is missing, bad or expired.
    if (auth && session?.token && (res.status === 401 || res.status === 403)) {
      window.dispatchEvent(new Event('ff:unauthorized'))
    }
    throw new ApiError(friendlyMessage(res.status), res.status)
  }
  return data
}

/* ---------- Auth (real) ---------- */

export async function register({ name, email, password }) {
  try {
    return await request('/api/v1/auth/register', { method: 'POST', json: { name, email, password }, auth: false })
  } catch (err) {
    // The backend throws a plain RuntimeException for a duplicate email, which reaches us as a 500.
    if (err.status === 500) {
      throw new ApiError('We could not create that account. The email may already be registered.', 500)
    }
    throw err
  }
}

export async function login({ email, password }) {
  try {
    return await request('/api/v1/auth/login', { method: 'POST', json: { email, password }, auth: false })
  } catch (err) {
    if (err.status === 500 || err.status === 403 || err.status === 401) {
      throw new ApiError('Email or password is incorrect.', err.status)
    }
    throw err
  }
}

/* ---------- Events (real) ---------- */

export async function listEvents() {
  const events = await request('/api/v1/events')
  mock.rememberEvents(events)
  return events
}

export function createEvent(payload) {
  return request('/api/v1/events', { method: 'POST', json: payload })
}

/* ---------- Photos and face search (planned, mock until the backend has them) ---------- */

export function listPhotos(eventId) {
  if (USE_MOCK_PHOTOS) return mock.listPhotos(eventId)
  return request(`/api/v1/events/${eventId}/photos`)
}

export function uploadPhotos(eventId, files) {
  if (USE_MOCK_PHOTOS) return mock.uploadPhotos(eventId, files)
  const form = new FormData()
  files.forEach((file) => form.append('files', file))
  return request(`/api/v1/events/${eventId}/photos`, { method: 'POST', form })
}

export function getGuestEvent(eventId) {
  if (USE_MOCK_PHOTOS) return mock.getGuestEvent(eventId)
  return request(`/api/v1/guest/events/${eventId}`, { auth: false })
}

export function searchBySelfie(eventId, selfieFile) {
  if (USE_MOCK_PHOTOS) return mock.searchBySelfie(eventId, selfieFile)
  const form = new FormData()
  form.append('selfie', selfieFile)
  return request(`/api/v1/guest/events/${eventId}/search`, { method: 'POST', form, auth: false })
}
