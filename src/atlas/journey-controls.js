/**
 * Creates the control-rail contract without owning Atlas or story state.
 * Controls without an approved callback are unavailable and never appear
 * interactive.
 */
export function createJourneyControls({
  container,
  callbacks = {},
  availability = {},
  onLegendToggle,
  onZoomIn,
  onZoomOut,
  onNorth,
  onInformation,
  onPrevious,
  onNext,
  onMenu,
  onMenuExplore,
  onMenuHome,
  onMenuRestart,
  informationContent = ''
} = {}) {
  if (!container) return { setVisible() {}, destroy() {} };

  const handlers = {
    legend: callbacks.onLegendToggle || onLegendToggle,
    'zoom-in': callbacks.onZoomIn || onZoomIn,
    'zoom-out': callbacks.onZoomOut || onZoomOut,
    north: callbacks.onNorth || onNorth,
    information: callbacks.onInformation || onInformation,
    previous: callbacks.onPrevious || onPrevious,
    next: callbacks.onNext || onNext,
    menu: callbacks.onMenu || onMenu
  };

  container.innerHTML = `
    <button type="button" data-journey-control="legend" aria-expanded="false">Legend</button>
    <div class="map-actions">
      <button type="button" data-journey-control="zoom-in" aria-label="Zoom in">+</button>
      <button type="button" data-journey-control="zoom-out" aria-label="Zoom out">−</button>
    </div>
    <button type="button" data-journey-control="north" aria-label="Reset north"></button>
    <div data-journey-control="scale" aria-label="Map scale">
      <img data-scale-svg src="/data/images/Scale Bar.svg" alt="" aria-hidden="true">
      <span data-scale-label></span>
    </div>
    <div class="bottom-rail-spacer" aria-hidden="true"></div>
    <div data-journey-control="information-wrap" class="map-attribution">
      <button type="button" data-journey-control="information" aria-label="Information" aria-expanded="false">i</button>
      <div data-journey-control="information-panel" hidden>${informationContent}</div>
    </div>
    <div class="journey-step-controls" aria-label="Journey locations">
      <button type="button" data-journey-control="previous" aria-label="Previous location">‹</button>
      <button type="button" data-journey-control="next" aria-label="Next location">›</button>
    </div>
    <div data-journey-control="menu-wrap">
      <button type="button" data-journey-control="menu" aria-label="Open menu" aria-expanded="false">☰</button>
      <div data-journey-control="menu-panel" hidden>
        <button type="button" data-menu-action="explore">Explore map</button>
        <button type="button" data-menu-action="home">Return to Home</button>
        <button type="button" data-menu-action="restart">Restart Journey</button>
      </div>
    </div>
  `;

  const elements = {};
  Object.keys(handlers).forEach((controlId) => {
    elements[controlId] = container.querySelector(
      `[data-journey-control="${controlId}"]`
    );
  });

  const menuPanel = container.querySelector('[data-journey-control="menu-panel"]');
  const menuButton = elements.menu;
  const menuActions = {
    explore: callbacks.onMenuExplore || onMenuExplore,
    home: callbacks.onMenuHome || onMenuHome,
    restart: callbacks.onMenuRestart || onMenuRestart
  };
  const hasMenuActions = Object.values(menuActions).some(Boolean);
  const states = {};
  Object.keys(handlers).forEach((controlId) => {
    states[controlId] = {
      available: controlId === 'menu'
        ? availability[controlId] ?? (Boolean(handlers[controlId]) || hasMenuActions)
        : availability[controlId] ?? Boolean(handlers[controlId]),
      disabled: false
    };
  });

  const applyState = (controlId) => {
    const element = elements[controlId];
    const state = states[controlId];
    if (!element || !state) return;
    const hasBehavior = Boolean(handlers[controlId])
      || (controlId === 'menu' && hasMenuActions);
    const unavailable = !state.available || !hasBehavior;
    const disabled = unavailable || state.disabled;
    element.disabled = disabled;
    element.setAttribute('aria-disabled', String(disabled));
    element.dataset.available = String(!unavailable);
    element.dataset.disabled = String(disabled);
  };

  Object.keys(handlers).forEach((controlId) => {
    const element = elements[controlId];
    if (element && handlers[controlId]) {
      element.addEventListener('click', (event) => {
        if (!states[controlId].available || states[controlId].disabled) return;
        handlers[controlId](event);
      });
    }
    applyState(controlId);
  });

  const setMenuOpen = (open) => {
    if (!menuPanel || !menuButton) return;
    menuPanel.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
  };

  menuButton?.addEventListener('click', () => {
    if (!states.menu.available || states.menu.disabled) return;
    setMenuOpen(menuPanel?.hidden !== false);
  });
  Object.entries(menuActions).forEach(([action, callback]) => {
    const button = container.querySelector(`[data-menu-action="${action}"]`);
    if (!button) return;
    button.disabled = !callback;
    button.setAttribute('aria-disabled', String(!callback));
    button.addEventListener('click', (event) => {
      if (!callback) return;
      setMenuOpen(false);
      callback(event);
    });
  });

  return {
    setVisible(visible) {
      container.hidden = !visible;
    },
    setControlAvailability(controlId, available) {
      if (!states[controlId]) return;
      states[controlId].available = Boolean(available);
      applyState(controlId);
    },
    setControlDisabled(controlId, disabled) {
      if (!states[controlId]) return;
      states[controlId].disabled = Boolean(disabled);
      applyState(controlId);
    },
    setMenuOpen,
    setInformationOpen(open) {
      const panel = container.querySelector('[data-journey-control="information-panel"]');
      const button = elements.information;
      if (!panel || !button) return;
      panel.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    },
    setScaleContent({ label = '', width } = {}) {
      const scale = elements.scale;
      if (!scale) return;
      const labelElement = scale.querySelector('[data-scale-label]');
      if (labelElement) labelElement.textContent = label;
      if (Number.isFinite(width)) scale.dataset.scaleWidth = String(width);
    },
    setNorthArrow({ src, alt = 'North', rotation = 0 } = {}) {
      const button = elements.north;
      if (!button) return;
      let image = button.querySelector('[data-north-arrow]');
      if (!image) {
        image = document.createElement('img');
        image.dataset.northArrow = 'true';
        button.appendChild(image);
      }
      if (src) image.src = src;
      image.alt = alt;
      image.style.transform = `rotate(${-rotation}deg)`;
    },
    setLegendExpanded(expanded) {
      elements.legend?.setAttribute('aria-expanded', String(expanded));
    },
    destroy() {
      container.replaceChildren();
    }
  };
}
