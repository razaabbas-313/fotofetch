# FotoFetch frontend

React 19 + Vite + Tailwind CSS 4 + React Router. Talks to the Spring Boot backend in the parent folder.

## Run it

You need Node 20 or newer.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Start the Spring Boot app too (port 8080) with PostgreSQL running.

In development, Vite forwards every `/api/...` request to Spring Boot, so the browser sees a single
origin and you do not need any CORS setup. To point at a different backend, copy `.env.example` to
`.env.local` and change `VITE_PROXY_TARGET`.

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Pages

| Route | Who | What it does |
| --- | --- | --- |
| `/` | everyone | Landing page |
| `/register`, `/login` | photographers | Account and JWT sign-in (real backend) |
| `/dashboard` | photographers | List events, create an event (real backend) |
| `/events/:eventId` | photographers | Event details, guest link, photo upload and gallery |
| `/find` | guests | Paste an event link or ID |
| `/find/:eventId` | guests | Take or upload a selfie, see matching photos |

## What is real and what is demo

Real, using your existing endpoints:

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- `GET /api/v1/events`, `POST /api/v1/events`

Demo mode (`VITE_MOCK_PHOTOS=true`, the default): photo upload, the photo gallery and the selfie
search are simulated in the browser, because the backend does not have those endpoints yet. Photos
live in memory and disappear on refresh, and search returns random sample photos. A yellow "Demo
mode" note on those pages says so.

## Connecting the real photo endpoints later

Build these in Spring Boot, then set `VITE_MOCK_PHOTOS=false` in `.env.local`. The frontend already
calls them (see `src/lib/api.js`).

| Method and path | Auth | Request | Response |
| --- | --- | --- | --- |
| `GET /api/v1/events/{id}/photos` | JWT | none | `[{ id, url, fileName }]` |
| `POST /api/v1/events/{id}/photos` | JWT | multipart, field `files` (many) | any 2xx |
| `GET /api/v1/guest/events/{id}` | public | none | `{ id, name, location, eventDate }` |
| `POST /api/v1/guest/events/{id}/search` | public | multipart, field `selfie` | `[{ id, url, fileName }]` |

Notes for the backend:

- `SecurityConfig` already allows `/api/v1/guest/**` without a token, which is what the guest page needs.
- Spring rejects uploads over 1 MB per file by default. Raise it in `application.properties`:
  `spring.servlet.multipart.max-file-size=20MB` and `spring.servlet.multipart.max-request-size=200MB`.
- `url` must be something the browser can load in an `<img>` tag.
- There is no "get one event" endpoint, so the event page finds the event in the `GET /api/v1/events`
  list. A `GET /api/v1/events/{id}` endpoint would be cleaner.

## Deploying separately from the backend

If the frontend is hosted on a different domain, set `VITE_API_URL` to the backend URL at build time
and add a CORS configuration to Spring Security (`http.cors(...)`), because the dev proxy no longer
applies.

## Folder guide

```
src/
  main.jsx, App.jsx     app entry and routes
  index.css             Tailwind theme (colors, fonts) and shared button/input styles
  pages/                one file per route
  components/           Navbar, Modal, Dropzone, PhotoGrid, SelfieInput, ...
  lib/
    api.js              every backend call, plus JWT storage and error messages
    auth.jsx            sign-in state (React context)
    mockPhotos.js       the demo photo store
```
