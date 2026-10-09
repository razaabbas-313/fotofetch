import { useEffect, useRef, useState } from 'react'

// Lets a guest provide one selfie: use the webcam, or pick or take a photo.
// Calls onSelect(file) with a File, or onSelect(null) when cleared.
export default function SelfieInput({ onSelect, disabled = false }) {
  const fileRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState('')

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  // Release the camera if the guest leaves the page.
  useEffect(() => stopCamera, [])

  // Free the temporary preview URL when it changes.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  function choose(file) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onSelect(file)
  }

  async function startCamera() {
    setCameraError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('This browser cannot open the camera here. Upload a photo instead.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      streamRef.current = stream
      setCameraOn(true)
      // The <video> mounts on the next render, so attach the stream after that.
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
    } catch {
      setCameraError('Camera access was blocked. Allow it in your browser, or upload a photo instead.')
    }
  }

  function snap() {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (blob) choose(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }))
        stopCamera()
      },
      'image/jpeg',
      0.92,
    )
  }

  function clear() {
    setPreview(null)
    onSelect(null)
  }

  if (cameraOn) {
    return (
      <div className="space-y-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-[4/3] w-full -scale-x-100 rounded-lg bg-ink object-cover"
        />
        <div className="flex gap-2">
          <button type="button" onClick={snap} className="btn btn-find">
            Take photo
          </button>
          <button type="button" onClick={stopCamera} className="btn btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (preview) {
    return (
      <div className="space-y-3">
        <img src={preview} alt="Your selfie" className="aspect-[4/3] w-full rounded-lg object-cover" />
        <button type="button" onClick={clear} disabled={disabled} className="btn btn-ghost btn-sm">
          Use a different photo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border-2 border-dashed border-line bg-paper p-6 text-center text-sm text-slate">
        Use a clear, front-facing photo of your face, in good light.
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={startCamera} disabled={disabled} className="btn btn-primary">
          Use camera
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={disabled} className="btn btn-ghost">
          Upload a photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="user"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            choose(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
      {cameraError && (
        <p role="alert" className="text-sm text-danger">
          {cameraError}
        </p>
      )}
    </div>
  )
}
