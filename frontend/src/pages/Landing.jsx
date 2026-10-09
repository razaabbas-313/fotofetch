import { Link } from 'react-router-dom'
import { sceneSvg } from '../lib/scenes.js'
import usePageTitle from '../lib/usePageTitle.js'

// Twelve demo frames laid out as a 4 x 3 contact sheet. The animated autofocus
// bracket in index.css ends on frame 5 (second column, second row).
const SHEET = Array.from({ length: 12 }, (_, i) => sceneSvg(i * 11 + 5))
const MATCH_INDEX = 5

const STEPS = [
  {
    title: 'Photographer uploads',
    text: 'Create an event, drop in the photos, and share one link with your guests.',
  },
  {
    title: 'Guest takes a selfie',
    text: 'No account needed. Open the link, snap a selfie or pick a photo of your face.',
  },
  {
    title: 'FotoFetch finds the matches',
    text: 'Face recognition checks the event photos and shows only the ones you appear in.',
  },
]

export default function Landing() {
  usePageTitle('')

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
        <div>
          <p className="chip mb-5">AI-powered event photo retrieval</p>
          <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-6xl">
            Take a selfie.
            <br />
            <span className="text-af-deep">Find your event photos.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Stop scrolling through hundreds of photos from the wedding, the graduation or the
            conference. FotoFetch recognizes your face and pulls out the photos you are in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/find" className="btn btn-find px-5 py-3 text-base">
              Find my photos
            </Link>
            <Link to="/register" className="btn btn-ghost px-5 py-3 text-base">
              I'm a photographer
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="rounded-lg bg-ink p-2 shadow-xl">
          <div className="relative aspect-[4/3] w-full">
            <div className="grid h-full w-full grid-cols-4 grid-rows-3">
              {SHEET.map((src, i) => (
                <div key={i} className="relative overflow-hidden border-2 border-ink">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {i === MATCH_INDEX && (
                    <span className="hero-match absolute bottom-1 left-1 rounded-full bg-af px-2 py-0.5 text-[11px] font-bold text-ink">
                      Match
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="hero-af">
              <span className="af-corner af-tl" />
              <span className="af-corner af-tr" />
              <span className="af-corner af-bl" />
              <span className="af-corner af-br" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="panel bg-table p-5">
                <span className="font-display text-4xl font-extrabold text-af-deep">{i + 1}</span>
                <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="panel flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Shooting an event?</h2>
            <p className="mt-2 max-w-xl text-slate">
              Create a free account, upload your photos once, and send guests a single link instead
              of answering "can you send me my photos?" a hundred times.
            </p>
          </div>
          <Link to="/register" className="btn btn-primary shrink-0 px-5 py-3 text-base">
            Create an account
          </Link>
        </div>
      </section>
    </>
  )
}
