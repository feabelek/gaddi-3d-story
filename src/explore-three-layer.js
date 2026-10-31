import * as THREE from 'three';

import * as maplibregl from 'maplibre-gl';

import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


// This is an existing WGS84 route point from
// Bharmour_Darcha_RP_WGS84.geojson. The oak is an illustrative
// reconstruction, not a surveyed tree at this exact point.
export const BHARMOUR_EXPLORE_ASSETS = [
  {
    id: 'bharmour-oak-tree',
    type: 'gltf',
    source: '/models/trees/oak_tree.glb',
    location: [
      76.5326151804133,
      32.4444683599394
    ],
    elevationOffset: 0,
    scale: 0.5,
    upAxis: 'y',
    rotation: [
      0,
      0,
      0
    ],
    animation: null,
    visibility: 'explore'
  }
];


const degreesToRadians =
  Math.PI / 180;


function disposeObject(
  object
) {

  object.traverse(
    (child) => {
      if (
        child.geometry
      ) {
        child.geometry.dispose();
      }

      if (
        child.material
      ) {
        const materials = Array.isArray(
          child.material
        )
          ? child.material
          : [child.material];

        materials.forEach(
          (material) => material.dispose()
        );
      }
    }
  );

}


function createPlaceholder() {

  const group =
    new THREE.Group();

  const baseMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x2a2118,
      roughness: 0.82,
      metalness: 0.05,
      transparent: true,
      opacity: 1
    });

  const markerMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe0b45d,
      roughness: 0.55,
      metalness: 0.08,
      transparent: true,
      opacity: 1
    });

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(
      5.5,
      6.5,
      1.8,
      12
    ),
    baseMaterial
  );

  base.position.y = 0.9;

  const marker = new THREE.Mesh(
    new THREE.ConeGeometry(
      3.8,
      9,
      8
    ),
    markerMaterial
  );

  marker.position.y = 6.3;

  group.add(
    base,
    marker
  );

  return group;

}


function setObjectOpacity(
  object,
  opacity
) {

  object.traverse(
    (child) => {
      if (
        !child.material
      ) {
        return;
      }

      const materials = Array.isArray(
        child.material
      )
        ? child.material
        : [child.material];

      materials.forEach(
        (material) => {
          if (
            material.userData.exploreBaseOpacity === undefined
          ) {
            material.userData.exploreBaseOpacity =
              material.opacity;
          }

          material.transparent =
            true;

          material.opacity =
            material.userData.exploreBaseOpacity * opacity;
        }
      );
    }
  );

}


export function createExploreThreeLayer({
  map,
  assets = BHARMOUR_EXPLORE_ASSETS
}) {

  const scene =
    new THREE.Scene();

  const camera =
    new THREE.Camera();

  const clock =
    new THREE.Clock();

  const loader =
    new GLTFLoader();

  const assetGroups = new Map();
  const mixers = [];
  let renderer = null;
  let gl = null;
  let visible = false;
  let opacity = 0;
  let fadeFrame = null;
  let fadeToken = 0;

  scene.add(
    new THREE.HemisphereLight(
      0xfff3d0,
      0x34281d,
      2.2
    )
  );

  const keyLight =
    new THREE.DirectionalLight(
      0xffe4ae,
      2.8
    );

  keyLight.position.set(
    -120,
    -160,
    240
  );

  scene.add(
    keyLight
  );

  function placeAsset(
    asset,
    group
  ) {

    const elevation =
      map.queryTerrainElevation(
        asset.location
      );

    if (
      elevation === null
    ) {
      group.visible =
        false;

      return false;
    }

    const mercator =
      maplibregl.MercatorCoordinate.fromLngLat(
        asset.location,
        elevation + (asset.elevationOffset || 0)
      );

    const meterScale =
      mercator.meterInMercatorCoordinateUnits();

    group.position.set(
      mercator.x,
      mercator.y,
      mercator.z
    );

    group.visible =
      true;

    group.scale.setScalar(
      meterScale * (asset.scale || 1)
    );

    const axisRotation =
      asset.upAxis === 'z'
        ? 0
        : Math.PI / 2;

    group.rotation.set(
      axisRotation
      + (asset.rotation?.[0] || 0) * degreesToRadians,
      (asset.rotation?.[1] || 0) * degreesToRadians,
      (asset.rotation?.[2] || 0) * degreesToRadians
    );

    return true;

  }

  function addAsset(
    asset,
    group
  ) {

    placeAsset(
      asset,
      group
    );

    setObjectOpacity(
      group,
      opacity
    );

    scene.add(
      group
    );

    assetGroups.set(
      asset.id,
      {
        asset,
        group
      }
    );

  }

  function loadAsset(
    asset
  ) {

    if (
      asset.type === 'gltf'
      && asset.source
    ) {
      loader.load(
        asset.source,
        (gltf) => {
          addAsset(
            asset,
            gltf.scene
          );

          if (
            asset.animation
            && gltf.animations.length
          ) {
            const mixer =
              new THREE.AnimationMixer(
                gltf.scene
              );

            const clip =
              gltf.animations.find(
                (candidate) =>
                  candidate.name === asset.animation
              ) || gltf.animations[0];

            mixer.clipAction(
              clip
            ).play();

            mixers.push(
              mixer
            );
          }

          map.triggerRepaint();
        },
        undefined,
        (error) => {
          console.warn(
            `Explore asset failed to load: ${asset.source}`,
            error
          );
        }
      );

      return;
    }

    addAsset(
      asset,
      createPlaceholder()
    );

  }

  const layer = {
    id: 'bharmour-explore-three',
    type: 'custom',
    renderingMode: '3d',

    onAdd(mapInstance, context) {
      gl = context;

      renderer = new THREE.WebGLRenderer({
        canvas: mapInstance.getCanvas(),
        context,
        antialias: true
      });

      renderer.autoClear = false;

      assets
        .filter(
          (asset) => asset.visibility === 'explore'
        )
        .forEach(loadAsset);
    },

    setVisible(nextVisible) {
      visible = nextVisible;

      if (
        !visible
      ) {
        setObjectOpacity(
          scene,
          0
        );
      }

      map.triggerRepaint();
    },

    refreshTerrain() {
      assetGroups.forEach(
        ({ asset, group }) => {
          placeAsset(
            asset,
            group
          );
        }
      );

      map.triggerRepaint();
    },

    fadeTo(
      target,
      duration = 420
    ) {
      const startOpacity =
        opacity;

      const token =
        ++fadeToken;

      visible = true;

      if (
        fadeFrame
      ) {
        cancelAnimationFrame(
          fadeFrame
        );
      }

      if (
        duration === 0
      ) {
        opacity = target;
        setObjectOpacity(
          scene,
          opacity
        );
        visible = target > 0;
        map.triggerRepaint();
        return;
      }

      const startedAt =
        performance.now();

      const animate = (
        now
      ) => {
        if (
          token !== fadeToken
        ) {
          return;
        }

        const progress =
          Math.min(
            1,
            (now - startedAt) / duration
          );

        const eased =
          progress * progress * (3 - 2 * progress);

        opacity =
          startOpacity
          + (target - startOpacity) * eased;

        setObjectOpacity(
          scene,
          opacity
        );

        map.triggerRepaint();

        if (
          progress < 1
        ) {
          fadeFrame =
            requestAnimationFrame(
              animate
            );
        }
        else {
          fadeFrame = null;
          visible = target > 0;
        }
      };

      fadeFrame =
        requestAnimationFrame(
          animate
        );
    },

    render(context, args) {
      if (
        !visible
        || !renderer
      ) {
        return;
      }

      const matrix =
        args.defaultProjectionData?.mainMatrix
        || args.mainMatrix
        || args.matrix;

      camera.projectionMatrix.fromArray(
        matrix
      );

      camera.matrixWorld.identity();
      camera.matrixWorldInverse.identity();

      const delta =
        clock.getDelta();

      mixers.forEach(
        (mixer) => mixer.update(delta)
      );

      renderer.resetState();
      renderer.render(
        scene,
        camera
      );

      map.triggerRepaint();
    },

    onRemove() {
      if (
        fadeFrame
      ) {
        cancelAnimationFrame(
          fadeFrame
        );
      }

      assetGroups.forEach(
        ({ group }) => {
          scene.remove(
            group
          );
          disposeObject(
            group
          );
        }
      );

      mixers.length = 0;

      if (
        renderer
      ) {
        renderer.dispose();
      }

      gl = null;
      renderer = null;
    }
  };

  return layer;
}
