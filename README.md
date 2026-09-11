# Jal Sanskriti — Digital Archive of Traditional Indian Water Systems

A React + Vite application with a Node.js API for discovering and documenting India’s traditional water infrastructure: stepwells, tanks, johads, zabo systems, and irrigation networks.

## Run locally

```bash
npm install
npm run dev:api
npm run dev
```

Run the API and frontend in separate terminals. The API uses port `5051` by default. Copy `.env.example` to `.env` if your API uses a different address.

## API

The backend reads `server/data/systems.csv`, the supplied 106-record dataset. It provides:

- `GET /api/systems?search=&state=&region=&type=&page=&limit=` — paginated, server-side search and filters.
- `GET /api/systems/:id` — one water system.
- `GET /api/systems/filters` — filter choices for the archive UI.
- `GET /api/systems/map` and `GET /api/states` — map/state data.
- `GET /api/research-papers` — research library entries.

The archive search waits 300 ms after the user stops typing, then sends the search term to the backend. Filter values and searches remain in the URL, so archive links are shareable.

## Frontend stack

- React + Vite + React Router
- Framer Motion for scroll and list motion
- Anime.js for the landing-page reveal
- Lucide React icons
- Custom responsive CSS in `src/styles.css` for a focused archive aesthetic.
- Axios is included for API integration.

## Future persistence

The current server intentionally reads the supplied CSV directly, so it needs no database to run. When you are ready for editable content, replace the repository in `server/repositories/systemsRepository.js` with a database adapter while keeping the same API response shape: `{ data, pagination }`. The React pages will continue to work unchanged.
