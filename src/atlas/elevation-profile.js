const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
}

function datasetRecord(profile, datasetId) {
  const value = profile?.datasets?.[datasetId];
  if (Array.isArray(value)) return { points: value };
  return value || null;
}

function datasetDomain(profile, dataset, key, fallback) {
  return dataset?.[key] || profile?.[key] || fallback;
}

function selectPoint(points, {
  pointId,
  pointIndex,
  pointOccurrence
} = {}) {
  if (!Array.isArray(points)) return null;
  if (Number.isInteger(pointIndex)) return points[pointIndex] || null;

  const matches = points
    .map((point, index) => ({ point, index }))
    .filter(({ point }) => point.id === pointId);
  if (Number.isInteger(pointOccurrence)) {
    return matches[pointOccurrence]?.point || null;
  }
  return matches[0]?.point || null;
}

function resolvePoint(profile, dataset, chapter, selection = {}) {
  const explicitId = selection.profilePointId
    || chapter?.profilePointId
    || chapter?.id;
  const pointId = profile?.chapterAliases?.[explicitId] || explicitId;
  return selectPoint(dataset?.points, {
    pointId,
    pointIndex: selection.profilePointIndex ?? chapter?.profilePointIndex,
    pointOccurrence: selection.profilePointOccurrence ?? chapter?.profilePointOccurrence
  });
}

function pointColor(profile, datasetId, point) {
  return point?.color || profile?.colors?.[datasetId] || '#f18700';
}

/**
 * Renders any configured profile dataset. Profile points are independent of
 * story chapters; aliases and explicit occurrence/index selection only resolve
 * the current highlight.
 */
export function createElevationProfile(svg, {
  profile,
  onSelect
} = {}) {
  if (!svg) {
    return {
      setProfile() {},
      setJourneyState() {},
      setVisible() {}
    };
  }

  let activeProfile = profile;
  let position = null;
  let currentElevation = null;
  let renderedPoints = [];

  const render = () => {
    svg.innerHTML = '';
    position = null;
    currentElevation = null;
    renderedPoints = [];
    if (!activeProfile) return;

    const width = activeProfile.width || 320;
    const height = activeProfile.height || 90;
    const chartBottom = activeProfile.chartBottom || 64;
    const plotLeft = activeProfile.plotLeft || 38;
    const plotRight = activeProfile.plotRight || width - 2;
    const datasets = Object.entries(activeProfile.datasets || {});

    const profileDistanceDomain = activeProfile.distanceDomain || [-100, 237];
    const profileElevationDomain = activeProfile.elevationDomain || [400, 4800];
    const [profileMinDistance, profileMaxDistance] = profileDistanceDomain;
    const [profileMinElevation, profileMaxElevation] = profileElevationDomain;
    const xFor = (distance, dataset) => {
      const [minDistance, maxDistance] = datasetDomain(
        activeProfile,
        dataset,
        'distanceDomain',
        profileDistanceDomain
      );
      return plotLeft
        + ((distance - minDistance) / (maxDistance - minDistance))
        * (plotRight - plotLeft);
    };
    const yFor = (elevation, dataset) => {
      const [minElevation, maxElevation] = datasetDomain(
        activeProfile,
        dataset,
        'elevationDomain',
        profileElevationDomain
      );
      return chartBottom
        - ((elevation - minElevation) / (maxElevation - minElevation))
        * (activeProfile.plotHeight || 48);
    };

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    datasets.forEach(([datasetId, datasetValue]) => {
      const dataset = datasetRecord(activeProfile, datasetId);
      if (!dataset?.points?.length) return;
      const path = createSvgElement('path', {
        class: 'profile-route',
        d: dataset.points.map((point, index) =>
          `${index ? 'L' : 'M'}${xFor(point.distance, dataset)},${yFor(point.elevation, dataset)}`
        ).join(' ')
      });
      path.style.setProperty('--profile-color', pointColor(activeProfile, datasetId));
      svg.appendChild(path);

      dataset.points.forEach((point, pointIndex) => {
        const marker = createSvgElement('circle', {
          class: 'profile-point',
          'data-location-id': point.id,
          'data-profile-index': pointIndex,
          'data-profile-dataset': datasetId,
          'data-distance': point.distance,
          cx: xFor(point.distance, dataset),
          cy: yFor(point.elevation, dataset),
          r: point.range ? 3.5 : 2.5
        });
        marker.style.setProperty('--profile-color', pointColor(activeProfile, datasetId, point));
        marker.addEventListener('click', () => onSelect?.(point.id, {
          datasetId,
          pointIndex,
          point
        }));
        svg.appendChild(marker);
        renderedPoints.push({ marker, datasetId, pointIndex, point });
      });
    });

    const ticks = activeProfile.ticks || [400, 1000, 2000, 3000, 4000, 4800];
    svg.appendChild(createSvgElement('path', {
      class: 'profile-axis',
      d: `M${plotLeft} ${chartBottom}V${yFor(profileMaxElevation, { elevationDomain: profileElevationDomain })}M${plotLeft} ${chartBottom}H${plotRight}`
    }));
    ticks.forEach((elevation) => {
      const y = yFor(elevation, { elevationDomain: profileElevationDomain });
      svg.appendChild(createSvgElement('path', {
        class: 'profile-tick',
        d: `M${plotLeft} ${y}h4`
      }));
      const label = createSvgElement('text', {
        class: 'profile-axis-label',
        x: plotLeft - 5,
        y: y + 2.5,
        'text-anchor': 'end'
      });
      label.textContent = `${elevation}m`;
      svg.appendChild(label);
    });

    currentElevation = createSvgElement('text', {
      id: 'profile-current-elevation',
      class: 'profile-current-elevation',
      x: width - 2,
      y: 10,
      'text-anchor': 'end'
    });
    currentElevation.textContent = '—';
    svg.appendChild(currentElevation);
    position = createSvgElement('circle', {
      id: 'profile-position',
      class: 'profile-position',
      r: 4,
      visibility: 'hidden'
    });
    svg.appendChild(position);
  };

  render();

  return {
    setProfile(nextProfile) {
      activeProfile = nextProfile;
      render();
    },

    setJourneyState({
      chapter,
      datasetId,
      profilePointId,
      profilePointIndex,
      profilePointOccurrence
    } = {}) {
      if (!activeProfile || !position || !chapter) return;
      const selectedDatasetId = datasetId || activeProfile.defaultDataset;
      const dataset = datasetRecord(activeProfile, selectedDatasetId);
      const current = resolvePoint(activeProfile, dataset, chapter, {
        profilePointId,
        profilePointIndex,
        profilePointOccurrence
      });
      renderedPoints.forEach(({ marker }) => marker.classList.remove('active'));

      if (!current) {
        position.setAttribute('visibility', 'hidden');
        if (currentElevation) currentElevation.textContent = '—';
        return;
      }

      const width = activeProfile.width || 320;
      const chartBottom = activeProfile.chartBottom || 64;
      const plotLeft = activeProfile.plotLeft || 38;
      const plotRight = activeProfile.plotRight || width - 2;
      const profileDistanceDomain = activeProfile.distanceDomain || [-100, 237];
      const profileElevationDomain = activeProfile.elevationDomain || [400, 4800];
      const xFor = (distance) => {
        const [minDistance, maxDistance] = datasetDomain(
          activeProfile,
          dataset,
          'distanceDomain',
          profileDistanceDomain
        );
        return plotLeft
          + ((distance - minDistance) / (maxDistance - minDistance))
          * (plotRight - plotLeft);
      };
      const yFor = (elevation) => {
        const [minElevation, maxElevation] = datasetDomain(
          activeProfile,
          dataset,
          'elevationDomain',
          profileElevationDomain
        );
        return chartBottom
          - ((elevation - minElevation) / (maxElevation - minElevation))
          * (activeProfile.plotHeight || 48);
      };
      const selectedIndex = dataset.points.indexOf(current);
      const selectedMarker = renderedPoints.find((item) =>
        item.datasetId === selectedDatasetId && item.pointIndex === selectedIndex
      );
      selectedMarker?.marker.classList.add('active');
      position.setAttribute('visibility', 'visible');
      position.setAttribute('cx', xFor(current.distance));
      position.setAttribute('cy', yFor(current.elevation));
      currentElevation.textContent = `${current.label} · ${current.elevation}m`;
    },

    setVisible(visible) {
      svg.hidden = !visible;
    }
  };
}
