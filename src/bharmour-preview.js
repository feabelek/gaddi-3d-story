import * as THREE from 'three';

import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  fromUrl
} from 'geotiff';

import gsap from 'gsap';

import './bharmour-preview.css';


const canvas =
  document.querySelector(
    '#bharmour-preview-canvas'
  );


const statusElement =
  document.querySelector(
    '#preview-status'
  );


const terrainStatsElement =
  document.querySelector(
    '#preview-terrain-stats'
  );


const cameraPositionElement =
  document.querySelector(
    '#preview-camera-position'
  );


const wireframeInput =
  document.querySelector(
    '#preview-wireframe'
  );


const profileButton =
  document.querySelector(
    '#preview-profile'
  );


const scaleToggleButton =
  document.querySelector(
    '#preview-scale-toggle'
  );


const assetDiagnosticsElement =
  document.querySelector(
    '#preview-asset-diagnostics'
  );


const assetDebugButton =
  document.querySelector(
    '#preview-asset-debug'
  );


const viewpointTitleElement =
  document.querySelector(
    '#preview-viewpoint-title'
  );


const viewpointDescriptionElement =
  document.querySelector(
    '#preview-viewpoint-description'
  );


const previousButton =
  document.querySelector(
    '#preview-previous'
  );


const nextButton =
  document.querySelector(
    '#preview-next'
  );


const dotsElement =
  document.querySelector(
    '#preview-dots'
  );


const diagnosticsEnabled =
  new URLSearchParams(
    window.location.search
  ).has('diagnostics')
  || new URLSearchParams(
    window.location.search
  ).has('assetDebug');


const hybridRequested =
  new URLSearchParams(
    window.location.search
  ).has('hybrid');


let assetDebugMode =
  new URLSearchParams(
    window.location.search
  ).get('assetDebug') === 'flat'
    ? 'flat'
    : 'dem';


// UTM 43N coordinates from the existing Bharmour route-point dataset.
const STUDY_AREA = {
  minEasting: 640000,
  maxEasting: 656000,
  minNorthing: 3586000,
  maxNorthing: 3598000
};


const DEM_URL =
  '/data/states/himachal/geospatial/terrain/Bharmour_Darcha_DEM_Web.tif';


const VERTICAL_EXAGGERATION =
  1;


// Provisional presentation mask derived from the verified route corridor
// and anchor locations in EPSG:32643. It is not an administrative boundary.
const ORGANIC_BOUNDARY_UTM = [
  [641800, 3587500],
  [648000, 3586500],
  [654500, 3587000],
  [656000, 3590500],
  [655800, 3594000],
  [653000, 3596000],
  [647000, 3596500],
  [642000, 3595000],
  [640500, 3591500]
];


const TERRAIN_EDGE_DEPTH =
  260;


const ASSETS = [
  {
    id: 'oak-tree-1',
    title: 'Oak tree',
    source: '/models/trees/oak_tree.glb',
    upAxis: 'y',
    kind: 'oak',
    location: [
      644300,
      3590750
    ]
  },
  {
    id: 'oak-tree-2',
    title: 'Oak tree',
    source: '/models/trees/oak_tree.glb',
    upAxis: 'y',
    kind: 'oak',
    location: [
      643850,
      3590630
    ]
  },
  {
    id: 'sheep-1',
    title: 'Sheep',
    source: '/models/animals/sheep.glb',
    upAxis: 'y',
    kind: 'sheep',
    location: [
      644068,
      3590737
    ]
  },
  {
    id: 'sheep-2',
    title: 'Sheep',
    source: '/models/animals/sheep.glb',
    upAxis: 'y',
    kind: 'sheep',
    location: [
      644180,
      3590800
    ]
  },
  {
    id: 'sheep-3',
    title: 'Sheep',
    source: '/models/animals/sheep.glb',
    upAxis: 'y',
    kind: 'sheep',
    location: [
      643980,
      3590830
    ]
  }
];


const HYBRID_ACTIVITY = {
  center: [
    644088.350713,
    3590857.263543
  ],
  width: 180,
  depth: 140,
  columns: 72,
  rows: 56,
  renderLift: 0.08,
  reliefAmplitude: 0.8
};


const HYBRID_ASSET_LOCATIONS = {
  'sheep-1': [
    644070,
    3590849
  ],
  'oak-tree-1': [
    644114,
    3590875
  ]
};


const SCALE_PRESETS = {
  overview: {
    sheep: 0.35,
    pine: 1.8,
    oak: 0.22
  },
  realWorld: {
    sheep: 0.16,
    pine: 3.9,
    oak: 0.1674
  }
};


let scaleMode = 'overview';

const assetDebugRequested =
  new URLSearchParams(
    window.location.search
  ).has('assetDebug');


const originalBackground =
  new THREE.Color(0x8ba39f);


const ASSET_DEBUG_IDS = [
  'sheep-1',
  'oak-tree-1'
];


const FLAT_DEBUG_POSITIONS = {
  'sheep-1': [-3, 0],
  'oak-tree-1': [3, 0]
};


const ANCHORS = [
  {
    label: 'Bharmour',
    location: [
      644068.350713,
      3590737.263543
    ],
    color: 0xf2d18d
  },
  {
    label: 'Shearing location',
    location: [
      644013.364817,
      3590669.01338
    ],
    color: 0xe07c58
  }
];


const VIEWPOINTS = [
  {
    title: 'Bharmour Village',
    description:
      'A technical establishing view around the verified Bharmour route point.',
    position: [
      10500,
      7000,
      12000
    ],
    target: [
      0,
      1000,
      3000
    ]
  },
  {
    title: 'Preparing the Flock',
    description:
      'A closer technical view toward the existing route-point location.',
    position: [
      9000,
      3700,
      9500
    ],
    target: [
      -250,
      850,
      5350
    ]
  },
  {
    title: 'Shearing Context',
    description:
      'A provisional composition for future shearing-related interpretation.',
    position: [
      4000,
      1700,
      3900
    ],
    target: [
      -3987,
      565,
      4669
    ]
  },
  {
    title: 'Asset Close-up',
    description:
      'Illustrative sheep and tree cluster near the verified Bharmour route point.',
    position: [
      -3650,
      760,
      -900
    ],
    target: [
      -3932,
      570,
      -1263
    ]
  }
];


const HYBRID_VIEWPOINT = {
  title: 'Hybrid Pastoral Scene',
  description:
    'Illustrative pastoral activity area over the DEM-derived mountain context; local micro-relief is not surveyed topography.',
  position: [
    -3500,
    620,
    -600
  ],
  target: [
    -3912,
    135,
    -1143
  ]
};


if (hybridRequested) {
  VIEWPOINTS.push(HYBRID_VIEWPOINT);
}


const renderer =
  new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);


renderer.setSize(
  window.innerWidth,
  window.innerHeight,
  false
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.08;

renderer.shadowMap.enabled =
  true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;


const scene =
  new THREE.Scene();

const diagnosticGroup =
  new THREE.Group();

const assetGroup =
  new THREE.Group();

const terrainGroup =
  new THREE.Group();

const hybridGroup =
  new THREE.Group();

const assetDebugGroup =
  new THREE.Group();

diagnosticGroup.visible =
  diagnosticsEnabled;

scene.add(
  diagnosticGroup
);

scene.add(
  assetGroup
);

scene.add(
  terrainGroup
);

scene.add(
  hybridGroup
);

scene.add(
  assetDebugGroup
);

scene.background =
  originalBackground.clone();

scene.fog =
  new THREE.Fog(
    0x8ba39f,
    15000,
    36000
  );


const camera =
  new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    1,
    50000
  );


const cameraTarget =
  new THREE.Vector3();


const controls =
  new OrbitControls(
    camera,
    canvas
  );

controls.enableDamping =
  true;
controls.dampingFactor =
  0.07;
controls.minDistance =
  120;
controls.maxDistance =
  30000;
controls.maxPolarAngle =
  Math.PI * 0.49;
controls.screenSpacePanning =
  false;


const clock =
  new THREE.Clock();


const assetRoots =
  new Map();


let terrainMesh = null;
let terrainWireframe = null;
let routeLine = null;
let dem = null;
let profileMode = false;
let viewpointIndex = 0;
let loadCount = 0;
let loadedCount = 0;
let hybridTerrainMesh = null;


const assetFrustum =
  new THREE.Frustum();

const assetProjection =
  new THREE.Matrix4();


function terrainHeight(
  easting,
  northing
) {

  if (
    !dem
  ) {
    return 0;
  }

  const column = Math.round(
    (easting - dem.minX) / dem.pixelWidth
  );

  const row = Math.round(
    (dem.maxY - northing) / dem.pixelHeight
  );

  const clampedColumn = Math.max(
    0,
    Math.min(dem.width - 1, column)
  );

  const clampedRow = Math.max(
    0,
    Math.min(dem.height - 1, row)
  );

  const value =
    dem.values[
      (dem.startRow + clampedRow) * dem.fullWidth
      + dem.startColumn
      + clampedColumn
    ];

  if (
    value !== dem.noData
    && Number.isFinite(value)
  ) {
    return (
      value - dem.minElevation
    ) * VERTICAL_EXAGGERATION;
  }

  return dem.minElevationFallback;
}


function readDem() {

  return fromUrl(
    DEM_URL
  ).then(
    async (tiff) => {
      const image = await tiff.getImage();
      const [minX, minY, maxX, maxY] = image.getBoundingBox();
      const fullWidth = image.getWidth();
      const fullHeight = image.getHeight();
      const pixelWidth = (maxX - minX) / fullWidth;
      const pixelHeight = (maxY - minY) / fullHeight;
      const rasters = await image.readRasters({
        samples: [0],
        interleave: false
      });
      const values = rasters[0];
      const noData = Number(image.getGDALNoData()) || -9999;
      const startColumn = Math.max(
        0,
        Math.floor((STUDY_AREA.minEasting - minX) / pixelWidth)
      );
      const endColumn = Math.min(
        fullWidth - 1,
        Math.ceil((STUDY_AREA.maxEasting - minX) / pixelWidth)
      );
      const startRow = Math.max(
        0,
        Math.floor((maxY - STUDY_AREA.maxNorthing) / pixelHeight)
      );
      const endRow = Math.min(
        fullHeight - 1,
        Math.ceil((maxY - STUDY_AREA.minNorthing) / pixelHeight)
      );
      const cropValues = [];
      let minimum = Infinity;
      let maximum = -Infinity;
      let noDataCount = 0;

      for (let row = startRow; row <= endRow; row += 1) {
        for (let column = startColumn; column <= endColumn; column += 1) {
          const value = values[row * fullWidth + column];
          cropValues.push(value);

          if (
            value === noData
            || !Number.isFinite(value)
          ) {
            noDataCount += 1;
          }
          else {
            minimum = Math.min(minimum, value);
            maximum = Math.max(maximum, value);
          }
        }
      }

      return {
        values,
        noData,
        minX: minX + startColumn * pixelWidth,
        maxX: minX + endColumn * pixelWidth,
        minY: maxY - endRow * pixelHeight,
        maxY: maxY - startRow * pixelHeight,
        pixelWidth,
        pixelHeight,
        fullWidth,
        startColumn,
        startRow,
        width: endColumn - startColumn + 1,
        height: endRow - startRow + 1,
        minElevation: minimum,
        maxElevation: maximum,
        noDataCount,
        totalCells: cropValues.length,
        minElevationFallback: minimum
      };
    }
  );
}


function toLocal(
  easting,
  northing
) {
  return [
    easting - STUDY_AREA.minEasting,
    northing - STUDY_AREA.minNorthing
  ];
}


function sampleDemElevation(
  easting,
  northing
) {

  if (
    !dem
  ) {
    return 0;
  }

  const column = Math.max(
    0,
    Math.min(
      dem.width - 1,
      (easting - dem.minX) / dem.pixelWidth
    )
  );
  const row = Math.max(
    0,
    Math.min(
      dem.height - 1,
      (dem.maxY - northing) / dem.pixelHeight
    )
  );
  const left = Math.floor(column);
  const top = Math.floor(row);
  const right = Math.min(
    dem.width - 1,
    left + 1
  );
  const bottom = Math.min(
    dem.height - 1,
    top + 1
  );
  const xMix = column - left;
  const yMix = row - top;

  const read = (
    sampleRow,
    sampleColumn
  ) => dem.values[
    (dem.startRow + sampleRow) * dem.fullWidth
    + dem.startColumn
    + sampleColumn
  ];

  const values = [
    read(top, left),
    read(top, right),
    read(bottom, left),
    read(bottom, right)
  ];

  const valid = values.filter(
    (value) => value !== dem.noData && Number.isFinite(value)
  );

  if (
    valid.length === 0
  ) {
    return dem.minElevation;
  }

  const fallback =
    valid.reduce((sum, value) => sum + value, 0) / valid.length;
  const corners = values.map(
    (value) => value === dem.noData || !Number.isFinite(value)
      ? fallback
      : value
  );
  const topValue =
    corners[0] + (corners[1] - corners[0]) * xMix;
  const bottomValue =
    corners[2] + (corners[3] - corners[2]) * xMix;

  return topValue + (bottomValue - topValue) * yMix;
}


function localTerrainHeight(
  easting,
  northing
) {
  return (
    sampleDemElevation(easting, northing) - dem.minElevation
  ) * VERTICAL_EXAGGERATION;
}


function hybridAssetLocation(
  asset
) {
  return hybridRequested
    && HYBRID_ASSET_LOCATIONS[asset.id]
    ? HYBRID_ASSET_LOCATIONS[asset.id]
    : asset.location;
}


function hybridReliefAt(
  easting,
  northing
) {
  const halfWidth = HYBRID_ACTIVITY.width / 2;
  const halfDepth = HYBRID_ACTIVITY.depth / 2;
  const x = (easting - HYBRID_ACTIVITY.center[0]) / halfWidth;
  const z = (northing - HYBRID_ACTIVITY.center[1]) / halfDepth;
  const edgeFade = Math.max(
    0,
    Math.min(1, 1 - Math.max(Math.abs(x), Math.abs(z)))
  );
  const wave = (
    Math.sin((easting - HYBRID_ACTIVITY.center[0]) * 0.11)
    * Math.cos((northing - HYBRID_ACTIVITY.center[1]) * 0.13)
    + 0.35 * Math.sin((easting + northing) * 0.07)
  );

  return wave
    * HYBRID_ACTIVITY.reliefAmplitude
    * edgeFade
    * edgeFade;
}


function hybridSurfaceHeight(
  easting,
  northing
) {
  return localTerrainHeight(
    easting,
    northing
  ) + HYBRID_ACTIVITY.renderLift + hybridReliefAt(
    easting,
    northing
  );
}


function scenePosition(
  easting,
  northing,
  height
) {
  return new THREE.Vector3(
    easting - (STUDY_AREA.minEasting + STUDY_AREA.maxEasting) / 2,
    height,
    northing - (STUDY_AREA.minNorthing + STUDY_AREA.maxNorthing) / 2
  );
}


function createHybridLabel() {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 720;
  labelCanvas.height = 96;
  const context = labelCanvas.getContext('2d');
  context.fillStyle = 'rgba(20, 27, 21, 0.86)';
  context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
  context.font = '600 30px system-ui, sans-serif';
  context.fillStyle = '#e0b45d';
  context.fillText(
    'ILLUSTRATIVE PASTORAL ACTIVITY AREA',
    24,
    59
  );

  const label = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(labelCanvas),
      transparent: true,
      depthTest: false
    })
  );
  label.scale.set(120, 16, 1);
  const centerHeight = hybridSurfaceHeight(
    HYBRID_ACTIVITY.center[0],
    HYBRID_ACTIVITY.center[1]
  );
  label.position.copy(
    scenePosition(
      HYBRID_ACTIVITY.center[0],
      HYBRID_ACTIVITY.center[1],
      centerHeight + 12
    )
  );
  hybridGroup.add(label);
}


function createHybridTerrainPatch() {
  const positions = [];
  const colors = [];
  const indices = [];
  const columns = HYBRID_ACTIVITY.columns;
  const rows = HYBRID_ACTIVITY.rows;

  for (let row = 0; row <= rows; row += 1) {
    const northing = HYBRID_ACTIVITY.center[1]
      - HYBRID_ACTIVITY.depth / 2
      + row / rows * HYBRID_ACTIVITY.depth;

    for (let column = 0; column <= columns; column += 1) {
      const easting = HYBRID_ACTIVITY.center[0]
        - HYBRID_ACTIVITY.width / 2
        + column / columns * HYBRID_ACTIVITY.width;
      const height = hybridSurfaceHeight(easting, northing);
      const normalized = Math.min(
        1,
        Math.max(
          0,
          (height / VERTICAL_EXAGGERATION - dem.minElevation)
          / (dem.maxElevation - dem.minElevation)
        )
      );
      const point = scenePosition(easting, northing, height);
      positions.push(point.x, point.y, point.z);
      colors.push(
        0.19 + normalized * 0.13,
        0.27 + normalized * 0.13,
        0.16 + normalized * 0.1
      );
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const topLeft = row * (columns + 1) + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + columns + 1;
      const bottomRight = bottomLeft + 1;
      indices.push(
        topLeft,
        bottomLeft,
        topRight,
        topRight,
        bottomLeft,
        bottomRight
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  hybridTerrainMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    })
  );
  hybridTerrainMesh.receiveShadow = true;
  hybridGroup.add(hybridTerrainMesh);
  createHybridLabel();
}


function hybridSlopeDegrees() {
  const sampleDistance = 20;
  const east = sampleDemElevation(
    HYBRID_ACTIVITY.center[0] + sampleDistance,
    HYBRID_ACTIVITY.center[1]
  ) - sampleDemElevation(
    HYBRID_ACTIVITY.center[0] - sampleDistance,
    HYBRID_ACTIVITY.center[1]
  );
  const north = sampleDemElevation(
    HYBRID_ACTIVITY.center[0],
    HYBRID_ACTIVITY.center[1] + sampleDistance
  ) - sampleDemElevation(
    HYBRID_ACTIVITY.center[0],
    HYBRID_ACTIVITY.center[1] - sampleDistance
  );
  return Math.atan(
    Math.hypot(east, north) / (sampleDistance * 2)
  ) * 180 / Math.PI;
}


function updateHybridDiagnostics() {
  if (!hybridRequested || !dem) {
    return;
  }

  const centerElevation = sampleDemElevation(
    HYBRID_ACTIVITY.center[0],
    HYBRID_ACTIVITY.center[1]
  );
  const assetDistance = Math.hypot(
    HYBRID_ASSET_LOCATIONS['sheep-1'][0]
      - HYBRID_ASSET_LOCATIONS['oak-tree-1'][0],
    HYBRID_ASSET_LOCATIONS['sheep-1'][1]
      - HYBRID_ASSET_LOCATIONS['oak-tree-1'][1]
  );

  terrainStatsElement.textContent += `\nHybrid patch: ${HYBRID_ACTIVITY.width}m x ${HYBRID_ACTIVITY.depth}m · ${HYBRID_ACTIVITY.columns} x ${HYBRID_ACTIVITY.rows} cells\n`
    + `Activity center DEM elevation: ${centerElevation.toFixed(1)}m · approximate DEM slope: ${hybridSlopeDegrees().toFixed(1)}°\n`
    + `Hybrid sheep/oak separation: ${assetDistance.toFixed(1)}m · illustrative micro-relief: ±${HYBRID_ACTIVITY.reliefAmplitude.toFixed(1)}m`;
  console.info(
    '[Bharmour hybrid composition]',
    `DEM ${dem.width} x ${dem.height} @ ${dem.pixelWidth.toFixed(2)}m, ${dem.pixelHeight.toFixed(2)}m · vertical exaggeration ${VERTICAL_EXAGGERATION}x`,
    `activity ${HYBRID_ACTIVITY.width}m x ${HYBRID_ACTIVITY.depth}m · center elevation ${centerElevation.toFixed(1)}m · slope ${hybridSlopeDegrees().toFixed(1)}°`
  );
}


function polygonArea(
  polygon
) {
  return polygon.reduce(
    (area, point, index) => {
      const next = polygon[(index + 1) % polygon.length];
      return area + point[0] * next[1] - next[0] * point[1];
    },
    0
  ) / 2;
}


function clipCellToBoundary(
  cell,
  boundary
) {
  const orientation = polygonArea(boundary) >= 0 ? 1 : -1;
  let output = cell;

  for (
    let index = 0;
    index < boundary.length;
    index += 1
  ) {
    const edgeStart = boundary[index];
    const edgeEnd = boundary[(index + 1) % boundary.length];
    const input = output;
    output = [];

    if (
      input.length === 0
    ) {
      break;
    }

    const inside = (point) => orientation * (
      (edgeEnd[0] - edgeStart[0]) * (point[1] - edgeStart[1])
      - (edgeEnd[1] - edgeStart[1]) * (point[0] - edgeStart[0])
    ) >= -0.001;

    const intersection = (from, to) => {
      const dx = to[0] - from[0];
      const dy = to[1] - from[1];
      const ex = edgeEnd[0] - edgeStart[0];
      const ey = edgeEnd[1] - edgeStart[1];
      const denominator = dx * ey - dy * ex;

      if (Math.abs(denominator) < 1e-9) {
        return to;
      }

      const t = (
        (edgeStart[0] - from[0]) * ey
        - (edgeStart[1] - from[1]) * ex
      ) / denominator;

      return [
        from[0] + dx * t,
        from[1] + dy * t
      ];
    };

    for (
      let pointIndex = 0;
      pointIndex < input.length;
      pointIndex += 1
    ) {
      const current = input[pointIndex];
      const previous = input[(pointIndex + input.length - 1) % input.length];
      const currentInside = inside(current);
      const previousInside = inside(previous);

      if (currentInside !== previousInside) {
        output.push(
          intersection(previous, current)
        );
      }

      if (currentInside) {
        output.push(current);
      }
    }
  }

  return output;
}


function createOrganicTerrain() {

  const width = dem.maxX - dem.minX;
  const depth = dem.maxY - dem.minY;
  const step = 2;
  const positions = [];
  const colors = [];
  const boundary = ORGANIC_BOUNDARY_UTM;

  const pushTriangle = (
    triangle
  ) => {
    triangle.forEach(
      (point) => {
        const height = localTerrainHeight(
          point[0],
          point[1]
        );
        const normalized = Math.min(
          1,
          Math.max(
            0,
            (height / VERTICAL_EXAGGERATION - dem.minElevation + dem.minElevation - dem.minElevation)
            / (dem.maxElevation - dem.minElevation)
          )
        );
        positions.push(
          point[0] - (STUDY_AREA.minEasting + STUDY_AREA.maxEasting) / 2,
          height,
          point[1] - (STUDY_AREA.minNorthing + STUDY_AREA.maxNorthing) / 2
        );
        colors.push(
          0.16 + normalized * 0.16,
          0.22 + normalized * 0.16,
          0.13 + normalized * 0.14
        );
      }
    );
  };

  for (
    let row = 0;
    row < dem.height - 1;
    row += step
  ) {
    for (
      let column = 0;
      column < dem.width - 1;
      column += step
    ) {
      const minX = dem.minX + column * dem.pixelWidth;
      const maxX = dem.minX + Math.min(
        dem.width - 1,
        column + step
      ) * dem.pixelWidth;
      const maxY = dem.maxY - row * dem.pixelHeight;
      const minY = dem.maxY - Math.min(
        dem.height - 1,
        row + step
      ) * dem.pixelHeight;
      const clipped = clipCellToBoundary(
        [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY]
        ],
        boundary
      );

      if (
        clipped.length < 3
      ) {
        continue;
      }

      for (
        let index = 1;
        index < clipped.length - 1;
        index += 1
      ) {
        pushTriangle([
          clipped[0],
          clipped[index + 1],
          clipped[index]
        ]);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.computeVertexNormals();

  terrainMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0,
      side: THREE.DoubleSide,
      emissive: 0x182016,
      emissiveIntensity: 0.42
    })
  );
  terrainMesh.receiveShadow = true;
  terrainGroup.add(terrainMesh);

  statusElement.textContent =
    `Organic DEM terrain ready · ${positions.length / 3} vertices`;

  terrainWireframe = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xf2d18d,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      visible: false
    })
  );
  terrainGroup.add(terrainWireframe);

  const sidePositions = [];
  const sideColors = [];
  const bottom = -TERRAIN_EDGE_DEPTH;
  const edgeStep = 2;

  const perimeter = [];
  boundary.forEach(
    (point, index) => {
      const next = boundary[(index + 1) % boundary.length];
      const distance = Math.hypot(
        next[0] - point[0],
        next[1] - point[1]
      );
      const segments = Math.max(
        1,
        Math.ceil(distance / (dem.pixelWidth * edgeStep))
      );

      for (let segment = 0; segment < segments; segment += 1) {
        const t = segment / segments;
        perimeter.push([
          point[0] + (next[0] - point[0]) * t,
          point[1] + (next[1] - point[1]) * t
        ]);
      }
    }
  );

  for (
    let index = 0;
    index < perimeter.length;
    index += 1
  ) {
    const current = perimeter[index];
    const next = perimeter[(index + 1) % perimeter.length];
    const currentTop = localTerrainHeight(current[0], current[1]);
    const nextTop = localTerrainHeight(next[0], next[1]);
    const vertices = [
      [current, currentTop],
      [next, nextTop],
      [next, bottom],
      [current, bottom]
    ];
    [[0, 1, 2], [0, 2, 3]].forEach(
      (triangle) => triangle.forEach(
        (vertexIndex) => {
          const [point, height] =
            vertices[vertexIndex];

          sidePositions.push(
            point[0] - (STUDY_AREA.minEasting + STUDY_AREA.maxEasting) / 2,
            height,
            point[1] - (STUDY_AREA.minNorthing + STUDY_AREA.maxNorthing) / 2
          );
          sideColors.push(0.28, 0.28, 0.24);
        }
      )
    );
  }

  const sideGeometry = new THREE.BufferGeometry();
  sideGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(sidePositions, 3)
  );
  sideGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(sideColors, 3)
  );
  sideGeometry.computeVertexNormals();

  const sideMesh = new THREE.Mesh(
    sideGeometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
      emissive: 0x171914,
      emissiveIntensity: 0.3
    })
  );
  sideMesh.receiveShadow = true;
  terrainGroup.add(sideMesh);

  const bottomPoints = boundary.map(
    (point) => new THREE.Vector2(
      point[0],
      point[1]
    )
  );
  const bottomTriangles =
    THREE.ShapeUtils.triangulateShape(
      bottomPoints,
      []
    );
  const bottomPositions = [];

  bottomTriangles.forEach(
    (triangle) => triangle.forEach(
      (index) => {
        const point = boundary[index];
        bottomPositions.push(
          point[0] - (STUDY_AREA.minEasting + STUDY_AREA.maxEasting) / 2,
          bottom,
          point[1] - (STUDY_AREA.minNorthing + STUDY_AREA.maxNorthing) / 2
        );
      }
    )
  );

  const bottomGeometry = new THREE.BufferGeometry();
  bottomGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(bottomPositions, 3)
  );
  bottomGeometry.computeVertexNormals();

  terrainGroup.add(
    new THREE.Mesh(
      bottomGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x30312c,
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide
      })
    )
  );

  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      perimeter.map(
        (point) => new THREE.Vector3(
          point[0] - (STUDY_AREA.minEasting + STUDY_AREA.maxEasting) / 2,
          localTerrainHeight(point[0], point[1]) + 4,
          point[1] - (STUDY_AREA.minNorthing + STUDY_AREA.maxNorthing) / 2
        )
      )
    ),
    new THREE.LineBasicMaterial({
      color: 0xe0b45d,
      transparent: true,
      opacity: 0.75
    })
  );
  outline.visible = diagnosticsEnabled;
  diagnosticGroup.add(outline);
}


function createTerrain() {

  const widthSegments = Math.min(
    96,
    Math.floor(dem.width / 2)
  );
  const depthSegments = Math.min(
    72,
    Math.floor(dem.height / 2)
  );
  const width = dem.maxX - dem.minX;
  const depth = dem.maxY - dem.minY;
  const positions = [];
  const colors = [];
  const indices = [];

  for (
    let row = 0;
    row <= depthSegments;
    row += 1
  ) {
    for (
      let column = 0;
      column <= widthSegments;
      column += 1
    ) {
      const easting =
        dem.minX
        + column / widthSegments * width;
      const northing =
        dem.minY
        + row / depthSegments * depth;
      const height = terrainHeight(
        easting,
        northing
      );

      positions.push(
        column / widthSegments * width - width / 2,
        height,
        row / depthSegments * depth - depth / 2
      );

      const absoluteElevation =
        height / VERTICAL_EXAGGERATION
        + dem.minElevation;
      const normalizedHeight =
        Math.min(
          1,
          Math.max(
            0,
            (absoluteElevation - dem.minElevation)
            / (dem.maxElevation - dem.minElevation)
          )
        );

      colors.push(
        0.16 + normalizedHeight * 0.16,
        0.22 + normalizedHeight * 0.16,
        0.13 + normalizedHeight * 0.14
      );
    }
  }

  for (
    let row = 0;
    row < depthSegments;
    row += 1
  ) {
    for (
      let column = 0;
      column < widthSegments;
      column += 1
    ) {
      const topLeft =
        row * (widthSegments + 1) + column;
      const topRight =
        topLeft + 1;
      const bottomLeft =
        topLeft + widthSegments + 1;
      const bottomRight =
        bottomLeft + 1;

      indices.push(
        topLeft,
        bottomLeft,
        topRight,
        topRight,
        bottomLeft,
        bottomRight
      );
    }
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      positions,
      3
    )
  );

  geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(
      colors,
      3
    )
  );

  geometry.setIndex(
    indices
  );

  geometry.computeVertexNormals();

  const material =
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0,
      flatShading: false
    });

  terrainMesh =
    new THREE.Mesh(
      geometry,
      material
    );

  terrainMesh.receiveShadow =
    true;

  scene.add(
    terrainMesh
  );

  terrainWireframe = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xf2d18d,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      visible: false
    })
  );

  scene.add(
    terrainWireframe
  );

  const terrainBase =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width + 320,
        900,
        depth + 320
      ),
      new THREE.MeshStandardMaterial({
        color: 0x3b3931,
        roughness: 1,
        metalness: 0
      })
    );

  terrainBase.position.y =
    -450;
  terrainBase.receiveShadow =
    true;

  scene.add(
    terrainBase
  );

}


function createLights() {

  scene.add(
    new THREE.HemisphereLight(
      0xd9e9e4,
      0x33271b,
      1.8
    )
  );

  const sunlight =
    new THREE.DirectionalLight(
      0xffdca3,
      3.2
    );

  sunlight.position.set(
    -9000,
    15000,
    7000
  );

  sunlight.castShadow =
    true;

  sunlight.shadow.mapSize.set(
    1024,
    1024
  );

  sunlight.shadow.camera.left =
    -12000;
  sunlight.shadow.camera.right =
    12000;
  sunlight.shadow.camera.top =
    12000;
  sunlight.shadow.camera.bottom =
    -12000;

  scene.add(
    sunlight
  );

}


function createAnchorMarkers() {

  const createLabel = (
    text,
    color
  ) => {
    const labelCanvas =
      document.createElement('canvas');

    labelCanvas.width = 512;
    labelCanvas.height = 96;

    const context =
      labelCanvas.getContext('2d');

    context.fillStyle =
      'rgba(18, 20, 16, 0.82)';
    context.fillRect(
      0,
      0,
      labelCanvas.width,
      labelCanvas.height
    );
    context.font =
      '600 30px system-ui, sans-serif';
    context.fillStyle =
      `#${color.toString(16).padStart(6, '0')}`;
    context.fillText(
      text,
      24,
      59
    );

    const texture =
      new THREE.CanvasTexture(
        labelCanvas
      );
    const label =
      new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false
        })
      );

    label.scale.set(
      620,
      116,
      1
    );

    return label;
  };

  ANCHORS.forEach(
    (anchor) => {
      const local = toLocal(
        anchor.location[0],
        anchor.location[1]
      );
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(
          55,
          12,
          8
        ),
        new THREE.MeshBasicMaterial({
          color: anchor.color,
          transparent: true,
          opacity: 0.9
        })
      );

      marker.position.set(
        local[0] - (STUDY_AREA.maxEasting - STUDY_AREA.minEasting) / 2,
        terrainHeight(
          anchor.location[0],
          anchor.location[1]
        ) + 100,
        local[1] - (STUDY_AREA.maxNorthing - STUDY_AREA.minNorthing) / 2
      );

      marker.userData.label =
        anchor.label;

      diagnosticGroup.add(
        marker
      );

      const label = createLabel(
        anchor.label,
        anchor.color
      );

      label.position.copy(
        marker.position
      );
      label.position.y += 190;

      diagnosticGroup.add(
        label
      );
    }
  );

}


function updateTerrainDiagnostics() {

  if (
    !dem
  ) {
    return;
  }

  const noDataPercentage =
    dem.noDataCount / dem.totalCells * 100;

  const anchorSummary = ANCHORS.map(
    (anchor) => {
      const local = toLocal(
        anchor.location[0],
        anchor.location[1]
      );
      const sceneX =
        local[0]
        - (STUDY_AREA.maxEasting - STUDY_AREA.minEasting) / 2;
      const sceneZ =
        local[1]
        - (STUDY_AREA.maxNorthing - STUDY_AREA.minNorthing) / 2;
      const elevation =
        terrainHeight(
          anchor.location[0],
          anchor.location[1]
        ) + dem.minElevation;

      return `${anchor.label}: local (${sceneX.toFixed(1)}, ${elevation.toFixed(1)}, ${sceneZ.toFixed(1)})m`;
    }
  ).join('\n');

  terrainStatsElement.textContent =
    `DEM: ${DEM_URL}\n`
    + `CRS: EPSG:32643 · crop: ${Math.round(dem.maxX - dem.minX)}m x ${Math.round(dem.maxY - dem.minY)}m\n`
    + `Raster: ${dem.width} x ${dem.height} cells @ ${dem.pixelWidth.toFixed(1)}m\n`
    + `Elevation: ${dem.minElevation.toFixed(1)}–${dem.maxElevation.toFixed(1)}m `
    + `(${(dem.maxElevation - dem.minElevation).toFixed(1)}m relief)\n`
    + `NoData: ${dem.noDataCount}/${dem.totalCells} (${noDataPercentage.toFixed(1)}%) · vertical scale: ${VERTICAL_EXAGGERATION}x\n`
    + anchorSummary;

}


function setProfileMode(
  enabled
) {

  profileMode = enabled;
  profileButton.textContent =
    enabled
      ? 'Return to viewpoints'
      : 'Terrain profile';

  if (
    enabled
  ) {
    const relief =
      dem
        ? (dem.maxElevation - dem.minElevation)
          * VERTICAL_EXAGGERATION
        : 1000;

    camera.position.set(
      23500,
      Math.max(5000, relief * 1.05),
      6000
    );

    cameraTarget.set(
      0,
      relief * 0.42,
      0
    );

    controls.target.copy(
      cameraTarget
    );
    controls.update();
  }
  else {
    updateViewpoint(
      viewpointIndex,
      false
    );
  }

}


function setModelMaterials(
  object
) {

  object.traverse(
    (child) => {
      if (
        !child.isMesh
      ) {
        return;
      }

      child.castShadow =
        true;
      child.receiveShadow =
        true;

      if (
        child.material
      ) {
        const materials = Array.isArray(
          child.material
        )
          ? child.material
          : [child.material];

        materials.forEach(
          (material) => {
            material.envMapIntensity =
              0.65;
          }
        );
      }
    }
  );

}


function alignModelToGround(
  model,
  asset
) {

  setModelMaterials(
    model
  );

  if (
    asset.upAxis === 'z'
  ) {
    model.rotation.x =
      -Math.PI / 2;
  }

}


function assetScale(
  asset
) {
  return SCALE_PRESETS[
    scaleMode
  ][asset.kind];
}


function placeAsset(
  root,
  model,
  asset
) {

  const location = hybridAssetLocation(asset);
  const local = toLocal(
    location[0],
    location[1]
  );

  model.scale.setScalar(
    assetScale(asset)
  );

  root.position.set(
    local[0] - (STUDY_AREA.maxEasting - STUDY_AREA.minEasting) / 2,
    0,
    local[1] - (STUDY_AREA.maxNorthing - STUDY_AREA.minNorthing) / 2
  );

  model.position.set(
    0,
    0,
    0
  );

  root.updateMatrixWorld(
    true
  );

  const bounds =
    new THREE.Box3().setFromObject(
      root
    );

  const groundHeight = hybridRequested
    ? hybridSurfaceHeight(location[0], location[1])
    : terrainHeight(location[0], location[1]);
  root.position.y = groundHeight - bounds.min.y;

}


function placeAssetOnFlatGround(
  root,
  model,
  asset
) {
  const position =
    FLAT_DEBUG_POSITIONS[asset.id];

  root.position.set(
    position[0],
    0,
    position[1]
  );
  model.position.set(
    0,
    0,
    0
  );
  model.scale.setScalar(
    assetScale(asset)
  );
  root.updateMatrixWorld(
    true
  );

  const bounds = new THREE.Box3().setFromObject(
    root
  );

  root.position.y =
    -bounds.min.y;
}


function clearAssetDebugGroup() {
  while (
    assetDebugGroup.children.length
  ) {
    assetDebugGroup.remove(
      assetDebugGroup.children[0]
    );
  }
}


function createAssetDebugHelpers(
  flat
) {
  clearAssetDebugGroup();

  if (
    flat
  ) {
    scene.background = new THREE.Color(0x252a2d);
    scene.fog = null;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        color: 0x77786d,
        roughness: 1,
        metalness: 0
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    assetDebugGroup.add(ground);

    const grid = new THREE.GridHelper(
      40,
      40,
      0x7b806f,
      0x44483f
    );
    grid.position.y = 0.02;
    assetDebugGroup.add(grid);

    assetDebugGroup.add(
      new THREE.AxesHelper(8)
    );
  }
  else {
    scene.background = originalBackground.clone();
    scene.fog = new THREE.Fog(
      0x8ba39f,
      15000,
      36000
    );
  }

  ASSET_DEBUG_IDS.forEach(
    (assetId) => {
      const record = assetRoots.get(assetId);

      if (
        !record
      ) {
        return;
      }

       const helper = new THREE.BoxHelper(
         record.root,
        record.asset.kind === 'sheep'
          ? 0xe5e1d1
          : 0xa7c96b
       );
       helper.update();
       assetDebugGroup.add(helper);

      const contact = new THREE.Mesh(
        new THREE.SphereGeometry(
          record.asset.kind === 'sheep' ? 0.12 : 0.22,
          10,
          8
        ),
        new THREE.MeshBasicMaterial({
          color: 0xff6038
        })
      );
      record.root.getWorldPosition(
        contact.position
      );
      assetDebugGroup.add(contact);

      const axes = new THREE.AxesHelper(
        record.asset.kind === 'sheep' ? 1.5 : 4
      );
      record.root.getWorldPosition(
        axes.position
      );
      assetDebugGroup.add(axes);
    }
  );
}


function frameAssetDebugView() {
  const bounds = new THREE.Box3();

  ASSET_DEBUG_IDS.forEach(
    (assetId) => {
      const record = assetRoots.get(assetId);
      if (record) {
        bounds.expandByObject(
          record.root
        );
      }
    }
  );

  if (
    bounds.isEmpty()
  ) {
    return;
  }

  const center = bounds.getCenter(
    new THREE.Vector3()
  );
  const size = bounds.getSize(
    new THREE.Vector3()
  );
  const radius = Math.max(
    4,
    size.length() * 0.5
  );

  camera.position.copy(
    center.clone().add(
      new THREE.Vector3(
        radius * 1.7,
        radius * 1.15,
        radius * 2.1
      )
    )
  );
  controls.target.copy(
    center
  );
  controls.update();
}


function setAssetDebugMode(
  mode
) {
  assetDebugMode = mode;
  const flat = mode === 'flat';

  terrainGroup.visible = !flat;
  hybridGroup.visible = hybridRequested && !flat;
  diagnosticGroup.visible =
    diagnosticsEnabled && !flat;
  assetGroup.visible = true;

  assetRoots.forEach(
    ({ root, model, asset }) => {
      const selected = ASSET_DEBUG_IDS.includes(
        asset.id
      );

      root.visible =
        assetDebugRequested
          ? selected
          : true;

      if (
        selected
      ) {
        if (flat) {
          placeAssetOnFlatGround(
            root,
            model,
            asset
          );
        }
        else {
          placeAsset(
            root,
            model,
            asset
          );
        }
      }
    }
  );

  assetDebugGroup.visible =
    assetDebugRequested;
  createAssetDebugHelpers(
    flat
  );
  assetDebugButton.textContent =
    `Asset test: ${flat ? 'flat ground' : 'DEM'}`;
  frameAssetDebugView();
  updateAssetDiagnostics();
}


function loadAsset(
  loader,
  asset
) {

  return new Promise(
    (resolve) => {
      loader.load(
        asset.source,
        (gltf) => {
          const model =
            gltf.scene;

          const root =
            new THREE.Group();

          root.name =
            `${asset.id}-root`;

          root.add(
            model
          );

          alignModelToGround(
            model,
            asset
          );

          placeAsset(
            root,
            model,
            asset
          );

          const axes =
            new THREE.AxesHelper(
              asset.kind === 'sheep'
                ? 20
                : 60
            );

          axes.visible =
            diagnosticsEnabled;

          root.add(
            axes
          );

          assetGroup.add(
            root
          );

          assetRoots.set(
            asset.id,
            {
              root,
              model,
              asset
            }
          );

          resolve({
            asset,
            ok: true,
            animations: gltf.animations.map(
              (clip) => clip.name || 'Unnamed clip'
            )
          });
        },
        undefined,
        (error) => {
          console.warn(
            `Could not load ${asset.title}:`,
            error
          );

          resolve({
            asset,
            ok: false,
            animations: []
          });
        }
      );
    }
  );

}


function updateAssetDiagnostics() {

  if (
    !assetDiagnosticsElement
  ) {
    return;
  }

  camera.updateMatrixWorld();
  assetProjection.multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  assetFrustum.setFromProjectionMatrix(
    assetProjection
  );

  const bharmour = ANCHORS[0].location;

  const reports = [
    `Asset scale mode: ${scaleMode}`,
    ...[...assetRoots.values()].map(
      ({ root, model, asset }) => {
        const location = hybridAssetLocation(asset);
        const bounds = new THREE.Box3().setFromObject(root);
        const size = bounds.getSize(
          new THREE.Vector3()
        );
        const worldPosition = root.getWorldPosition(
          new THREE.Vector3()
        );
        const worldRotation = new THREE.Euler().setFromQuaternion(
          model.getWorldQuaternion(
            new THREE.Quaternion()
          )
        );
        const worldScale = root.getWorldScale(
          new THREE.Vector3()
        );
        const meshReport = {
          count: 0,
          visible: 0,
          materials: 0,
          hiddenMaterials: 0
        };
        model.traverse((child) => {
          if (!child.isMesh) {
            return;
          }
          meshReport.count += 1;
          if (child.visible) {
            meshReport.visible += 1;
          }
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => {
            meshReport.materials += 1;
            if (!material.visible || material.opacity === 0) {
              meshReport.hiddenMaterials += 1;
            }
          });
        });
        let visibleChain = true;
        let attachedToScene = false;
        let ancestor = root;
        while (ancestor) {
          visibleChain = visibleChain && ancestor.visible;
          if (ancestor === scene) {
            attachedToScene = true;
          }
          ancestor = ancestor.parent;
        }
        const inFrustum = assetFrustum.intersectsBox(bounds);
        const terrainY = hybridRequested
          ? hybridSurfaceHeight(location[0], location[1])
          : assetDebugMode === 'dem' && dem
            ? localTerrainHeight(location[0], location[1])
          : 0;
        const belowTerrain = bounds.min.y < terrainY - 0.05;
        const invalid = [
          worldPosition.x,
          worldPosition.y,
          worldPosition.z,
          worldScale.x,
          worldScale.y,
          worldScale.z,
          bounds.min.x,
          bounds.min.y,
          bounds.min.z,
          bounds.max.x,
          bounds.max.y,
          bounds.max.z
        ].some((value) => !Number.isFinite(value));
        const distance = Math.hypot(
          location[0] - bharmour[0],
          location[1] - bharmour[1]
        );
        return `${asset.id}: attached=${attachedToScene} visibleChain=${visibleChain} frustum=${inFrustum} belowTerrain=${belowTerrain} invalid=${invalid}\n`
          + `world pos ${worldPosition.x.toFixed(2)}, ${worldPosition.y.toFixed(2)}, ${worldPosition.z.toFixed(2)} · rot ${worldRotation.x.toFixed(2)}, ${worldRotation.y.toFixed(2)}, ${worldRotation.z.toFixed(2)} · scale ${worldScale.x.toFixed(3)}, ${worldScale.y.toFixed(3)}, ${worldScale.z.toFixed(3)}\n`
          + `bounds ${bounds.min.x.toFixed(2)},${bounds.min.y.toFixed(2)},${bounds.min.z.toFixed(2)} → ${bounds.max.x.toFixed(2)},${bounds.max.y.toFixed(2)},${bounds.max.z.toFixed(2)} · size ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}m\n`
          + `meshes ${meshReport.visible}/${meshReport.count} visible · materials ${meshReport.materials - meshReport.hiddenMaterials}/${meshReport.materials} visible · ground delta ${(bounds.min.y - terrainY).toFixed(2)}m · scale preset ${assetScale(asset)} · ${distance.toFixed(0)}m from Bharmour`;
      }
    )
  ];

  assetDiagnosticsElement.textContent = reports.join('\n');
  if (assetDebugRequested) {
    console.info(
      '[Bharmour asset diagnostic]',
      reports.join('\n')
    );
  }

}


function setScaleMode(
  mode
) {

  scaleMode = mode;

  scaleToggleButton.textContent =
    `Scale: ${scaleMode === 'overview' ? 'overview' : 'real-world'}`;

  assetRoots.forEach(
    ({ root, model, asset }) => {
      placeAsset(
        root,
        model,
        asset
      );
    }
  );

  updateAssetDiagnostics();

}


function buildRouteLine(
  routeGeoJSON
) {

  const points = [];

  routeGeoJSON.features.forEach(
    (feature) => {
      const lines =
        feature.geometry.type === 'MultiLineString'
          ? feature.geometry.coordinates
          : [feature.geometry.coordinates];

      lines.forEach(
        (line) => {
          line.forEach(
            (coordinate) => {
              if (
                coordinate[0] < STUDY_AREA.minEasting
                || coordinate[0] > STUDY_AREA.maxEasting
                || coordinate[1] < STUDY_AREA.minNorthing
                || coordinate[1] > STUDY_AREA.maxNorthing
              ) {
                return;
              }

              const local =
                toLocal(
                  coordinate[0],
                  coordinate[1]
                );

              points.push(
                new THREE.Vector3(
                  local[0] - (STUDY_AREA.maxEasting - STUDY_AREA.minEasting) / 2,
                  terrainHeight(coordinate[0], coordinate[1]) + 18,
                  local[1] - (STUDY_AREA.maxNorthing - STUDY_AREA.minNorthing) / 2
                )
              );
            }
          );
        }
      );
    }
  );

  if (
    points.length < 2
  ) {
    return;
  }

  const geometry =
    new THREE.BufferGeometry().setFromPoints(
      points
    );

  routeLine =
    new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0xe3a44e,
        transparent: true,
        opacity: 0.72
      })
    );

  diagnosticGroup.add(
    routeLine
  );

}


function updateViewpoint(
  nextIndex,
  animate = true
) {

  if (
    profileMode
  ) {
    profileMode = false;
    profileButton.textContent =
      'Terrain profile';
  }

  viewpointIndex = (
    nextIndex + VIEWPOINTS.length
  ) % VIEWPOINTS.length;

  const viewpoint =
    VIEWPOINTS[viewpointIndex];

  viewpointTitleElement.textContent =
    viewpoint.title;

  viewpointDescriptionElement.textContent =
    viewpoint.description;

  const nextPosition =
    new THREE.Vector3(
      ...viewpoint.position
    );

  const nextTarget =
    new THREE.Vector3(
      ...viewpoint.target
    );

  if (
    !animate
    || window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {
    camera.position.copy(
      nextPosition
    );
    cameraTarget.copy(
      nextTarget
    );
    controls.target.copy(
      nextTarget
    );
    controls.update();
    return;
  }

  gsap.killTweensOf(
    camera.position
  );

  gsap.killTweensOf(
    cameraTarget
  );

  gsap.to(
    camera.position,
    {
      ...nextPosition,
      duration: 2.2,
      ease: 'power2.inOut'
    }
  );

  gsap.to(
    cameraTarget,
    {
      ...nextTarget,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        controls.target.copy(
          cameraTarget
        );
      }
    }
  );

}


function createDots() {

  VIEWPOINTS.forEach(
    (viewpoint, index) => {
      const button =
        document.createElement('button');

      button.type =
        'button';
      button.className =
        'preview-dot';
      button.ariaLabel =
        viewpoint.title;

      button.addEventListener(
        'click',
        () => updateViewpoint(index)
      );

      dotsElement.appendChild(
        button
      );
    }
  );

}


function updateDots() {
  dotsElement.querySelectorAll(
    '.preview-dot'
  ).forEach(
    (dot, index) => {
      dot.classList.toggle(
        'active',
        index === viewpointIndex
      );
    }
  );
}


function resize() {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
  );

}


function animate() {

  requestAnimationFrame(
    animate
  );

  controls.update();

  cameraPositionElement.textContent =
    `Camera: ${camera.position.x.toFixed(0)}, `
    + `${camera.position.y.toFixed(0)}, `
    + `${camera.position.z.toFixed(0)}`;

  renderer.render(
    scene,
    camera
  );

}


async function initialise() {

  dem = await readDem();

  if (
    !diagnosticsEnabled
  ) {
    document.querySelector(
      '.preview-diagnostics'
    ).hidden = true;
  }

  updateTerrainDiagnostics();
  createOrganicTerrain();
  if (hybridRequested) {
    createHybridTerrainPatch();
    hybridGroup.visible = true;
    updateHybridDiagnostics();
  }
  createLights();
  createAnchorMarkers();
  createDots();
  updateViewpoint(
    0,
    false
  );
  updateDots();

  const loader =
    new GLTFLoader();

  loadCount =
    ASSETS.length;

  const results =
    await Promise.all(
      ASSETS.map(
        (asset) => loadAsset(
          loader,
          asset
        )
      )
    );

  loadedCount =
    results.filter(
      (result) => result.ok
    ).length;

  const animationNames =
    results.flatMap(
      (result) => result.animations
    );

  if (
    animationNames.length
  ) {
    statusElement.textContent =
      `${loadedCount}/${loadCount} assets loaded · animations: ${animationNames.join(', ')}`;
  }
  else {
    statusElement.textContent =
      `${loadedCount}/${loadCount} assets loaded · no embedded animations`;
  }

  updateAssetDiagnostics();

  if (hybridRequested) {
    assetRoots.forEach(
      ({ root, model, asset }) => {
        const selected = ASSET_DEBUG_IDS.includes(asset.id);
        root.visible = selected;
        if (selected) {
          placeAsset(root, model, asset);
        }
      }
    );
    updateViewpoint(
      VIEWPOINTS.length - 1,
      false
    );
    updateDots();
    updateAssetDiagnostics();
  }

  if (assetDebugRequested) {
    setAssetDebugMode(assetDebugMode);
  }

  try {
    const response =
      await fetch(
        '/data/states/himachal/geospatial/routes/Bharmour_Darcha_UTM43N.geojson'
      );

    if (
      response.ok
    ) {
      buildRouteLine(
        await response.json()
      );
    }
  }
  catch (error) {
    console.warn(
      'Could not load preview route:',
      error
    );
  }

}


previousButton.addEventListener(
  'click',
  () => {
    updateViewpoint(
      viewpointIndex - 1
    );
    updateDots();
  }
);


nextButton.addEventListener(
  'click',
  () => {
    updateViewpoint(
      viewpointIndex + 1
    );
    updateDots();
  }
);


wireframeInput.addEventListener(
  'change',
  () => {
    terrainWireframe.material.visible =
      wireframeInput.checked;
  }
);


profileButton.addEventListener(
  'click',
  () => setProfileMode(
    !profileMode
  )
);


scaleToggleButton.addEventListener(
  'click',
  () => setScaleMode(
    scaleMode === 'overview'
      ? 'realWorld'
      : 'overview'
  )
);


assetDebugButton.addEventListener(
  'click',
  () => setAssetDebugMode(
    assetDebugMode === 'flat'
      ? 'dem'
      : 'flat'
  )
);


window.addEventListener(
  'resize',
  resize
);


initialise()
  .catch(
    (error) => {
      statusElement.textContent =
        `Preview failed: ${error.message || error}`;
      console.error(
        'Bharmour preview failed:',
        error
      );
    }
  );


animate();
