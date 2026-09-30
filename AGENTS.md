# Agent Instructions

## Commands

- Install locked dependencies with `npm install`.
- Run the development server with `npm run dev`.
- Create the production bundle with `npm run build`; inspect `dist/` only as generated output.
- Serve the built bundle locally with `npm run preview`.
- `package.json` has no test, lint, typecheck, or format scripts; use `npm run build` as the available automated verification.
- Vite 8 requires Node `^20.19.0` or `>=22.12.0`.

## Structure

- `index.html` currently loads `src/main copy.js`, the Three.js/MapLibre case-study implementation. Change its module path to `/src/main.js` to run the alternate MapLibre-only atlas.
- `src/main.js` owns the alternate atlas UI, story state, camera transitions, and MapLibre layers. It fetches route and point GeoJSON from `/data/` at runtime.
- `public/data/` contains the route/point GIS files and story images. Preserve these root-relative `/data/...` URLs when moving or adding assets.
- `src/main copy.js` owns the current Three.js landscape, MapLibre overview, and GeoTIFF terrain loading. Its `geotiff` dependency must remain declared in `package.json`.
- The map depends on remote Esri satellite and AWS terrain tiles, so local runtime verification needs network access even though the Vite build does not.
