// ===========================================================
// Halosun — Impact Counter
// EDIT THESE TWO NUMBERS as your installed base grows.
// Everything else (generation, CO2, trees) is calculated from them.
// ===========================================================
const IMPACT_CONFIG = {
  totalInstalledKW: 185,      // <-- update this: total kW installed across all projects
  avgSunHoursPerDay: 4.2,     // generation-hours/day assumption (keep in sync with calculator.js)
  gridEmissionFactor: 0.82,   // kg CO2 avoided per kWh (India grid average, CEA baseline)
  kgCO2PerTreePerYear: 21     // standard estimate: one mature tree absorbs ~21kg CO2/year
};

function computeImpactStats(cfg) {
  const annualGenerationKWh = cfg.totalInstalledKW * cfg.avgSunHoursPerDay * 365;
  const co2AvoidedKgPerYear = annualGenerationKWh * cfg.gridEmissionFactor;
  const co2AvoidedTonsPerYear = co2AvoidedKgPerYear / 1000;
  const treesEquivalent = co2AvoidedKgPerYear / cfg.kgCO2PerTreePerYear;
  return {
    totalInstalledKW: cfg.totalInstalledKW,
    annualGenerationKWh: Math.round(annualGenerationKWh),
    co2AvoidedTonsPerYear: Math.round(co2AvoidedTonsPerYear * 10) / 10,
    treesEquivalent: Math.round(treesEquivalent)
  };
}

function animateCount(el, target, duration = 1400, decimals = 0) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = start + (target - start) * eased;
    el.textContent = decimals > 0
      ? value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : Math.round(value).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('impact-counter');
  if (!section) return;

  const stats = computeImpactStats(IMPACT_CONFIG);

  const targets = {
    'impact-kw': stats.totalInstalledKW,
    'impact-kwh': stats.annualGenerationKWh,
    'impact-co2': stats.co2AvoidedTonsPerYear,
    'impact-trees': stats.treesEquivalent
  };

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        Object.entries(targets).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) {
            const decimals = id === 'impact-co2' ? 1 : 0;
            animateCount(el, val, 1400, decimals);
          }
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
});
