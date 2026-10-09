import { useEffect, useRef } from 'react'

// Uses the browser's built-in <dialog>: focus trapping, Escape to close and the
// backdrop come for free.
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // click on the backdrop
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-line bg-paper p-0 text-ink shadow-xl backdrop:bg-ink/50"
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-1 rounded-md p-2 text-slate hover:bg-table hover:text-ink"
              aria-label="Close"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
