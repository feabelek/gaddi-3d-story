# Reference and Build Direction

## What the Primland reference is doing

The page is a Nuxt-generated experience. Its HTML loads bundled Nuxt client modules and a global stylesheet rather than exposing a readable application source. The shipped page references GSAP, canvas/WebGL behavior, responsive orientation handling, and a user-controlled `/audio/ambient.mp3` track.

The useful design pattern is the sequence, not a particular library:

1. A full-screen, atmospheric entry state establishes place and mood.
2. One deliberate action, `Explore the map`, moves the visitor into the experience.
3. The map is treated as a world to enter, not a data dashboard.
4. Camera movement and transitions carry the visitor between scales.
5. Text stays sparse at first, then detail appears at the point of interest.
6. Audio is optional and starts only after an explicit user action.
7. Portrait/mobile behavior is considered as part of the experience, not as a later layout fix.

## What is already implemented here

`src/main.js` already follows most of this structure:

- MapLibre provides the India overview, satellite base, terrain, route, and route points.
- A single Himachal case-study marker leads into the Gaddi story.
- `STORY` provides camera compositions, chapter text, images, and route progress.
- `simpleCameraMove` and `migrationCameraMove` provide the camera-led transitions.
- Wheel navigation advances one chapter at a time and locks during travel.
- `src/main copy.js` contains the separate Three.js + GeoTIFF terrain direction.

## Recommended production architecture

Keep the two scales separate:

- **Atlas scale:** MapLibre for India-wide routes, regions, and case-study selection.
- **Case-study scale:** MapLibre terrain for the geographic story, with Three.js used only for close-up authored scenes.
- **Object layer:** glTF assets for a small number of meaningful objects such as a goat flock, wool tools, a house, or a tree cluster. Place them at authored story stops, not everywhere on the map.
- **Story layer:** chapter data should contain the camera, text, media, sound cue, and optional object scene. This keeps editorial content independent from rendering code.

## Asset and performance rules

- Use compressed glTF/GLB assets and load them only when a chapter needs them.
- Keep a 2D image fallback for every 3D scene and for reduced-motion users.
- Do not use remote model URLs in production without an explicit license and a local cache.
- Keep ambient audio off by default, expose a visible toggle, and provide captions/transcripts for spoken material.
- Avoid making livestock decorative noise. Each object should explain a practice, relationship, or seasonal task.
- Preserve the current root-relative `/data/...` asset URLs when adding story media.

## Next authored scenes

1. **Bharmour:** home village, preparation, sheep/goat dipping, and departure.
2. **Kugti:** forest passage, route knowledge, and elevation change.
3. **Tandi:** convergence of routes and seasonal exchange.
4. **Darcha:** summer grazing grounds and the full-route view.

The existing `public/data/images/` assets provide the documentary fallback layer for these scenes. The existing GeoTIFF and Three.js work can become the optional close-up layer after the story content and camera states are stable.
