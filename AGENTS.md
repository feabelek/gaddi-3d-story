# Agent Instructions

## Commands

- Install locked dependencies with `npm install`.
- Run the development server with `npm run dev`.
- Create the production bundle with `npm run build`; inspect `dist/` only as generated output.
- Serve the built bundle locally with `npm run preview`.
- `package.json` has no test, lint, typecheck, or format scripts; use `npm run build` as the available automated verification.
- Vite 8 requires Node `^20.19.0` or `>=22.12.0`.

## Structure

- `index.html` loads `src/main.js`, the active MapLibre atlas implementation.
- `src/main.js` owns the atlas UI, story state, camera transitions, and MapLibre layers. It imports state-based map URLs from `src/atlas/map-assets.js` and fetches the corresponding GeoJSON from `/data/` at runtime.
- `src/atlas/map-assets.js` is the single configuration for state-specific runtime geographic assets. Preserve its root-relative `/data/...` URLs when moving or adding assets.
- `src/stories/` contains the editorial story registry and state-specific story data.
- Three.js close-up experiments are future development work kept outside the active GitHub branch; do not reintroduce them into the atlas without an explicit request.
- Open the live app with `?composer=1` to use the development Camera Composer for refining story-stop `center`, `zoom`, `pitch`, and `bearing` values; it is hidden without that query parameter.
- The map depends on remote Esri satellite and AWS terrain tiles, so local runtime verification needs network access even though the Vite build does not.
