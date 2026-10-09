import { USE_MOCK_PHOTOS } from '../lib/api.js'

// Shown while photo storage and face search are still simulated in the browser.
export default function DemoNotice({ children }) {
  if (!USE_MOCK_PHOTOS) return null
  return (
    <div
      role="note"
      className="flex gap-3 rounded-md border border-flash/70 bg-flash/15 px-4 py-3 text-sm leading-relaxed"
    >
      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-flash" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Demo mode.</strong> {children}
      </p>
    </div>
  )
}
