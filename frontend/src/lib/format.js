// Backend sends LocalDateTime like "2026-10-08T09:30:00" (no timezone).
export function formatDateTime(iso) {
  if (!iso) return 'Date not set'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Date not set'
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

// <input type="datetime-local"> gives "2026-10-08T09:30". Spring's LocalDateTime
// wants seconds as well, so add them. Empty input becomes null.
export function toLocalDateTime(value) {
  if (!value) return null
  return value.length === 16 ? `${value}:00` : value
}

export function guestLink(eventId) {
  return `${window.location.origin}/find/${eventId}`
}

// Accepts a full guest link or a bare event ID and returns just the ID.
export function extractEventId(input) {
  const text = input.trim()
  const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  return match ? match[0] : null
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers or http pages where the clipboard API is blocked.
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(area)
    return ok
  }
}
