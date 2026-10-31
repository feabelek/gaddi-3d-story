// Pastoralism Atlas: a MapLibre story map for pastoral landscapes.


// ============================================================
// IMPORTS
// ============================================================

import * as maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

import {
  CASE_STUDIES,
  CHAPTER_DIALOGUES as HIMACHAL_DIALOGUES,
  IMAGES,
  STORY as HIMACHAL_STORY,
  STORY_REGISTRY
} from './stories/index.js';

import {
  createCameraComposer,
  getCurrentCamera
} from './atlas/camera-composer.js';

import {
  MAP_ASSETS
} from './atlas/map-assets.js';

import workerUrl from
  'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(workerUrl);


// ============================================================
// FILE PATHS
// ============================================================

const ROUTE_URL = MAP_ASSETS.himachal.route;
const ISPUR_DARCHA_ROUTE_URL = MAP_ASSETS.himachal.storyRoute;
const POINTS_URL = MAP_ASSETS.himachal.points;
const ISPUR_DARCHA_POINTS_URL = MAP_ASSETS.himachal.storyPoints;
const INDIVIDUAL_LADAKH_POINTS_URL = MAP_ASSETS.ladakh.points;
const SHEARING_URL = MAP_ASSETS.himachal.shearing;
const RIVERS_URL = MAP_ASSETS.himachal.rivers;
const TEMPLE_URL = MAP_ASSETS.himachal.temple;
const SANCTUARY_URL = MAP_ASSETS.himachal.sanctuary;
const HIMACHAL_BOUNDARY_URL = MAP_ASSETS.himachal.boundary;
const LADAKH_BOUNDARY_URL = MAP_ASSETS.ladakh.boundary;
const ARUNACHAL_BOUNDARY_URL = MAP_ASSETS.arunachal.boundary;


function utm43ToWgs84(
  easting,
  northing
) {

  const semiMajorAxis = 6378137;
  const eccentricitySquared = 0.00669438;
  const scaleFactor = 0.9996;
  const falseEasting = 500000;
  const falseNorthing = 0;
  const centralMeridian = 75;

  const eccentricityPrimeSquared =
    eccentricitySquared
    / (
      1
      - eccentricitySquared
    );

  const meridionalArc =
    (northing - falseNorthing)
    / scaleFactor;

  const mu =
    meridionalArc
    / (
      semiMajorAxis
      * (
        1
        - eccentricitySquared / 4
        - 3 * eccentricitySquared ** 2 / 64
        - 5 * eccentricitySquared ** 3 / 256
      )
    );

  const eccentricityOne =
    (
      1
      - Math.sqrt(
        1
        - eccentricitySquared
      )
    )
    / (
      1
      + Math.sqrt(
        1
        - eccentricitySquared
      )
    );

  const footpointLatitude =
    mu
    + (
      3 * eccentricityOne / 2
      - 27 * eccentricityOne ** 3 / 32
    )
    * Math.sin(2 * mu)
    + (
      21 * eccentricityOne ** 2 / 16
      - 55 * eccentricityOne ** 4 / 32
    )
    * Math.sin(4 * mu)
    + 151 * eccentricityOne ** 3 / 96
    * Math.sin(6 * mu)
    + 1097 * eccentricityOne ** 4 / 512
    * Math.sin(8 * mu);

  const radiusOfCurvature =
    semiMajorAxis
    / Math.sqrt(
      1
      - eccentricitySquared
      * Math.sin(footpointLatitude) ** 2
    );

  const tangentSquared =
    Math.tan(footpointLatitude) ** 2;

  const curvatureRatio =
    eccentricityPrimeSquared
    * Math.cos(footpointLatitude) ** 2;

  const distanceFromMeridian =
    (easting - falseEasting)
    / (
      radiusOfCurvature
      * scaleFactor
    );

  const latitude =
    footpointLatitude
    - (
      radiusOfCurvature
      * Math.tan(footpointLatitude)
      / semiMajorAxis
    )
    * (
      distanceFromMeridian ** 2 / 2
      - (
        5
        + 3 * tangentSquared
        + 10 * curvatureRatio
        - 4 * curvatureRatio ** 2
        - 9 * eccentricityPrimeSquared
      )
      * distanceFromMeridian ** 4 / 24
      + (
        61
        + 90 * tangentSquared
        + 298 * curvatureRatio
        + 45 * tangentSquared ** 2
        - 252 * eccentricityPrimeSquared
        - 3 * curvatureRatio ** 2
      )
      * distanceFromMeridian ** 6 / 720
    );

  const longitude =
    centralMeridian
    + (
      distanceFromMeridian
      - (
        1
        + 2 * tangentSquared
        + curvatureRatio
      )
      * distanceFromMeridian ** 3 / 6
      + (
        5
        - 2 * curvatureRatio
        + 28 * tangentSquared
        - 3 * curvatureRatio ** 2
        + 8 * eccentricityPrimeSquared
        + 24 * tangentSquared ** 2
      )
      * distanceFromMeridian ** 5 / 120
    )
    / Math.cos(footpointLatitude)
    * 180
    / Math.PI;

  return [
    longitude,
    latitude * 180 / Math.PI
  ];

}


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
// STORY STATE
// ============================================================

let STORY = HIMACHAL_STORY;

let activeDialogues = HIMACHAL_DIALOGUES;

let activeStoryId = 'himachal';

let atlasMode = true;

let selectedOverviewState = null;

let currentStoryIndex = 0;

let cameraAnimating = false;

let storyReady = false;

let scrollLocked = false;

let templeMarker = null;

let sanctuaryLabelMarker = null;

let flockMarker = null;

let routeCoordinates = [];

let routeDistances = [];

let routeLength = 0;

let flockProgress = 0;

let flockAnimationFrame = null;

let route3dLayer = null;

let route3dVisible = false;

const FLOCK_START_PROGRESS =
  0.003;

let riverAnimationFrame = null;


const TANDI_RIVER_BOUNDS = [
  76.82,
  32.42,
  77.15,
  32.70
];


function coordinatesTouchBounds(
  coordinates,
  bounds
) {

  if (
    typeof coordinates[0] ===
    'number'
  ) {

    return (
      coordinates[0] >= bounds[0]
      && coordinates[0] <= bounds[2]
      && coordinates[1] >= bounds[1]
      && coordinates[1] <= bounds[3]
    );

  }

  return coordinates.some(
    (child) =>
      coordinatesTouchBounds(
        child,
        bounds
      )
  );

}


function stripRiverElevation(
  coordinates
) {

  if (
    typeof coordinates[0] ===
    'number'
  ) {

    return [
      coordinates[0],
      coordinates[1]
    ];

  }

  return coordinates.map(
    (child) =>
      stripRiverElevation(
        child
      )
  );

}


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

        maxzoom:
          17,

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
          14

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
            0

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
    true,

  fadeDuration:
    0,

  refreshExpiredTiles:
    false,

  maxTileCacheSize:
    512

});


// ============================================================
// MAP LIMITS
// ============================================================

map.setMinZoom(3.5);

map.setMaxZoom(16);

map.setMaxPitch(68);

if (
  typeof map.setPrefetchZoomDelta === 'function'
) {
  map.setPrefetchZoomDelta(2);
}


// ============================================================
// NAVIGATION CONTROL
// ============================================================

map.addControl(

  new maplibregl.NavigationControl(),

  'top-right'

);





if (
  new URLSearchParams(
    window.location.search
  ).has('composer')
) {
  createCameraComposer({
    map,
    chapters: STORY
  });
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
      An Atlas of Indian Pastoralism
    </div>

    <h1>
      Journeys Through
      <br>
      India's Pastoral Landscapes
    </h1>

    <p>
      Enjoy views of the diverse landscapes and explore how pastoral communities migrate through India, connecting seasonal grazing grounds,
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
        || caseStudy.overviewOnly
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

      const markerLabel = marker.querySelector(
        '.case-study-label'
      );
      if (caseStudy.labelOffset && markerLabel) {
        markerLabel.style.transform = `translate(${caseStudy.labelOffset[0]}px, ${caseStudy.labelOffset[1]}px)`;
      }


      if (caseStudy.active) {

        marker.setAttribute(
          'aria-label',
          `Explore ${caseStudy.state}`
        );


        marker.addEventListener(
          'click',
          () => {

            enterStateCaseStudy(caseStudy);

          }
        );

      }
      else if (caseStudy.overviewOnly) {
        marker.setAttribute(
          'aria-label',
          `View ${caseStudy.state} boundary`
        );
        marker.addEventListener(
          'click',
          () => enterStateCaseStudy(caseStudy)
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
            caseStudy.markerCenter || caseStudy.center
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

    <section id="story-dialogue" hidden>
      <div class="story-dialogue-label">Voice from the route</div>
      <blockquote id="story-dialogue-quote"></blockquote>
      <div id="story-dialogue-attribution"></div>
      <button id="story-dialogue-toggle" type="button">Read conversation</button>
      <div id="story-dialogue-expanded" hidden></div>
    </section>

    <p id="story-text"></p>

    <div id="story-media"></div>

    <p id="story-detail"></p>

    <div class="story-progress">

      <div
        class="story-progress-track"
        role="tablist"
        aria-label="Story stops"
      >

        <div class="story-progress-line">

          <div id="story-progress-fill"></div>

        </div>

        ${STORY.map(
          (chapter, index) => `
            <button
              class="story-progress-stop"
              type="button"
              role="tab"
              data-story-index="${index}"
              aria-label="Go to ${chapter.location}"
              aria-selected="${index === 0}"
            >
              <span>${String(index + 1).padStart(2, '0')}</span>
            </button>
          `
        ).join('')}

      </div>

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
// STORY IMAGE VIEWER
// ============================================================

const imageViewer =
  document.createElement('div');


imageViewer.id =
  'image-viewer';


imageViewer.setAttribute(
  'aria-hidden',
  'true'
);


imageViewer.innerHTML = `

  <div class="image-viewer-backdrop"></div>

  <div
    class="image-viewer-dialog"
    role="dialog"
    aria-modal="true"
    aria-label="Expanded story images"
  >

    <button
      class="image-viewer-close"
      type="button"
      aria-label="Close image viewer"
    >
      ×
    </button>

    <div class="image-viewer-heading">
      <span id="image-viewer-location"></span>
      <span id="image-viewer-count"></span>
    </div>

    <div class="image-viewer-stage">

      <button
        class="image-viewer-arrow image-viewer-previous"
        type="button"
        aria-label="Previous image"
      >
        ‹
      </button>

      <img
        id="image-viewer-image"
        alt=""
      >

      <button
        class="image-viewer-arrow image-viewer-next"
        type="button"
        aria-label="Next image"
      >
        ›
      </button>

    </div>

    <div
      class="image-viewer-dots"
      aria-label="Image selection"
    ></div>

  </div>

`;


document.body.appendChild(
  imageViewer
);


const imageViewerImage =
  imageViewer.querySelector(
    '#image-viewer-image'
  );


const imageViewerLocation =
  imageViewer.querySelector(
    '#image-viewer-location'
  );


const imageViewerCount =
  imageViewer.querySelector(
    '#image-viewer-count'
  );


const imageViewerDots =
  imageViewer.querySelector(
    '.image-viewer-dots'
  );


const imageViewerClose =
  imageViewer.querySelector(
    '.image-viewer-close'
  );


const imageViewerPrevious =
  imageViewer.querySelector(
    '.image-viewer-previous'
  );


const imageViewerNext =
  imageViewer.querySelector(
    '.image-viewer-next'
  );


let imageViewerImages = [];
let imageViewerIndex = 0;
let imageViewerTouchStartX = 0;


function renderImageViewerImage(
  direction = 0
) {

  const image =
    imageViewerImages[
      imageViewerIndex
    ];

  imageViewerImage.classList.remove(
    'image-viewer-image-next',
    'image-viewer-image-previous'
  );

  if (direction !== 0) {
    // Restart the entrance animation when moving between images.
    void imageViewerImage.offsetWidth;

    imageViewerImage.classList.add(
      direction > 0
        ? 'image-viewer-image-next'
        : 'image-viewer-image-previous'
    );
  }

  imageViewerImage.src =
    image.src;

  imageViewerImage.alt =
    image.alt;

  imageViewerCount.textContent =
    `${String(imageViewerIndex + 1).padStart(2, '0')} / ${String(imageViewerImages.length).padStart(2, '0')}`;

  imageViewerDots.innerHTML =
    imageViewerImages.map(
      (item, index) => `
        <button
          class="image-viewer-dot${index === imageViewerIndex ? ' active' : ''}"
          type="button"
          aria-label="Show image ${index + 1}"
          aria-current="${index === imageViewerIndex}"
          data-image-index="${index}"
        ></button>
      `
    ).join('');

  imageViewerDots.querySelectorAll(
    '.image-viewer-dot'
  ).forEach(
    (dot) => {
      dot.addEventListener(
        'click',
        () => {
          imageViewerIndex = Number(
            dot.dataset.imageIndex
          );

          renderImageViewerImage();
        }
      );
    }
  );

  imageViewerPrevious.hidden =
    imageViewerImages.length < 2;

  imageViewerNext.hidden =
    imageViewerImages.length < 2;

  imageViewerDots.hidden =
    imageViewerImages.length < 2;

}


function openImageViewer(
  images,
  index
) {

  imageViewerImages =
    images;

  imageViewerIndex =
    index;

  imageViewerLocation.textContent =
    STORY[currentStoryIndex].location;

  renderImageViewerImage();

  imageViewer.classList.add(
    'visible'
  );

  imageViewer.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'image-viewer-open'
  );

  imageViewerClose.focus();

}


function closeImageViewer() {

  imageViewer.classList.remove(
    'visible'
  );

  imageViewer.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'image-viewer-open'
  );

}


function moveImageViewer(
  direction
) {

  if (
    imageViewerImages.length < 2
  ) {
    return;
  }

  imageViewerIndex = (
    imageViewerIndex + direction + imageViewerImages.length
  ) % imageViewerImages.length;

  renderImageViewerImage(
    direction
  );

}


imageViewerClose.addEventListener(
  'click',
  closeImageViewer
);


imageViewer.querySelector(
  '.image-viewer-backdrop'
).addEventListener(
  'click',
  closeImageViewer
);


imageViewerPrevious.addEventListener(
  'click',
  () => moveImageViewer(-1)
);


imageViewerNext.addEventListener(
  'click',
  () => moveImageViewer(1)
);


imageViewer.addEventListener(
  'keydown',
  (event) => {
    if (event.key === 'Escape') {
      closeImageViewer();
    }

    if (event.key === 'ArrowLeft') {
      moveImageViewer(-1);
    }

    if (event.key === 'ArrowRight') {
      moveImageViewer(1);
    }
  }
);


imageViewer.addEventListener(
  'touchstart',
  (event) => {
    imageViewerTouchStartX =
      event.changedTouches[0].clientX;
  },
  {
    passive: true
  }
);


imageViewer.addEventListener(
  'touchend',
  (event) => {
    const distance =
      event.changedTouches[0].clientX
      - imageViewerTouchStartX;

    if (Math.abs(distance) > 45) {
      moveImageViewer(
        distance < 0 ? 1 : -1
      );
    }
  },
  {
    passive: true
  }
);


function bindStoryImages(
  chapter
) {

  const images = [
    chapter.image,
    chapter.secondImage
  ].filter(Boolean).map(
    (src, index) => ({
      src,
      alt: `${chapter.location} image ${index + 1}`
    })
  );

  mediaElement.querySelectorAll(
    '.story-image'
  ).forEach(
    (image, index) => {
      image.setAttribute(
        'role',
        'button'
      );

      image.setAttribute(
        'tabindex',
        '0'
      );

      const open = () => openImageViewer(
        images,
        index
      );

      image.addEventListener(
        'click',
        open
      );

      image.addEventListener(
        'keydown',
        (event) => {
          if (
            event.key === 'Enter'
            || event.key === ' '
          ) {
            event.preventDefault();
            open();
          }
        }
      );
    }
  );

}


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
      Home Village
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-shearing">
      ✂
    </span>

    <span>
      Shearing Location
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-stop">
      ●
    </span>

    <span>
      Route points
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-destination">
      ◇
    </span>

    <span>
      Summer Grazing Grounds
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-route"></span>

    <span>
      Migration Route
    </span>

  </div>


  <div class="legend-item">

    <span class="legend-cultural">
      ✦
    </span>

    <span>
      Cultural Site
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


const dialogueElement =
  document.querySelector(
    '#story-dialogue'
  );


const dialogueQuoteElement =
  document.querySelector(
    '#story-dialogue-quote'
  );


const dialogueAttributionElement =
  document.querySelector(
    '#story-dialogue-attribution'
  );


const dialogueToggle =
  document.querySelector(
    '#story-dialogue-toggle'
  );


const dialogueExpandedElement =
  document.querySelector(
    '#story-dialogue-expanded'
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


const progressFill =
  document.querySelector(
    '#story-progress-fill'
  );


const progressStops = [
  ...document.querySelectorAll(
    '.story-progress-stop'
  )
];


function updateProgressStopsForStory() {
  progressStops.forEach(
    (stop, index) => {
      const chapter = STORY[index];
      stop.hidden = !chapter;
      if (chapter) {
        stop.setAttribute(
          'aria-label',
          `Go to ${chapter.location}`
        );
        stop.querySelector('span').textContent =
          String(index + 1).padStart(2, '0');
      }
    }
  );
}


const scrollHint =
  document.querySelector(
    '#story-scroll-hint'
  );


const backToAtlasButton =
  document.querySelector(
    '#back-to-atlas'
  );


const storyPanelInner =
  storyPanel.querySelector(
    '.story-panel-inner'
  );


dialogueToggle.addEventListener(
  'click',
  () => {
    const expanded =
      !dialogueExpandedElement.hidden;
    dialogueExpandedElement.hidden = expanded;
    dialogueToggle.textContent = expanded
      ? 'Read conversation'
      : 'Close conversation';
  }
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


      const dialogue =
        activeDialogues[chapter.id];

      dialogueElement.hidden = !dialogue;
      dialogueExpandedElement.hidden = true;
      dialogueToggle.textContent = 'Read conversation';

      if (dialogue) {
        dialogueQuoteElement.textContent =
          `“${dialogue.quote}”`;
        dialogueAttributionElement.textContent =
          `${dialogue.speaker} · ${dialogue.role}`;
        dialogueExpandedElement.textContent =
          dialogue.conversation.join('\n\n');
      }
      else {
        dialogueQuoteElement.textContent = '';
        dialogueAttributionElement.textContent = '';
        dialogueExpandedElement.textContent = '';
      }


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


      bindStoryImages(
        chapter
      );


      // ======================================================
      // PROGRESS
      // ======================================================

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


      progressStops.forEach(
        (stop, index) => {
          const isCurrent =
            index === currentStoryIndex;

          stop.classList.toggle(
            'active',
            isCurrent
          );

          stop.classList.toggle(
            'visited',
            index <= currentStoryIndex
          );

          stop.setAttribute(
            'aria-selected',
            String(isCurrent)
          );

          if (isCurrent) {
            stop.setAttribute(
              'aria-current',
              'step'
            );
          }
          else {
            stop.removeAttribute(
              'aria-current'
            );
          }

        }
      );


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


progressStops.forEach(
  (stop) => {
    stop.addEventListener(
      'click',
      () => {
        goToChapter(
          Number(
            stop.dataset.storyIndex
          )
        );
      }
    );
  }
);


// ============================================================
// ROUTE PROGRESS
// ============================================================

function setRouteProgressPaint(
  progress
) {

  const visibleProgress =
    Math.max(
      FLOCK_START_PROGRESS,
      progress
    );

  const edge = Math.min(
    0.999,
    visibleProgress + 0.001
  );

  const gradient = visibleProgress >= 0.999
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
            visibleProgress,
        '#e8ad4f',
        edge,
        'rgba(91, 76, 56, 0)',
        1,
        'rgba(91, 76, 56, 0)'
      ];

  map.setPaintProperty(
    'migration-route',
    'line-gradient',
    gradient
  );

  if (
    map.getLayer(
      'migration-route-highlight'
    )
  ) {

    map.setPaintProperty(
      'migration-route-highlight',
      'line-gradient',
      gradient
    );

  }


  if (
    route3dLayer
  ) {
    route3dLayer.setProgress(
      progress
    );
  }

}

function setAutumnRouteProgressPaint(progress) {

  if (!map.getLayer('migration-route')) {
    return;
  }

  if (!Number.isFinite(progress)) {
    return;
  }

  const p = Math.max(0, Math.min(1, progress));

  // Keep the gradient stops strictly increasing.
  const start = Math.max(0, p - 0.001);

  const gradient = [
    'interpolate',
    ['linear'],
    ['line-progress'],

    0, 'rgba(91, 76, 56, 0)',

    start, 'rgba(91, 76, 56, 0)',

    p, '#D9D9D9',

    1, '#D9D9D9'
  ];

  map.setPaintProperty(
    'migration-route',
    'line-gradient',
    gradient
  );

  if (map.getLayer('migration-route-highlight')) {

    map.setPaintProperty(
      'migration-route-highlight',
      'line-gradient',
      gradient
    );

  }
}

function updateRouteProgress(
  progress,
  options = {}
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

  if (
    flockAnimationFrame
  ) {

    cancelAnimationFrame(flockAnimationFrame);
    flockAnimationFrame = null;

  }

  const startProgress = flockProgress;
  const isAutumnReturn =
  options.migrationPhase === 'autumn-return';

  if (
    options.animate !== false
    && Math.abs(p - startProgress) > 0.01
  ) {

    const startedAt = performance.now();
    const duration = options.duration
       Math.min(
        1800,
        Math.max(700, Math.abs(p - startProgress) * 2600)
      );

    const animateFlock = (now) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      const value = startProgress + (p - startProgress) * eased;

      if (isAutumnReturn) {
  setAutumnRouteProgressPaint(value);
} else {
  setRouteProgressPaint(value);
}

flockProgress = value;
updateFlockPosition(value);

      if (elapsed < 1) {
        flockAnimationFrame = requestAnimationFrame(animateFlock);
      }
      else {
        flockAnimationFrame = null;
      }
    };

    flockAnimationFrame = requestAnimationFrame(animateFlock);
    return;

  }


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

  if (
    map.getLayer(
      'migration-route-highlight'
    )
  ) {

    const highlightGradient =
      p >= 0.999
        ? [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'rgba(255, 238, 181, 0.78)',
            1,
            'rgba(255, 238, 181, 0.42)'
          ]
        : [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'rgba(255, 238, 181, 0.78)',
            p,
            'rgba(255, 238, 181, 0.42)',
            edge,
            'rgba(255, 238, 181, 0)',
            1,
            'rgba(255, 238, 181, 0)'
          ];

    map.setPaintProperty(
      'migration-route-highlight',
      'line-gradient',
      highlightGradient
    );

  }

  flockProgress = p;
  updateFlockPosition(p);

  if (
    route3dLayer
  ) {
    route3dLayer.setProgress(
      p
    );
  }

}


function getRouteCoordinate(
  progress
) {

  if (
    routeCoordinates.length < 2
    || routeLength === 0
  ) {

    return null;

  }

  const targetDistance = Math.max(
    0,
    Math.min(1, progress)
  ) * routeLength;

  let segment = 1;

  while (
    segment < routeDistances.length - 1
    && routeDistances[segment] < targetDistance
  ) {

    segment += 1;

  }

  const previousDistance = routeDistances[segment - 1];
  const segmentDistance = routeDistances[segment] - previousDistance;
  const ratio = segmentDistance === 0
    ? 0
    : (targetDistance - previousDistance) / segmentDistance;
  const previous = routeCoordinates[segment - 1];
  const current = routeCoordinates[segment];

  return [
    previous[0] + (current[0] - previous[0]) * ratio,
    previous[1] + (current[1] - previous[1]) * ratio
  ];

}


function getRouteProgressForCoordinate(
  coordinate,
  minProgress = 0,
  maxProgress = 1
) {

  if (
    routeCoordinates.length < 2
    || routeLength === 0
    || !coordinate
  ) {

    return null;

  }

  let closestDistance = Infinity;
  let closestProgress = 0;

  for (
    let index = 1;
    index < routeCoordinates.length;
    index += 1
  ) {

    const segmentStartProgress =
  routeDistances[index - 1] / routeLength;

const segmentEndProgress =
  routeDistances[index] / routeLength;

if (
  segmentEndProgress < minProgress ||
  segmentStartProgress > maxProgress
) {
  continue;
}

    const start = routeCoordinates[index - 1];
    const end = routeCoordinates[index];
    const latitudeScale = Math.cos(coordinate[1] * Math.PI / 180);
    const segmentX = (end[0] - start[0]) * latitudeScale;
    const segmentY = end[1] - start[1];
    const pointX = (coordinate[0] - start[0]) * latitudeScale;
    const pointY = coordinate[1] - start[1];
    const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
    const ratio = segmentLengthSquared === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            (pointX * segmentX + pointY * segmentY) / segmentLengthSquared
          )
        );
    const distanceX = pointX - segmentX * ratio;
    const distanceY = pointY - segmentY * ratio;
    const distance = distanceX * distanceX + distanceY * distanceY;

    if (
      distance < closestDistance
    ) {

      closestDistance = distance;
      closestProgress = (
        routeDistances[index - 1]
        + (routeDistances[index] - routeDistances[index - 1]) * ratio
      ) / routeLength;

    }

  }

  return closestProgress;

}


function inspectRouteProgress(coordinate) {

  if (!Array.isArray(coordinate) || coordinate.length !== 2) {
    console.warn('Invalid coordinate:', coordinate);
    return;
  }

  const matches = [];

  for (let i = 0; i < routeCoordinates.length; i++) {

    const point = routeCoordinates[i];

    const distance = Math.hypot(
      (point[0] - coordinate[0]) *
        Math.cos(coordinate[1] * Math.PI / 180),
      point[1] - coordinate[1]
    );

    matches.push({
      index: i,
      progress: routeDistances[i] / routeLength,
      distance
    });
  }

  matches.sort((a, b) => a.distance - b.distance);

  console.table(matches.slice(0, 15));
}


function getStoryRouteProgress(chapter) {

  // Summer overview uses exactly the same position as Darcha.
  if (chapter.id === 'full-route') {

    const darcha = STORY.find(
      item => item.id === 'darcha'
    );

    if (darcha) {
      return getStoryRouteProgress(darcha);
    }

    return null;
  }

  const coordinate = chapter.routeStop;

  const hasValidCoordinate =
    Array.isArray(coordinate) &&
    coordinate.length === 2 &&
    coordinate.every(Number.isFinite);

  const calculatedProgress = hasValidCoordinate
    ? getRouteProgressForCoordinate(
        coordinate,
        chapter.routeProgressMin ?? 0,
        chapter.routeProgressMax ?? 1
      )
    : null;

  if (Number.isFinite(calculatedProgress)) {
    return Math.max(0, Math.min(1, calculatedProgress));
  }

  if (Number.isFinite(chapter.routeProgress)) {
    return Math.max(0, Math.min(1, chapter.routeProgress));
  }

  console.warn(
    'No valid route progress for chapter:',
    chapter.id
  );

  return null;
}
window.inspectRouteProgress = inspectRouteProgress;


function updateFlockPosition(
  progress
) {

  if (
    !flockMarker
  ) {

    return;

  }

  const flockProgress =
    Math.max(
      FLOCK_START_PROGRESS,
      progress
    );

  const coordinate =
    getRouteCoordinate(
      flockProgress
    );

  if (
    coordinate
  ) {

    flockMarker.setOffset(
      [
        0,
        0
      ]
    );

    flockMarker.setLngLat(coordinate);

  }

}


function prepareRouteCoordinates(
  routeGeoJSON
) {

  const lines = [];

  routeGeoJSON.features.forEach(
    (feature) => {

      if (
        feature.geometry.type === 'LineString'
      ) {

        lines.push(feature.geometry.coordinates);

      }

      if (
        feature.geometry.type === 'MultiLineString'
      ) {

        lines.push(...feature.geometry.coordinates);

      }

    }
  );

  routeCoordinates = lines
    .sort((a, b) => b.length - a.length)[0]
    || [];

  routeDistances = [0];
  routeLength = 0;

  for (
    let index = 1;
    index < routeCoordinates.length;
    index += 1
  ) {

    const previous = routeCoordinates[index - 1];
    const current = routeCoordinates[index];
    const longitudeDistance = (current[0] - previous[0]) * Math.cos(
      ((current[1] + previous[1]) / 2) * Math.PI / 180
    );
    const latitudeDistance = current[1] - previous[1];

    routeLength += Math.sqrt(
      longitudeDistance * longitudeDistance
      + latitudeDistance * latitudeDistance
    );

    routeDistances.push(routeLength);

  }

}


// ============================================================
// RAISED 3D ROUTE
// ============================================================

function createRaisedRouteLayer() {

  const getRoutePoints = () => routeCoordinates.map(
    (coordinate, index) => {
      const elevation = map.queryTerrainElevation(
        coordinate,
        {
          exaggerated: true
        }
      ) || 0;

      const mercator =
        maplibregl.MercatorCoordinate.fromLngLat(
          coordinate,
          elevation + 28
        );

      const previous =
        routeCoordinates[Math.max(0, index - 1)];

      const next =
        routeCoordinates[Math.min(
          routeCoordinates.length - 1,
          index + 1
        )];

      const previousMercator =
        maplibregl.MercatorCoordinate.fromLngLat(
          previous,
          0
        );

      const nextMercator =
        maplibregl.MercatorCoordinate.fromLngLat(
          next,
          0
        );

      const tangentX =
        nextMercator.x - previousMercator.x;

      const tangentY =
        nextMercator.y - previousMercator.y;

      const tangentLength = Math.sqrt(
        tangentX * tangentX
        + tangentY * tangentY
      ) || 1;

      return {
        x: mercator.x,
        y: mercator.y,
        z: mercator.z,
        normalX: -tangentY / tangentLength,
        normalY: tangentX / tangentLength,
        meterScale:
          mercator.meterInMercatorCoordinateUnits(),
        progress:
          routeLength === 0
            ? 0
            : routeDistances[index] / routeLength
      };
    }
  );
  console.log('=== DARCHA ROUTE PROGRESS ===');

inspectRouteProgress([
  77.19755939568283,
  32.67493238488826
]);

console.log('=== HADSAR ROUTE PROGRESS ===');

inspectRouteProgress([
    76.61126,
    32.45489

]);


  let routePoints =
    getRoutePoints();


  const tubeData = [
    {
      radius: 11,
      color: [0.08, 0.055, 0.025],
      alpha: 0.28
    },
    {
      radius: 7,
      color: [0.23, 0.12, 0.035],
      alpha: 0.92
    },
    {
      radius: 3.5,
      color: [0.93, 0.57, 0.16],
      alpha: 1
    }
  ];


  const buildTube = (
    radius
  ) => {
    const vertices = [];
    const ringSegments = 8;

    const rings = routePoints.map(
      (point, index) => {
        const previous = routePoints[
          Math.max(0, index - 1)
        ];

        const next = routePoints[
          Math.min(
            routePoints.length - 1,
            index + 1
          )
        ];

        let tangentX = next.x - previous.x;
        let tangentY = next.y - previous.y;
        let tangentZ = next.z - previous.z;

        const tangentLength = Math.sqrt(
          tangentX * tangentX
          + tangentY * tangentY
          + tangentZ * tangentZ
        ) || 1;

        tangentX /= tangentLength;
        tangentY /= tangentLength;
        tangentZ /= tangentLength;

        let sideX = tangentY;
        let sideY = -tangentX;
        let sideZ = 0;

        const sideLength = Math.sqrt(
          sideX * sideX
          + sideY * sideY
        ) || 1;

        sideX /= sideLength;
        sideY /= sideLength;

        const normalX =
          sideY * tangentZ - sideZ * tangentY;
        const normalY =
          sideZ * tangentX - sideX * tangentZ;
        const normalZ =
          sideX * tangentY - sideY * tangentX;

        return Array.from(
          {
            length: ringSegments
          },
          (_, segment) => {
            const angle =
              segment / ringSegments * Math.PI * 2;
            const radialX =
              sideX * Math.cos(angle)
              + normalX * Math.sin(angle);
            const radialY =
              sideY * Math.cos(angle)
              + normalY * Math.sin(angle);
            const radialZ =
              sideZ * Math.cos(angle)
              + normalZ * Math.sin(angle);
            const offset =
              radius * point.meterScale;

            return {
              x: point.x + radialX * offset,
              y: point.y + radialY * offset,
              z: point.z + radialZ * offset,
              normalX: radialX,
              normalY: radialY,
              normalZ: radialZ,
              progress: point.progress
            };
          }
        );
      }
    );

    for (
      let index = 1;
      index < rings.length;
      index += 1
    ) {
      const previousRing = rings[index - 1];
      const currentRing = rings[index];

      for (
        let segment = 0;
        segment < ringSegments;
        segment += 1
      ) {
        const nextSegment =
          (segment + 1) % ringSegments;
        const corners = [
          previousRing[segment],
          currentRing[segment],
          currentRing[nextSegment],
          previousRing[nextSegment]
        ];

        [
          corners[0],
          corners[1],
          corners[2],
          corners[0],
          corners[2],
          corners[3]
        ].forEach(
          (vertex) => {
            vertices.push(
              vertex.x,
              vertex.y,
              vertex.z,
              vertex.normalX,
              vertex.normalY,
              vertex.normalZ,
              vertex.progress
            );
          }
        );
      }
    }

    return new Float32Array(
      vertices
    );
  };


  const layer = {
    id: 'gaddi-route-3d',

    type: 'custom',

    renderingMode: '3d',

    onAdd(mapInstance, gl) {
      this.map = mapInstance;
      this.gl = gl;

      const vertexShader = gl.createShader(
        gl.VERTEX_SHADER
      );

      gl.shaderSource(
        vertexShader,
        `
          attribute vec3 a_position;
          attribute vec3 a_normal;
          attribute float a_progress;
          uniform mat4 u_matrix;
          varying float v_progress;
          varying vec3 v_normal;

          void main() {
            gl_Position = u_matrix * vec4(a_position, 1.0);
            v_progress = a_progress;
            v_normal = a_normal;
          }
        `
      );

      gl.compileShader(
        vertexShader
      );

      const fragmentShader = gl.createShader(
        gl.FRAGMENT_SHADER
      );

      gl.shaderSource(
        fragmentShader,
        `
          precision highp float;

          uniform float u_progress;
          uniform vec3 u_color;
          uniform float u_alpha;

          varying float v_progress;
          varying vec3 v_normal;

          void main() {
            if (v_progress > u_progress) {
              discard;
            }

            float head = 1.0 - smoothstep(
              0.0,
              0.045,
              abs(v_progress - u_progress)
            );

            vec3 color = mix(
              u_color,
              vec3(1.0, 0.82, 0.42),
              head * 0.58
            );

            vec3 lightDirection = normalize(
              vec3(-0.45, -0.55, 0.9)
            );

            float lighting = 0.38 + 0.62 * max(
              dot(
                normalize(v_normal),
                lightDirection
              ),
              0.0
            );

            gl_FragColor = vec4(
              color * lighting,
              u_alpha + head * 0.16
            );
          }
        `
      );

      gl.compileShader(
        fragmentShader
      );

      this.program = gl.createProgram();

      gl.attachShader(
        this.program,
        vertexShader
      );

      gl.attachShader(
        this.program,
        fragmentShader
      );

      gl.linkProgram(
        this.program
      );

      this.positionLocation =
        gl.getAttribLocation(
          this.program,
          'a_position'
        );

      this.normalLocation =
        gl.getAttribLocation(
          this.program,
          'a_normal'
        );

      this.progressLocation =
        gl.getAttribLocation(
          this.program,
          'a_progress'
        );

      this.matrixLocation =
        gl.getUniformLocation(
          this.program,
          'u_matrix'
        );

      this.routeProgressLocation =
        gl.getUniformLocation(
          this.program,
          'u_progress'
        );

      this.colorLocation =
        gl.getUniformLocation(
          this.program,
          'u_color'
        );

      this.alphaLocation =
        gl.getUniformLocation(
          this.program,
          'u_alpha'
        );

      this.buffers = tubeData.map(
        (tube) => {
          const buffer = gl.createBuffer();
          const data = buildTube(
            tube.radius
          );

          gl.bindBuffer(
            gl.ARRAY_BUFFER,
            buffer
          );

          gl.bufferData(
            gl.ARRAY_BUFFER,
            data,
            gl.STATIC_DRAW
          );

          return {
            ...tube,
            buffer,
            vertexCount: data.length / 7
          };
        }
      );

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        null
      );
    },

    setProgress(progress) {
      this.progress = progress;
      map.triggerRepaint();
    },

    setVisible(visible) {
      this.visible = visible;
      map.triggerRepaint();
    },

    refreshTerrain() {
      routePoints =
        getRoutePoints();

      if (
        !this.buffers
      ) {
        return;
      }

      this.buffers.forEach(
        (tube) => {
          const data = buildTube(
            tube.radius
          );

          this.gl.bindBuffer(
            this.gl.ARRAY_BUFFER,
            tube.buffer
          );

          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            data,
            this.gl.STATIC_DRAW
          );
        }
      );

      this.gl.bindBuffer(
        this.gl.ARRAY_BUFFER,
        null
      );

      map.triggerRepaint();
    },

    progress: 0,

    visible: false,

    render(gl, args) {
      if (
        !this.visible
        || !this.program
        || !routePoints.length
      ) {
        return;
      }

      const hadDepthTest =
        gl.isEnabled(
          gl.DEPTH_TEST
        );

      const hadCullFace =
        gl.isEnabled(
          gl.CULL_FACE
        );

      const hadBlend =
        gl.isEnabled(
          gl.BLEND
        );

      const hadDepthWrite =
        gl.getParameter(
          gl.DEPTH_WRITEMASK
        );

      const matrix =
        args.defaultProjectionData?.mainMatrix
        || args.mainMatrix
        || args.matrix;

      gl.useProgram(
        this.program
      );

      gl.uniformMatrix4fv(
        this.matrixLocation,
        false,
        matrix
      );

      gl.uniform1f(
        this.routeProgressLocation,
        this.progress
      );

      gl.enable(
        gl.BLEND
      );

      gl.blendFunc(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA
      );

      gl.disable(
        gl.CULL_FACE
      );

      gl.depthMask(
        false
      );

      this.buffers.forEach(
        (tube) => {
          gl.bindBuffer(
            gl.ARRAY_BUFFER,
            tube.buffer
          );

          gl.enableVertexAttribArray(
            this.positionLocation
          );

          gl.vertexAttribPointer(
            this.positionLocation,
            3,
            gl.FLOAT,
            false,
            28,
            0
          );

          gl.enableVertexAttribArray(
            this.normalLocation
          );

          gl.vertexAttribPointer(
            this.normalLocation,
            3,
            gl.FLOAT,
            false,
            28,
            12
          );

          gl.enableVertexAttribArray(
            this.progressLocation
          );

          gl.vertexAttribPointer(
            this.progressLocation,
            1,
            gl.FLOAT,
            false,
            28,
            24
          );

          gl.uniform3fv(
            this.colorLocation,
            tube.color
          );

          gl.uniform1f(
            this.alphaLocation,
            tube.alpha
          );

          gl.drawArrays(
            gl.TRIANGLES,
            0,
            tube.vertexCount
          );
        }
      );

      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        null
      );

      gl.depthMask(
        hadDepthWrite
      );

      if (
        hadDepthTest
      ) {
        gl.enable(
          gl.DEPTH_TEST
        );
      }

      if (
        hadCullFace
      ) {
        gl.enable(
          gl.CULL_FACE
        );
      }

      if (
        hadBlend
      ) {
        gl.enable(
          gl.BLEND
        );
      }
      else {
        gl.disable(
          gl.BLEND
        );
      }
    }
  };


  return layer;

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
    activeStoryId === 'himachal'
    &&
    currentStoryIndex >= 1;

  const showHimachalBoundary =
    !atlasMode
    && activeStoryId === 'himachal';

  const showKugtiContext =
    !atlasMode
    && activeStoryId === 'himachal'
    &&
    STORY[
      currentStoryIndex
    ].showKugtiContext === true;

  const showTandiRiver =
    !atlasMode
    && activeStoryId === 'himachal'
    &&
    STORY[
      currentStoryIndex
    ].id ===
    'tandi';


  const visibility =
    showRoute
      ? 'visible'
      : 'none';


  if (
    route3dLayer
  ) {
    route3dLayer.setVisible(
      showRoute
    );
  }

  [
    'himachal-boundary-fill',
    'himachal-boundary-outline'
  ].forEach(
    (layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          showHimachalBoundary ? 'visible' : 'none'
        );
      }
    }
  );

  [
    ['ladakh', 'ladakh-boundary-fill'],
    ['ladakh', 'ladakh-boundary-outline'],
    ['arunachal', 'arunachal-boundary-fill'],
    ['arunachal', 'arunachal-boundary-outline']
  ].forEach(
    ([stateId, layerId]) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          (
            atlasMode
            && selectedOverviewState === stateId
          )
          || (
            !atlasMode
            && activeStoryId === stateId
          )
            ? 'visible'
            : 'none'
        );
      }
    }
  );


  [

    'route-points',
    'route-labels',
    'ispur-darcha-route-points',
    'ispur-darcha-route-labels',
    'individual-ladakh-points',
    'individual-ladakh-labels',
    'migration-route-casing',
    'migration-route-base',
    'migration-route',
    'migration-route-highlight',
    'ispur-darcha-route-casing',
    'ispur-darcha-route',
    'shearing-location',
    'kugti-sanctuary-fill',
    'kugti-sanctuary-outline',
    'tandi-river-shadow',
    'tandi-river-water',
    'tandi-river-flow'

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


  [
    'tandi-river-shadow',
    'tandi-river-water',
    'tandi-river-flow'
  ].forEach(
    (layerId) => {

      if (
        map.getLayer(layerId)
      ) {

        map.setPaintProperty(
          layerId,
          'line-opacity',
          showTandiRiver
            ? layerId === 'tandi-river-shadow'
              ? 0.9
              : layerId === 'tandi-river-water'
                ? 0.88
                : 0.9
            : 0
        );

      }

    }
  );


  if (
    flockMarker
  ) {

    flockMarker.getElement().style.display = showRoute
      ? 'block'
      : 'none';

  }


  if (
    showRoute
  ) {

      updateRouteProgress(

        getStoryRouteProgress(
          STORY[
            currentStoryIndex
          ]
        )

      );

  }

}


// ============================================================
// MAP INTERACTION
// ============================================================

function disableMapInteraction() {

  map.dragPan.disable();

  map.dragRotate.disable();

  map.scrollZoom.disable();

  map.touchZoomRotate.disable();

  map.doubleClickZoom.disable();

  map.keyboard.disable();

}


function enableMapInteraction() {

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
)
{

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
// CONTINUOUS CAMERA FLIGHT THROUGH WAYPOINTS
// ============================================================

function flyCameraThroughWaypoints(
  waypoints,
  duration = 9000
) {

  return new Promise((resolve) => {

    if (waypoints.length < 2) {
      resolve();
      return;
    }

    const startedAt = performance.now();




function interpolateCamera(progress) {

  const segments = waypoints.length - 1;
  const position = Math.min(
  Math.max(progress * segments, 0),
  segments
);

const index = Math.min(
  Math.floor(position),
  segments - 1
);

const t = Math.max(
  0,
  Math.min(1, position - index)
);

  const from = waypoints[index];
  const to = waypoints[index + 1];


  const lerp = (a, b, t) => a + (b - a) * t;

  const bearingDifference =
    ((to.bearing - from.bearing + 540) % 360) - 180;

  return {
    center: [
      lerp(from.center[0], to.center[0], t),
      lerp(from.center[1], to.center[1], t)
    ],

    zoom: lerp(from.zoom, to.zoom, t),

    pitch: lerp(from.pitch, to.pitch, t),

    bearing: from.bearing + bearingDifference * t
  };
}


    function animate(now) {

      const elapsed = now - startedAt;

      const rawProgress = Math.min(
        1,
        elapsed / duration
      );

      // Smooth acceleration at the beginning and
      // deceleration at the end of the complete flight.
      const progress = rawProgress;

      const camera = interpolateCamera(progress);

      map.jumpTo(camera);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);

  });

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
        t * t * t * (t * (t * 6 - 15) + 10)

  });

}


// ============================================================
// MIGRATION TRAVEL CAMERA
// ============================================================

function getTravelCamera(

  fromIndex,
  toIndex
) {const fromId = STORY[fromIndex]?.id;
const toId = STORY[toIndex]?.id;

  // Bharmour → Kugti

  if (
    fromId === 'bharmour'
    &&
    toId === 'kugti'
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
    fromId === 'kugti'
    &&
    toId === 'kartik-swami-temple'
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


  // Kartik Swami Temple → Kugti - Jot

  if (
    fromId === 'kartik-swami-temple'
    &&
    toId === 'kugti-jot'
  ) {

    return {

      zoom:
        13.2,

      pitch:
        60,

      duration1:
        1000,

      duration2:
        2200

    };

  }
  // ======================================================
// Kugti Jot → Tandi
// ======================================================

if (
  fromId === 'kugti-jot'
  &&
  toId === 'tandi'
) {

  return {
    zoom: 12.2,
    pitch: 48,
    duration1: 1400,
    duration2: 2400
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

  const destination = STORY[toIndex];
  const travel = getTravelCamera(fromIndex, toIndex);
    // ======================================================
  // CINEMATIC MOUNTAIN PASS — KUGTI JOT
  // ======================================================

  if (
    STORY[fromIndex]?.id === 'kartik-swami-temple' &&
    destination.id === 'kugti-jot'
  ) {

    const startCenter = map.getCenter().toArray();

    // Temporary approach viewpoint between the temple
    // and the mountain pass.
    const approachCenter = [
      startCenter[0] +
        (destination.center[0] - startCenter[0]) * 0.55,

      startCenter[1] +
        (destination.center[1] - startCenter[1]) * 0.55
    ];

    // Stage 1 — Pull back and approach the mountains.
    await easeCamera({
      center: approachCenter,
      zoom: 11.8,
      pitch: 55,
      bearing: destination.bearing,
      duration: 2400,
      easing: (t) => t * t * (3 - 2 * t)
    });

    // Stage 2 — Move into the saved pass viewpoint.
    await easeCamera({
      center: destination.center,
      zoom: destination.zoom,
      pitch: destination.pitch,
      bearing: destination.bearing,
      duration: 2800,
      easing: (t) => t * t * (3 - 2 * t)
    });

    return;
  }

// ======================================================
// KUGTI JOT → TANDI — SMOOTH CAMERA TRANSITION
// ======================================================

if (
  STORY[fromIndex]?.id === 'kugti-jot' &&
  destination.id === 'tandi'
) {

  // Stage 1 — Pull back from a different direction
  await easeCamera({
    center: [76.894781, 32.602374],
    zoom: 12.96,
    pitch: 64.5,
    bearing: -108.39,
    duration: 2200,
    easing: t => t * t * (3 - 2 * t)
  });

  // Stage 2 — Move towards Tandi
  await easeCamera({
    center: destination.center,
    zoom: destination.zoom,
    pitch: destination.pitch,
    bearing: destination.bearing,
    duration: 2600,
    easing: t => t * t * (3 - 2 * t)
  });

  return;
}

if (
  STORY[fromIndex]?.id === 'kugti-jot' &&
  destination.id === 'tandi'
) {

  const cameraWaypoints = [

    // Start from the current camera position.
    {
      center: map.getCenter().toArray(),
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing()
    },

    // Waypoint 1 — Leaving Kugti Jot.
    {
      center: [76.844651, 32.554483],
      zoom: 13.313,
      pitch: 66,
      bearing: -145.06
    },

    // Waypoint 2 — Mountain traverse.
    {
      center: [76.894781, 32.602374],
      zoom: 12.96,
      pitch: 64.5,
      bearing: -108.39
    },

    // Waypoint 3 — Turning towards Tandi.
    {
      center: [76.94738, 32.600003],
      zoom: 12.857,
      pitch: 53.52,
      bearing: 0
    },

    // Waypoint 4 — Above Tandi.
    {
      center: [76.980444, 32.554338],
      zoom: 13.741,
      pitch: 48.02,
      bearing: 43.21
    },

    // Finish at the existing Tandi chapter camera.
    {
      center: destination.center,
      zoom: destination.zoom,
      pitch: destination.pitch,
      bearing: destination.bearing
    }

  ];

  await flyCameraThroughWaypoints(
    cameraWaypoints,
    6500
  );

  return;
}




// This determines the camera transitions for all the routes and route points
  await easeCamera({
    center: destination.center,
    zoom: destination.zoom,
    pitch: destination.pitch,
    bearing: destination.bearing,
    duration: travel.duration1 + travel.duration2,
    easing: (t) =>
      t * t * t * (t * (t * 6 - 15) + 10)
  });

}


// ============================================================
// ENTER STATE STORY
// ============================================================

async function enterStateCaseStudy(caseStudy) {

  if (
    cameraAnimating
    ||
    !storyReady
  ) {

    return;

  }


  cameraAnimating =
    true;

  selectedOverviewState = null;

  const storyConfig =
    STORY_REGISTRY[caseStudy.storyId || caseStudy.id]
    || STORY_REGISTRY.himachal;

  STORY = storyConfig.chapters;
  activeDialogues = storyConfig.dialogues;
  activeStoryId = storyConfig.id;
  updateProgressStopsForStory();


  disableMapInteraction();


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

    flockProgress = 0;
    updateFlockPosition(0);


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


    enableMapInteraction();

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


  disableMapInteraction();


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

    STORY = HIMACHAL_STORY;
    activeDialogues = HIMACHAL_DIALOGUES;
    activeStoryId = 'himachal';
    updateProgressStopsForStory();

    flockProgress = 0;
    updateFlockPosition(0);


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


    enableMapInteraction();

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


  disableMapInteraction();


  storyPanel.classList.add(
    'travelling'
  );


  scrollHint.textContent =
    'Following the journey…';

  const transitionDuration =
    previousIndex === 0
    || destinationIndex === 0
      ? 3300
      : destination.id === 'full-route'
        ? 3000
        : (() => {
            const travel = getTravelCamera(
              previousIndex,
              destinationIndex
            );

            return travel.duration1 + travel.duration2;
          })();

  if (
    flockMarker
  ) {

    flockMarker.getElement().style.display = activeStoryId === 'himachal'
      && destinationIndex >= 1
      ? 'block'
      : 'none';

  }

  if (
    activeStoryId === 'himachal'
    && destinationIndex >= 1
  ) {

    [
      'route-points',
      'route-labels',
      'ispur-darcha-route-points',
      'ispur-darcha-route-labels',
      'individual-ladakh-points',
      'individual-ladakh-labels',
      'migration-route-casing',
      'migration-route-base',
      'migration-route',
      'migration-route-highlight',
      'ispur-darcha-route-casing',
      'ispur-darcha-route',
      'shearing-location',
      'kugti-sanctuary-fill',
      'kugti-sanctuary-outline'
    ].forEach(
      (layerId) => {

        if (
          map.getLayer(layerId)
        ) {

          map.setLayoutProperty(
            layerId,
            'visibility',
            'visible'
          );

        }

      }
    );
const isAutumnReturn =
  destination.migrationPhase === 'autumn-return';

const targetProgress =
  getStoryRouteProgress(destination);

if (Number.isFinite(targetProgress)) {
  const isInitialBharmour =
  destination.id === 'bharmour' &&
  previousIndex === 0;

  if (isInitialBharmour) {

  updateRouteProgress(
    targetProgress,
    {
      duration: 0,
      migrationPhase: 'summer'
    }
  );

} else {

  updateRouteProgress(
    targetProgress,
    {
      duration: transitionDuration,
      migrationPhase: isAutumnReturn
        ? 'autumn-return'
        : 'summer'
    }
  );

}

} else {

  console.warn(
    'Skipping invalid route progress for:',
    destination.id
  );

}

  }
  else {

    updateRouteProgress(
      0,
      {
        duration: transitionDuration
      }
    );

  }


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


    enableMapInteraction();


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


      try {
        const himachalBoundaryResponse = await fetch(
          HIMACHAL_BOUNDARY_URL
        );

        if (!himachalBoundaryResponse.ok) {
          throw new Error(
            `Could not load Himachal boundary: ${himachalBoundaryResponse.status}`
          );
        }

        const himachalBoundaryGeoJSON =
          await himachalBoundaryResponse.json();

        map.addSource(
          'himachal-boundary',
          {
            type: 'geojson',
            data: himachalBoundaryGeoJSON
          }
        );

        map.addLayer({
          id: 'himachal-boundary-fill',
          type: 'fill',
          source: 'himachal-boundary',
          layout: {
            visibility: 'none'
          },
          paint: {
            'fill-color': '#8fa66f',
            'fill-opacity': 0.06
          }
        });

        map.addLayer({
          id: 'himachal-boundary-outline',
          type: 'line',
          source: 'himachal-boundary',
          layout: {
            visibility: 'none',
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#b7c995',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              1.2,
              8,
              2,
              12,
              3
            ],
            'line-opacity': 0.78
          }
        });
      }
      catch (error) {
        console.warn(
          'Himachal boundary unavailable:',
          error
        );
      }


      try {
        const [ladakhResponse, arunachalResponse] =
          await Promise.all([
            fetch(LADAKH_BOUNDARY_URL),
            fetch(ARUNACHAL_BOUNDARY_URL)
          ]);

        if (!ladakhResponse.ok || !arunachalResponse.ok) {
          throw new Error('Could not load Ladakh or Arunachal boundary.');
        }

        const [ladakhBoundaryGeoJSON, arunachalBoundaryGeoJSON] =
          await Promise.all([
            ladakhResponse.json(),
            arunachalResponse.json()
          ]);

        [
          {
            id: 'ladakh',
            data: ladakhBoundaryGeoJSON,
            fillColor: '#8fa66f',
            color: '#b7c995'
          },
          {
            id: 'arunachal',
            data: arunachalBoundaryGeoJSON,
            fillColor: '#7fa89a',
            color: '#7fa89a'
          }
        ].forEach((boundary) => {
          map.addSource(
            `${boundary.id}-boundary`,
            {
              type: 'geojson',
              data: boundary.data
            }
          );

          map.addLayer({
            id: `${boundary.id}-boundary-fill`,
            type: 'fill',
            source: `${boundary.id}-boundary`,
            layout: {
              visibility: 'none'
            },
            paint: {
              'fill-color': boundary.fillColor,
              'fill-opacity': 0.045
            }
          });

          map.addLayer({
            id: `${boundary.id}-boundary-outline`,
            type: 'line',
            source: `${boundary.id}-boundary`,
            layout: {
              visibility: 'none',
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': boundary.color,
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                3,
                1.1,
                6,
                1.8,
                10,
                2.8
              ],
              'line-opacity': 0.82
            }
          });
        });
      }
      catch (error) {
        console.warn(
          'Ladakh or Arunachal boundary unavailable:',
          error
        );
      }


      const routeResponse =
        await fetch(
          ISPUR_DARCHA_ROUTE_URL
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

      prepareRouteCoordinates(
        routeGeoJSON
      );


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


      const flockElement = document.createElement('div');

      flockElement.className = 'flock-marker';
      flockElement.setAttribute('role', 'img');
      flockElement.setAttribute(
        'aria-label',
        'The moving flock on the Gaddi migration route'
      );
      flockElement.innerHTML = `
        <span class="flock-sheep flock-sheep-back" aria-hidden="true"></span>
        <span class="flock-sheep flock-sheep-middle" aria-hidden="true"></span>
        <span class="flock-sheep flock-sheep-front" aria-hidden="true"></span>
      `;

      flockMarker = new maplibregl.Marker({
        element: flockElement,
        anchor: 'center'
      })
        .setLngLat(
          getRouteCoordinate(0)
          || STORY[1].center
        )
        .addTo(map);

      flockMarker.getElement().style.display = 'none';


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
      // ISPUR-DARCHA ROUTE (SUPPLEMENTAL)
      // ======================================================

      try {
        const ispurDarchaResponse = await fetch(
          ISPUR_DARCHA_ROUTE_URL
        );

        if (!ispurDarchaResponse.ok) {
          throw new Error(
            `Could not load Ispur-Darcha route: ${ispurDarchaResponse.status}`
          );
        }

        const ispurDarchaGeoJSON =
          await ispurDarchaResponse.json();

        map.addSource(
          'ispur-darcha-route',
          {
            type: 'geojson',
            data: ispurDarchaGeoJSON
          }
        );

        map.addLayer({
          id: 'ispur-darcha-route-casing',
          type: 'line',
          source: 'ispur-darcha-route',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'none'
          },
          paint: {
            'line-color': 'rgba(28, 22, 16, 0.68)',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              2.2,
              11,
              4,
              14,
              6.2
            ],
            'line-opacity': 0.75
          }
        });

        map.addLayer({
          id: 'ispur-darcha-route',
          type: 'line',
          source: 'ispur-darcha-route',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
            visibility: 'none'
          },
          paint: {
            'line-color': '#8fa66f',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              1.3,
              11,
              2.5,
              14,
              4
            ],
            'line-opacity': 0.92
          }
        });
      }
      catch (error) {
        console.warn(
          'Supplemental Ispur-Darcha route unavailable:',
          error
        );
      }


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
      // ROUTE HIGHLIGHT
      // ======================================================

      map.addLayer({

        id:
          'migration-route-highlight',

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
            0.7,

            11,
            1.1,

            14,
            1.7

          ],

          'line-opacity':
            0.9,

          'line-gradient': [

            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'rgba(255, 238, 181, 0)',
            1,
            'rgba(255, 238, 181, 0)'

          ]

        }

      });


      // ======================================================
      // POINTS
      // ======================================================

      const riversResponse =
        await fetch(
          RIVERS_URL
        );

      if (
        !riversResponse.ok
      ) {

        throw new Error(
          `Could not load rivers: ${riversResponse.status}`
        );

      }

      const riversGeoJSON =
        await riversResponse.json();

      const tandiRivers = {
        type:
          'FeatureCollection',
        features:
          riversGeoJSON.features
            .filter(
              (feature) =>
                coordinatesTouchBounds(
                  feature.geometry.coordinates,
                  TANDI_RIVER_BOUNDS
                )
            )
            .map(
              (feature) => ({
                ...feature,
                geometry: {
                  ...feature.geometry,
                  coordinates:
                    stripRiverElevation(
                      feature.geometry.coordinates
                    )
                }
              })
            )
      };

      map.addSource(
        'tandi-rivers',
        {
          type:
            'geojson',
          data:
            tandiRivers,
          lineMetrics:
            true
        }
      );

      map.addLayer({

        id:
          'tandi-river-shadow',

        type:
          'line',

        source:
          'tandi-rivers',

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
            'rgba(20, 53, 66, 0.72)',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            4,
            13,
            10,
            16,
            18
          ],
          'line-opacity':
            0.9,
          'line-opacity-transition': {
            duration:
              850
          }
        }

      });

      map.addLayer({

        id:
          'tandi-river-water',

        type:
          'line',

        source:
          'tandi-rivers',

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
            '#3d9bb2',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            2,
            13,
            6,
            16,
            12
          ],
          'line-opacity':
            0.88,
          'line-opacity-transition': {
            duration:
              850
          }
        }

      });

      map.addLayer({

        id:
          'tandi-river-flow',

        type:
          'line',

        source:
          'tandi-rivers',

        layout: {
          visibility:
            'none',
          'line-cap':
            'round',
          'line-join':
            'round'
        },

        paint: {
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            0.7,
            13,
            1.5,
            16,
            3
          ],
          'line-opacity':
            0.9,
          'line-opacity-transition': {
            duration:
              850
          },
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'rgba(195, 245, 251, 0.1)',
            1,
            'rgba(195, 245, 251, 0.1)'
          ]
        }

      });

      const animateRiverFlow =
        (now) => {

          if (
            map.getLayer(
              'tandi-river-flow'
            )
          ) {

            const phase =
              (now % 2200)
              / 2200
              * 0.78;

            map.setPaintProperty(
              'tandi-river-flow',
              'line-gradient',
              [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                'rgba(195, 245, 251, 0.08)',
                phase,
                'rgba(195, 245, 251, 0.08)',
                phase + 0.08,
                'rgba(225, 255, 255, 0.88)',
                phase + 0.16,
                'rgba(195, 245, 251, 0.08)',
                1,
                'rgba(195, 245, 251, 0.08)'
              ]
            );

          }

          riverAnimationFrame =
            requestAnimationFrame(
              animateRiverFlow
            );

        };

      riverAnimationFrame =
        requestAnimationFrame(
          animateRiverFlow
        );

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
      // SHEARING LOCATION
      // ======================================================

      const shearingResponse =
        await fetch(
          SHEARING_URL
        );

      if (
        !shearingResponse.ok
      ) {

        throw new Error(
          `Could not load shearing locations: ${shearingResponse.status}`
        );

      }

      const shearingGeoJSON =
        await shearingResponse.json();

      shearingGeoJSON.features =
        shearingGeoJSON.features
          .filter(
            (feature) =>
              feature.properties?.Name ===
              'Bharmour'
          )
          .map(
            (feature) => ({
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates:
                  utm43ToWgs84(
                    feature.geometry.coordinates[0],
                    feature.geometry.coordinates[1]
                  )
              }
            })
          );

      map.addSource(
        'shearing-sites',
        {
          type:
            'geojson',
          data:
            shearingGeoJSON
        }
      );

      map.addLayer({

        id:
          'shearing-location',

        type:
          'symbol',

        source:
          'shearing-sites',

        layout: {

          visibility:
            'none',

          'text-field':
            '✂  Shearing',

          'text-size':
            14,

          'text-offset': [
            2.2,
            0
          ],

          'text-anchor':
            'left',

          'text-allow-overlap':
            true,

          'text-ignore-placement':
            true

        },

        paint: {

          'text-color':
            '#f0b86b',

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
      // ISPUR-DARCHA ROUTE POINTS (SUPPLEMENTAL)
      // ======================================================

      try {
        const ispurDarchaPointsResponse = await fetch(
          ISPUR_DARCHA_POINTS_URL
        );

        if (!ispurDarchaPointsResponse.ok) {
          throw new Error(
            `Could not load Ispur-Darcha route points: ${ispurDarchaPointsResponse.status}`
          );
        }

        const ispurDarchaPointsGeoJSON =
          await ispurDarchaPointsResponse.json();

        map.addSource(
          'ispur-darcha-route-points',
          {
            type: 'geojson',
            data: ispurDarchaPointsGeoJSON
          }
        );

        map.addLayer({
          id: 'ispur-darcha-route-points',
          type: 'circle',
          source: 'ispur-darcha-route-points',
          layout: {
            visibility: 'none'
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              3.5,
              11,
              5,
              14,
              7
            ],
            'circle-color': '#9ab88b',
            'circle-stroke-color': 'rgba(20, 17, 13, 0.92)',
            'circle-stroke-width': 1.5,
            'circle-opacity': 0.92
          }
        });

        map.addLayer({
          id: 'ispur-darcha-route-labels',
          type: 'symbol',
          source: 'ispur-darcha-route-points',
          layout: {
            visibility: 'none',
            'text-field': [
              'coalesce',
              ['get', 'Local Na_1'],
              ['get', 'Name'],
              'Route point'
            ],
            'text-size': 11,
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
            'text-allow-overlap': false
          },
          paint: {
            'text-color': '#dce8c9',
            'text-halo-color': 'rgba(15, 15, 12, 0.92)',
            'text-halo-width': 1.5
          }
        });
      }
      catch (error) {
        console.warn(
          'Supplemental Ispur-Darcha route points unavailable:',
          error
        );
      }


      // ======================================================
      // INDIVIDUAL LADAKH ROUTE POINTS
      // ======================================================

      try {
        const individualLadakhResponse = await fetch(
          INDIVIDUAL_LADAKH_POINTS_URL
        );

        if (!individualLadakhResponse.ok) {
          throw new Error(
            `Could not load individual Ladakh route: ${individualLadakhResponse.status}`
          );
        }

        const individualLadakhGeoJSON =
          await individualLadakhResponse.json();

        map.addSource(
          'individual-ladakh-route',
          {
            type: 'geojson',
            data: individualLadakhGeoJSON
          }
        );

        map.addLayer({
          id: 'individual-ladakh-points',
          type: 'circle',
          source: 'individual-ladakh-route',
          layout: {
            visibility: 'none'
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              4,
              11,
              5.5,
              14,
              7
            ],
            'circle-color': '#c58a62',
            'circle-stroke-color': 'rgba(20, 17, 13, 0.92)',
            'circle-stroke-width': 1.5,
            'circle-opacity': 0.94
          }
        });

        map.addLayer({
          id: 'individual-ladakh-labels',
          type: 'symbol',
          source: 'individual-ladakh-route',
          layout: {
            visibility: 'none',
            'text-field': [
              'coalesce',
              ['get', 'Local Name'],
              ['get', 'Point No.'],
              'Ladakh route point'
            ],
            'text-size': 11,
            'text-offset': [0, 1.25],
            'text-anchor': 'top',
            'text-allow-overlap': false
          },
          paint: {
            'text-color': '#f0d0b5',
            'text-halo-color': 'rgba(15, 15, 12, 0.92)',
            'text-halo-width': 1.5
          }
        });
      }
      catch (error) {
        console.warn(
          'Individual Ladakh route unavailable:',
          error
        );
      }


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
