# RitzlaPlay

RitzlaPlay is a React/Vite movie and TV discovery interface backed by VidSrc playback and catalog inventories.

## Data flow

- VidSrc (`vsembed.ru`) is the source of truth for stream availability.
- The app reads VidSrc's keyless, CORS-enabled movie, TV, and episode ID inventories.
- Visible titles are enriched on demand with keyless Cinemeta metadata for posters, backdrops, plots, genres, cast, and episode guides.
- Playback uses the title's IMDb ID with VidSrc's movie or TV embed endpoint.
- Google Cloud Translation translates synopses when a browser-restricted API key is configured.

The app does not require a TMDB API key.

## Catalog behavior

- Movies and Series use real paginated provider results instead of a hardcoded catalog.
- Search is available in Discover, Movies, and Series. It checks metadata, then removes anything missing from the VidSrc inventory.
- A Bloom-filter precheck plus an exact ID set makes large-inventory membership checks fast without false matches.
- Provider inventories, home results, opened metadata, and provider counts are cached in browser storage to speed up hard refreshes.
- Discover supports media type, genre, region, original language, and sorting.
- TV detail pages build seasons and episodes from live metadata and play the selected VidSrc episode.
- Posters fall back to an accessible placeholder if a remote image is unavailable.

## Environment

Copy `.env.example` to `.env.local` and set any private values there:

```env
VITE_GOOGLE_TRANSLATE_API_KEY=your_browser_restricted_google_key
VITE_STREAM_API_URL=https://vsembed.ru
VITE_METADATA_API_URL=https://v3-cinemeta.strem.io
```

Restrict the Google key by HTTP referrer and enable Cloud Translation Basic (v2) for its project. Do not commit `.env.local`.

## Run

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
```

## Main routes

- `/home` — provider-backed home catalog
- `/discover` — simple discovery filters
- `/movies` — paginated movies
- `/series` — paginated series
- `/search` — debounced movie and series search
- `/title/:id` — metadata, cast, seasons, and episodes
- `/watch/:id` — VidSrc playback, mirrors, subtitle language, and resume tracking

The previous Live & Events route, sign-in flow, and simulated voice search were removed. The player can open the selected provider URL in a new tab; any download option is controlled by VidSrc because its public API does not expose a direct download endpoint.
