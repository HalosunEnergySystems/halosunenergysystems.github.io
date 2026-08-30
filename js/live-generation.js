// ============ LIVE GENERATION ESTIMATOR ============
// Pulls today's actual solar irradiance for the selected UP city from
// Open-Meteo (free, no API key) and estimates current + today's output
// for a rooftop system, using layman inputs only (city, size, shading).
(function () {
  var citySelect   = document.getElementById('livegen-city');
  var sizeSelect   = document.getElementById('livegen-size');
  var shadeSelect  = document.getElementById('livegen-shade');
  var runBtn       = document.getElementById('livegen-run');
  var statusEl     = document.getElementById('livegen-status');
  var resultsEl    = document.getElementById('livegen-results');
  var nowValueEl   = document.getElementById('livegen-now-value');
  var nowSubEl     = document.getElementById('livegen-now-sub');
  var todayValueEl = document.getElementById('livegen-today-value');
  var weatherValueEl = document.getElementById('livegen-weather-value');
  var skyWidgetEl  = document.getElementById('livegen-sky');
  var seasonalWrapEl    = document.getElementById('livegen-seasonal');
  var seasonalChartEl   = document.getElementById('livegen-seasonal-chart');
  var seasonalSummaryEl = document.getElementById('livegen-seasonal-summary');

  if (!runBtn) return;

  // Coordinates for major Uttar Pradesh cities. Halosun's core service
  // cities are listed first in the dropdown, but all use the same lookup.
  var CITY_COORDS = {
    raebareli:  { lat: 26.2309, lon: 81.2337 },
    lucknow:    { lat: 26.8467, lon: 80.9462 },
    unnao:      { lat: 26.5464, lon: 80.4879 },
    amethi:     { lat: 26.1542, lon: 81.8103 },
    sultanpur:  { lat: 26.2647, lon: 82.0716 },
    pratapgarh: { lat: 25.9084, lon: 81.9990 },
    hardoi:     { lat: 27.3966, lon: 80.1310 },
    kanpur:     { lat: 26.4499, lon: 80.3319 },
    varanasi:   { lat: 25.3176, lon: 82.9739 },
    prayagraj:  { lat: 25.4358, lon: 81.8463 },
    agra:       { lat: 27.1767, lon: 78.0081 },
    meerut:     { lat: 28.9845, lon: 77.7064 },
    ghaziabad:  { lat: 28.6692, lon: 77.4538 },
    noida:      { lat: 28.5355, lon: 77.3910 },
    bareilly:   { lat: 28.3670, lon: 79.4304 },
    gorakhpur:  { lat: 26.7606, lon: 83.3732 },
    moradabad:  { lat: 28.8386, lon: 78.7733 },
    aligarh:    { lat: 27.8974, lon: 78.0880 },
    jhansi:     { lat: 25.4484, lon: 78.5685 },
    saharanpur: { lat: 29.9680, lon: 77.5460 },
    ayodhya:    { lat: 26.7922, lon: 82.1998 },
    mathura:    { lat: 27.4924, lon: 77.6737 },
    firozabad:  { lat: 27.1592, lon: 78.3957 },
    sitapur:    { lat: 27.5620, lon: 80.6820 }
  };

  // Real-world performance ratio for a well-installed on-grid rooftop
  // system: accounts for inverter efficiency, temperature losses,
  // wiring losses, soiling and mismatch. Industry planning figures for
  // India commonly land in the 0.75-0.80 range.
  var BASE_PERFORMANCE_RATIO = 0.78;
  // Extra derate applied when the visitor tells us their roof gets
  // shade for part of the day (kept simple - no azimuth/tilt asked).
  var SHADE_DERATE = 0.82;
  var STC_IRRADIANCE = 1000; // W/m^2, standard test condition reference

  // Short month labels for the seasonal chart, matching the pattern
  // used elsewhere in this file for two-language (en/hi) UI strings.
  var MONTH_LABELS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    hi: ['जन', 'फ़र', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्तू', 'नव', 'दिस']
  };

  function currentLang() {
    return document.documentElement.getAttribute('lang') === 'hi' ? 'hi' : 'en';
  }

  function t(key, en, hi) {
    var TR = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS : null;
    if (TR && TR[key] && TR[key][currentLang()]) return TR[key][currentLang()];
    return currentLang() === 'hi' ? hi : en;
  }

  function setStatus(msg, isError) {
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('is-error', !!isError);
  }

  function skyLabel(cloudPct) {
    if (cloudPct < 20)  return { en: 'Clear skies', hi: 'साफ आसमान' };
    if (cloudPct < 50)  return { en: 'Partly cloudy', hi: 'आंशिक बादल' };
    if (cloudPct < 80)  return { en: 'Mostly cloudy', hi: 'ज़्यादातर बादल' };
    return { en: 'Overcast', hi: 'घने बादल' };
  }

  // Open-Meteo's "weather_code" is the WMO code for the current instant -
  // this tells us fog / rain / thunderstorm, which cloud_cover % alone
  // can't distinguish (an overcast fog-bound morning and an overcast
  // clear-of-rain afternoon report similar cloud cover but look and feel
  // completely different). Falls back to null (cloud-band only) for
  // codes we don't have a specific overlay for, e.g. plain cloud codes.
  function weatherCategory(code) {
    if (code == null) return null;
    if (code === 45 || code === 48) return 'fog';
    if (code === 95 || code === 96 || code === 99) return 'thunder';
    var rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86];
    if (rainCodes.indexOf(code) !== -1) return 'rain';
    return null;
  }

  function weatherCategoryLabel(cat) {
    if (cat === 'fog')     return { en: 'Foggy', hi: 'कोहरा' };
    if (cat === 'rain')    return { en: 'Rainy', hi: 'बारिश' };
    if (cat === 'thunder') return { en: 'Thunderstorm', hi: 'आंधी-तूफ़ान' };
    return null;
  }

  // Local day-part from the API's own Asia/Kolkata-timestamped "current"
  // reading (not the visitor's device clock), so the sky's color band
  // matches the selected city's actual time, not wherever the visitor
  // happens to be browsing from.
  function dayPartFromTime(timeStr, isDay) {
    if (!isDay) return 'night';
    var hour = timeStr ? parseInt(timeStr.slice(11, 13), 10) : 12;
    if (hour >= 5 && hour < 7)   return 'dawn';
    if (hour >= 17 && hour < 19) return 'dusk';
    return 'day';
  }

  // Drives the animated sky scene (sky color, sun/moon, stars, drifting
  // clouds, and fog/rain/thunder overlays) from the live reading: real
  // local time-of-day sets the background gradient, cloud_cover % sets
  // cloud density/animation speed (same bands as the text label), and
  // the WMO weather code layers in fog, rain streaks, or a thunderstorm
  // flash on top when actually present at the selected city right now.
  function updateSkyWidget(cloudPct, isDay, timeStr, weatherCat) {
    if (!skyWidgetEl) return;
    skyWidgetEl.classList.remove(
      'is-clear', 'is-partly', 'is-mostly', 'is-overcast',
      'is-night', 'is-dawn', 'is-dusk', 'is-day',
      'is-fog', 'is-rain', 'is-thunder'
    );

    var part = dayPartFromTime(timeStr, isDay);
    skyWidgetEl.classList.add('is-' + part);
    if (part === 'dawn' || part === 'dusk') skyWidgetEl.classList.add('is-day');

    if (cloudPct < 20)       skyWidgetEl.classList.add('is-clear');
    else if (cloudPct < 50)  skyWidgetEl.classList.add('is-partly');
    else if (cloudPct < 80)  skyWidgetEl.classList.add('is-mostly');
    else                     skyWidgetEl.classList.add('is-overcast');

    if (weatherCat === 'fog')     skyWidgetEl.classList.add('is-fog');
    else if (weatherCat === 'rain')    skyWidgetEl.classList.add('is-rain');
    else if (weatherCat === 'thunder') skyWidgetEl.classList.add('is-thunder', 'is-rain');
  }

  function formatKwh(value) {
    return value.toFixed(value < 10 ? 2 : 1) + ' ' + t('livegen-unit-kwh', 'kWh', 'यूनिट');
  }

  function formatKw(value) {
    return value.toFixed(2) + ' kW';
  }

  async function fetchWeather(lat, lon) {
    var url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + lat + '&longitude=' + lon
      + '&current=cloud_cover,shortwave_radiation,is_day,weather_code'
      + '&daily=shortwave_radiation_sum'
      + '&timezone=Asia%2FKolkata&forecast_days=1';
    var res = await fetch(url);
    if (!res.ok) throw new Error('weather request failed');
    return res.json();
  }

  // ============ SEASONAL FORECAST ============
  // Same city, same weather provider - one more Open-Meteo endpoint
  // (the free historical Archive API) covering the past 12 months, so
  // we can show a real monthly generation profile instead of only the
  // current-instant estimate above.

  // Archive data typically lags a few days behind today, so we ask for
  // the most recent full year ending ~6 days ago rather than "today".
  function pastYearRange() {
    var end = new Date();
    end.setDate(end.getDate() - 6);
    var start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() + 1);
    function iso(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    return { start: iso(start), end: iso(end) };
  }

  async function fetchSeasonal(lat, lon) {
    var range = pastYearRange();
    var url = 'https://archive-api.open-meteo.com/v1/archive'
      + '?latitude=' + lat + '&longitude=' + lon
      + '&start_date=' + range.start + '&end_date=' + range.end
      + '&daily=shortwave_radiation_sum&timezone=Asia%2FKolkata';
    var res = await fetch(url);
    if (!res.ok) throw new Error('seasonal request failed');
    return res.json();
  }

  // Averages daily shortwave_radiation_sum (MJ/m^2/day) into peak sun
  // hours per calendar month (1 kWh/m^2 = 3.6 MJ/m^2, same conversion
  // used for "today" above). Returns an array of 12 values (or null
  // for a month with no usable data).
  function monthlyPeakSunHours(daily) {
    var sums = new Array(12).fill(0);
    var counts = new Array(12).fill(0);
    var times = (daily && daily.time) || [];
    var rad = (daily && daily.shortwave_radiation_sum) || [];
    for (var i = 0; i < times.length; i++) {
      var v = rad[i];
      if (v === null || v === undefined) continue;
      var month = parseInt(times[i].slice(5, 7), 10) - 1;
      if (month < 0 || month > 11) continue;
      sums[month] += v;
      counts[month] += 1;
    }
    return sums.map(function (s, i) { return counts[i] ? (s / counts[i]) / 3.6 : null; });
  }

  // Attributes the worst month's dip to the most likely local cause,
  // rather than always blaming "monsoon" - UP's dip is usually the
  // Jun-Sep monsoon, but for some cities/years the low point lands in
  // Dec-Jan instead, which is winter fog and haze, not rain clouds.
  // Falls back to no specific cause when the worst month is neither.
  function seasonalDipReason(worstIdx, lang) {
    var isMonsoon = (worstIdx >= 5 && worstIdx <= 8);   // Jun-Sep
    var isWinterFog = (worstIdx === 11 || worstIdx === 0); // Dec-Jan
    if (isMonsoon) {
      return lang === 'hi' ? ', मुख्यतः मानसून के बादलों के कारण' : ', mainly from monsoon cloud cover';
    }
    if (isWinterFog) {
      return lang === 'hi' ? ', मुख्यतः सर्दियों के कोहरे और धुंध के कारण' : ', mainly from winter fog and haze';
    }
    return '';
  }

  function renderSeasonal(monthlyPSH, systemKw, pr) {
    if (!seasonalWrapEl || !seasonalChartEl || !seasonalSummaryEl) return;

    var dailyKwh = monthlyPSH.map(function (psh) {
      return psh === null ? null : systemKw * psh * pr;
    });
    var known = dailyKwh.filter(function (v) { return v !== null; });
    if (known.length < 6) {
      seasonalWrapEl.hidden = true;
      return;
    }

    var maxVal = Math.max.apply(null, known);
    var minVal = Math.min.apply(null, known);
    var bestIdx = dailyKwh.indexOf(maxVal);
    var worstIdx = dailyKwh.indexOf(minVal);
    var currentMonth = new Date().getMonth();
    var lang = currentLang();
    var labels = MONTH_LABELS[lang];

    seasonalChartEl.innerHTML = '';

    // One shared tooltip bubble per chart, repositioned/relabelled per
    // bar on hover/tap rather than creating a fresh element each time -
    // cheaper, and avoids layout thrash when the user runs the mouse
    // quickly across all twelve bars.
    var tooltip = document.createElement('div');
    tooltip.className = 'livegen-seasonal-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    seasonalChartEl.appendChild(tooltip);

    var hoveredCol = null;

    function showTooltip(col, label, value) {
      if (hoveredCol) hoveredCol.classList.remove('is-hovered');
      hoveredCol = col;
      col.classList.add('is-hovered');
      tooltip.innerHTML = '<strong>' + label + '</strong><br>' + formatKwh(value) + '/'
        + (lang === 'hi' ? 'दिन' : 'day');
      // Position the bubble centred above the hovered bar. offsetLeft/
      // offsetWidth are relative to seasonalChartEl since it's the
      // nearest positioned ancestor (position: relative in CSS).
      var left = col.offsetLeft + col.offsetWidth / 2;
      tooltip.style.left = left + 'px';
      tooltip.classList.add('is-visible');
    }

    function hideTooltip() {
      if (hoveredCol) hoveredCol.classList.remove('is-hovered');
      hoveredCol = null;
      tooltip.classList.remove('is-visible');
    }

    dailyKwh.forEach(function (v, i) {
      var col = document.createElement('div');
      col.className = 'livegen-seasonal-col';
      if (i === bestIdx) col.classList.add('is-best');
      if (i === worstIdx) col.classList.add('is-worst');
      if (i === currentMonth) col.classList.add('is-current');

      var bar = document.createElement('div');
      bar.className = 'livegen-seasonal-bar';
      var heightPct = v === null ? 4 : Math.max(6, Math.round((v / maxVal) * 100));
      bar.style.height = heightPct + '%';

      if (v !== null) {
        bar.setAttribute('aria-label', labels[i] + ': ' + formatKwh(v) + '/' + (lang === 'hi' ? 'दिन' : 'day'));
        bar.addEventListener('mouseenter', function () { showTooltip(col, labels[i], v); });
        bar.addEventListener('mouseleave', hideTooltip);
        bar.addEventListener('focus', function () { showTooltip(col, labels[i], v); });
        bar.addEventListener('blur', hideTooltip);
        // Tap-to-show on touch devices, since there's no hover there.
        // A second tap on the same bar hides it again; tapping another
        // bar just moves the bubble.
        bar.addEventListener('touchstart', function (e) {
          e.preventDefault();
          if (hoveredCol === col) { hideTooltip(); }
          else { showTooltip(col, labels[i], v); }
        }, { passive: false });
        bar.tabIndex = 0;
      }

      var label = document.createElement('span');
      label.className = 'livegen-seasonal-label';
      label.textContent = labels[i];

      col.appendChild(bar);
      col.appendChild(label);
      seasonalChartEl.appendChild(col);
    });

    // Hide the tooltip if the visitor taps/clicks elsewhere on the page.
    document.addEventListener('touchstart', function (e) {
      if (hoveredCol && !seasonalChartEl.contains(e.target)) hideTooltip();
    }, { passive: true });

    var swingPct = Math.round(((maxVal - minVal) / maxVal) * 100);
    var bestLabel = labels[bestIdx];
    var worstLabel = labels[worstIdx];
    var reason = seasonalDipReason(worstIdx, lang);
    var summary = (lang === 'hi')
      ? ('आपका सिस्टम ' + bestLabel + ' में सबसे ज़्यादा (लगभग ' + formatKwh(maxVal) + '/दिन) और ' + worstLabel + ' में सबसे कम (लगभग ' + formatKwh(minVal) + '/दिन) बिजली बनाता है — यानी करीब ' + swingPct + '% का मौसमी अंतर' + reason + '।')
      : ('Your system would generate the most in ' + bestLabel + ' (about ' + formatKwh(maxVal) + '/day) and the least in ' + worstLabel + ' (about ' + formatKwh(minVal) + '/day) — a ' + swingPct + '% seasonal swing' + reason + '.');
    seasonalSummaryEl.textContent = summary;
    seasonalWrapEl.hidden = false;
  }

  async function runEstimate() {
    var cityKey = citySelect.value;
    if (!cityKey) {
      setStatus(t('livegen-error-city', 'Please select your city first.', 'कृपया पहले अपना शहर चुनें।'), true);
      citySelect.focus();
      return;
    }
    var coords = CITY_COORDS[cityKey];
    var systemKw = parseFloat(sizeSelect.value) || 3;
    var shaded = shadeSelect.value === 'yes';
    var pr = BASE_PERFORMANCE_RATIO * (shaded ? SHADE_DERATE : 1);

    resultsEl.hidden = true;
    if (seasonalWrapEl) seasonalWrapEl.hidden = true;
    runBtn.disabled = true;
    setStatus(t('livegen-loading', 'Fetching live weather for your city…', 'आपके शहर के लिए लाइव मौसम डेटा प्राप्त किया जा रहा है…'), false);

    // Kicked off alongside the live-weather request below (not awaited
    // yet) so both network calls run in parallel. A failure here is
    // non-fatal - the seasonal block just stays hidden.
    var seasonalPromise = seasonalWrapEl
      ? fetchSeasonal(coords.lat, coords.lon).catch(function () { return null; })
      : null;

    try {
      var data = await fetchWeather(coords.lat, coords.lon);
      var current = data.current || {};
      var ghi = current.shortwave_radiation || 0;
      var cloudPct = (current.cloud_cover != null) ? current.cloud_cover : 0;
      var isDay = current.is_day;
      var weatherCat = weatherCategory(current.weather_code);

      var currentKw = Math.min(systemKw, systemKw * (ghi / STC_IRRADIANCE) * pr);
      if (!isDay || ghi <= 0) currentKw = 0;

      // Daily total: shortwave_radiation_sum is in MJ/m^2/day.
      // 1 kWh/m^2 = 3.6 MJ/m^2, and 1 kWh/m^2 of insolation is the
      // standard "1 peak sun hour" used for sizing estimates.
      var dailyMJ = (data.daily && data.daily.shortwave_radiation_sum && data.daily.shortwave_radiation_sum[0]) || 0;
      var peakSunHours = dailyMJ / 3.6;
      var todayKwh = systemKw * peakSunHours * pr;

      nowValueEl.textContent = formatKw(currentKw);
      if (!isDay) {
        nowSubEl.textContent = t('livegen-night-note', 'It\'s currently night-time here — systems only generate in daylight.', 'यहाँ अभी रात है — सिस्टम केवल दिन के उजाले में बिजली बनाता है।');
      } else {
        nowSubEl.textContent = '';
      }
      todayValueEl.textContent = formatKwh(todayKwh);

      // Prefer the actual weather code's label (Foggy / Rainy /
      // Thunderstorm) when one applies - it's more specific and more
      // accurate than a cloud-cover band alone, which can't tell a
      // rainy overcast sky from a dry overcast one.
      var catLabel = weatherCategoryLabel(weatherCat);
      var sky = catLabel || skyLabel(cloudPct);
      weatherValueEl.textContent = (currentLang() === 'hi' ? sky.hi : sky.en) + ' (' + Math.round(cloudPct) + '% ' + t('livegen-cloud-suffix', 'cloud cover', 'बादल') + ')';
      updateSkyWidget(cloudPct, isDay, current.time, weatherCat);

      resultsEl.hidden = false;
      setStatus('', false);
    } catch (err) {
      setStatus(t('livegen-error-fetch', 'Live weather data isn\'t available right now — please try again in a moment.', 'अभी लाइव मौसम डेटा उपलब्ध नहीं है — कृपया थोड़ी देर बाद पुनः प्रयास करें।'), true);
    } finally {
      runBtn.disabled = false;
    }

    if (seasonalPromise) {
      seasonalPromise.then(function (sdata) {
        if (!sdata || !sdata.daily) {
          seasonalWrapEl.hidden = true;
          return;
        }
        var monthlyPSH = monthlyPeakSunHours(sdata.daily);
        renderSeasonal(monthlyPSH, systemKw, pr);
      });
    }
  }

  runBtn.addEventListener('click', runEstimate);
})();
