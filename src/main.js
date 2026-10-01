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

const TEMPLE_URL =
  '/data/Kartik_Swami_Temple_WGS84.geojson';

const SANCTUARY_URL =
  '/data/Kugti_WS_WGS84.geojson';


const IMAGES = {

  bharmour:
    '/data/images/Bharmour.png',

  dipping:
    '/data/images/Bharmour_goat_dipping.png',

  jalsu:
    '/data/images/jalsu_pass.png',

  temple:
    '/data/kartik_swami_temple.png',

  darcha:
    '/data/images/Darcha.jpg'

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
      `Our journey follows Mohanlal, a shepherd from Bharmour, for whom returning to Bharmour is both a pause and
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
      seasonal landscape into another. Near Kugti, the route also
      passes a cultural pilgrimage site at Kartik Swami Temple and
      enters the protected landscape of Kugti Wildlife Sanctuary.`,

    center: [
      76.715469,
      32.471323
    ],

    zoom: 13.5,

    pitch: 68,

    bearing: 88.52,

    routeProgress: 0.30,

    showKugtiContext: true,

    image:
      IMAGES.jalsu,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 3 — KARTIK SWAMI TEMPLE
  // ----------------------------------------------------------

  {
    id: 'kartik-swami-temple',

    eyebrow:
      'Cultural and Pilgrimage Site',

    title:
      'A pause along the route',

    location:
      'Kartik Swami Temple',

    text:
      `Near Kugti, the migration route passes Kartik Swami
      Temple, a cultural and pilgrimage site set within the
      mountain landscape. Its location adds another layer to the
      journey: the route connects not only grazing grounds and
      settlements, but places of cultural meaning as well.`,

    detail:
      `The temple is shown here as a point of cultural context
      alongside the pastoral route. The nearby Kugti Wildlife
      Sanctuary marks the protected landscape through which this
      section of the journey passes.`,

    center: [
      76.733215,
      32.478799
    ],

    zoom: 15.156,

    pitch: 50,

    bearing: 7.99,

    routeProgress: 0.34,

    showKugtiContext: true,

    image:
      IMAGES.temple,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 4 — TANDI
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

    showKugtiContext: true,

    image: null,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 5 — DARCHA
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

    showKugtiContext: true,

    image:
      IMAGES.darcha,

    secondImage: null,

    showLegend: true
  },


  // ----------------------------------------------------------
  // 6 — FULL ROUTE
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

    showKugtiContext: true,

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

let templeMarker = null;

let sanctuaryLabelMarker = null;


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

map.setMaxZoom(16);

map.setMaxPitch(68);


// ============================================================
// NAVIGATION CONTROL
// ============================================================

map.addControl(

  new maplibregl.NavigationControl(),

  'top-right'

);


// ============================================================
// CAMERA COMPOSER
//
// Development-only tool. Open the app with ?composer=1 to
// compose and copy refined camera stops without changing the
// normal public experience.
// ============================================================

function getCurrentCamera() {

  const center =
    map.getCenter();

  return {
    center: [
      Number(
        center.lng.toFixed(6)
      ),
      Number(
        center.lat.toFixed(6)
      )
    ],
    zoom: Number(
      map.getZoom().toFixed(3)
    ),
    pitch: Number(
      map.getPitch().toFixed(2)
    ),
    bearing: Number(
      map.getBearing().toFixed(2)
    )
  };

}


function formatCamera(camera) {

  return JSON.stringify(
    camera,
    null,
    2
  );

}


function createCameraComposer() {

  const composer =
    document.createElement('aside');

  composer.id =
    'camera-composer';

  composer.innerHTML = `
    <div class="camera-composer-heading">
      Camera Composer
      <span>DEV</span>
    </div>

    <label class="camera-composer-field">
      <span>Story stop</span>
      <select id="camera-composer-stop"></select>
    </label>

    <div class="camera-composer-readout">
      <code id="camera-composer-output"></code>
    </div>

    <div class="camera-composer-actions">
      <button id="camera-composer-target" type="button">Go to stop</button>
      <button id="camera-composer-capture" type="button">Capture stop</button>
      <button id="camera-composer-copy" type="button">Copy camera</button>
      <button id="camera-composer-copy-all" type="button">Copy all</button>
    </div>

    <div id="camera-composer-status" class="camera-composer-status">
      Move the map, then copy the refined camera values.
    </div>
  `;

  document.body.appendChild(
    composer
  );

  const stopSelect =
    composer.querySelector(
      '#camera-composer-stop'
    );

  const output =
    composer.querySelector(
      '#camera-composer-output'
    );

  const status =
    composer.querySelector(
      '#camera-composer-status'
    );

  STORY.forEach(
    (chapter, index) => {

      const option =
        document.createElement('option');

      option.value =
        String(index);

      option.textContent =
        `${String(index).padStart(2, '0')} · ${chapter.location}`;

      stopSelect.appendChild(
        option
      );

    }
  );

  const selectedChapter = () =>
    STORY[
      Number(
        stopSelect.value
      )
    ];

  const updateOutput = () => {

    output.textContent =
      formatCamera(
        getCurrentCamera()
      );

  };

  const setStatus = (
    message
  ) => {

    status.textContent =
      message;

  };

  const copyText = async (
    text,
    message
  ) => {

    try {

      await navigator.clipboard.writeText(
        text
      );

      setStatus(
        message
      );

    }

    catch (
      error
    ) {

      output.textContent =
        text;

      setStatus(
        'Clipboard access was blocked. Select and copy the text above.'
      );

    }

  };

  composer
    .querySelector(
      '#camera-composer-target'
    )
    .addEventListener(
      'click',
      () => {

        const chapter =
          selectedChapter();

        map.easeTo({
          center:
            chapter.center,
          zoom:
            chapter.zoom,
          pitch:
            chapter.pitch,
          bearing:
            chapter.bearing,
          duration:
            900
        });

        setStatus(
          'Adjust the map, then copy the camera values.'
        );

      }
    );

  composer
    .querySelector(
      '#camera-composer-capture'
    )
    .addEventListener(
      'click',
      () => {

        const chapter =
          selectedChapter();

        const camera =
          getCurrentCamera();

        chapter.center =
          camera.center;
        chapter.zoom =
          camera.zoom;
        chapter.pitch =
          camera.pitch;
        chapter.bearing =
          camera.bearing;

        setStatus(
          `Captured camera for ${chapter.location}. Use “Copy all” to export the refined stops.`
        );

      }
    );

  composer
    .querySelector(
      '#camera-composer-copy'
    )
    .addEventListener(
      'click',
      () => {

        const camera =
          getCurrentCamera();

        copyText(
          formatCamera(
            camera
          ),
          `Copied camera for ${selectedChapter().location}.`
        );

      }
    );

  composer
    .querySelector(
      '#camera-composer-copy-all'
    )
    .addEventListener(
      'click',
      () => {

        const cameras = {};

        STORY.forEach(
          (chapter) => {

            cameras[
              chapter.id
            ] = {
              center:
                chapter.center,
              zoom:
                chapter.zoom,
              pitch:
                chapter.pitch,
              bearing:
                chapter.bearing
            };

          }
        );

        copyText(
          formatCamera(
            cameras
          ),
          `Copied ${STORY.length} story cameras.`
        );

      }
    );

  stopSelect.addEventListener(
    'change',
    () => {

      setStatus(
        'Use “Go to stop” or move the map to compose a new view.'
      );

    }
  );

  map.on(
    'move',
    updateOutput
  );

  updateOutput();

}


if (
  new URLSearchParams(
    window.location.search
  ).has('composer')
) {

  createCameraComposer();

}


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


  <div class="legend-item">

    <span class="legend-cultural">
      ✦
    </span>

    <span>
      Cultural / pilgrimage site
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-protected"></span>

    <span>
      Kugti Wildlife Sanctuary
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
      0.999,
      p + 0.001
    );

  const activeGradient =
    p >= 0.999
      ? [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          '#d89535',
          1,
          '#e8ad4f'
        ]
      : [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          '#d89535',
          p,
          '#e8ad4f',
          edge,
          'rgba(91, 76, 56, 0)',
          1,
          'rgba(91, 76, 56, 0)'
        ];


  map.setPaintProperty(
    'migration-route',
    'line-gradient',
    activeGradient
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

  const showKugtiContext =
    !atlasMode
    &&
    STORY[
      currentStoryIndex
    ].showKugtiContext === true;


  const visibility =
    showRoute
      ? 'visible'
      : 'none';


  [

    'route-points',
    'route-labels',
    'migration-route-casing',
    'migration-route-base',
    'migration-route',
    'kugti-sanctuary-fill',
    'kugti-sanctuary-outline',
    'temple-halo',
    'temple-point'

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
    templeMarker
  ) {

    templeMarker.getElement().style.display =
      showKugtiContext
        ? 'flex'
        : 'none';

  }


  if (
    sanctuaryLabelMarker
  ) {

    sanctuaryLabelMarker.getElement().style.display =
      showKugtiContext
        ? 'block'
        : 'none';

  }


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


  // Kugti → Kartik Swami Temple

  if (
    fromIndex === 2
    &&
    toIndex === 3
  ) {

    return {

      zoom:
        13.7,

      pitch:
        64,

      duration1:
        1200,

      duration2:
        1800

    };

  }


  // Kartik Swami Temple → Tandi

  if (
    fromIndex === 3
    &&
    toIndex === 4
  ) {

    return {

      zoom:
        12.2,

      pitch:
        54,

      duration1:
        1000,

      duration2:
        2200

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
      // ROUTE BASE
      // ======================================================

      map.addLayer({

        id:
          'migration-route-base',

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
            'rgba(222, 190, 126, 0.48)',

          'line-width': [

            'interpolate',
            ['linear'],
            ['zoom'],

            8,
            1.2,

            11,
            2.2,

            14,
            3.5

          ],

          'line-opacity':
            0.72

        }

      });


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
            1.6,

            11,
            2.8,

            14,
            4.5

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
            'rgba(91, 76, 56, 0)'

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
      // CULTURAL AND ECOLOGICAL CONTEXT
      // ======================================================

      const [
        templeResponse,
        sanctuaryResponse
      ] = await Promise.all([

        fetch(
          TEMPLE_URL
        ),

        fetch(
          SANCTUARY_URL
        )

      ]);


      if (
        !templeResponse.ok
        ||
        !sanctuaryResponse.ok
      ) {

        throw new Error(
          'Could not load cultural or ecological context data.'
        );

      }


      const templeGeoJSON =
        await templeResponse.json();

      const sanctuaryGeoJSON =
        await sanctuaryResponse.json();


      map.addSource(
        'cultural-site',
        {
          type:
            'geojson',
          data:
            templeGeoJSON
        }
      );


      map.addLayer({

        id:
          'temple-halo',

        type:
          'circle',

        source:
          'cultural-site',

        layout: {
          visibility:
            'none'
        },

        paint: {
          'circle-radius': 12,
          'circle-color':
            'rgba(244, 194, 91, 0.22)',
          'circle-stroke-width': 1,
          'circle-stroke-color':
            'rgba(244, 194, 91, 0.5)'
        }

      });


      map.addLayer({

        id:
          'temple-point',

        type:
          'circle',

        source:
          'cultural-site',

        layout: {
          visibility:
            'none'
        },

        paint: {
          'circle-radius': 5,
          'circle-color':
            '#f4c25b',
          'circle-stroke-width': 2,
          'circle-stroke-color':
            '#2b2117'
        }

      });


      map.addSource(
        'kugti-sanctuary',
        {
          type:
            'geojson',
          data:
            sanctuaryGeoJSON
        }
      );


      map.addLayer({

        id:
          'kugti-sanctuary-fill',

        type:
          'fill',

        source:
          'kugti-sanctuary',

        layout: {
          visibility:
            'none'
        },

        paint: {
          'fill-color':
            '#7c9b72',
          'fill-opacity':
            0.18
        }

      });


      map.addLayer({

        id:
          'kugti-sanctuary-outline',

        type:
          'line',

        source:
          'kugti-sanctuary',

        layout: {
          visibility:
            'none',
          'line-cap':
            'round',
          'line-join':
            'round'
        },

        paint: {
          'line-color':
            '#9ab88b',
          'line-width': 1.5,
          'line-opacity':
            0.8,
          'line-dasharray': [
            2,
            1.5
          ]
        }

      });


      map.moveLayer(
        'kugti-sanctuary-fill',
        'migration-route-casing'
      );

      map.moveLayer(
        'kugti-sanctuary-outline',
        'migration-route-casing'
      );


      const templeElement =
        document.createElement('div');

      templeElement.className =
        'context-marker temple-marker';

      templeElement.innerHTML = `
        <span class="context-marker-symbol">✦</span>
        <span class="context-marker-label">Kartik Swami Temple</span>
      `;

      templeMarker = new maplibregl.Marker({
        element:
          templeElement,
        anchor:
          'bottom-left'
      })
        .setLngLat([
          76.73414143160518,
          32.4793322013462
        ])
        .addTo(map);


      const sanctuaryLabelElement =
        document.createElement('div');

      sanctuaryLabelElement.className =
        'context-marker sanctuary-label-marker';

      sanctuaryLabelElement.textContent =
        'Kugti Wildlife Sanctuary';

      sanctuaryLabelMarker = new maplibregl.Marker({
        element:
          sanctuaryLabelElement,
        anchor:
          'center'
      })
        .setLngLat([
          76.72,
          32.42
        ])
        .addTo(map);


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
