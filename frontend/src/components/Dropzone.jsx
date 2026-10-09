import { useRef, useState } from 'react'

// Click to choose files or drag them in. Only image files are passed on.
export default function Dropzone({ onFiles, disabled = false }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function accept(fileList) {
    const images = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (images.length) onFiles(images)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (!disabled) accept(e.dataTransfer.files)
      }}
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragging ? 'border-af bg-af/10' : 'border-line bg-paper'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-medium">Drop event photos here</p>
      <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()} className="btn btn-ghost btn-sm">
        Choose photos
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          accept(e.target.files)
          e.target.value = '' // lets the same files be chosen again
        }}
      />
    </div>
  )
}
