// ============================================================
// PASTORALISM ATLAS
//
// INDIA SATELLITE OVERVIEW
//          ↓
//   HIMACHAL PRADESH
//          ↓
//      BHARMOUR
//          ↓
//       KUGTI
//          ↓
//       TANDI
//          ↓
//      DARCHA
//          ↓
//   FULL ROUTE REVEAL
//
// MapLibre = national atlas/navigation
// Three.js   = immersive case-study landscape
// ============================================================


import * as THREE from 'three';

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  fromUrl
} from 'geotiff';

import gsap from 'gsap';

import * as maplibregl from 'maplibre-gl';



import 'maplibre-gl/dist/maplibre-gl.css';

import './style.css';


// ============================================================
// DATA
// ============================================================

const DEM_URL =
  '/data/states/himachal/geospatial/terrain/Bharmour_Darcha_DEM_Web.tif';

const ROUTE_URL =
  '/data/states/himachal/geospatial/routes/Bharmour_Darcha_UTM43N.geojson';

const ROUTE_POINTS_URL =
  '/data/states/himachal/geospatial/points/Bharmour_Darcha_RP.geojson';


// ============================================================
// TERRAIN SETTINGS
// ============================================================

const SAMPLE_STEP = 3;

const TERRAIN_WIDTH = 300;

const VERTICAL_SCALE = 0.0045;

const ROUTE_HEIGHT_OFFSET = 0.35;


// ============================================================
// ROUTE POINT NAMES
//
// Feature order in Bharmour_Darcha_RP.geojson
// ============================================================

const ROUTE_POINT_NAMES = [
  'Kugti',
  'Hadsar',
  'Bharmour',
  'Darcha',
  'Tandi'
];


// ============================================================
// STORY CAMERA COMPOSITIONS
// ============================================================

const STORY_STOPS = [

  {

    name: 'Bharmour',

    position:
      new THREE.Vector3(
        -131.888,
        11.072,
        42.539
      ),

    target:
      new THREE.Vector3(
        -12.863,
        -15.728,
        62.248
      )

  },


  {

    name: 'Kugti',

    position:
      new THREE.Vector3(
        -80.222,
        17.940,
        41.806
      ),

    target:
      new THREE.Vector3(
        -9.383,
        1.164,
        31.104
      )

  },


  {

    name: 'Tandi',

    position:
      new THREE.Vector3(
        35.429,
        56.626,
        33.977
      ),

    target:
      new THREE.Vector3(
        35.972,
        16.003,
        5.420
      )

  },


  {

    name: 'Darcha',

    position:
      new THREE.Vector3(
        130.086,
        56.873,
        -20.585
      ),

    target:
      new THREE.Vector3(
        120.601,
        31.366,
        -32.969
      )

  },


  {

    name: 'Full Route',

    position:
      new THREE.Vector3(
        94.323,
        157.254,
        100.257
      ),

    target:
      new THREE.Vector3(
        8.046,
        4.653,
        -13.445
      )

  }

];


// ============================================================
// DOM
// ============================================================

const app =
  document.querySelector(
    '#app'
  );

const indiaMapElement =
  document.querySelector(
    '#india-map'
  );

const transitionVeil =
  document.querySelector(
    '#transition-veil'
  );


// ============================================================
// THREE.JS SCENE
// ============================================================

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0xb8c5c3
  );


scene.fog =
  new THREE.Fog(
    0xb8c5c3,
    180,
    450
  );


// ============================================================
// CAMERA
// ============================================================

const camera =
  new THREE.PerspectiveCamera(

    48,

    window.innerWidth /
      window.innerHeight,

    0.1,

    2000

  );


camera.position.set(
  0,
  120,
  190
);


// ============================================================
// THREE RENDERER
// ============================================================

const renderer =
  new THREE.WebGLRenderer({

    antialias: true

  });


renderer.setSize(

  window.innerWidth,

  window.innerHeight

);


renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio,
    2
  )

);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


app.appendChild(
  renderer.domElement
);


// ============================================================
// ORBIT CONTROLS
// ============================================================

const controls =
  new OrbitControls(

    camera,

    renderer.domElement

  );


controls.enableDamping = true;

controls.dampingFactor = 0.05;

controls.minDistance = 0.2;

controls.maxDistance = 1000;

controls.zoomToCursor = true;


controls.target.set(
  0,
  15,
  0
);


// Locked until we enter HP.

controls.enabled = false;


// ============================================================
// LIGHTING
// ============================================================

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    1.4
  );


scene.add(
  ambientLight
);


const sun =
  new THREE.DirectionalLight(
    0xffffff,
    2.4
  );


sun.position.set(
  -100,
  160,
  80
);


scene.add(
  sun
);


// ============================================================
// STORY STATE
// ============================================================

let terrainReady = false;

let storyStarted = false;

let cameraAnimating = false;

let currentStoryIndex = 0;

let scrollLocked = false;


// ============================================================
// STORY UI
// ============================================================

const chapterLabel =
  document.createElement(
    'div'
  );


chapterLabel.className =
  'story-chapter';


document.body.appendChild(
  chapterLabel
);


const exploreHint =
  document.createElement(
    'div'
  );


exploreHint.className =
  'explore-hint';


exploreHint.innerHTML =
  'Drag to explore &nbsp; • &nbsp; Scroll to continue';


document.body.appendChild(
  exploreHint
);


// ============================================================
// BACK BUTTON
// ============================================================

const backButton =
  document.createElement(
    'button'
  );


backButton.className =
  'back-to-india';


backButton.textContent =
  '← India';


document.body.appendChild(
  backButton
);


// ============================================================
// INDIA MAP TITLE
// ============================================================

const atlasTitle =
  document.createElement(
    'div'
  );


atlasTitle.className =
  'atlas-title';


atlasTitle.innerHTML = `

  <div class="atlas-eyebrow">
    Pastoralism Atlas
  </div>

  <div class="atlas-heading">
    Journeys through<br>
    India's herding landscapes
  </div>

  <div class="atlas-instruction">
    Select a landscape to explore
  </div>

`;


document.body.appendChild(
  atlasTitle
);


// ============================================================
// MAPLIBRE — INDIA SATELLITE OVERVIEW
//
// This follows the same approach as your earlier prototype:
// Esri World Imagery raster tiles.
// ============================================================

const indiaMap =
  new maplibregl.Map({

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

        }

      },


      layers: [

        {

          id:
            'satellite-layer',

          type:
            'raster',

          source:
            'satellite'

        }

      ]

    },


    // India overview.

    center:
      [78, 25],

    zoom:
      4.2,

    pitch:
      0,

    bearing:
      0

  });


// ============================================================
// MAPLIBRE CONTROLS
// ============================================================

indiaMap.addControl(

  new maplibregl.NavigationControl({

    showCompass: false

  }),

  'bottom-right'

);


// ============================================================
// HP CASE STUDY MARKER
// ============================================================

indiaMap.on(
  'load',

  () => {

    const markerElement =
      document.createElement(
        'div'
      );


    markerElement.className =
      'hp-marker';


    markerElement.innerHTML = `

      <div class="hp-label">

        <strong>
          Himachal Pradesh
        </strong>

        <span>
          Gaddi migration
        </span>

      </div>

    `;


    markerElement.title =
      'Explore the Gaddi migration';


    markerElement.addEventListener(

      'click',

      event => {

        event.stopPropagation();

        enterGaddiStory();

      }

    );


    // --------------------------------------------------------
    // Marker location
    //
    // We place the case-study marker at Bharmour rather
    // than at the centre of Himachal Pradesh.
    //
    // Bharmour:
    // 76.53262 E
    // 32.44447 N
    // --------------------------------------------------------

    new maplibregl.Marker({

      element:
        markerElement,

      anchor:
        'center'

    })

      .setLngLat([
        76.53262,
        32.44447
      ])

      .addTo(
        indiaMap
      );

  }
);


// ============================================================
// CINEMATIC TRANSITION
// ============================================================

function fadeToBlack(
  onBlack
) {

  transitionVeil.style
    .pointerEvents =
      'auto';


  gsap.to(

    transitionVeil,

    {

      opacity:
        1,

      duration:
        0.65,

      ease:
        'power2.inOut',


      onComplete: () => {

        if (
          onBlack
        ) {

          onBlack();

        }


        gsap.to(

          transitionVeil,

          {

            opacity:
              0,

            duration:
              1.1,

            ease:
              'power2.inOut',


            onComplete: () => {

              transitionVeil.style
                .pointerEvents =
                  'none';

            }

          }

        );

      }

    }

  );

}


// ============================================================
// ENTER GADDI STORY
// ============================================================

function enterGaddiStory() {

  if (
    storyStarted
  ) {

    return;

  }


  if (
    !terrainReady
  ) {

    console.log(
      'Terrain is still loading...'
    );

    return;

  }


  fadeToBlack(

    () => {

      storyStarted = true;

      currentStoryIndex = 0;


      // Hide MapLibre.

      indiaMapElement
        .classList
        .add(
          'hidden'
        );


      atlasTitle.style
        .display =
          'none';


      // ------------------------------------------------------
      // Start directly at Bharmour.
      // ------------------------------------------------------

      const bharmour =
        STORY_STOPS[0];


      camera.position.copy(
        bharmour.position
      );


      controls.target.copy(
        bharmour.target
      );


      camera.lookAt(
        bharmour.target
      );


      arriveAtStoryStop();


      backButton.classList.add(
        'visible'
      );

    }

  );

}


// ============================================================
// RETURN TO INDIA
// ============================================================

function returnToIndia() {

  if (
    cameraAnimating
  ) {

    return;

  }


  fadeToBlack(

    () => {

      storyStarted = false;

      controls.enabled = false;


      chapterLabel.style.opacity =
        '0';


      exploreHint.style.opacity =
        '0';


      backButton.classList.remove(
        'visible'
      );


      indiaMapElement
        .classList
        .remove(
          'hidden'
        );


      atlasTitle.style.display =
        'block';


      // ------------------------------------------------------
      // Reset India map.
      // ------------------------------------------------------

      indiaMap.jumpTo({

        center:
          [78, 25],

        zoom:
          4.2,

        pitch:
          0,

        bearing:
          0

      });


      // MapLibre sometimes needs this after
      // being hidden.

      requestAnimationFrame(

        () => {

          indiaMap.resize();

        }

      );

    }

  );

}


backButton.addEventListener(

  'click',

  returnToIndia

);


// ============================================================
// STORY ARRIVAL
// ============================================================

function arriveAtStoryStop() {

  cameraAnimating = false;


  controls.enabled = true;


  controls.target.copy(

    STORY_STOPS[
      currentStoryIndex
    ].target

  );


  controls.update();


  chapterLabel.textContent =

    STORY_STOPS[
      currentStoryIndex
    ].name;


  chapterLabel.style.opacity =
    '1';


  exploreHint.style.opacity =
    '1';

}


// ============================================================
// QUADRATIC BÉZIER
// ============================================================

function quadraticBezier(

  start,

  control,

  end,

  t

) {

  const oneMinusT =
    1 - t;


  const point =
    new THREE.Vector3();


  point

    .addScaledVector(

      start,

      oneMinusT *
      oneMinusT

    )

    .addScaledVector(

      control,

      2 *
      oneMinusT *
      t

    )

    .addScaledVector(

      end,

      t * t

    );


  return point;

}


// ============================================================
// FLY TO STORY STOP
// ============================================================

function flyToStoryStop(

  destinationIndex

) {

  if (
    cameraAnimating
  ) {

    return;

  }


  if (

    destinationIndex < 0 ||

    destinationIndex >=
      STORY_STOPS.length

  ) {

    return;

  }


  cameraAnimating = true;


  controls.enabled = false;


  exploreHint.style.opacity =
    '0';


  // ==========================================================
  // IMPORTANT:
  //
  // The flight starts wherever the visitor currently is.
  //
  // Therefore they can explore freely at a story location
  // without breaking the journey.
  // ==========================================================

  const startPosition =
    camera.position.clone();


  const startTarget =
    controls.target.clone();


  const destination =

    STORY_STOPS[
      destinationIndex
    ];


  const endPosition =
    destination.position.clone();


  const endTarget =
    destination.target.clone();


  // ==========================================================
  // CAMERA FLIGHT CONTROL POINT
  // ==========================================================

  const flightControl =

    startPosition
      .clone()
      .lerp(
        endPosition,
        0.5
      );


  let flightLift = 18;


  // ----------------------------------------------------------
  // Darcha → Full Route
  //
  // Much stronger rise because this is the final geographic
  // reveal.
  // ----------------------------------------------------------

  if (
    destination.name ===
    'Full Route'
  ) {

    flightLift = 48;

  }


  flightControl.y +=
    flightLift;


  // ==========================================================
  // ANIMATION
  // ==========================================================

  const animation = {

    progress: 0

  };


  const duration =

    destination.name ===
      'Full Route'

      ? 4.5

      : 3.5;


  gsap.to(

    animation,

    {

      progress:
        1,

      duration,

      ease:
        'power2.inOut',


      onUpdate: () => {

        const t =
          animation.progress;


        // ----------------------------------------------------
        // POSITION
        // ----------------------------------------------------

        const position =

          quadraticBezier(

            startPosition,

            flightControl,

            endPosition,

            t

          );


        camera.position.copy(
          position
        );


        // ----------------------------------------------------
        // VIEW DIRECTION
        //
        // Keep the original interpolation approach.
        //
        // We deliberately do NOT use the experimental
        // early-turn system from the previous test.
        // ----------------------------------------------------

        const lookTarget =

          startTarget
            .clone()
            .lerp(
              endTarget,
              t
            );


        camera.lookAt(
          lookTarget
        );

      },


      onComplete: () => {

        currentStoryIndex =
          destinationIndex;


        // Guarantee exact final composition.

        camera.position.copy(
          destination.position
        );


        controls.target.copy(
          destination.target
        );


        camera.lookAt(
          destination.target
        );


        arriveAtStoryStop();

      }

    }

  );

}


// ============================================================
// STORY SCROLL
//
// Scroll = move one chapter.
//
// Once we arrive, OrbitControls unlock again.
// ============================================================

window.addEventListener(

  'wheel',

  event => {

    if (
      !storyStarted
    ) {

      return;

    }


    if (
      cameraAnimating
    ) {

      return;

    }


    if (
      scrollLocked
    ) {

      return;

    }


    // Ignore tiny trackpad movements.

    if (
      Math.abs(
        event.deltaY
      ) < 8
    ) {

      return;

    }


    scrollLocked = true;


    setTimeout(

      () => {

        scrollLocked = false;

      },

      700

    );


    // --------------------------------------------------------
    // FORWARD
    // --------------------------------------------------------

    if (
      event.deltaY > 0
    ) {

      const next =
        currentStoryIndex + 1;


      if (
        next <
        STORY_STOPS.length
      ) {

        flyToStoryStop(
          next
        );

      }

    }


    // --------------------------------------------------------
    // BACKWARD
    // --------------------------------------------------------

    else {

      const previous =
        currentStoryIndex - 1;


      if (
        previous >= 0
      ) {

        flyToStoryStop(
          previous
        );

      }

    }

  },

  {

    passive:
      true

  }

);


// ============================================================
// TEXT SPRITE
// ============================================================

function createTextSprite(
  text
) {

  const canvas =
    document.createElement(
      'canvas'
    );


  canvas.width =
    512;


  canvas.height =
    128;


  const context =
    canvas.getContext(
      '2d'
    );


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Background.

  context.fillStyle =
    'rgba(15,20,18,0.82)';


  context.beginPath();


  context.roundRect(
    8,
    8,
    496,
    112,
    24
  );


  context.fill();


  // Text.

  context.fillStyle =
    '#ffffff';


  context.font =
    'bold 42px Arial';


  context.textAlign =
    'center';


  context.textBaseline =
    'middle';


  context.fillText(
    text,
    256,
    64
  );


  const texture =
    new THREE.CanvasTexture(
      canvas
    );


  texture.colorSpace =
    THREE.SRGBColorSpace;


  const material =
    new THREE.SpriteMaterial({

      map:
        texture,

      transparent:
        true,

      depthTest:
        false

    });


  const sprite =
    new THREE.Sprite(
      material
    );


  sprite.scale.set(
    18,
    4.5,
    1
  );


  return sprite;

}


// ============================================================
// CREATE LANDSCAPE
// ============================================================

async function createLandscape() {

  // ==========================================================
  // LOAD DEM
  // ==========================================================

  const tiff =
    await fromUrl(
      DEM_URL
    );


  const image =
    await tiff.getImage();


  const width =
    image.getWidth();


  const height =
    image.getHeight();


  const bbox =
    image.getBoundingBox();


  const [

    minX,
    minY,
    maxX,
    maxY

  ] =
    bbox;


  const noData =
    image.getGDALNoData();


  const raster =
    await image.readRasters({

      interleave:
        true

    });


  // ==========================================================
  // ELEVATION RANGE
  // ==========================================================

  let minElevation =
    Infinity;


  let maxElevation =
    -Infinity;


  for (
    let i = 0;
    i < raster.length;
    i++
  ) {

    const value =
      raster[i];


    if (
      !Number.isFinite(
        value
      )
    ) {

      continue;

    }


    if (

      noData !== null &&

      value ===
        noData

    ) {

      continue;

    }


    minElevation =
      Math.min(

        minElevation,

        value

      );


    maxElevation =
      Math.max(

        maxElevation,

        value

      );

  }


  console.log(

    'Elevation:',

    minElevation,

    '→',

    maxElevation

  );


  // ==========================================================
  // TERRAIN DIMENSIONS
  // ==========================================================

  const gisWidth =
    maxX - minX;


  const gisHeight =
    maxY - minY;


  const terrainWidth =
    TERRAIN_WIDTH;


  const terrainHeight =

    TERRAIN_WIDTH *

    (
      gisHeight /
      gisWidth
    );


  // ==========================================================
  // GIS → THREE.JS
  //
  // Easting  → X
  // Northing → Z
  // Elevation → Y
  // ==========================================================

  function utmToThreeX(
    easting
  ) {

    return (

      (
        (
          easting -
          minX
        ) /
        gisWidth
      )

      - 0.5

    ) *

    terrainWidth;

  }


  function utmToThreeZ(
    northing
  ) {

    return (

      0.5 -

      (
        (
          northing -
          minY
        ) /
        gisHeight
      )

    ) *

    terrainHeight;

  }


  // ==========================================================
  // SAMPLE DEM ELEVATION
  // ==========================================================

  function sampleElevation(

    easting,

    northing

  ) {

    const px =

      (
        (
          easting -
          minX
        ) /
        gisWidth
      )

      *

      (
        width - 1
      );


    const py =

      (
        (
          maxY -
          northing
        ) /
        gisHeight
      )

      *

      (
        height - 1
      );


    const x0 =
      Math.floor(
        px
      );


    const y0 =
      Math.floor(
        py
      );


    const x1 =
      Math.min(

        x0 + 1,

        width - 1

      );


    const y1 =
      Math.min(

        y0 + 1,

        height - 1

      );


    if (

      x0 < 0 ||

      y0 < 0 ||

      x0 >= width ||

      y0 >= height

    ) {

      return null;

    }


    const q11 =
      raster[
        y0 *
        width +
        x0
      ];


    const q21 =
      raster[
        y0 *
        width +
        x1
      ];


    const q12 =
      raster[
        y1 *
        width +
        x0
      ];


    const q22 =
      raster[
        y1 *
        width +
        x1
      ];


    const values = [

      q11,
      q21,
      q12,
      q22

    ];


    for (
      const value of values
    ) {

      if (
        !Number.isFinite(
          value
        )
      ) {

        return null;

      }


      if (

        noData !== null &&

        value ===
          noData

      ) {

        return null;

      }

    }


    const tx =
      px - x0;


    const ty =
      py - y0;


    const top =
      THREE.MathUtils.lerp(

        q11,

        q21,

        tx

      );


    const bottom =
      THREE.MathUtils.lerp(

        q12,

        q22,

        tx

      );


    return THREE.MathUtils.lerp(

      top,

      bottom,

      ty

    );

  }


  // ==========================================================
  // BUILD TERRAIN
  // ==========================================================

  const sampleWidth =

    Math.floor(

      (
        width - 1
      ) /

      SAMPLE_STEP

    )

    + 1;


  const sampleHeight =

    Math.floor(

      (
        height - 1
      ) /

      SAMPLE_STEP

    )

    + 1;


  const positions = [];

  const valid = [];


  for (
    let sy = 0;
    sy < sampleHeight;
    sy++
  ) {

    const sourceY =

      Math.min(

        sy *
        SAMPLE_STEP,

        height - 1

      );


    for (
      let sx = 0;
      sx < sampleWidth;
      sx++
    ) {

      const sourceX =

        Math.min(

          sx *
          SAMPLE_STEP,

          width - 1

        );


      const elevation =

        raster[

          sourceY *
          width +
          sourceX

        ];


      const isValid =

        Number.isFinite(
          elevation
        )

        &&

        !(
          noData !== null &&
          elevation ===
            noData
        );


      valid.push(
        isValid
      );


      const x =

        (
          sourceX /
          (
            width - 1
          )

          - 0.5
        )

        *

        terrainWidth;


      const z =

        (
          sourceY /
          (
            height - 1
          )

          - 0.5
        )

        *

        terrainHeight;


      const y =

        isValid

        ? (

            elevation -
            minElevation

          )

          *

          VERTICAL_SCALE

        : 0;


      positions.push(
        x,
        y,
        z
      );

    }

  }


  // ==========================================================
  // TRIANGLES
  // ==========================================================

  const indices = [];


  for (
    let y = 0;
    y < sampleHeight - 1;
    y++
  ) {

    for (
      let x = 0;
      x < sampleWidth - 1;
      x++
    ) {

      const a =
        y *
        sampleWidth +
        x;


      const b =
        a + 1;


      const c =
        a +
        sampleWidth;


      const d =
        c + 1;


      if (
        valid[a] &&
        valid[c] &&
        valid[b]
      ) {

        indices.push(
          a,
          c,
          b
        );

      }


      if (
        valid[b] &&
        valid[c] &&
        valid[d]
      ) {

        indices.push(
          b,
          c,
          d
        );

      }

    }

  }


  const terrainGeometry =
    new THREE.BufferGeometry();


  terrainGeometry.setAttribute(

    'position',

    new THREE.Float32BufferAttribute(

      positions,

      3

    )

  );


  terrainGeometry.setIndex(
    indices
  );


  terrainGeometry.computeVertexNormals();


  const terrainMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0xa6b394,

      roughness:
        0.95,

      metalness:
        0,

      side:
        THREE.DoubleSide

    });


  const terrain =
    new THREE.Mesh(

      terrainGeometry,

      terrainMaterial

    );


  scene.add(
    terrain
  );


  // ==========================================================
  // LOAD ROUTE
  // ==========================================================

  const routeResponse =
    await fetch(
      ROUTE_URL
    );


  const routeGeoJSON =
    await routeResponse.json();


  const routeLines = [];


  for (
    const feature of
    routeGeoJSON.features
  ) {

    if (
      feature.geometry.type ===
      'LineString'
    ) {

      routeLines.push(
        feature.geometry.coordinates
      );

    }


    else if (
      feature.geometry.type ===
      'MultiLineString'
    ) {

      routeLines.push(
        ...feature.geometry.coordinates
      );

    }

  }


  // ==========================================================
  // DRAW ROUTE
  // ==========================================================

  for (
    const lineCoordinates of
    routeLines
  ) {

    const routePoints = [];


    for (
      const coordinate of
      lineCoordinates
    ) {

      const [

        easting,

        northing

      ] =
        coordinate;


      const elevation =
        sampleElevation(

          easting,

          northing

        );


      if (
        elevation === null
      ) {

        continue;

      }


      routePoints.push(

        new THREE.Vector3(

          utmToThreeX(
            easting
          ),

          (
            elevation -
            minElevation
          )

          *

          VERTICAL_SCALE

          +

          ROUTE_HEIGHT_OFFSET,

          utmToThreeZ(
            northing
          )

        )

      );

    }


    if (
      routePoints.length < 2
    ) {

      continue;

    }


    const routeGeometry =

      new THREE.BufferGeometry()

        .setFromPoints(
          routePoints
        );


    const routeMaterial =
      new THREE.LineBasicMaterial({

        color:
          0xe8732a

      });


    const route =
      new THREE.Line(

        routeGeometry,

        routeMaterial

      );


    scene.add(
      route
    );

  }


  // ==========================================================
  // LOAD ROUTE LOCATIONS
  // ==========================================================

  const pointResponse =
    await fetch(
      ROUTE_POINTS_URL
    );


  const pointGeoJSON =
    await pointResponse.json();


  // ==========================================================
  // LOCATION MARKERS
  // ==========================================================

  pointGeoJSON.features.forEach(

    (
      feature,
      index
    ) => {

      const name =

        ROUTE_POINT_NAMES[
          index
        ]

        ||

        `Point ${index + 1}`;


      const [

        easting,

        northing

      ] =
        feature.geometry.coordinates;


      const elevation =
        sampleElevation(

          easting,

          northing

        );


      if (
        elevation === null
      ) {

        return;

      }


      const x =
        utmToThreeX(
          easting
        );


      const z =
        utmToThreeZ(
          northing
        );


      const y =

        (
          elevation -
          minElevation
        )

        *

        VERTICAL_SCALE;


      const markerGroup =
        new THREE.Group();


      markerGroup.position.set(
        x,
        y,
        z
      );


      // ------------------------------------------------------
      // STEM
      // ------------------------------------------------------

      const stem =
        new THREE.Mesh(

          new THREE.CylinderGeometry(

            0.08,
            0.08,
            4,
            8

          ),

          new THREE.MeshBasicMaterial({

            color:
              0xffffff

          })

        );


      stem.position.y =
        2;


      markerGroup.add(
        stem
      );


      // ------------------------------------------------------
      // YELLOW POINT
      // ------------------------------------------------------

      const sphere =
        new THREE.Mesh(

          new THREE.SphereGeometry(

            0.6,
            18,
            18

          ),

          new THREE.MeshBasicMaterial({

            color:
              0xffd34d

          })

        );


      sphere.position.y =
        4;


      markerGroup.add(
        sphere
      );


      // ------------------------------------------------------
      // LABEL
      // ------------------------------------------------------

      const label =
        createTextSprite(
          name
        );


      label.position.y =
        8;


      markerGroup.add(
        label
      );


      scene.add(
        markerGroup
      );

    }

  );


  // ==========================================================
  // READY
  // ==========================================================

  terrainReady = true;


  console.log(

    'Gaddi landscape ready.'

  );

}


// ============================================================
// RENDER LOOP
// ============================================================

function animate() {

  requestAnimationFrame(
    animate
  );


  if (
    controls.enabled
  ) {

    controls.update();

  }


  renderer.render(
    scene,
    camera
  );

}


animate();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(

  'resize',

  () => {

    camera.aspect =

      window.innerWidth /

      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(

      window.innerWidth,

      window.innerHeight

    );


    indiaMap.resize();

  }

);


// ============================================================
// INITIALISE THREE.JS LANDSCAPE
//
// It loads invisibly behind MapLibre so that when HP is
// clicked the terrain should already be ready.
// ============================================================

createLandscape()

  .catch(

    error => {

      console.error(

        'Landscape failed to load:',

        error

      );

    }

  );
