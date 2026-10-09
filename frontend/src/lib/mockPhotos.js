// Demo photo storage. Used only while VITE_MOCK_PHOTOS=true, because the Spring Boot
// backend has no photo upload or face search endpoints yet.
// Everything lives in memory: refresh the page and uploads are gone.

import { sceneSvg, hashString } from './scenes.js'

const photosByEvent = new Map()
const eventNames = new Map()
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function ensureSeeded(eventId) {
  if (!photosByEvent.has(eventId)) {
    const base = hashString(eventId)
    photosByEvent.set(
      eventId,
      Array.from({ length: 12 }, (_, i) => ({
        id: `${eventId}-sample-${i}`,
        url: sceneSvg(base + i * 7),
        fileName: `sample-${i + 1}.svg`,
        sample: true,
      })),
    )
  }
  return photosByEvent.get(eventId)
}

export function rememberEvents(events) {
  events.forEach((e) => eventNames.set(e.id, e))
}

export async function listPhotos(eventId) {
  await wait(250)
  return [...ensureSeeded(eventId)]
}

export async function uploadPhotos(eventId, files) {
  await wait(400)
  const list = ensureSeeded(eventId)
  const added = files.map((file) => ({
    id: `${eventId}-${crypto.randomUUID()}`,
    url: URL.createObjectURL(file),
    fileName: file.name,
  }))
  list.unshift(...added)
  return added
}

export async function getGuestEvent(eventId) {
  await wait(200)
  const known = eventNames.get(eventId)
  return known
    ? { id: eventId, name: known.name, location: known.location, eventDate: known.eventDate }
    : { id: eventId, name: 'This event', location: null, eventDate: null }
}

// Pretends to run face matching: waits, then returns a random handful of the event's photos.
export async function searchBySelfie(eventId) {
  await wait(1600)
  const all = ensureSeeded(eventId)
  const count = Math.min(all.length, 4 + Math.floor(Math.random() * 4))
  return [...all].sort(() => Math.random() - 0.5).slice(0, count)
}
