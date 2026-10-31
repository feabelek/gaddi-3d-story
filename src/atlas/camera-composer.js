function formatCamera(camera) {
  return JSON.stringify(camera, null, 2);
}


export function getCurrentCamera(map) {
  const center = map.getCenter();
  return {
    center: [
      Number(center.lng.toFixed(6)),
      Number(center.lat.toFixed(6))
    ],
    zoom: Number(map.getZoom().toFixed(3)),
    pitch: Number(map.getPitch().toFixed(2)),
    bearing: Number(map.getBearing().toFixed(2))
  };
}


export function createCameraComposer({ map, chapters }) {
  const composer = document.createElement('aside');
  composer.id = 'camera-composer';
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
  document.body.appendChild(composer);

  const stopSelect = composer.querySelector('#camera-composer-stop');
  const output = composer.querySelector('#camera-composer-output');
  const status = composer.querySelector('#camera-composer-status');

  chapters.forEach((chapter, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${String(index).padStart(2, '0')} · ${chapter.location}`;
    stopSelect.appendChild(option);
  });

  const selectedChapter = () => chapters[Number(stopSelect.value)];
  const updateOutput = () => {
    output.textContent = formatCamera(getCurrentCamera(map));
  };
  const setStatus = (message) => {
    status.textContent = message;
  };
  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(message);
    }
    catch (error) {
      output.textContent = text;
      setStatus('Clipboard access was blocked. Select and copy the text above.');
    }
  };

  composer.querySelector('#camera-composer-target').addEventListener('click', () => {
    const chapter = selectedChapter();
    map.easeTo({
      center: chapter.center,
      zoom: chapter.zoom,
      pitch: chapter.pitch,
      bearing: chapter.bearing,
      duration: 900
    });
    setStatus('Adjust the map, then copy the camera values.');
  });

  composer.querySelector('#camera-composer-capture').addEventListener('click', () => {
    const chapter = selectedChapter();
    const camera = getCurrentCamera(map);
    chapter.center = camera.center;
    chapter.zoom = camera.zoom;
    chapter.pitch = camera.pitch;
    chapter.bearing = camera.bearing;
    setStatus(`Captured camera for ${chapter.location}. Use “Copy all” to export the refined stops.`);
  });

  composer.querySelector('#camera-composer-copy').addEventListener('click', () => {
    copyText(
      formatCamera(getCurrentCamera(map)),
      `Copied camera for ${selectedChapter().location}.`
    );
  });

  composer.querySelector('#camera-composer-copy-all').addEventListener('click', () => {
    const cameras = {};
    chapters.forEach((chapter) => {
      cameras[chapter.id] = {
        center: chapter.center,
        zoom: chapter.zoom,
        pitch: chapter.pitch,
        bearing: chapter.bearing
      };
    });
    copyText(
      formatCamera(cameras),
      `Copied ${chapters.length} story cameras.`
    );
  });

  stopSelect.addEventListener('change', () => {
    setStatus('Use “Go to stop” or move the map to compose a new view.');
  });
  map.on('move', updateOutput);
  updateOutput();
}
