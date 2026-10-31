import * as THREE from 'three';

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

import './bharmour-living-preview.css';


const canvas = document.querySelector(
  '#living-preview-canvas'
);
const statusElement = document.querySelector(
  '#living-status'
);
const resetButton = document.querySelector(
  '#living-reset'
);
const closeUpButton = document.querySelector(
  '#living-close-up'
);
const fogToggle = document.querySelector(
  '#living-fog-toggle'
);
const woodlandToggle = document.querySelector(
  '#living-woodland-toggle'
);
const flockToggle = document.querySelector(
  '#living-flock-toggle'
);
const flockCountSelect = document.querySelector(
  '#living-flock-count'
);
const shepherdToggle = document.querySelector(
  '#living-shepherd-toggle'
);
const hazeSlider = document.querySelector(
  '#living-haze'
);
const hazeValue = document.querySelector(
  '#living-haze-value'
);
const strongFogButton = document.querySelector(
  '#living-strong-fog'
);
const editToggle = document.querySelector(
  '#living-edit-toggle'
);
const editorPanel = document.querySelector(
  '#living-editor'
);
const editorSelection = document.querySelector(
  '#living-editor-selection'
);
const editorState = document.querySelector(
  '#living-editor-state'
);
const moveFlockButton = document.querySelector(
  '#living-move-flock'
);
const undoButton = document.querySelector(
  '#living-undo'
);
const redoButton = document.querySelector(
  '#living-redo'
);
const exportButton = document.querySelector(
  '#living-export'
);
const importButton = document.querySelector(
  '#living-import-button'
);
const importInput = document.querySelector(
  '#living-import'
);
const restoreButton = document.querySelector(
  '#living-restore'
);
const editorToolButtons = document.querySelectorAll(
  '[data-editor-tool]'
);


const TERRAIN = {
  width: 220,
  depth: 170,
  columns: 128,
  rows: 100,
  edgePoints: 96,
  undersideDepth: 2.6
};


const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);
renderer.setSize(
  window.innerWidth,
  window.innerHeight,
  false
);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91a39b);

const ATMOSPHERE = {
  fogColor: 0x91a39b,
  fogNear: Math.max(TERRAIN.width, TERRAIN.depth) * 1.45,
  fogFar: Math.max(TERRAIN.width, TERRAIN.depth) * 3.2
};

const STRONG_FOG = {
  near: TERRAIN.width * 0.27,
  far: TERRAIN.width * 0.82
};

const sceneFog = new THREE.Fog(
  ATMOSPHERE.fogColor,
  ATMOSPHERE.fogNear,
  ATMOSPHERE.fogFar
);
scene.fog = sceneFog;

function setFogStrength(value) {
  const strength = THREE.MathUtils.clamp(
    Number(value),
    0,
    1
  );
  sceneFog.near = THREE.MathUtils.lerp(
    ATMOSPHERE.fogNear,
    STRONG_FOG.near,
    strength
  );
  sceneFog.far = THREE.MathUtils.lerp(
    ATMOSPHERE.fogFar,
    STRONG_FOG.far,
    strength
  );
  hazeSlider.value = strength.toFixed(2);
  hazeValue.textContent = `${Math.round(strength * 100)}%`;
}

setFogStrength(hazeSlider.value);


const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const controls = new OrbitControls(
  camera,
  canvas
);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = true;
controls.screenSpacePanning = false;
controls.minDistance = 62;
controls.maxDistance = 510;
controls.minPolarAngle = 0.28;
controls.maxPolarAngle = Math.PI * 0.475;


const terrainGroup = new THREE.Group();
scene.add(terrainGroup);

const assetGroup = new THREE.Group();
scene.add(assetGroup);

const woodlandGroup = new THREE.Group();
scene.add(woodlandGroup);

const flockGroup = new THREE.Group();
scene.add(flockGroup);

const assetRoots = new Map();
const flockMembers = [];
const editableAssets = new Map();
const editorRaycaster = new THREE.Raycaster();
const editorPointer = new THREE.Vector2();
const editorHelperGroup = new THREE.Group();
scene.add(editorHelperGroup);

const EDITOR_SCHEMA_VERSION = 1;
const EDITOR_SCENE_ID = 'bharmour-living-atlas';
const SCALE_LIMITS = {
  oak: [0.75, 1.25],
  sheep: [0.85, 1.15],
  shepherd: [0.85, 1.15]
};

let surfaceMesh = null;
let editMode = false;
let editorTool = 'move';
let selectedAsset = null;
let moveFlockMode = false;
let editorDrag = null;
let defaultLayout = null;
const undoStack = [];
const redoStack = [];

const ASSETS = [
  {
    id: 'oak-tree',
    title: 'Oak tree',
    source: '/models/trees/oak_tree.glb',
    scale: 0.1674,
    position: [-50, 25]
  },
  {
    id: 'sheep',
    title: 'Sheep',
    source: '/models/animals/sheep.glb',
    scale: 0.16,
    position: [-12, -18]
  },
  {
    id: 'shepherd',
    title: 'Shepherd',
    source: '/models/humans/shepherd.glb',
    upAxis: 'y',
    scale: 0.92,
    rotation: Math.PI * 0.5,
    position: [-52, -12]
  }
];


const WOODLAND_PLACEMENTS = [
  { position: [-91, 39], rotation: 0.2, scale: 0.96 },
  { position: [-78, 55], rotation: 2.4, scale: 1.03 },
  { position: [-65, 66], rotation: 4.1, scale: 0.98 },
  { position: [-47, 72], rotation: 1.1, scale: 1.04 },
  { position: [43, 61], rotation: 5.2, scale: 1.02 },
  { position: [58, 70], rotation: 3.2, scale: 0.95 },
  { position: [75, 56], rotation: 0.7, scale: 0.97 },
  { position: [91, 25], rotation: 2.8, scale: 1.04 },
  { position: [-94, 4], rotation: 4.8, scale: 1.01 },
  { position: [-82, 14], rotation: 1.7, scale: 0.96 },
  { position: [76, -6], rotation: 3.8, scale: 1.02 },
  { position: [91, 9], rotation: 5.6, scale: 0.98 }
];


const FLOCK_PLACEMENTS = [
  { position: [-42, -40], rotation: 0.3, scale: 1.01 },
  { position: [-31, -36], rotation: 2.1, scale: 0.98 },
  { position: [-20, -42], rotation: 4.4, scale: 1.03 },
  { position: [-47, -27], rotation: 5.6, scale: 0.97 },
  { position: [-34, -24], rotation: 1.2, scale: 1.02 },
  { position: [-21, -29], rotation: 3.5, scale: 0.99 },
  { position: [-10, -19], rotation: 0.8, scale: 1.01 },
  { position: [0, -24], rotation: 2.8, scale: 0.96 },
  { position: [11, -18], rotation: 5.1, scale: 1.03 },
  { position: [-4, -8], rotation: 1.7, scale: 0.99 },
  { position: [8, -5], rotation: 3.9, scale: 1.02 },
  { position: [19, -12], rotation: 0.2, scale: 0.98 },
  { position: [14, -40], rotation: 4.8, scale: 1.01 },
  { position: [25, -35], rotation: 1.4, scale: 0.97 },
  { position: [35, -41], rotation: 3.1, scale: 1.03 },
  { position: [18, -27], rotation: 5.8, scale: 0.99 },
  { position: [30, -23], rotation: 2.5, scale: 1.01 },
  { position: [40, -30], rotation: 4.2, scale: 0.98 },
  { position: [-52, -34], rotation: 0.9, scale: 1.02 },
  { position: [-44, -17], rotation: 3.7, scale: 0.96 },
  { position: [-30, -48], rotation: 5.3, scale: 1.01 },
  { position: [-12, -50], rotation: 2.2, scale: 0.98 },
  { position: [4, -42], rotation: 4.6, scale: 1.03 },
  { position: [16, -50], rotation: 1.1, scale: 0.97 },
  { position: [28, -46], rotation: 3.4, scale: 1.02 },
  { position: [-56, -25], rotation: 5.9, scale: 0.99 },
  { position: [-2, -34], rotation: 0.5, scale: 1.01 },
  { position: [23, -8], rotation: 2.9, scale: 0.98 },
  { position: [34, -14], rotation: 4.9, scale: 1.02 },
  { position: [-18, -10], rotation: 1.9, scale: 0.97 }
];


function smoothstep(value) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}


function boundaryRadius(angle) {
  return 1
    + 0.055 * Math.sin(angle * 3 + 0.4)
    + 0.035 * Math.sin(angle * 7 - 1.1)
    + 0.018 * Math.cos(angle * 11 + 0.7);
}


function isInsideTerrain(x, z) {
  const normalizedX = x / (TERRAIN.width / 2);
  const normalizedZ = z / (TERRAIN.depth / 2);
  const radius = Math.hypot(normalizedX, normalizedZ);
  const angle = Math.atan2(normalizedZ, normalizedX);
  return radius <= boundaryRadius(angle) - 0.025;
}


function terrainSlope(x, z) {
  const distance = 2;
  const east = (
    terrainHeight(x + distance, z)
    - terrainHeight(x - distance, z)
  ) / (distance * 2);
  const north = (
    terrainHeight(x, z + distance)
    - terrainHeight(x, z - distance)
  ) / (distance * 2);
  return Math.atan(Math.hypot(east, north));
}


function gaussian(x, z, centerX, centerZ, widthX, widthZ) {
  return Math.exp(
    -(
      ((x - centerX) / widthX) ** 2
      + ((z - centerZ) / widthZ) ** 2
    )
  );
}


function terrainHeight(x, z) {
  const normalizedZ = (z + TERRAIN.depth / 2) / TERRAIN.depth;
  const backRise = smoothstep(
    (normalizedZ - 0.2) / 0.78
  ) * 5;
  const broadShoulder = gaussian(
    x,
    z,
    -48,
    37,
    70,
    72
  ) * 1.8;
  const leftRidge = gaussian(
    x,
    z,
    -58,
    46,
    18,
    62
  ) * 5.8;
  const rightRidge = gaussian(
    x,
    z,
    48,
    67,
    22,
    50
  ) * 4.7;
  const rearRidge = gaussian(
    x,
    z,
    3,
    78,
    76,
    21
  ) * 3.4;

  const passageCenter = -5
    + Math.sin((z + 30) * 0.035) * 13;
  const passage = gaussian(
    x,
    z,
    passageCenter,
    30,
    17,
    72
  ) * 2.2;
  const meadow = gaussian(
    x,
    z,
    -15,
    -30,
    47,
    27
  );
  const activityLevel = 0.52;
  const activityBlend = gaussian(
    x,
    z,
    -15,
    -30,
    32,
    20
  );
  const naturalTexture = (
    Math.sin(x * 0.15 + z * 0.04)
    + Math.cos(z * 0.18 - x * 0.05)
  ) * 0.11;
  const sculpted = 0.08 * (x / TERRAIN.width);
  const height = 0.35
    + normalizedZ * 1.05
    + backRise
    + broadShoulder
    + leftRidge
    + rightRidge
    + rearRidge
    - passage
    + naturalTexture
    + sculpted;

  return THREE.MathUtils.lerp(
    height,
    activityLevel,
    meadow * activityBlend
  );
}


function organicBoundaryPoint(index) {
  const angle = index / TERRAIN.edgePoints * Math.PI * 2;
  const radius = boundaryRadius(angle);
  const x = Math.cos(angle) * TERRAIN.width / 2 * radius;
  const z = Math.sin(angle) * TERRAIN.depth / 2 * radius;
  return new THREE.Vector3(
    x,
    terrainHeight(x, z),
    z
  );
}


function createTerrainSurface() {
  const radialSegments = Math.round(
    (TERRAIN.columns + TERRAIN.rows) / 4
  );
  const edgePoints = TERRAIN.edgePoints;
  const positions = [];
  const colors = [];
  const indices = [];

  const addVertex = (x, z) => {
    const height = terrainHeight(x, z);
    const normalizedHeight = THREE.MathUtils.clamp(
      height / 15,
      0,
      1
    );
    const meadowTint = gaussian(x, z, -15, -30, 53, 30);
    positions.push(x, height, z);
    colors.push(
      0.18 + normalizedHeight * 0.09 + meadowTint * 0.015,
      0.27 + normalizedHeight * 0.1 + meadowTint * 0.025,
      0.15 + normalizedHeight * 0.06 + meadowTint * 0.008
    );
    return positions.length / 3 - 1;
  };

  const centerIndex = addVertex(0, 0);
  const rings = [];
  for (let ring = 1; ring <= radialSegments; ring += 1) {
    const ringVertices = [];
    const radialMix = ring / radialSegments;
    for (let edge = 0; edge < edgePoints; edge += 1) {
      const boundary = organicBoundaryPoint(edge);
      ringVertices.push(
        addVertex(
          boundary.x * radialMix,
          boundary.z * radialMix
        )
      );
    }
    rings.push(ringVertices);
  }

  for (let edge = 0; edge < edgePoints; edge += 1) {
    const nextEdge = (edge + 1) % edgePoints;
    indices.push(
      centerIndex,
      rings[0][nextEdge],
      rings[0][edge]
    );
  }

  for (let ring = 1; ring < rings.length; ring += 1) {
    for (let edge = 0; edge < edgePoints; edge += 1) {
      const nextEdge = (edge + 1) % edgePoints;
      const inner = rings[ring - 1];
      const outer = rings[ring];
      indices.push(
        inner[edge],
        inner[nextEdge],
        outer[edge],
        outer[edge],
        inner[nextEdge],
        outer[nextEdge]
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

  const terrain = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.96,
      metalness: 0,
      side: THREE.DoubleSide,
      flatShading: false
    })
  );
  terrain.castShadow = true;
  terrain.receiveShadow = true;
  terrainGroup.add(terrain);

  return {
    geometry,
    mesh: terrain,
    triangleCount: indices.length / 3
  };
}


function createOrganicBoundary() {
  const top = [];
  const bottom = [];
  const pointCount = TERRAIN.edgePoints;

  for (let index = 0; index < pointCount; index += 1) {
    const point = organicBoundaryPoint(index);
    top.push(point);
    bottom.push(
      new THREE.Vector3(
        point.x,
        point.y - TERRAIN.undersideDepth,
        point.z
      )
    );
  }

  const positions = [];
  const colors = [];
  for (let index = 0; index < pointCount; index += 1) {
    const next = (index + 1) % pointCount;
    const vertices = [
      top[index],
      top[next],
      bottom[next],
      bottom[index]
    ];
    vertices.forEach((vertex) => {
      positions.push(vertex.x, vertex.y, vertex.z);
      colors.push(0.13, 0.14, 0.1);
    });
  }

  const indices = [];
  for (let index = 0; index < pointCount; index += 1) {
    const offset = index * 4;
    indices.push(
      offset,
      offset + 1,
      offset + 2,
      offset,
      offset + 2,
      offset + 3
    );
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

  const underside = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide
    })
  );
  underside.receiveShadow = true;
  terrainGroup.add(underside);

  const edge = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(top),
    new THREE.LineBasicMaterial({
      color: 0x8f895f,
      transparent: true,
      opacity: 0.62
    })
  );
  terrainGroup.add(edge);
}


function createLighting() {
  scene.add(new THREE.HemisphereLight(
    0xdbe8df,
    0x33271c,
    2.45
  ));

  const sunlight = new THREE.DirectionalLight(
    0xffdcb6,
    2.65
  );
  sunlight.position.set(-160, 260, 120);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  sunlight.shadow.bias = -0.0002;
  sunlight.shadow.camera.left = -180;
  sunlight.shadow.camera.right = 180;
  sunlight.shadow.camera.top = 180;
  sunlight.shadow.camera.bottom = -180;
  sunlight.shadow.camera.near = 1;
  sunlight.shadow.camera.far = 560;
  scene.add(sunlight);

  const fillLight = new THREE.DirectionalLight(
    0xc9d8d2,
    0.8
  );
  fillLight.position.set(180, 110, -170);
  fillLight.castShadow = false;
  scene.add(fillLight);
}


const INITIAL_CAMERA = {
  position: new THREE.Vector3(184, 145, 220),
  target: new THREE.Vector3(0, 3.4, 18)
};


const PASTORAL_CLOSE_UP = {
  position: new THREE.Vector3(50, 34, 84),
  target: new THREE.Vector3(-24, 3.4, -7)
};


function resetView() {
  camera.position.copy(INITIAL_CAMERA.position);
  controls.target.copy(INITIAL_CAMERA.target);
  controls.update();
}


function setPastoralCloseUp() {
  camera.position.copy(PASTORAL_CLOSE_UP.position);
  controls.target.copy(PASTORAL_CLOSE_UP.target);
  controls.update();
}


function setAssetMaterials(model, isTree) {
  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach((material) => {
      if (
        isTree
        && material.name.toLowerCase().includes('trank')
      ) {
        material.color.set(0x5b3b25);
        material.transparent = false;
        material.opacity = 1;
        material.side = THREE.DoubleSide;
      }
      if (isTree && material.transparent) {
        material.side = THREE.DoubleSide;
        material.alphaTest = 0.35;
        material.depthWrite = false;
      }
      if (!isTree) {
        material.side = THREE.DoubleSide;
        if ('roughness' in material) {
          material.roughness = Math.max(material.roughness, 0.72);
        }
        if ('metalness' in material) {
          material.metalness = 0;
        }
        material.envMapIntensity = 0.45;
      }
      material.needsUpdate = true;
    });
  });
}


function placeAsset(root, model, asset) {
  root.position.set(
    asset.position[0],
    0,
    asset.position[1]
  );
  model.position.set(0, 0, 0);
  model.scale.setScalar(asset.scale);
  root.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(root);
  root.position.y = terrainHeight(
    asset.position[0],
    asset.position[1]
  ) - bounds.min.y;
  root.updateMatrixWorld(true);
}


function registerEditable(record, type) {
  record.type = type;
  record.baseScale = record.asset.scale;
  record.scaleFactor = 1;
  record.root.userData.editorAssetId = record.asset.id;
  editableAssets.set(record.asset.id, record);
}


function snapEditableAsset(record, x, z) {
  if (!isInsideTerrain(x, z) || terrainSlope(x, z) > 0.72) {
    return false;
  }

  const limits = SCALE_LIMITS[record.type];
  record.scaleFactor = THREE.MathUtils.clamp(
    record.scaleFactor,
    limits[0],
    limits[1]
  );
  record.root.position.set(x, 0, z);
  record.model.position.set(0, 0, 0);
  record.model.scale.setScalar(
    record.baseScale * record.scaleFactor
  );
  record.root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(record.root);
  record.root.position.y = terrainHeight(x, z) - bounds.min.y;
  record.root.updateMatrixWorld(true);
  return true;
}


function inspectModel(model) {
  const materials = [];
  let meshCount = 0;
  let meshesWithNormals = 0;
  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    meshCount += 1;
    if (child.geometry.getAttribute('normal')) {
      meshesWithNormals += 1;
    }
    const meshMaterials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    meshMaterials.forEach((material) => {
      materials.push({
        name: material.name,
        type: material.type,
        side: material.side === THREE.DoubleSide ? 'double' : 'single',
        texture: Boolean(material.map),
        color: material.color?.getHexString?.() || null
      });
    });
  });
  return {
    meshCount,
    meshesWithNormals,
    materials
  };
}


function assetReport(record) {
  const bounds = new THREE.Box3().setFromObject(record.root);
  const size = bounds.getSize(new THREE.Vector3());
  return `${record.asset.title} ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}m`;
}


function loadAsset(loader, asset) {
  return new Promise((resolve) => {
    loader.load(
      asset.source,
      (gltf) => {
        const model = gltf.scene;
        const originalBounds = new THREE.Box3().setFromObject(model);
        const originalSize = originalBounds.getSize(
          new THREE.Vector3()
        );
        const root = new THREE.Group();
        root.name = `${asset.id}-root`;
        root.rotation.y = asset.rotation || 0;
        root.add(model);
        setAssetMaterials(model, asset.id === 'oak-tree');
        placeAsset(root, model, asset);
        assetGroup.add(root);
        const record = {
          asset,
          model,
          root,
          originalSize,
          inspection: inspectModel(model),
          animations: gltf.animations.map((clip) => ({
            name: clip.name || 'Unnamed clip',
            duration: clip.duration
          }))
        };
        assetRoots.set(asset.id, record);
        if (asset.id !== 'sheep') {
          registerEditable(record, asset.id === 'oak-tree' ? 'oak' : 'shepherd');
        }
        resolve(record);
      },
      undefined,
      (error) => {
        console.warn(`Could not load ${asset.title}:`, error);
        resolve(null);
      }
    );
  });
}


function createWoodland(oakRecord) {
  if (!oakRecord) {
    return;
  }

  WOODLAND_PLACEMENTS.forEach((placement, index) => {
    const asset = {
      id: `woodland-oak-${index + 1}`,
      title: 'Illustrative oak',
      scale: 0.1674 * placement.scale,
      position: placement.position
    };
    const root = new THREE.Group();
    root.name = `${asset.id}-root`;
    root.rotation.y = placement.rotation;
    const model = oakRecord.model.clone(true);
    root.add(model);
    model.traverse((child) => {
      if (!child.isMesh) {
        return;
      }
      child.castShadow = false;
      child.receiveShadow = true;
    });
    placeAsset(root, model, asset);
    woodlandGroup.add(root);
    registerEditable({ asset, root, model }, 'oak');
  });
}


function updateFlockCount(count) {
  const visibleCount = Number(count);
  flockMembers.forEach((member, index) => {
    member.root.visible = flockToggle.checked
      && index < visibleCount;
  });
  if (selectedAsset && !selectedAsset.root.visible) {
    setSelectedAsset(null);
  }
}


function createFlock(sheepRecord) {
  if (!sheepRecord) {
    return;
  }

  sheepRecord.root.visible = false;
  FLOCK_PLACEMENTS.forEach((placement, index) => {
    const asset = {
      id: `flock-sheep-${index + 1}`,
      title: 'Sheep',
      scale: 0.16 * placement.scale,
      position: placement.position
    };
    const root = new THREE.Group();
    root.name = `${asset.id}-root`;
    root.rotation.y = placement.rotation;
    const model = sheepRecord.model.clone(true);
    root.add(model);
    model.traverse((child) => {
      if (!child.isMesh) {
        return;
      }
      child.castShadow = false;
      child.receiveShadow = true;
    });
    placeAsset(root, model, asset);
    flockGroup.add(root);
    const member = { asset, root, model };
    flockMembers.push(member);
    registerEditable(member, 'sheep');
  });

  updateFlockCount(flockCountSelect.value);
  const groundErrors = flockMembers.map((member) => {
    const bounds = new THREE.Box3().setFromObject(member.root);
    return Math.abs(
      bounds.min.y - terrainHeight(
        member.asset.position[0],
        member.asset.position[1]
      )
    );
  });
  let minimumSpacing = Infinity;
  for (let first = 0; first < FLOCK_PLACEMENTS.length; first += 1) {
    for (let second = first + 1; second < FLOCK_PLACEMENTS.length; second += 1) {
      minimumSpacing = Math.min(
        minimumSpacing,
        Math.hypot(
          FLOCK_PLACEMENTS[first].position[0]
            - FLOCK_PLACEMENTS[second].position[0],
          FLOCK_PLACEMENTS[first].position[1]
            - FLOCK_PLACEMENTS[second].position[1]
        )
      );
    }
  }
  console.info(
    '[Bharmour Living Atlas flock]',
    `members=${flockMembers.length} · max ground error=${Math.max(...groundErrors).toFixed(4)}m · minimum spacing=${minimumSpacing.toFixed(1)}m`
  );
}


function captureSceneConfig() {
  return {
    sceneId: EDITOR_SCENE_ID,
    schemaVersion: EDITOR_SCHEMA_VERSION,
    assets: [...editableAssets.values()].map((record) => ({
      id: record.asset.id,
      type: record.type,
      position: [
        record.root.position.x,
        record.root.position.y,
        record.root.position.z
      ],
      heading: record.root.rotation.y,
      scale: record.scaleFactor,
      visible: record.root.visible
    })),
    flock: {
      count: Number(flockCountSelect.value),
      visible: flockToggle.checked,
      grouping: 'three illustrative meadow subgroups'
    }
  };
}


function setEditorState(message) {
  editorState.textContent = message;
}


function updateSelectionHelper() {
  while (editorHelperGroup.children.length) {
    editorHelperGroup.remove(editorHelperGroup.children[0]);
  }
  if (!selectedAsset) {
    editorSelection.textContent = 'No object selected';
    return;
  }
  const helper = new THREE.BoxHelper(
    selectedAsset.root,
    selectedAsset.type === 'sheep'
      ? 0xe5e1d1
      : selectedAsset.type === 'shepherd'
        ? 0xe07c58
        : 0xa7c96b
  );
  helper.update();
  editorHelperGroup.add(helper);
  editorSelection.textContent = `${selectedAsset.type} · ${selectedAsset.asset.id}`;
}


function setSelectedAsset(record) {
  selectedAsset = record;
  updateSelectionHelper();
}


function editableRecordFromObject(object) {
  let current = object;
  while (current) {
    const id = current.userData.editorAssetId;
    if (id && editableAssets.has(id)) {
      return editableAssets.get(id);
    }
    current = current.parent;
  }
  return null;
}


function isAssetVisible(record) {
  let current = record.root;
  while (current) {
    if (!current.visible) {
      return false;
    }
    current = current.parent;
  }
  return true;
}


function pointerFromEvent(event) {
  const bounds = canvas.getBoundingClientRect();
  editorPointer.x = (
    (event.clientX - bounds.left) / bounds.width
  ) * 2 - 1;
  editorPointer.y = -(
    (event.clientY - bounds.top) / bounds.height
  ) * 2 + 1;
}


function raycastAsset(event) {
  pointerFromEvent(event);
  editorRaycaster.setFromCamera(editorPointer, camera);
  const roots = [...editableAssets.values()]
    .filter(isAssetVisible)
    .map((record) => record.root);
  const hits = editorRaycaster.intersectObjects(roots, true);
  for (const hit of hits) {
    const record = editableRecordFromObject(hit.object);
    if (record && isAssetVisible(record)) {
      return record;
    }
  }
  return null;
}


function raycastTerrain(event) {
  if (!surfaceMesh) {
    return null;
  }
  pointerFromEvent(event);
  editorRaycaster.setFromCamera(editorPointer, camera);
  const hits = editorRaycaster.intersectObject(surfaceMesh, false);
  return hits.length ? hits[0].point : null;
}


function recordsForDrag(record) {
  if (
    moveFlockMode
    && record.type === 'sheep'
  ) {
    return flockMembers;
  }
  return [record];
}


function translateRecords(records, deltaX, deltaZ, startPositions) {
  const nextPositions = records.map((record) => ({
    record,
    x: startPositions.get(record).x + deltaX,
    z: startPositions.get(record).z + deltaZ
  }));
  if (nextPositions.some(({ x, z }) => (
    !isInsideTerrain(x, z) || terrainSlope(x, z) > 0.72
  ))) {
    return false;
  }
  nextPositions.forEach(({ record, x, z }) => {
    snapEditableAsset(record, x, z);
  });
  updateSelectionHelper();
  return true;
}


function pushHistory(before, after) {
  if (JSON.stringify(before) === JSON.stringify(after)) {
    return;
  }
  undoStack.push({ before, after });
  if (undoStack.length > 50) {
    undoStack.shift();
  }
  redoStack.length = 0;
}


function applySceneConfig(config) {
  config.assets.forEach((saved) => {
    const record = editableAssets.get(saved.id);
    record.scaleFactor = saved.scale;
    record.root.rotation.y = saved.heading;
    snapEditableAsset(
      record,
      saved.position[0],
      saved.position[2]
    );
    record.root.visible = saved.visible;
  });
  flockCountSelect.value = String(config.flock.count);
  flockToggle.checked = config.flock.visible;
  updateFlockCount(config.flock.count);
  flockGroup.visible = config.flock.visible;
  const shepherdRecord = editableAssets.get('shepherd');
  if (shepherdRecord) {
    shepherdRecord.root.visible = config.assets.find(
      (asset) => asset.id === 'shepherd'
    ).visible;
  }
  updateSelectionHelper();
}


function validateSceneConfig(value) {
  if (
    !value
    || value.sceneId !== EDITOR_SCENE_ID
    || value.schemaVersion !== EDITOR_SCHEMA_VERSION
    || !Array.isArray(value.assets)
    || !value.flock
  ) {
    throw new Error('Unsupported scene JSON schema.');
  }
  const validCounts = [1, 10, 18, 30];
  if (
    !validCounts.includes(value.flock.count)
    || typeof value.flock.visible !== 'boolean'
  ) {
    throw new Error('Invalid flock settings.');
  }
  const seen = new Set();
  value.assets.forEach((saved) => {
    const record = editableAssets.get(saved.id);
    if (
      !record
      || seen.has(saved.id)
      || record.type !== saved.type
      || !Array.isArray(saved.position)
      || saved.position.length !== 3
      || !saved.position.every(Number.isFinite)
      || !Number.isFinite(saved.heading)
      || !Number.isFinite(saved.scale)
      || !SCALE_LIMITS[saved.type]
      || saved.scale < SCALE_LIMITS[saved.type][0]
      || saved.scale > SCALE_LIMITS[saved.type][1]
      || typeof saved.visible !== 'boolean'
      || !isInsideTerrain(saved.position[0], saved.position[2])
      || terrainSlope(saved.position[0], saved.position[2]) > 0.72
    ) {
      throw new Error(`Invalid asset entry: ${saved.id || 'unknown'}.`);
    }
    seen.add(saved.id);
  });
  if (seen.size !== editableAssets.size) {
    throw new Error('Scene JSON does not contain every editable asset.');
  }
  return value;
}


function undoEditorAction() {
  const command = undoStack.pop();
  if (!command) {
    return;
  }
  applySceneConfig(command.before);
  redoStack.push(command);
}


function redoEditorAction() {
  const command = redoStack.pop();
  if (!command) {
    return;
  }
  applySceneConfig(command.after);
  undoStack.push(command);
}


function exportSceneConfig() {
  const blob = new Blob(
    [JSON.stringify(captureSceneConfig(), null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bharmour-living-atlas-scene.json';
  link.click();
  URL.revokeObjectURL(url);
  setEditorState('Scene JSON exported');
}


function importSceneFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const config = validateSceneConfig(
        JSON.parse(reader.result)
      );
      const before = captureSceneConfig();
      applySceneConfig(config);
      pushHistory(before, captureSceneConfig());
      setEditorState('Scene JSON imported');
    }
    catch (error) {
      setEditorState(`Import rejected: ${error.message}`);
    }
  };
  reader.readAsText(file);
}


function beginEditorDrag(event, record) {
  const terrainPoint = raycastTerrain(event);
  if (!terrainPoint) {
    return;
  }
  const records = recordsForDrag(record);
  editorDrag = {
    record,
    records,
    before: captureSceneConfig(),
    startTerrain: terrainPoint,
    startRotation: record.root.rotation.y,
    startScale: record.scaleFactor,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startPositions: new Map(
      records.map((member) => [
        member,
        {
          x: member.root.position.x,
          z: member.root.position.z
        }
      ])
    )
  };
  controls.enabled = false;
  canvas.setPointerCapture(event.pointerId);
  setEditorState(`Ground snap: on · ${editorTool}`);
}


function updateEditorDrag(event) {
  if (!editorDrag) {
    return;
  }
  if (editorTool === 'move') {
    const terrainPoint = raycastTerrain(event);
    if (terrainPoint) {
      translateRecords(
        editorDrag.records,
        terrainPoint.x - editorDrag.startTerrain.x,
        terrainPoint.z - editorDrag.startTerrain.z,
        editorDrag.startPositions
      );
    }
  }
  else if (editorTool === 'rotate') {
    editorDrag.record.root.rotation.y = editorDrag.startRotation
      + (event.clientX - editorDrag.startClientX) * 0.01;
    updateSelectionHelper();
  }
  else if (editorTool === 'scale') {
    const limits = SCALE_LIMITS[editorDrag.record.type];
    editorDrag.record.scaleFactor = THREE.MathUtils.clamp(
      editorDrag.startScale
        * Math.exp((editorDrag.startClientY - event.clientY) * 0.005),
      limits[0],
      limits[1]
    );
    snapEditableAsset(
      editorDrag.record,
      editorDrag.record.root.position.x,
      editorDrag.record.root.position.z
    );
    updateSelectionHelper();
  }
}


function finishEditorDrag(event) {
  if (!editorDrag) {
    return;
  }
  controls.enabled = true;
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  pushHistory(editorDrag.before, captureSceneConfig());
  editorDrag = null;
}


function onEditorPointerDown(event) {
  if (!editMode) {
    return;
  }
  const record = raycastAsset(event);
  if (record) {
    setSelectedAsset(record);
    beginEditorDrag(event, record);
  }
  else {
    setSelectedAsset(null);
  }
}


function onEditorPointerMove(event) {
  if (editMode && editorDrag) {
    updateEditorDrag(event);
  }
}


function onEditorPointerUp(event) {
  if (editorDrag) {
    finishEditorDrag(event);
  }
}


function setEditorTool(tool) {
  editorTool = tool;
  editorToolButtons.forEach((button) => {
    button.classList.toggle(
      'active',
      button.dataset.editorTool === tool
    );
  });
  setEditorState(`Ground snap: on · ${tool}`);
}


function setEditMode(enabled) {
  editMode = enabled;
  if (enabled) {
    editorPanel.removeAttribute('hidden');
  }
  else {
    editorPanel.setAttribute('hidden', '');
  }
  editToggle.setAttribute('aria-pressed', String(enabled));
  editToggle.textContent = enabled
    ? 'Exit Edit Mode'
    : 'Edit Scene';
  if (!enabled) {
    setSelectedAsset(null);
    moveFlockMode = false;
    moveFlockButton.classList.remove('active');
    controls.enabled = true;
  }
}


function clampControls() {
  controls.target.x = THREE.MathUtils.clamp(
    controls.target.x,
    -105,
    105
  );
  controls.target.y = THREE.MathUtils.clamp(
    controls.target.y,
    0,
    14
  );
  controls.target.z = THREE.MathUtils.clamp(
    controls.target.z,
    -82,
    82
  );
}


function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
  );
}


const surface = createTerrainSurface();
surfaceMesh = surface.mesh;
createOrganicBoundary();
createLighting();
resetView();

statusElement.textContent = `${surface.triangleCount.toLocaleString()} triangles · loading oak and sheep`;

resetButton.addEventListener('click', resetView);
closeUpButton.addEventListener('click', setPastoralCloseUp);
editToggle.addEventListener('click', () => setEditMode(!editMode));
editorToolButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setEditorTool(button.dataset.editorTool);
  });
});
moveFlockButton.addEventListener('click', () => {
  moveFlockMode = !moveFlockMode;
  moveFlockButton.classList.toggle('active', moveFlockMode);
  setEditorState(moveFlockMode
    ? 'Ground snap: on · move flock'
    : `Ground snap: on · ${editorTool}`);
});
undoButton.addEventListener('click', undoEditorAction);
redoButton.addEventListener('click', redoEditorAction);
exportButton.addEventListener('click', exportSceneConfig);
importButton.addEventListener('click', () => importInput.click());
importInput.addEventListener('change', () => {
  if (importInput.files[0]) {
    importSceneFile(importInput.files[0]);
  }
  importInput.value = '';
});
restoreButton.addEventListener('click', () => {
  if (!defaultLayout) {
    setEditorState('Default layout is still loading');
    return;
  }
  const before = captureSceneConfig();
  applySceneConfig(defaultLayout);
  pushHistory(before, captureSceneConfig());
  setEditorState('Default layout restored');
});
controls.addEventListener('change', clampControls);
window.addEventListener('resize', resize);
canvas.addEventListener('pointerdown', onEditorPointerDown);
canvas.addEventListener('pointermove', onEditorPointerMove);
canvas.addEventListener('pointerup', onEditorPointerUp);
canvas.addEventListener('pointercancel', onEditorPointerUp);
setEditorTool('move');

fogToggle.addEventListener('change', () => {
  scene.fog = fogToggle.checked ? sceneFog : null;
});

woodlandToggle.addEventListener('change', () => {
  woodlandGroup.visible = woodlandToggle.checked;
  if (selectedAsset && selectedAsset.type === 'oak') {
    const isWoodland = selectedAsset.asset.id.startsWith('woodland-oak-');
    if (isWoodland && !woodlandToggle.checked) {
      setSelectedAsset(null);
    }
  }
});

flockToggle.addEventListener('change', () => {
  updateFlockCount(flockCountSelect.value);
  flockGroup.visible = flockToggle.checked;
  if (!flockToggle.checked && selectedAsset?.type === 'sheep') {
    setSelectedAsset(null);
  }
});

flockCountSelect.addEventListener('change', () => {
  updateFlockCount(flockCountSelect.value);
});

shepherdToggle.addEventListener('change', () => {
  const shepherdRecord = assetRoots.get('shepherd');
  if (shepherdRecord) {
    shepherdRecord.root.visible = shepherdToggle.checked;
    if (!shepherdToggle.checked && selectedAsset === shepherdRecord) {
      setSelectedAsset(null);
    }
  }
  defaultLayout = captureSceneConfig();
});

hazeSlider.addEventListener('input', () => {
  setFogStrength(hazeSlider.value);
});

strongFogButton.addEventListener('click', () => {
  fogToggle.checked = true;
  scene.fog = sceneFog;
  setFogStrength(0.9);
});

const loader = new GLTFLoader();
Promise.all(
  ASSETS.map((asset) => loadAsset(loader, asset))
).then((records) => {
  const loaded = records.filter(Boolean);
  createWoodland(assetRoots.get('oak-tree'));
  createFlock(assetRoots.get('sheep'));
  const sheepRecord = assetRoots.get('sheep');
  const animationSummary = sheepRecord
    && sheepRecord.animations.length
    ? ` · animations: ${sheepRecord.animations.map((clip) => `${clip.name} (${clip.duration.toFixed(2)}s)`).join(', ')}`
    : ' · sheep animations: none';
  statusElement.textContent = `${surface.triangleCount.toLocaleString()} triangles · ${loaded.map(assetReport).join(' · ')}`;
  statusElement.textContent += ` · ${WOODLAND_PLACEMENTS.length} illustrative oaks`;
  statusElement.textContent += ` · flock: ${flockMembers.length}${animationSummary}`;
  woodlandGroup.visible = woodlandToggle.checked;
  flockGroup.visible = flockToggle.checked;
  const shepherdRecord = assetRoots.get('shepherd');
  if (shepherdRecord) {
    shepherdRecord.root.visible = shepherdToggle.checked;
  }
  console.info(
    '[Bharmour Living Atlas assets]',
    loaded.map((record) => ({
      id: record.asset.id,
      source: record.asset.source,
      position: record.asset.position,
      dimensions: assetReport(record),
      originalDimensions: record.originalSize.toArray(),
      inspection: record.inspection,
      animations: record.animations
    }))
  );
});


function animate() {
  requestAnimationFrame(animate);
  clampControls();
  controls.update();
  if (editorHelperGroup.children[0]) {
    editorHelperGroup.children[0].update();
  }
  renderer.render(scene, camera);
}


animate();
