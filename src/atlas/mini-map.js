import * as maplibregl from 'maplibre-gl';

function geometryParts(geoJSON) {
  const features = geoJSON?.type === 'FeatureCollection'
    ? geoJSON.features || []
    : geoJSON?.type === 'Feature'
      ? [geoJSON]
      : [{ geometry: geoJSON }];

  return features.flatMap((feature) => {
    const geometry = feature?.geometry;
    if (geometry?.type === 'LineString') return [geometry.coordinates];
    if (geometry?.type === 'MultiLineString') return geometry.coordinates || [];
    return [];
  }).filter((part) => part.length >= 2 && part.every(isValidCoordinate));
}

function geometryCoordinates(geoJSON) {
  const features = geoJSON?.type === 'FeatureCollection'
    ? geoJSON.features || []
    : geoJSON?.type === 'Feature'
      ? [geoJSON]
      : [{ geometry: geoJSON }];

  const collect = (coordinates) => {
    if (!Array.isArray(coordinates)) return [];
    if (typeof coordinates[0] === 'number') return [coordinates];
    return coordinates.flatMap(collect);
  };

  return features.flatMap((feature) => collect(feature?.geometry?.coordinates));
}

function isValidCoordinate(coordinate) {
  return Array.isArray(coordinate)
    && coordinate.length >= 2
    && Number.isFinite(coordinate[0])
    && Number.isFinite(coordinate[1]);
}

function routeMetric(parts) {
  const metricParts = [];
  let totalLength = 0;

  parts.forEach((coordinates) => {
    const distances = [0];
    let length = 0;
    for (let index = 1; index < coordinates.length; index += 1) {
      const previous = coordinates[index - 1];
      const current = coordinates[index];
      const latitudeScale = Math.cos(
        ((previous[1] + current[1]) / 2) * Math.PI / 180
      );
      length += Math.hypot(
        (current[0] - previous[0]) * latitudeScale,
        current[1] - previous[1]
      );
      distances.push(length);
    }
    metricParts.push({ coordinates, distances, length, start: totalLength });
    totalLength += length;
  });

  return { parts: metricParts, length: totalLength };
}

function coordinateAtProgress(progress, metric) {
  if (!metric?.parts?.length || metric.length === 0) return null;

  const target = Math.max(0, Math.min(1, progress)) * metric.length;
  const part = metric.parts.find((candidate, index) => {
    const end = candidate.start + candidate.length;
    return target <= end || index === metric.parts.length - 1;
  });
  if (!part?.length) return part?.coordinates?.[0] || null;

  const localTarget = Math.max(0, target - part.start);
  let segment = 1;
  while (
    segment < part.distances.length - 1
    && part.distances[segment] < localTarget
  ) {
    segment += 1;
  }

  const previousDistance = part.distances[segment - 1];
  const segmentDistance = part.distances[segment] - previousDistance;
  const ratio = segmentDistance === 0
    ? 0
    : (localTarget - previousDistance) / segmentDistance;
  const previous = part.coordinates[segment - 1];
  const current = part.coordinates[segment];

  const coordinate = [
    previous[0] + (current[0] - previous[0]) * ratio,
    previous[1] + (current[1] - previous[1]) * ratio
  ];
  return isValidCoordinate(coordinate) ? coordinate : null;
}

function progressOnRoute(coordinate, metric) {
  if (!isValidCoordinate(coordinate) || !metric?.parts?.length || metric.length === 0) {
    return null;
  }

  let closestDistance = Infinity;
  let closestProgress = null;

  metric.parts.forEach((part) => {
    for (let index = 1; index < part.coordinates.length; index += 1) {
      const start = part.coordinates[index - 1];
      const end = part.coordinates[index];
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

      if (distance < closestDistance) {
        closestDistance = distance;
        const distanceAlongPart = part.distances[index - 1]
          + (part.distances[index] - part.distances[index - 1]) * ratio;
        closestProgress = (part.start + distanceAlongPart) / metric.length;
      }
    }
  });

  return Number.isFinite(closestProgress)
    ? Math.max(0, Math.min(1, closestProgress))
    : null;
}

function chapterCoordinate(chapter) {
  if (isValidCoordinate(chapter?.miniMapCoordinate)) return chapter.miniMapCoordinate;
  if (isValidCoordinate(chapter?.routeStop)) return chapter.routeStop;
  return null;
}

function routeConfigValue(routeConfig, key) {
  return typeof routeConfig === 'string' ? routeConfig : routeConfig?.[key];
}

function routeKey(routeId, partIndex) {
  return `mini-route-${encodeURIComponent(routeId)}-${partIndex}`;
}

/**
 * Creates a fixed, north-up overview map. Story state remains owned by the
 * caller; route IDs, route data, context data, and chapter locations are all
 * supplied through configuration.
 */
export function createMiniMap(container, {
  mapConfig = {},
  onChapterSelect
} = {}) {
  if (!container) {
    return {
      setState() {},
      setActiveRoute() {},
      setRouteProgress() {},
      setJourneyState() {},
      setCurrentPosition() {},
      setVisible() {},
      resize() {},
      destroy() {}
    };
  }

  const miniMap = new maplibregl.Map({
    container,
    interactive: true,
    dragPan: false,
    dragRotate: false,
    scrollZoom: false,
    touchZoomRotate: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    attributionControl: false,
    style: {
      version: 8,
      sources: {},
      layers: [{
        id: 'mini-map-background',
        type: 'background',
        paint: { 'background-color': '#141a14' }
      }]
    },
    center: mapConfig.center || [0, 0],
    zoom: mapConfig.zoom || 1,
    bearing: 0,
    pitch: 0
  });

  let activeConfig = mapConfig;
  let activeRouteId = mapConfig.defaultRoute;
  let routeRecords = new Map();
  let dynamicLayerIds = new Set();
  let dynamicSourceIds = new Set();
  let positionMarker = null;
  let ready = false;
  let loading = false;
  let loadToken = 0;
  let pendingJourneyState = null;
  let locationsLayerId = null;
  let routeBounds = null;
  let boundsPadding = 30;
  let visible = false;

  function clearDynamicMap() {
    [...dynamicLayerIds].reverse().forEach((layerId) => {
      if (miniMap.getLayer(layerId)) miniMap.removeLayer(layerId);
    });
    [...dynamicSourceIds].reverse().forEach((sourceId) => {
      if (miniMap.getSource(sourceId)) miniMap.removeSource(sourceId);
    });
    dynamicLayerIds.clear();
    dynamicSourceIds.clear();
    routeRecords = new Map();
    locationsLayerId = null;
    routeBounds = null;
    positionMarker?.remove();
    positionMarker = null;
  }

  function addContext(contextId, data, contextConfig = {}) {
    if (!data) return;
    const sourceId = `mini-context-${encodeURIComponent(contextId)}`;
    const layerId = sourceId;
    miniMap.addSource(sourceId, { type: 'geojson', data });
    miniMap.addLayer({
      id: layerId,
      type: contextConfig.type || 'line',
      source: sourceId,
      paint: contextConfig.paint || {
        'line-color': '#aebd98',
        'line-width': 1,
        'line-opacity': 0.5
      }
    });
    dynamicSourceIds.add(sourceId);
    dynamicLayerIds.add(layerId);
  }

  function addRoute(routeId, data, routeConfig = {}) {
    const reverse = routeConfigValue(routeConfig, 'reverse') === true;
    const parts = geometryParts(data).map((coordinates) => (
      reverse ? [...coordinates].reverse() : coordinates
    ));
    const record = { metric: routeMetric(parts), layers: [] };
    routeRecords.set(routeId, record);

    parts.forEach((coordinates, partIndex) => {
      const sourceId = routeKey(routeId, partIndex);
      const baseLayerId = `${sourceId}-base`;
      const progressLayerId = `${sourceId}-progress`;
      const partData = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates }
      };
      const color = routeConfigValue(routeConfig, 'color') || '#f18700';
      const width = routeConfigValue(routeConfig, 'width') || 2.2;
      const opacity = routeConfigValue(routeConfig, 'opacity') ?? 0.55;
      const dasharray = routeConfigValue(routeConfig, 'dasharray');

      miniMap.addSource(sourceId, {
        type: 'geojson',
        data: partData,
        lineMetrics: true
      });
      miniMap.addLayer({
        id: baseLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': width,
          'line-opacity': opacity,
          ...(dasharray ? { 'line-dasharray': dasharray } : {})
        }
      });
      miniMap.addLayer({
        id: progressLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': width + 1,
          'line-opacity': 0
        }
      });
      dynamicSourceIds.add(sourceId);
      dynamicLayerIds.add(baseLayerId);
      dynamicLayerIds.add(progressLayerId);
      record.layers.push({
        baseLayerId,
        progressLayerId,
        color
      });
    });
  }

  function addRoutePoints(data) {
    if (!data) return;
    const sourceId = 'mini-route-points';
    const layerId = sourceId;
    miniMap.addSource(sourceId, { type: 'geojson', data });
    miniMap.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': 2.5,
        'circle-color': [
          'match',
          ['get', '2_SEASONs'],
          'WINTER',
          '#55aadd',
          '#f18700'
        ],
        'circle-opacity': 0.72,
        'circle-stroke-color': '#eef1d8',
        'circle-stroke-width': 0.5
      }
    });
    dynamicSourceIds.add(sourceId);
    dynamicLayerIds.add(layerId);
  }

  function addLocations(locations, bounds) {
    const validLocations = (locations || []).filter(
      (location) => Array.isArray(location.coordinate)
    );
    if (!validLocations.length) return;

    const sourceId = 'mini-chapter-locations-hit';
    const layerId = sourceId;
    miniMap.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: validLocations.map((location, index) => ({
          type: 'Feature',
          id: index,
          properties: { chapterId: location.chapterId },
          geometry: { type: 'Point', coordinates: location.coordinate }
        }))
      }
    });
    miniMap.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': 7,
        'circle-color': '#ffffff',
        'circle-opacity': 0,
        'circle-stroke-opacity': 0
      }
    });
    dynamicSourceIds.add(sourceId);
    dynamicLayerIds.add(layerId);
    locationsLayerId = layerId;
  }

  async function loadState(nextConfig = {}) {
    const token = ++loadToken;
    loading = true;
    activeConfig = nextConfig;
    activeRouteId = nextConfig.defaultRoute;
    boundsPadding = nextConfig.padding || 30;
    clearDynamicMap();
    const bounds = new maplibregl.LngLatBounds();
    const routeEntries = Object.entries(nextConfig.routes || {});
    const contextEntries = Object.entries(nextConfig.context || {});
    const locationResponse = nextConfig.locationsUrl
      ? fetch(nextConfig.locationsUrl).then(async (response) => ({
        kind: 'points',
        id: 'route-points',
        response,
        data: response.ok ? await response.json() : null
      }))
      : null;
    const responses = await Promise.all([
      ...routeEntries.map(async ([routeId, routeConfig]) => ({
        kind: 'route',
        id: routeId,
        config: routeConfig,
        response: await fetch(routeConfigValue(routeConfig, 'url'))
      })),
      ...contextEntries.map(async ([contextId, contextConfig]) => ({
        kind: 'context',
        id: contextId,
        config: contextConfig,
        response: await fetch(routeConfigValue(contextConfig, 'url'))
      })),
      ...(locationResponse ? [locationResponse] : [])
    ]);
    if (token !== loadToken) return;

    for (const item of responses) {
      if (!item.response.ok) continue;
      if (item.kind === 'points') {
        if (token !== loadToken) return;
        addRoutePoints(item.data);
        continue;
      }
      const data = await item.response.json();
      if (token !== loadToken) return;
      if (item.kind === 'route') {
        addRoute(item.id, data, item.config);
        geometryCoordinates(data).forEach((coordinate) => bounds.extend(coordinate));
      } else if (item.kind === 'points') {
        addRoutePoints(item.data);
      } else {
        addContext(item.id, data, item.config);
      }
    }

    addLocations(nextConfig.locations, bounds);
    ready = true;
    loading = false;
    routeBounds = bounds.isEmpty() ? null : bounds;
    fitRouteBounds();
    if (pendingJourneyState) {
      const state = pendingJourneyState;
      pendingJourneyState = null;
      applyJourneyState(state);
    }
  }

  function fitRouteBounds() {
    if (!routeBounds || routeBounds.isEmpty()) return;
    miniMap.fitBounds(routeBounds, { padding: boundsPadding, duration: 0 });
  }

  function setCurrentPosition(coordinate) {
    if (!isValidCoordinate(coordinate)) {
      positionMarker?.remove();
      positionMarker = null;
      return;
    }
    if (!positionMarker) {
      const markerElement = document.createElement('div');
      markerElement.className = 'mini-position-marker';
      markerElement.setAttribute('aria-label', 'Current journey position');
      positionMarker = new maplibregl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat(coordinate)
        .addTo(miniMap);
    }
    positionMarker.setLngLat(coordinate);
  }

  function setRouteProgress(routeId, progress) {
    const record = routeRecords.get(routeId);
    if (!record || !Number.isFinite(progress)) return;
    const value = Math.max(0, Math.min(1, progress));
    record.layers.forEach((layer, partIndex) => {
      const part = record.metric.parts[partIndex];
      const start = record.metric.length ? part.start / record.metric.length : 0;
      const end = record.metric.length
        ? (part.start + part.length) / record.metric.length
        : 0;
      let localProgress = 0;
      if (value >= end) localProgress = 1;
      else if (value > start && end > start) localProgress = (value - start) / (end - start);
      if (miniMap.getLayer(layer.progressLayerId)) {
        const gradient = localProgress <= 0
          ? [
              'interpolate',
              ['linear'],
              ['line-progress'],
              0,
              'rgba(0,0,0,0)',
              1,
              'rgba(0,0,0,0)'
            ]
          : localProgress >= 1
            ? [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                'rgba(0,0,0,0)',
                1,
                layer.color
              ]
            : [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                'rgba(0,0,0,0)',
                localProgress,
                layer.color,
                1,
                'rgba(0,0,0,0)'
              ];
        miniMap.setPaintProperty(
          layer.progressLayerId,
          'line-opacity',
          localProgress > 0 ? 1 : 0
        );
        miniMap.setPaintProperty(
          layer.progressLayerId,
          'line-gradient',
          gradient
        );
      }
    });
  }

  function setActiveRoute(routeId) {
    if (!routeRecords.has(routeId)) return;
    const changed = activeRouteId !== routeId;
    activeRouteId = routeId;
    if (changed) routeRecords.forEach((record) => {
      record.layers.forEach((layer) => {
        if (miniMap.getLayer(layer.progressLayerId)) {
          miniMap.setPaintProperty(layer.progressLayerId, 'line-opacity', 0);
          miniMap.setPaintProperty(
            layer.progressLayerId,
            'line-gradient',
            ['interpolate', ['linear'], ['line-progress'], 0, 'rgba(0,0,0,0)', 1, 'rgba(0,0,0,0)']
          );
        }
      });
    });
  }

  function applyJourneyState({ chapter, progress, routeId, coordinate } = {}) {
    const selectedRoute = routeId || activeRouteId;
    setActiveRoute(selectedRoute);
    const currentCoordinate = isValidCoordinate(coordinate)
      ? coordinate
      : chapterCoordinate(chapter);
    const miniMapProgress = progressOnRoute(
      currentCoordinate,
      routeRecords.get(selectedRoute)?.metric
    );
    if (Number.isFinite(miniMapProgress)) {
      setRouteProgress(selectedRoute, miniMapProgress);
    }
    setCurrentPosition(currentCoordinate);
  }

  miniMap.on('click', (event) => {
    if (!locationsLayerId) return;
    const features = miniMap.queryRenderedFeatures(event.point, { layers: [locationsLayerId] });
    const chapterId = features[0]?.properties?.chapterId;
    if (chapterId) onChapterSelect?.(chapterId);
  });

  miniMap.on('load', () => {
    loadState(activeConfig).catch((error) => {
      loading = false;
      console.warn('Mini-map data unavailable:', error);
    });
  });

  return {
    async setState(nextConfig) {
      if (!ready) {
        activeConfig = nextConfig;
        return;
      }
      try {
        await loadState(nextConfig);
      } catch (error) {
        loading = false;
        throw error;
      }
    },
    setActiveRoute,
    setRouteProgress,
    setJourneyState(state = {}) {
      if (!ready || loading) {
        pendingJourneyState = state;
        return;
      }
      applyJourneyState(state);
    },
    setCurrentPosition,
    setVisible(isVisible) {
      const becameVisible = isVisible && !visible;
      container.hidden = !isVisible;
      if (becameVisible && ready) {
        miniMap.resize();
        fitRouteBounds();
      }
      visible = isVisible;
    },
    resize() {
      miniMap.resize();
    },
    destroy() {
      ++loadToken;
      positionMarker?.remove();
      miniMap.remove();
    }
  };
}
