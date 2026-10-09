import { useEffect, useRef, useState } from 'react'
import { copyText } from '../lib/format.js'

export default function CopyButton({ text, label = 'Copy', copiedLabel = 'Copied', className = 'btn btn-ghost btn-sm' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function handleClick() {
    const ok = await copyText(text)
    if (!ok) return
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  )
}
