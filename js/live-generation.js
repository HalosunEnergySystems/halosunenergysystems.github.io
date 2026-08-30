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

  // Returns "YYYY-MM-DDTHH:00" for the current hour in Asia/Kolkata,
  // matching the format Open-Meteo uses for hourly.time entries.
  function kolkataHourString(date) {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', hour12: false
    }).formatToParts(date);
    var get = function (type) {
      var p = parts.filter(function (x) { return x.type === type; })[0];
      return p ? p.value : '';
    };
    var hour = get('hour');
    if (hour === '24') hour = '00';
    return get('year') + '-' + get('month') + '-' + get('day') + 'T' + hour + ':00';
  }

  function skyLabel(cloudPct) {
    if (cloudPct < 20)  return { en: 'Clear skies', hi: 'साफ आसमान' };
    if (cloudPct < 50)  return { en: 'Partly cloudy', hi: 'आंशिक बादल' };
    if (cloudPct < 80)  return { en: 'Mostly cloudy', hi: 'ज़्यादातर बादल' };
    return { en: 'Overcast', hi: 'घने बादल' };
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
      + '&hourly=cloud_cover,shortwave_radiation,is_day'
      + '&daily=shortwave_radiation_sum'
      + '&timezone=Asia%2FKolkata&forecast_days=2';
    var res = await fetch(url);
    if (!res.ok) throw new Error('weather request failed');
    return res.json();
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
    runBtn.disabled = true;
    setStatus(t('livegen-loading', 'Fetching live weather for your city…', 'आपके शहर के लिए लाइव मौसम डेटा प्राप्त किया जा रहा है…'), false);

    try {
      var data = await fetchWeather(coords.lat, coords.lon);
      var nowKey = kolkataHourString(new Date());
      var idx = data.hourly.time.indexOf(nowKey);
      if (idx === -1) idx = 0;

      var ghi = data.hourly.shortwave_radiation[idx] || 0;
      var cloudPct = data.hourly.cloud_cover[idx];
      var isDay = data.hourly.is_day[idx];

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
      var sky = skyLabel(cloudPct);
      weatherValueEl.textContent = (currentLang() === 'hi' ? sky.hi : sky.en) + ' (' + Math.round(cloudPct) + '% ' + t('livegen-cloud-suffix', 'cloud cover', 'बादल') + ')';

      resultsEl.hidden = false;
      setStatus('', false);
    } catch (err) {
      setStatus(t('livegen-error-fetch', 'Live weather data isn\'t available right now — please try again in a moment.', 'अभी लाइव मौसम डेटा उपलब्ध नहीं है — कृपया थोड़ी देर बाद पुनः प्रयास करें।'), true);
    } finally {
      runBtn.disabled = false;
    }
  }

  runBtn.addEventListener('click', runEstimate);
})();
