/* ===================================================================
   Solar savings calculator
   All assumptions live in CONFIG below — edit these to match your
   real pricing and local generation figures at any time.
=================================================================== */
const CALC_CONFIG = {
  unitsPerKwPerMonth: 120,        // ~4 units/kWp/day average across India
  costPerKwResidential: 60000,    // ₹ per kW, turnkey, before subsidy
  costPerKwCommercial: 45000,     // ₹ per kW, before subsidy, commercial scale
  minSystemKw: 1,
  roundToKw: 0.5,
  fixedChargeEstimate: 200,       // ₹ minimum monthly bill even with solar
  degradationFactor: 0.9,         // rough allowance for panel output decline over 25 yrs
};

function calcSubsidy(kw, propertyType) {
  if (propertyType === 'commercial') return 0; // PM Surya Ghar targets residential rooftop
  if (kw <= 0) return 0;
  let subsidy = Math.min(kw, 2) * 30000;
  if (kw > 2) subsidy += Math.min(kw - 2, 1) * 18000;
  return Math.min(subsidy, 78000);
}

function formatINR(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function runCalculator() {
  const billInput = document.getElementById('calc-bill');
  const tariffInput = document.getElementById('calc-tariff');
  const typeInput = document.getElementById('calc-type');
  const resultsEl = document.getElementById('calc-results');

  const bill = parseFloat(billInput.value);
  const tariff = parseFloat(tariffInput.value) || 8;
  const propertyType = typeInput.value;

  if (!bill || bill <= 0) {
    billInput.focus();
    return;
  }

  const monthlyUnits = bill / tariff;
  let kw = monthlyUnits / CALC_CONFIG.unitsPerKwPerMonth;
  kw = Math.ceil(kw / CALC_CONFIG.roundToKw) * CALC_CONFIG.roundToKw;
  kw = Math.max(kw, CALC_CONFIG.minSystemKw);

  const generatedUnits = kw * CALC_CONFIG.unitsPerKwPerMonth;
  const costPerKw = propertyType === 'commercial'
    ? CALC_CONFIG.costPerKwCommercial
    : CALC_CONFIG.costPerKwResidential;
  const systemCost = kw * costPerKw;
  const subsidy = calcSubsidy(kw, propertyType);
  const netCost = systemCost - subsidy;

  const monthlySavings = Math.min(generatedUnits, monthlyUnits) * tariff;
  const newBill = Math.max(bill - monthlySavings, CALC_CONFIG.fixedChargeEstimate);
  const paybackYears = monthlySavings > 0 ? netCost / (monthlySavings * 12) : 0;
  const lifetimeSavings = (monthlySavings * 12 * 25 * CALC_CONFIG.degradationFactor) - netCost;

  document.getElementById('res-size').textContent = kw + ' kWp';
  document.getElementById('res-units').textContent = Math.round(generatedUnits) + ' units/month';
  document.getElementById('res-cost').textContent = formatINR(systemCost);
  document.getElementById('res-subsidy').textContent = subsidy > 0 ? formatINR(subsidy) : 'Not applicable';
  document.getElementById('res-net').textContent = formatINR(netCost);
  document.getElementById('res-savings').textContent = formatINR(monthlySavings) + '/month';
  document.getElementById('res-payback').textContent = paybackYears > 0 ? paybackYears.toFixed(1) + ' years' : '—';
  document.getElementById('res-lifetime').textContent = formatINR(Math.max(lifetimeSavings, 0));

  resultsEl.hidden = false;

  // Carry the bill amount over to the lead form for convenience
  const leadBillField = document.getElementById('lf-bill');
  if (leadBillField && !leadBillField.value) leadBillField.value = Math.round(bill);

  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('calc-run').addEventListener('click', runCalculator);
document.getElementById('calc-bill').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); runCalculator(); }
});
