import * as THREE from 'three';

import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import './bharmour-assets-preview.css';


const canvas =
  document.querySelector(
    '#asset-inspection-canvas'
  );


const statusElement =
  document.querySelector(
    '#asset-status'
  );


const reportElement =
  document.querySelector(
    '#asset-report'
  );


const resetButton =
  document.querySelector(
    '#asset-reset-camera'
  );


const ASSETS = [
  {
    id: 'pine-tree',
    title: 'Pine tree',
    source: '/models/trees/pine_tree%20.glb',
    color: '#e0b45d',
    scale: 3.9,
    upAxis: 'z',
    authoredHeight: 3.0778,
    intendedHeight: 12,
    position: [-5, 0, 0]
  },
  {
    id: 'sheep',
    title: 'Sheep',
    source: '/models/animals/sheep.glb',
    color: '#e5e1d1',
    scale: 0.16,
    upAxis: 'y',
    intendedShoulderHeight: 0.9,
    position: [5, 0, 0]
  },
  {
    id: 'oak-tree',
    title: 'Oak tree',
    source: '/models/trees/oak_tree.glb',
    color: '#a7c96b',
    scale: 0.1674,
    upAxis: 'y',
    authoredHeight: 71.688,
    intendedHeight: 12,
    position: [0, 0, 6]
  }
];


const renderer =
  new THREE.WebGLRenderer({
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
renderer.outputColorSpace =
  THREE.SRGBColorSpace;
renderer.toneMapping =
  THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure =
  1.05;
renderer.shadowMap.enabled =
  true;
renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;


const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x20231f);


const camera =
  new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );


const controls =
  new OrbitControls(
    camera,
    canvas
  );

controls.enableDamping =
  true;
controls.dampingFactor =
  0.08;
controls.minDistance =
  2;
controls.maxDistance =
  40;
controls.maxPolarAngle =
  Math.PI * 0.49;
controls.target.set(
  0,
  1.25,
  0
);


function resetCamera() {
  camera.position.set(
    26,
    14,
    34
  );
  controls.target.set(
    0,
    5,
    0
  );
  controls.update();
}


function createGround() {
  const ground =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        30,
        30
      ),
      new THREE.MeshStandardMaterial({
        color: 0x77786d,
        roughness: 1,
        metalness: 0
      })
    );

  ground.rotation.x =
    -Math.PI / 2;
  ground.receiveShadow =
    true;
  scene.add(
    ground
  );
}


function createReferenceScale() {
  const group =
    new THREE.Group();

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xe07c58
    });

  const pole = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.035,
      1,
      0.035
    ),
    material
  );

  pole.position.y =
    0.5;

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.5,
      0.035,
      0.035
    ),
    material
  );

  cap.position.y =
    1;

  group.position.set(
    0,
    0,
    -5
  );
  group.add(
    pole,
    cap
  );
  scene.add(
    group
  );
}


function createLights() {
  scene.add(
    new THREE.HemisphereLight(
      0xe8eee8,
      0x332b22,
      2.4
    )
  );

  const sunlight =
    new THREE.DirectionalLight(
      0xffe0af,
      3.2
    );

  sunlight.position.set(
    -8,
    14,
    10
  );
  sunlight.castShadow =
    true;
  sunlight.shadow.mapSize.set(
    1024,
    1024
  );

  scene.add(
    sunlight
  );
}


function describeMaterials(
  object
) {
  const descriptions = [];
  let meshCount = 0;
  let textureCount = 0;

  object.traverse(
    (child) => {
      if (
        !child.isMesh
      ) {
        return;
      }

      meshCount += 1;
      const materials = Array.isArray(
        child.material
      )
        ? child.material
        : [child.material];

      materials.forEach(
        (material) => {
          const texture =
            material.map
            || material.alphaMap
            || material.normalMap
            || material.roughnessMap;

          if (
            texture
          ) {
            textureCount += 1;
          }

          descriptions.push(
            `${material.type} · transparent=${material.transparent} · alphaMode=${material.alphaTest.toFixed(2)} · side=${material.side === THREE.DoubleSide ? 'double' : 'single'} · texture=${texture ? 'yes' : 'no'}`
          );
        }
      );
    }
  );

  return {
    meshCount,
    textureCount,
    descriptions
  };
}


function describeHierarchy(
  object
) {
  const nodes = [];

  object.traverse(
    (child) => {
      nodes.push(
        `${child.name || '(unnamed)'} `
        + `pos(${child.position.x.toFixed(2)},${child.position.y.toFixed(2)},${child.position.z.toFixed(2)}) `
        + `scale(${child.scale.x.toFixed(2)},${child.scale.y.toFixed(2)},${child.scale.z.toFixed(2)})`
      );
    }
  );

  return nodes;
}


function alignModel(
  model,
  asset
) {
  const originalBounds =
    new THREE.Box3().setFromObject(
      model
    );
  const originalSize =
    originalBounds.getSize(
      new THREE.Vector3()
    );
  const originalMin =
    originalBounds.min.clone();
  const hierarchy =
    describeHierarchy(model);

  if (
    asset.upAxis === 'z'
  ) {
    model.rotation.x =
      -Math.PI / 2;
  }

  model.scale.setScalar(
    asset.scale
  );
  model.updateMatrixWorld(
    true
  );

  const scaledBounds =
    new THREE.Box3().setFromObject(
      model
    );
  const finalSize =
    scaledBounds.getSize(
      new THREE.Vector3()
    );
  const groundCorrection =
    -scaledBounds.min.y;

  model.position.y +=
    groundCorrection;
  model.position.x =
    asset.position[0];
  model.position.z =
    asset.position[2];

  setMeshFlags(
    model,
    asset.id.includes('tree')
  );

  return {
    originalSize,
    originalMin,
    finalSize,
    groundCorrection,
    originalRotation: asset.upAxis === 'z'
      ? '-90deg X (Z-up to Y-up)'
      : 'none (Y-up retained)',
    hierarchy,
    materials: describeMaterials(model)
  };
}


function setMeshFlags(
  object,
  isTree
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

      const materials = Array.isArray(
        child.material
      )
        ? child.material
        : [child.material];

        materials.forEach(
          (material) => {
            if (
              isTree
              && material.name.toLowerCase().includes('trank')
            ) {
              material.color.set(
                0x5b3b25
              );
              material.transparent =
                false;
              material.opacity =
                1;
              material.side =
                THREE.DoubleSide;
            }

            if (
              isTree
              && material.transparent
          ) {
            material.side =
              THREE.DoubleSide;
            material.alphaTest =
              0.35;
            material.depthWrite =
              false;
          }

          material.needsUpdate =
            true;
        }
      );
    }
  );
}


function formatReport(
  asset,
  diagnostic
) {
  const size = diagnostic.finalSize;
  const original = diagnostic.originalSize;
  const material = diagnostic.materials;
  return `<div class="asset-report"><strong>${asset.title}</strong>\n`
    + `Original bounds: ${original.x.toFixed(2)} x ${original.y.toFixed(2)} x ${original.z.toFixed(2)} units\n`
    + `Final bounds: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)} units\n`
    + `Scale: ${asset.scale} · rotation: ${diagnostic.originalRotation}\n`
    + (asset.intendedHeight
      ? `Target height: ${asset.intendedHeight.toFixed(2)}m\n`
      : `Target shoulder height: ${asset.intendedShoulderHeight.toFixed(2)}m\n`)
    + `Hierarchy nodes: ${diagnostic.hierarchy.length}\n`
    + `Origin correction: ${diagnostic.groundCorrection.toFixed(2)}m to ground\n`
    + `Meshes: ${material.meshCount} · texture maps: ${material.textureCount}\n`
    + `Materials:\n${material.descriptions.join('\n')}</div>`;
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
          const diagnostic =
            alignModel(
              gltf.scene,
              asset
            );

          scene.add(
            gltf.scene
          );

          reportElement.insertAdjacentHTML(
            'beforeend',
            formatReport(
              asset,
              diagnostic
            )
          );

          resolve({
            ok: true,
            animations: gltf.animations.map(
              (clip) => clip.name || 'Unnamed clip'
            )
          });
        },
        undefined,
        (error) => {
          reportElement.insertAdjacentHTML(
            'beforeend',
            `<div class="asset-report"><strong>${asset.title}</strong>\nLoad failed. See console.</div>`
          );
          console.warn(
            `Asset inspection failed for ${asset.source}:`,
            error
          );
          resolve({
            ok: false,
            animations: []
          });
        }
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
  renderer.render(
    scene,
    camera
  );
}


resetButton.addEventListener(
  'click',
  resetCamera
);

window.addEventListener(
  'resize',
  resize
);


createGround();
createReferenceScale();
createLights();
resetCamera();

const loader =
  new GLTFLoader();

Promise.all(
  ASSETS.map(
    (asset) => loadAsset(
      loader,
      asset
    )
  )
).then(
  (results) => {
    const loaded = results.filter(
      (result) => result.ok
    ).length;
    const animations = results.flatMap(
      (result) => result.animations
    );

    statusElement.textContent =
      `${loaded}/${ASSETS.length} assets loaded`
      + (animations.length
        ? ` · animations: ${animations.join(', ')}`
        : ' · no embedded animations');
  }
);


animate();
