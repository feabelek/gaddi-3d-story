# Agent Instructions

## Commands

- Install locked dependencies with `npm install`.
- Run the development server with `npm run dev`.
- Create the production bundle with `npm run build`; inspect `dist/` only as generated output.
- Serve the built bundle locally with `npm run preview`.
- `package.json` has no test, lint, typecheck, or format scripts; use `npm run build` as the available automated verification.
- Vite 8 requires Node `^20.19.0` or `>=22.12.0`.

## Structure

- `index.html` loads only `src/main.js`; this is the live MapLibre application entrypoint.
- `src/main.js` owns the atlas UI, story state, camera transitions, and MapLibre layers. It fetches route and point GeoJSON from `/data/` at runtime.
- `public/data/` contains the route/point GIS files and story images. Preserve these root-relative `/data/...` URLs when moving or adding assets.
- `src/main copy.js` is an unused legacy Three.js implementation and is not part of the current app unless `index.html` is explicitly changed.
- The map depends on remote Esri satellite and AWS terrain tiles, so local runtime verification needs network access even though the Vite build does not.
