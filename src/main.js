// ============================================================
// PASTORALISM ATLAS
//
// INDIA ATLAS
//      ↓ choose a case study
//
// HIMACHAL PRADESH
//      ↓
// BHARMOUR
//      ↓
// KUGTI
//      ↓
// TANDI
//      ↓
// DARCHA
//      ↓
// FULL ROUTE
//
// Future:
// LADAKH
// ARUNACHAL PRADESH
// ============================================================


// ============================================================
// IMPORTS
// ============================================================

import * as maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

import workerUrl from
  'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(workerUrl);


// ============================================================
// OLD APP
// ============================================================

const oldApp = document.querySelector('#app');

if (oldApp) {
  oldApp.style.display = 'none';
}


// ============================================================
// FILE PATHS
// ============================================================

const ROUTE_URL =
  '/data/Bharmour_Darcha_HP_Route.geojson';

const POINTS_URL =
  '/data/Bharmour_Darcha_RP_WGS84.geojson';


const IMAGES = {

  bharmour:
    '/data/images/Bharmour.png',

  dipping:
    '/data/images/Bharmour_goat_dipping.png',

  jalsu:
    '/data/images/jalsu_pass.png',

  lambing:
    '/data/images/lambing.png'

};


// ============================================================
// ATLAS HOME CAMERA
// ============================================================

const ATLAS_CAMERA = {

  center: [79.2, 24.2],

  zoom: 4.15,

  pitch: 0,

  bearing: 0

};


// ============================================================
// CASE STUDIES
//
// For now, only the Himachal Pradesh case study is shown.
//
// The marker is positioned at Bharmour — the actual home
// village and starting point of the Gaddi migration route.
// These coordinates come from our route-point GIS data.
// ============================================================

const CASE_STUDIES = [

  {
    id: 'himachal',

    state: 'Himachal Pradesh',

    subtitle: 'Gaddi pastoralists',

    // Bharmour — actual GIS point
    center: [
      76.5326151804133,
      32.4444683599394
    ],

    active: true
  }

];


// ============================================================
// HIMACHAL STORY
//
// IMPORTANT:
//
// India is NOT in this array anymore.
//
// This array begins only after the user chooses Himachal.
// ============================================================

const STORY = [

  // ----------------------------------------------------------
  // 0 — HIMACHAL PRADESH
  // ----------------------------------------------------------

  {
    id: 'himachal',

    eyebrow:
      'Case Study 01 · Western Himalaya',

    title:
      'A landscape shaped by movement',

    location:
      'Himachal Pradesh',

    text:
      `The Gaddi are a traditional agro-pastoralist community
      who rear sheep and goats. During summer, their flocks move
      toward high-altitude pastures. In winter, they descend
      toward the lower hills and plains.`,

    center: [
      77.15,
      31.82
    ],

    zoom: 7.25,

    pitch: 34,

    bearing: -8,

    routeProgress: 0,

    image: null,

    showLegend: false
  },


  // ----------------------------------------------------------
  // 1 — BHARMOUR
  // ----------------------------------------------------------

  {
    id: 'bharmour',

    eyebrow:
      'Home Village',

    title:
      'Preparing for the climb',

    location:
      'Bharmour',

    text:
      `For Mohanlal, returning to Bharmour is both a pause and
      a flurry of activity before the long climb to the summer
      pastures. The flock is sheared, supplies are gathered,
      and the animals are prepared for the migration ahead.`,

    detail:
      `Before departure, the sheep and goats are taken to the
      village dipping site and washed in a medicated solution
      to help protect the herd during the months of migration.`,

    center: [
      76.547306,
      32.440468
    ],

    zoom: 13.5,

    pitch: 68,

    bearing: 128.7,

    routeProgress: 0.035,

    image:
      IMAGES.bharmour,

    secondImage:
      IMAGES.dipping,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 2 — KUGTI
  // ----------------------------------------------------------

  {
    id: 'kugti',

    eyebrow:
      'The Journey',

    title:
      'Into the high mountains',

    location:
      'Kugti',

    text:
      `Leaving Bharmour, the migration climbs through forests,
      valleys and alpine landscapes. These routes connect home
      villages with grazing grounds and have been travelled
      across generations.`,

    detail:
      `Mountain passes are more than points on a map. They link
      valleys and grazing grounds, marking the movement from one
      seasonal landscape into another.`,

    center: [
      76.715469,
      32.471323
    ],

    zoom: 13.5,

    pitch: 68,

    bearing: 88.52,

    routeProgress: 0.30,

    image:
      IMAGES.jalsu,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 3 — TANDI
  // ----------------------------------------------------------

  {
    id: 'tandi',

    eyebrow:
      'Ecological Transition',

    title:
      'The landscape opens',

    location:
      'Tandi',

    text:
      `Beyond the alpine meadows, the migration enters the
      higher elevations of Lahaul. The landscape becomes
      increasingly open and sparse, with grasses, herbs,
      stunted blue pines and low shrubs across the slopes.`,

    detail:
      `At Tandi, the Chandra and Bhaga rivers meet to form the
      Chenab. The gentler slopes give the flock a chance to
      rest and graze before the final journey into the higher
      summer pastures.`,

    center: [
      76.983644,
      32.557597
    ],

    zoom: 13.5,

    pitch: 54.5,

    bearing: 74.76,

    routeProgress: 0.72,

    image: null,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 4 — DARCHA
  // ----------------------------------------------------------

  {
    id: 'darcha',

    eyebrow:
      'Summer Grazing Grounds',

    title:
      'Arrival in the high pastures',

    location:
      'Darcha',

    text:
      `At last, Mohanlal reaches the wide valleys of the
      high-altitude summer pastures. The broad basins allow the
      flock to spread out and graze while the shepherd rests,
      repairs equipment and prepares for the weeks ahead.`,

    detail:
      `From June to August, the flock grazes these alpine
      meadows. It is also lambing season, when Mohanlal tends
      to newborn animals while making the most of the rich
      summer pastures.`,

    center: [
      77.198028,
      32.671213
    ],

    zoom: 13.5,

    pitch: 52,

    bearing: -71.24,

    routeProgress: 1,

    image:
      IMAGES.lambing,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 5 — FULL ROUTE
  // ----------------------------------------------------------

  {
    id: 'full-route',

    eyebrow:
      'The Migration',

    title:
      'A journey across landscapes',

    location:
      'Bharmour → Darcha',

    text:
      `The summer migration connects home, mountain passes,
      grazing grounds and changing ecological zones across the
      Western Himalaya.`,

    center: [
      76.924699,
      32.532357
    ],

    zoom: 10.467,

    pitch: 44.49,

    bearing: -57.03,

    routeProgress: 1,

    image: null,

    secondImage: null,

    showLegend: true
  }

];


// ============================================================
// STATE
// ============================================================

let atlasMode = true;

let currentStoryIndex = 0;

let cameraAnimating = false;

let storyReady = false;

let scrollLocked = false;


// ============================================================
// CREATE MAP
// ============================================================

const map = new maplibregl.Map({

  container:
    'india-map',

  style: {

    version: 8,

    sources: {

      satellite: {

        type:
          'raster',

        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],

        tileSize:
          256,

        attribution:
          'Esri, Maxar, Earthstar Geographics'
      },


      terrain: {

        type:
          'raster-dem',

        tiles: [
          'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
        ],

        tileSize:
          256,

        encoding:
          'terrarium',

        maxzoom:
          15

      }

    },


    layers: [

      {

        id:
          'satellite',

        type:
          'raster',

        source:
          'satellite',

        paint: {

          'raster-saturation':
            -0.18,

          'raster-contrast':
            0.05,

          'raster-brightness-min':
            0.05,

          'raster-brightness-max':
            0.91,

          'raster-fade-duration':
            600

        }

      }

    ]

  },


  center:
    ATLAS_CAMERA.center,

  zoom:
    ATLAS_CAMERA.zoom,

  pitch:
    ATLAS_CAMERA.pitch,

  bearing:
    ATLAS_CAMERA.bearing,

  antialias:
    true

});


// ============================================================
// MAP LIMITS
// ============================================================

map.setMinZoom(3.5);

map.setMaxZoom(13.5);

map.setMaxPitch(68);


// ============================================================
// NAVIGATION CONTROL
// ============================================================

map.addControl(

  new maplibregl.NavigationControl(),

  'top-right'

);


// ============================================================
// ATLAS HOME UI
// ============================================================

const atlasHome =
  document.createElement('section');


atlasHome.id =
  'atlas-home';


atlasHome.innerHTML = `

  <div class="atlas-intro">

    <div class="atlas-kicker">
      Pastoralism Atlas
    </div>

    <h1>
      Journeys Through
      <br>
      India's Pastoral Landscapes
    </h1>

    <p>
      Explore how pastoral communities move through India's
      diverse landscapes, connecting seasonal grazing grounds,
      settlements and ecosystems.
    </p>

    <div class="atlas-instruction">
      Select a case study on the map
    </div>

  </div>

`;


document.body.appendChild(
  atlasHome
);


// ============================================================
// CASE STUDY MARKERS
// ============================================================

const caseStudyMarkers =
  [];


function createCaseStudyMarkers() {

  CASE_STUDIES.forEach(
    (caseStudy) => {

      const marker =
        document.createElement('button');


      marker.className =
        caseStudy.active
          ? 'case-study-marker active'
          : 'case-study-marker future';


      marker.type =
        'button';


      marker.innerHTML = `

        <span class="case-study-dot"></span>

        <span class="case-study-label">

          <strong>
            ${caseStudy.state}
          </strong>

          <small>
            ${caseStudy.subtitle}
          </small>

        </span>

      `;


      if (
        caseStudy.active
      ) {

        marker.setAttribute(
          'aria-label',
          `Explore ${caseStudy.state}`
        );


        marker.addEventListener(
          'click',
          () => {

            enterHimachalCaseStudy();

          }
        );

      }


      else {

        marker.disabled =
          true;

      }


      const mapMarker =
        new maplibregl.Marker({

          element:
            marker,

          anchor:
            'left'

        })

          .setLngLat(
            caseStudy.center
          )

          .addTo(
            map
          );


      caseStudyMarkers.push(
        mapMarker
      );

    }
  );

}


// ============================================================
// STORY PANEL
// ============================================================

const storyPanel =
  document.createElement('section');


storyPanel.id =
  'story-panel';


storyPanel.classList.add(
  'hidden'
);


storyPanel.innerHTML = `

  <div class="story-panel-inner">

    <button
      id="back-to-atlas"
      type="button"
    >
      ← Atlas
    </button>


    <div id="story-eyebrow"></div>

    <h1 id="story-title"></h1>

    <div id="story-location"></div>

    <p id="story-text"></p>

    <div id="story-media"></div>

    <p id="story-detail"></p>


    <div class="story-progress">

      <span id="story-number"></span>

      <div class="story-progress-line">

        <div id="story-progress-fill"></div>

      </div>

      <span id="story-total"></span>

    </div>


    <div id="story-scroll-hint">
      Scroll to continue
    </div>

  </div>

`;


document.body.appendChild(
  storyPanel
);


// ============================================================
// LEGEND
// ============================================================

const legend =
  document.createElement('aside');


legend.id =
  'map-legend';


legend.innerHTML = `

  <div class="legend-heading">
    Summer Migration
  </div>


  <div class="legend-item">

    <span class="legend-home">
      △
    </span>

    <span>
      Home village
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-stop">
      ●
    </span>

    <span>
      Route stop
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-destination">
      ◇
    </span>

    <span>
      Summer grazing grounds
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-route"></span>

    <span>
      Migration route
    </span>

  </div>

`;


document.body.appendChild(
  legend
);


// ============================================================
// STORY ELEMENTS
// ============================================================

const eyebrowElement =
  document.querySelector(
    '#story-eyebrow'
  );


const titleElement =
  document.querySelector(
    '#story-title'
  );


const locationElement =
  document.querySelector(
    '#story-location'
  );


const textElement =
  document.querySelector(
    '#story-text'
  );


const detailElement =
  document.querySelector(
    '#story-detail'
  );


const mediaElement =
  document.querySelector(
    '#story-media'
  );


const numberElement =
  document.querySelector(
    '#story-number'
  );


const totalElement =
  document.querySelector(
    '#story-total'
  );


const progressFill =
  document.querySelector(
    '#story-progress-fill'
  );


const scrollHint =
  document.querySelector(
    '#story-scroll-hint'
  );


const backToAtlasButton =
  document.querySelector(
    '#back-to-atlas'
  );


// ============================================================
// STORY PANEL UPDATE
// ============================================================

function updateStoryPanel() {

  const chapter =
    STORY[
      currentStoryIndex
    ];


  storyPanel.classList.add(
    'changing'
  );


  setTimeout(
    () => {

      eyebrowElement.textContent =
        chapter.eyebrow || '';


      titleElement.textContent =
        chapter.title || '';


      locationElement.textContent =
        chapter.location || '';


      textElement.textContent =
        chapter.text || '';


      detailElement.textContent =
        chapter.detail || '';


      // ======================================================
      // IMAGES
      // ======================================================

      mediaElement.innerHTML =
        '';


      if (
        chapter.image
      ) {

        const image =
          document.createElement(
            'img'
          );


        image.src =
          chapter.image;


        image.alt =
          chapter.location;


        image.className =
          'story-image';


        mediaElement.appendChild(
          image
        );

      }


      if (
        chapter.secondImage
      ) {

        const image =
          document.createElement(
            'img'
          );


        image.src =
          chapter.secondImage;


        image.alt =
          chapter.location;


        image.className =
          'story-image story-image-secondary';


        mediaElement.appendChild(
          image
        );

      }


      // ======================================================
      // PROGRESS
      // ======================================================

      numberElement.textContent =
        String(
          currentStoryIndex + 1
        ).padStart(
          2,
          '0'
        );


      totalElement.textContent =
        String(
          STORY.length
        ).padStart(
          2,
          '0'
        );


      const progress =
        (
          currentStoryIndex
          /
          (
            STORY.length - 1
          )
        )
        *
        100;


      progressFill.style.width =
        `${progress}%`;


      // ======================================================
      // LEGEND
      // ======================================================

      legend.classList.toggle(

        'visible',

        chapter.showLegend

      );


      // ======================================================
      // HINT
      // ======================================================

      if (
        currentStoryIndex ===
        STORY.length - 1
      ) {

        scrollHint.textContent =
          'The complete summer route';

      }

      else {

        scrollHint.textContent =
          'Scroll to continue';

      }


      storyPanel.classList.remove(
        'changing'
      );

    },
    170
  );

}


// ============================================================
// ROUTE PROGRESS
// ============================================================

function updateRouteProgress(
  progress
) {

  if (
    !map.getLayer(
      'migration-route'
    )
  ) {

    return;

  }


  const p =
    Math.max(
      0,
      Math.min(
        1,
        progress
      )
    );


  const edge =
    Math.min(
      1,
      p + 0.001
    );


  map.setPaintProperty(

    'migration-route',

    'line-gradient',

    [

      'interpolate',

      ['linear'],

      ['line-progress'],


      0,
      '#d89535',


      p,
      '#e8ad4f',


      edge,
      'rgba(91, 76, 56, 0.46)',


      1,
      'rgba(91, 76, 56, 0.46)'

    ]

  );

}


// ============================================================
// MAP LAYER VISIBILITY
// ============================================================

function updateMapVisibility() {

  // Route begins at Bharmour.
  //
  // STORY:
  // 0 Himachal
  // 1 Bharmour
  // 2 Kugti
  // ...

  const showRoute =
    !atlasMode
    &&
    currentStoryIndex >= 1;


  const visibility =
    showRoute
      ? 'visible'
      : 'none';


  [

    'route-points',
    'route-labels',
    'migration-route-casing',
    'migration-route'

  ]

    .forEach(
      (layerId) => {

        if (
          map.getLayer(
            layerId
          )
        ) {

          map.setLayoutProperty(

            layerId,

            'visibility',

            visibility

          );

        }

      }
    );


  if (
    showRoute
  ) {

    updateRouteProgress(

      STORY[
        currentStoryIndex
      ].routeProgress

    );

  }

}


// ============================================================
// MAP INTERACTION
// ============================================================

function disableExploration() {

  map.dragPan.disable();

  map.dragRotate.disable();

  map.scrollZoom.disable();

  map.touchZoomRotate.disable();

  map.doubleClickZoom.disable();

  map.keyboard.disable();

}


function enableExploration() {

  map.dragPan.enable();

  map.dragRotate.enable();

  map.scrollZoom.enable();

  map.touchZoomRotate.enable();

  map.doubleClickZoom.enable();

  map.keyboard.enable();

}


// ============================================================
// CAMERA PROMISE
// ============================================================

function easeCamera(
  options
) {

  return new Promise(
    (resolve) => {

      let finished =
        false;


      const finish =
        () => {

          if (
            finished
          ) {

            return;

          }


          finished =
            true;


          map.off(
            'moveend',
            finish
          );


          resolve();

        };


      map.once(
        'moveend',
        finish
      );


      map.easeTo(
        options
      );


      setTimeout(

        finish,

        (options.duration || 0)
        +
        600

      );

    }
  );

}


// ============================================================
// SIMPLE CAMERA
// ============================================================

async function simpleCameraMove(
  destination,
  duration = 2600
) {

  await easeCamera({

    center:
      destination.center,

    zoom:
      destination.zoom,

    pitch:
      destination.pitch,

    bearing:
      destination.bearing,

    duration,

    easing:
      (t) =>
        t * t * (3 - 2 * t)

  });

}


// ============================================================
// MIGRATION TRAVEL CAMERA
// ============================================================

function getTravelCamera(
  fromIndex,
  toIndex
) {

  // Bharmour → Kugti

  if (
    fromIndex === 1
    &&
    toIndex === 2
  ) {

    return {

      zoom:
        12.4,

      pitch:
        57,

      duration1:
        1100,

      duration2:
        1900

    };

  }


  // Kugti → Tandi

  if (
    fromIndex === 2
    &&
    toIndex === 3
  ) {

    return {

      zoom:
        12.0,

      pitch:
        52,

      duration1:
        1100,

      duration2:
        2100

    };

  }


  // Tandi → Darcha

  if (
    fromIndex === 3
    &&
    toIndex === 4
  ) {

    return {

      zoom:
        12.0,

      pitch:
        48,

      duration1:
        1100,

      duration2:
        2100

    };

  }


  return {

    zoom:
      12.1,

    pitch:
      52,

    duration1:
      1000,

    duration2:
      1900

  };

}


// ============================================================
// MIGRATION CAMERA
// ============================================================

async function migrationCameraMove(
  fromIndex,
  toIndex
) {

  const destination =
    STORY[
      toIndex
    ];


  const mapCenter =
    map.getCenter();


  const start = {

    center: [

      mapCenter.lng,
      mapCenter.lat

    ],

    zoom:
      map.getZoom(),

    pitch:
      map.getPitch(),

    bearing:
      map.getBearing()

  };


  const travel =
    getTravelCamera(
      fromIndex,
      toIndex
    );


  const travelProgress =
    0.42;


  const travelCenter = [

    start.center[0]
    +
    (
      destination.center[0]
      -
      start.center[0]
    )
    *
    travelProgress,


    start.center[1]
    +
    (
      destination.center[1]
      -
      start.center[1]
    )
    *
    travelProgress

  ];


  let bearingDifference =
    destination.bearing
    -
    start.bearing;


  while (
    bearingDifference > 180
  ) {

    bearingDifference -=
      360;

  }


  while (
    bearingDifference < -180
  ) {

    bearingDifference +=
      360;

  }


  const travelBearing =
    start.bearing
    +
    bearingDifference
    *
    0.45;


  // First part.

  await easeCamera({

    center:
      travelCenter,

    zoom:
      travel.zoom,

    pitch:
      travel.pitch,

    bearing:
      travelBearing,

    duration:
      travel.duration1,

    easing:
      (t) =>
        t * t * (3 - 2 * t)

  });


  // Arrival.

  await easeCamera({

    center:
      destination.center,

    zoom:
      destination.zoom,

    pitch:
      destination.pitch,

    bearing:
      destination.bearing,

    duration:
      travel.duration2,

    easing:
      (t) =>
        t * t * (3 - 2 * t)

  });

}


// ============================================================
// ENTER HIMACHAL CASE STUDY
// ============================================================

async function enterHimachalCaseStudy() {

  if (
    cameraAnimating
    ||
    !storyReady
  ) {

    return;

  }


  cameraAnimating =
    true;


  disableExploration();


  // Fade atlas text and markers.

  atlasHome.classList.add(
    'leaving'
  );


  document.body.classList.add(
    'case-study-active'
  );


  // Hide marker labels during the flight.

  document
    .querySelectorAll(
      '.case-study-marker'
    )
    .forEach(
      (marker) => {

        marker.classList.add(
          'leaving'
        );

      }
    );


  try {

    currentStoryIndex =
      0;


    // India → Himachal.

    await simpleCameraMove(

      STORY[0],

      3000

    );


    atlasMode =
      false;


    atlasHome.classList.add(
      'hidden'
    );


    document
      .querySelectorAll(
        '.case-study-marker'
      )
      .forEach(
        (marker) => {

          marker.style.display =
            'none';

        }
      );


    storyPanel.classList.remove(
      'hidden'
    );


    updateMapVisibility();

    updateStoryPanel();

  }


  catch (
    error
  ) {

    console.error(
      'Could not enter Himachal case study:',
      error
    );

  }


  finally {

    cameraAnimating =
      false;


    enableExploration();

  }

}


// ============================================================
// RETURN TO ATLAS
// ============================================================

async function returnToAtlas() {

  if (
    cameraAnimating
  ) {

    return;

  }


  cameraAnimating =
    true;


  disableExploration();


  legend.classList.remove(
    'visible'
  );


  storyPanel.classList.add(
    'hidden'
  );


  updateMapVisibility();


  try {

    await simpleCameraMove(

      ATLAS_CAMERA,

      3000

    );


    atlasMode =
      true;


    document.body.classList.remove(
      'case-study-active'
    );


    atlasHome.classList.remove(
      'hidden',
      'leaving'
    );


    document
      .querySelectorAll(
        '.case-study-marker'
      )
      .forEach(
        (marker) => {

          marker.style.display =
            'flex';


          marker.classList.remove(
            'leaving'
          );

        }
      );


    currentStoryIndex =
      0;


    updateMapVisibility();

  }


  catch (
    error
  ) {

    console.error(
      'Could not return to atlas:',
      error
    );

  }


  finally {

    cameraAnimating =
      false;


    enableExploration();

  }

}


// ============================================================
// BACK BUTTON
// ============================================================

backToAtlasButton.addEventListener(

  'click',

  () => {

    returnToAtlas();

  }

);


// ============================================================
// STORY CHAPTER CHANGE
// ============================================================

async function goToChapter(
  destinationIndex
) {

  if (
    atlasMode
    ||
    !storyReady
    ||
    cameraAnimating
  ) {

    return;

  }


  if (
    destinationIndex < 0
    ||
    destinationIndex >= STORY.length
    ||
    destinationIndex === currentStoryIndex
  ) {

    return;

  }


  const previousIndex =
    currentStoryIndex;


  const destination =
    STORY[
      destinationIndex
    ];


  cameraAnimating =
    true;


  disableExploration();


  storyPanel.classList.add(
    'travelling'
  );


  scrollHint.textContent =
    'Following the journey…';


  try {

    // Himachal → Bharmour.

    if (
      previousIndex === 0
      ||
      destinationIndex === 0
    ) {

      await simpleCameraMove(

        destination,

        3300

      );

    }


    // Final full route.

    else if (
      destination.id ===
      'full-route'
    ) {

      await simpleCameraMove(

        destination,

        3000

      );

    }


    // Route journey.

    else {

      await migrationCameraMove(

        previousIndex,

        destinationIndex

      );

    }


    currentStoryIndex =
      destinationIndex;


    updateMapVisibility();

    updateStoryPanel();

  }


  catch (
    error
  ) {

    console.error(
      'Story transition error:',
      error
    );

  }


  finally {

    cameraAnimating =
      false;


    enableExploration();


    storyPanel.classList.remove(
      'travelling'
    );

  }

}


// ============================================================
// SCROLL NAVIGATION
//
// IMPORTANT:
//
// Scroll does NOTHING on the India atlas home.
//
// The user must deliberately choose a case study first.
// ============================================================

window.addEventListener(

  'wheel',

  (event) => {

    if (
      atlasMode
      ||
      !storyReady
      ||
      cameraAnimating
      ||
      scrollLocked
    ) {

      return;

    }


    if (
      Math.abs(
        event.deltaY
      )
      <
      12
    ) {

      return;

    }


    scrollLocked =
      true;


    if (
      event.deltaY > 0
    ) {

      const nextIndex =
        Math.min(

          currentStoryIndex + 1,

          STORY.length - 1

        );


      if (
        nextIndex !==
        currentStoryIndex
      ) {

        goToChapter(
          nextIndex
        );

      }

    }


    else {

      const previousIndex =
        Math.max(

          currentStoryIndex - 1,

          0

        );


      if (
        previousIndex !==
        currentStoryIndex
      ) {

        goToChapter(
          previousIndex
        );

      }

    }


    setTimeout(
      () => {

        scrollLocked =
          false;

      },
      750
    );

  },

  {
    passive: true
  }

);


// ============================================================
// MAP LOAD
// ============================================================

map.on(

  'load',

  async () => {

    try {

      // ======================================================
      // TERRAIN
      // ======================================================

      map.setTerrain({

        source:
          'terrain',

        exaggeration:
          1.35

      });


      // ======================================================
      // ROUTE
      // ======================================================

      const routeResponse =
        await fetch(
          ROUTE_URL
        );


      if (
        !routeResponse.ok
      ) {

        throw new Error(
          `Could not load route: ${routeResponse.status}`
        );

      }


      const routeGeoJSON =
        await routeResponse.json();


      map.addSource(

        'gaddi-route',

        {

          type:
            'geojson',

          data:
            routeGeoJSON,

          lineMetrics:
            true

        }

      );


      // ======================================================
      // ROUTE CASING
      // ======================================================

      map.addLayer({

        id:
          'migration-route-casing',

        type:
          'line',

        source:
          'gaddi-route',

        layout: {

          'line-cap':
            'round',

          'line-join':
            'round',

          visibility:
            'none'

        },

        paint: {

          'line-color':
            'rgba(28, 22, 16, 0.72)',

          'line-width': [

            'interpolate',
            ['linear'],
            ['zoom'],

            8,
            2.5,

            11,
            4.5,

            14,
            7

          ],

          'line-opacity':
            0.78

        }

      });


      // ======================================================
      // ROUTE
      // ======================================================

      map.addLayer({

        id:
          'migration-route',

        type:
          'line',

        source:
          'gaddi-route',

        layout: {

          'line-cap':
            'round',

          'line-join':
            'round',

          visibility:
            'none'

        },

        paint: {

          'line-width': [

            'interpolate',
            ['linear'],
            ['zoom'],

            8,
            1.3,

            11,
            2.4,

            14,
            4

          ],

          'line-opacity':
            1,

          'line-gradient': [

            'interpolate',

            ['linear'],

            ['line-progress'],

            0,
            '#e8ad4f',

            1,
            'rgba(91, 76, 56, 0.46)'

          ]

        }

      });


      // ======================================================
      // POINTS
      // ======================================================

      const pointsResponse =
        await fetch(
          POINTS_URL
        );


      if (
        !pointsResponse.ok
      ) {

        throw new Error(
          `Could not load points: ${pointsResponse.status}`
        );

      }


      const pointsGeoJSON =
        await pointsResponse.json();


      pointsGeoJSON
        .features
        .forEach(
          (feature) => {

            feature.properties =
              feature.properties
              ||
              {};


            const name =
              feature.properties[
                'Local Na_1'
              ]
              ||
              'Route stop';


            feature.properties.story_name =
              name;


            const normalised =
              String(name)
                .trim()
                .toLowerCase();


            if (
              normalised ===
              'bharmour'
            ) {

              feature.properties.story_type =
                'home';

            }


            else if (
              normalised ===
              'darcha'
            ) {

              feature.properties.story_type =
                'destination';

            }


            else {

              feature.properties.story_type =
                'stop';

            }

          }
        );


      map.addSource(

        'story-points',

        {

          type:
            'geojson',

          data:
            pointsGeoJSON

        }

      );


      // ======================================================
      // POINT SYMBOLS
      // ======================================================

      map.addLayer({

        id:
          'route-points',

        type:
          'symbol',

        source:
          'story-points',

        layout: {

          visibility:
            'none',

          'text-field': [

            'match',

            [
              'get',
              'story_type'
            ],

            'home',
            '△',

            'destination',
            '◇',

            '●'

          ],

          'text-size': [

            'match',

            [
              'get',
              'story_type'
            ],

            'stop',
            17,

            27

          ],

          'text-allow-overlap':
            true,

          'text-ignore-placement':
            true

        },

        paint: {

          'text-color': [

            'match',

            [
              'get',
              'story_type'
            ],

            'home',
            '#f3d47b',

            'destination',
            '#f3d47b',

            '#f2eee4'

          ],

          'text-halo-color':
            'rgba(20, 17, 13, 0.95)',

          'text-halo-width':
            2

        }

      });


      // ======================================================
      // LABELS
      // ======================================================

      map.addLayer({

        id:
          'route-labels',

        type:
          'symbol',

        source:
          'story-points',

        layout: {

          visibility:
            'none',

          'text-field': [
            'get',
            'story_name'
          ],

          'text-size':
            14,

          'text-offset': [
            0,
            1.55
          ],

          'text-anchor':
            'top',

          'text-allow-overlap':
            false

        },

        paint: {

          'text-color':
            '#f5f1e8',

          'text-halo-color':
            'rgba(15, 15, 12, 0.92)',

          'text-halo-width':
            2

        }

      });


      // ======================================================
      // ATLAS HOME
      // ======================================================

      map.jumpTo({

        center:
          ATLAS_CAMERA.center,

        zoom:
          ATLAS_CAMERA.zoom,

        pitch:
          ATLAS_CAMERA.pitch,

        bearing:
          ATLAS_CAMERA.bearing

      });


      createCaseStudyMarkers();


      updateMapVisibility();


      storyReady =
        true;


      console.log(
        'Pastoralism Atlas ready.'
      );

    }


    catch (
      error
    ) {

      console.error(
        'Error loading Pastoralism Atlas:',
        error
      );

    }

  }

);


// ============================================================
// MAP ERRORS
// ============================================================

map.on(

  'error',

  (event) => {

    console.error(
      'MapLibre error:',
      event.error
    );

  }

);