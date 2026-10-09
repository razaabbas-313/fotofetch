// Generates small photo-like SVG scenes (a background plus one or two people).
// Used for the landing page contact sheet and for demo photos while the backend
// has no photo storage yet. Same seed always gives the same picture.

const BACKDROPS = [
  ['#3b5b73', '#d9a273'],
  ['#2f4a45', '#c9c58e'],
  ['#5b4a6b', '#e3a49a'],
  ['#1f3a5f', '#8fb7c9'],
  ['#6b4a2f', '#e8c58a'],
  ['#3d5a4a', '#a7c4b0'],
  ['#7a3f4a', '#f0b7a4'],
  ['#2c2f48', '#8d9bd1'],
]
const SKIN = ['#e0b08c', '#c68a62', '#8d5a3c', '#f1c9a5', '#a8714c']
const CLOTH = ['#1d2b3a', '#b5483a', '#e8e2d0', '#2e6f5e', '#d9a441', '#4a4e8a']

// Small deterministic random number generator, so a seed always draws the same scene.
function rng(seed) {
  let s = (Math.abs(Math.floor(seed)) + 1) * 2654435761
  return () => {
    s = (s ^ (s << 13)) >>> 0
    s = (s ^ (s >>> 17)) >>> 0
    s = (s ^ (s << 5)) >>> 0
    return (s % 10000) / 10000
  }
}
const pick = (r, list) => list[Math.floor(r() * list.length)]

export function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function sceneSvg(seed) {
  const r = rng(seed)
  const [top, bottom] = pick(r, BACKDROPS)
  const people = r() > 0.55 ? 2 : 1
  const xs = people === 1 ? [160 + r() * 80] : [105 + r() * 30, 255 + r() * 30]

  const figures = xs
    .map((x) => {
      const skin = pick(r, SKIN)
      const cloth = pick(r, CLOTH)
      const scale = 0.85 + r() * 0.3
      return `
        <g transform="translate(${x.toFixed(0)} 0) scale(${scale.toFixed(2)})" >
          <ellipse cx="0" cy="300" rx="92" ry="105" fill="${cloth}"/>
          <rect x="-14" y="170" width="28" height="40" rx="10" fill="${skin}"/>
          <circle cx="0" cy="140" r="42" fill="${skin}"/>
          <path d="M-42 134 Q-38 92 0 92 Q40 92 42 134 Q20 112 -42 134Z" fill="#1a1410" opacity="0.85"/>
        </g>`
    })
    .join('')

  const sunX = 60 + r() * 280
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
      </linearGradient>
      <radialGradient id="s"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <circle cx="${sunX.toFixed(0)}" cy="70" r="90" fill="url(#s)"/>
    ${figures}
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
