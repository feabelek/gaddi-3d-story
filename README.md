# Pastoralism Atlas

An interactive MapLibre story map exploring the seasonal migration route of Gaddi pastoralists from Bharmour to Darcha in Himachal Pradesh.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The map uses remote Esri satellite and AWS terrain tiles, so the browser needs network access for the full experience.

## Commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Create the production bundle in dist/
npm run preview   # Serve the production bundle locally
```

## Project Structure

- `src/main.js` contains the live MapLibre map, atlas UI, story chapters, camera transitions, and route layers.
- `src/style.css` contains the application styling and responsive layout.
- `public/data/` contains route and point GeoJSON, GIS source files, terrain data, and story images.
- `index.html` is the application shell and loads `src/main.js`.

The route and point data are loaded at runtime from root-relative `/data/...` URLs. Keep those paths unchanged when adding or moving public assets.

`src/main copy.js` is an unused legacy Three.js implementation and is not part of the current application.

## Verification

There are currently no test, lint, typecheck, or format scripts. Run `npm run build` to verify the production bundle.
