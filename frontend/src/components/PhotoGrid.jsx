// Shows photos in a column layout that keeps each photo's own proportions.
export default function PhotoGrid({ photos, highlight = false }) {
  return (
    <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>li]:mb-3">
      {photos.map((photo) => (
        <li key={photo.id} className="group relative break-inside-avoid overflow-hidden rounded-md bg-paper">
          <a href={photo.url} target="_blank" rel="noreferrer" className="block">
            <img
              src={photo.url}
              alt={photo.fileName ? `Photo ${photo.fileName}` : 'Event photo'}
              loading="lazy"
              className="block w-full"
            />
          </a>
          {highlight && (
            <span className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-inset ring-af/80" />
          )}
          <a
            href={photo.url}
            download={photo.fileName || 'photo'}
            className="absolute bottom-2 right-2 rounded-md bg-ink/85 px-2.5 py-1 text-xs font-semibold text-paper opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
            aria-label={`Download ${photo.fileName || 'photo'}`}
          >
            Download
          </a>
        </li>
      ))}
    </ul>
  )
}
