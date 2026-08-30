// ============ BATTERY SIZING ESTIMATOR ============
// Layman-input estimate only: pick appliances + quantities + desired
// backup hours, choose a battery chemistry, and we show a *directional
// range* for usable battery capacity - not a confident final number.
// The things that actually separate a correct install from a bad one
// (surge/inrush current, real DoD by chemistry, round-trip losses,
// whether the array can recharge it day to day) are listed explicitly
// as reasons for an on-site load audit, not folded into the math.
(function () {
  var listEl      = document.getElementById('battery-appliance-list');
  var hoursSelect = document.getElementById('battery-hours');
  var chemSelect  = document.getElementById('battery-chemistry');
  var runBtn      = document.getElementById('battery-run');
  var resetBtn    = document.getElementById('battery-reset');
  var resultsEl   = document.getElementById('battery-results');
  var rangeValueEl = document.getElementById('battery-range-value');
  var loadValueEl  = document.getElementById('battery-load-value');
  var statusEl    = document.getElementById('battery-status');

  if (!runBtn) return;

  // Captured once, before any user interaction, so Reset restores
  // whatever the HTML actually ships as selected rather than a
  // hardcoded guess that could drift out of sync with the markup.
  var DEFAULTS = {
    hours: hoursSelect.value,
    chemistry: chemSelect.value
  };

  // Simple, monochrome line icons (24x24, stroke = currentColor) so each
  // appliance is recognizable at a glance without relying on the label
  // text alone - same minimal style as the site's existing social icons.
  var ICONS = {
    'led-bulb': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.15 1 1.9V16h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3Z"/></svg>',
    'fan':      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1.6"/><path d="M12 10.4C10.5 7 8 6.5 6.5 7.3 5 8.1 5 10.3 7 11.6c1 .65 2.7.9 5 .8Z"/><path d="M13.6 12C17 10.5 17.5 8 16.7 6.5 15.9 5 13.7 5 12.4 7c-.65 1-.9 2.7-.8 5Z"/><path d="M12 13.6c1.5 3.4 4 3.9 5.5 3.1 1.5-.8 1.5-3 -.5-4.3-1-.65-2.7-.9-5-.8Z"/><path d="M10.4 12C7 13.5 6.5 16 7.3 17.5c.8 1.5 3 1.5 4.3-.5.65-1 .9-2.7.8-5Z"/></svg>',
    'wifi':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="18.5" r="1.1" fill="currentColor" stroke="none"/><path d="M8.5 15.3a5 5 0 0 1 7 0"/><path d="M5.5 12.2a9.2 9.2 0 0 1 13 0"/><path d="M2.8 9a13 13 0 0 1 18.4 0"/></svg>',
    'tv':       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M9 20h6"/><path d="M12 17v3"/></svg>',
    'laptop':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4.5" width="14" height="9.5" rx="1"/><path d="M2.5 18.5h19l-1.5-3h-16Z"/></svg>',
    'fridge':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="1.5"/><path d="M6 9.5h12"/><path d="M9 5.5v2"/><path d="M9 12.5v2"/></svg>',
    'cooler':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="1.5"/><path d="M4 10.5h16"/><path d="M7 3.5 8.5 6"/><path d="M12 3.5 12 6"/><path d="M17 3.5 15.5 6"/></svg>',
    'washing':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="1.5"/><circle cx="12" cy="13" r="4.5"/><circle cx="12" cy="13" r="1.6"/><path d="M7 6h.01"/><path d="M10 6h4"/></svg>',
    'pump':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="12" r="6.5"/><path d="M10 8.5v3.5l2.8 1.6"/><path d="M16.5 12h4"/><path d="M18.5 10.2v3.6"/></svg>',
    'ac':       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6" width="19" height="8" rx="1.5"/><path d="M6 17.5 5 20"/><path d="M10.3 17.5 9.6 20"/><path d="M14.7 17.5 15.4 20"/><path d="M19 17.5 20 20"/></svg>'
  };

  // Typical running watts per unit - conservative, round-number planning
  // figures (same spirit as the 0.78 performance ratio used elsewhere on
  // this site), not nameplate/spec-sheet values for a specific product.
  var APPLIANCES = [
    { key: 'led-bulb',   watts: 10,  en: 'LED bulb / tube light',        hi: 'LED बल्ब / ट्यूब लाइट' },
    { key: 'fan',        watts: 75,  en: 'Ceiling fan',                  hi: 'सीलिंग पंखा' },
    { key: 'wifi',       watts: 15,  en: 'Wi-Fi router',                 hi: 'वाई-फाई राउटर' },
    { key: 'tv',         watts: 100, en: 'LED TV (32-43")',              hi: 'LED टीवी (32-43")' },
    { key: 'laptop',     watts: 65,  en: 'Laptop',                       hi: 'लैपटॉप' },
    { key: 'fridge',     watts: 150, en: 'Refrigerator',                 hi: 'रेफ्रिजरेटर' },
    { key: 'cooler',     watts: 200, en: 'Air cooler',                   hi: 'एयर कूलर' },
    { key: 'washing',    watts: 500, en: 'Washing machine',              hi: 'वॉशिंग मशीन' },
    { key: 'pump',       watts: 750, en: 'Water pump (0.5-1 HP)',        hi: 'पानी की मोटर (0.5-1 HP)' },
    { key: 'ac',         watts: 1500, en: 'Air conditioner (1.5 ton)',   hi: 'एयर कंडीशनर (1.5 टन)' }
  ];

  var MAX_QTY = 20;

  // Not every appliance runs at once, so summing nameplate watts for
  // everything selected would overstate real simultaneous demand.
  // This is a simple, conservative diversity factor for a household
  // backup scenario - a real load audit replaces it with an actual
  // load schedule for the circuits being backed up.
  var DIVERSITY_FACTOR = 0.7;

  // Usable-capacity assumptions by chemistry. Lithium (LiFePO4) allows
  // deep, repeated discharge; tubular lead-acid should not be routinely
  // discharged as deep, so more raw capacity is needed for the same
  // usable energy. Round-trip efficiency (charge + discharge losses)
  // is folded in here too.
  var CHEMISTRY = {
    lithium: { dod: 0.9,  roundTrip: 0.92 },
    tubular: { dod: 0.5,  roundTrip: 0.85 }
  };

  // The estimate is shown as a range, not a point figure - +/-15%
  // reflects real variation in usage patterns, ambient temperature and
  // battery age, which a single number would falsely imply we know.
  var RANGE_SPREAD = 0.15;

  function currentLang() {
    return document.documentElement.getAttribute('lang') === 'hi' ? 'hi' : 'en';
  }

  function t(key, en, hi) {
    var TR = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS : null;
    if (TR && TR[key] && TR[key][currentLang()]) return TR[key][currentLang()];
    return currentLang() === 'hi' ? hi : en;
  }

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('is-error', !!isError);
  }

  function formatKwh(value) {
    return value.toFixed(value < 10 ? 2 : 1) + ' ' + t('battery-unit-kwh', 'kWh', 'यूनिट');
  }

  function setRowQty(row, item, qty, countEl, minusBtn) {
    qty = Math.max(0, Math.min(MAX_QTY, qty));
    row.dataset.qty = String(qty);
    countEl.textContent = String(qty);
    row.classList.toggle('is-active', qty > 0);
    minusBtn.disabled = qty === 0;
  }

  function buildApplianceList(preserveQtys) {
    if (!listEl) return;
    listEl.innerHTML = '';
    APPLIANCES.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'battery-appliance-row';
      row.dataset.key = item.key;

      var iconWrap = document.createElement('span');
      iconWrap.className = 'battery-appliance-icon';
      iconWrap.innerHTML = ICONS[item.key] || '';

      var textWrap = document.createElement('span');
      textWrap.className = 'battery-appliance-text';
      var nameEl = document.createElement('span');
      nameEl.className = 'battery-appliance-name';
      nameEl.textContent = (currentLang() === 'hi' ? item.hi : item.en);
      var wattEl = document.createElement('span');
      wattEl.className = 'battery-appliance-watts';
      wattEl.textContent = item.watts + 'W';
      textWrap.appendChild(nameEl);
      textWrap.appendChild(wattEl);

      var infoWrap = document.createElement('span');
      infoWrap.className = 'battery-appliance-info';
      infoWrap.appendChild(iconWrap);
      infoWrap.appendChild(textWrap);

      var stepper = document.createElement('span');
      stepper.className = 'battery-appliance-stepper';

      var minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'battery-stepper-btn battery-stepper-minus';
      minusBtn.setAttribute('aria-label', t('battery-decrease', 'Decrease', 'घटाएं'));
      minusBtn.textContent = '\u2212';

      var countEl = document.createElement('span');
      countEl.className = 'battery-appliance-count';
      countEl.textContent = '0';

      var plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'battery-stepper-btn battery-stepper-plus';
      plusBtn.setAttribute('aria-label', t('battery-increase', 'Increase', 'बढ़ाएं'));
      plusBtn.textContent = '+';

      var startQty = (preserveQtys && preserveQtys[item.key]) ? preserveQtys[item.key] : 0;
      setRowQty(row, item, startQty, countEl, minusBtn);

      minusBtn.addEventListener('click', function () {
        setRowQty(row, item, parseInt(row.dataset.qty, 10) - 1, countEl, minusBtn);
      });
      plusBtn.addEventListener('click', function () {
        setRowQty(row, item, parseInt(row.dataset.qty, 10) + 1, countEl, minusBtn);
      });

      stepper.appendChild(minusBtn);
      stepper.appendChild(countEl);
      stepper.appendChild(plusBtn);

      row.appendChild(infoWrap);
      row.appendChild(stepper);
      listEl.appendChild(row);
    });
  }

  function runEstimate() {
    if (!listEl) return;
    var rows = listEl.querySelectorAll('.battery-appliance-row');
    var totalWatts = 0;
    var anySelected = false;

    rows.forEach(function (row) {
      var qty = parseInt(row.dataset.qty, 10) || 0;
      if (qty <= 0) return;
      var item = APPLIANCES.filter(function (a) { return a.key === row.dataset.key; })[0];
      if (!item) return;
      anySelected = true;
      totalWatts += item.watts * qty;
    });

    if (!anySelected) {
      setStatus(t('battery-error-none', 'Select at least one appliance to back up.', 'बैकअप के लिए कम से कम एक उपकरण चुनें।'), true);
      resultsEl.hidden = true;
      return;
    }

    var backupHours = parseFloat(hoursSelect.value) || 4;
    var chemKey = chemSelect.value === 'tubular' ? 'tubular' : 'lithium';
    var chem = CHEMISTRY[chemKey];

    var diversifiedWatts = totalWatts * DIVERSITY_FACTOR;
    var energyNeededKwh = (diversifiedWatts * backupHours) / 1000;
    var usableFactor = chem.dod * chem.roundTrip;
    var batteryKwhMid = energyNeededKwh / usableFactor;

    var low = batteryKwhMid * (1 - RANGE_SPREAD);
    var high = batteryKwhMid * (1 + RANGE_SPREAD);

    loadValueEl.textContent = Math.round(diversifiedWatts) + ' W';
    rangeValueEl.textContent = formatKwh(low) + ' \u2013 ' + formatKwh(high);

    resultsEl.hidden = false;
    setStatus('', false);
  }

  // Puts every appliance quantity back to 0, restores the hours/
  // chemistry selects to their shipped defaults, and clears any result
  // on screen. Reuses buildApplianceList() with no preserved quantities
  // rather than looping setRowQty(0) over existing rows, so it also
  // rebuilds labels in the currently-active language.
  function resetEstimate() {
    buildApplianceList();
    hoursSelect.value = DEFAULTS.hours;
    chemSelect.value = DEFAULTS.chemistry;
    resultsEl.hidden = true;
    setStatus('', false);
  }

  buildApplianceList();
  runBtn.addEventListener('click', runEstimate);
  if (resetBtn) resetBtn.addEventListener('click', resetEstimate);

  // Rebuild appliance labels (not the selected quantities) if the page's
  // language toggle fires a custom event - falls back silently if the
  // site's i18n script doesn't dispatch one, since users can still
  // switch languages and re-run without losing anything.
  document.addEventListener('i18n:changed', function () {
    var qtys = {};
    if (listEl) {
      listEl.querySelectorAll('.battery-appliance-row').forEach(function (row) {
        var qty = parseInt(row.dataset.qty, 10) || 0;
        if (qty > 0) qtys[row.dataset.key] = qty;
      });
    }
    buildApplianceList(qtys);
  });
})();
