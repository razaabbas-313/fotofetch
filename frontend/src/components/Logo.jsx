export default function Logo({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g fill="none" stroke="#10B365" strokeWidth="3" strokeLinecap="square">
        <path d="M5 12V5h7" />
        <path d="M20 5h7v7" />
        <path d="M27 20v7h-7" />
        <path d="M12 27H5v-7" />
      </g>
      <circle cx="16" cy="16" r="3" fill="#FFB81C" />
    </svg>
  )
}
