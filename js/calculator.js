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
  // Subsidy slabs (residential only) — PM Surya Ghar (central) + UPNEDA (UP state):
  //   1 kW  → ₹30,000 central + ₹15,000 state = ₹45,000
  //   2 kW  → ₹60,000 central + ₹30,000 state = ₹90,000
  //   3 kW+ → ₹78,000 central + ₹30,000 state = ₹1,08,000 (both capped)
  whatsappNumber: '919250678826', // Halosun business WhatsApp — no country "+" here
};

function calcSubsidy(kw, propertyType) {
  // Matches PM Surya Ghar (central) + UPNEDA (UP state) slabs for residential rooftop.
  if (propertyType === 'commercial') return { central: 0, state: 0, total: 0 };
  if (kw <= 0) return { central: 0, state: 0, total: 0 };

  let central = Math.min(kw, 2) * 30000;
  if (kw > 2) central += Math.min(kw - 2, 1) * 18000;
  central = Math.min(central, 78000);

  let state = Math.min(kw, 2) * 15000;
  state = Math.min(state, 30000);

  return { central, state, total: central + state };
}

function formatINR(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

/* ---------- Lead capture (name + WhatsApp number) ----------
   Required before results are shown. This is the only "verification"
   step: a working WhatsApp number is needed to actually receive the
   pre-filled message, which is what filters out junk/fake entries —
   there's no paid OTP service involved. */
function validateLead() {
  const nameInput = document.getElementById('calc-name');
  const phoneInput = document.getElementById('calc-phone');
  const errorEl = document.getElementById('calc-lead-error');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim().replace(/\D/g, '');
  const phoneValid = /^[6-9]\d{9}$/.test(phone);

  if (!name) {
    errorEl.textContent = 'Please enter your name to see your estimate.';
    errorEl.hidden = false;
    nameInput.focus();
    return null;
  }
  if (!phoneValid) {
    errorEl.textContent = 'Please enter a valid 10-digit mobile number — this is where we\u2019ll send your estimate on WhatsApp.';
    errorEl.hidden = false;
    phoneInput.focus();
    return null;
  }

  errorEl.hidden = true;
  return { name, phone };
}

let hasAutoOpenedWhatsapp = false;

// Defaults used by the Reset button — keep in sync with the HTML's
// initial values (calc-tariff="8", calc-type="residential", etc.)
const CALC_FIELD_DEFAULTS = {
  'calc-name': '',
  'calc-phone': '',
  'calc-bill': '',
  'calc-tariff': '8',
  'calc-type': 'residential',
  'emi-downpayment': '10',
  'emi-tenure': '10',
  'emi-rate': '5.75',
};

function buildWhatsappUrl(lead, summary) {
  const lines = [
    `Hello Halosun Energy Systems,`,
    `I'm ${lead.name} (${lead.phone}).`,
    ``,
    `My savings calculator estimate:`,
    `\u2022 Monthly bill: ${formatINR(summary.bill)}`,
    `\u2022 Recommended system size: ${summary.kw} kWp`,
    `\u2022 Estimated monthly savings: ${formatINR(summary.monthlySavings)}`,
    `\u2022 Payback period: ${summary.paybackYears > 0 ? summary.paybackYears.toFixed(1) + ' years' : '\u2014'}`,
    `\u2022 Property type: ${summary.propertyType === 'commercial' ? 'Commercial / Industrial' : 'Residential'}`,
    ``,
    `Please share an exact quote for my property.`,
  ];
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${CALC_CONFIG.whatsappNumber}?text=${text}`;
}

function runCalculator() {
  const lead = validateLead();
  if (!lead) return;

  const billInput = document.getElementById('calc-bill');
  const tariffInput = document.getElementById('calc-tariff');
  const typeInput = document.getElementById('calc-type');
  const resultsEl = document.getElementById('calc-results-content');

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
  const netCost = systemCost - subsidy.total;

  const monthlySavings = Math.min(generatedUnits, monthlyUnits) * tariff;
  const newBill = Math.max(bill - monthlySavings, CALC_CONFIG.fixedChargeEstimate);
  const paybackYears = monthlySavings > 0 ? netCost / (monthlySavings * 12) : 0;
  const lifetimeSavings = (monthlySavings * 12 * 25 * CALC_CONFIG.degradationFactor) - netCost;

  document.getElementById('res-size').textContent = kw + ' kWp';
  document.getElementById('res-units').textContent = Math.round(generatedUnits) + ' units/month';
  document.getElementById('res-cost').textContent = formatINR(systemCost);
  document.getElementById('res-subsidy-central').textContent = subsidy.central > 0 ? formatINR(subsidy.central) : 'Not applicable';
  document.getElementById('res-subsidy-state').textContent = subsidy.state > 0 ? formatINR(subsidy.state) : 'Not applicable';
  document.getElementById('res-subsidy-total').textContent = subsidy.total > 0 ? formatINR(subsidy.total) : 'Not applicable';
  document.getElementById('res-net').textContent = formatINR(netCost);
  document.getElementById('res-savings').textContent = formatINR(monthlySavings) + '/month';
  document.getElementById('res-payback').textContent = paybackYears > 0 ? paybackYears.toFixed(1) + ' years' : '—';
  document.getElementById('res-lifetime').textContent = formatINR(Math.max(lifetimeSavings, 0));

  resultsEl.hidden = false;
  const placeholderEl = document.getElementById('calc-placeholder');
  if (placeholderEl) placeholderEl.hidden = true;

  // Carry the bill amount over to the contact page's lead form via URL param,
  // since the calculator and the lead form now live on separate pages.
  const ctaLink = document.getElementById('calc-cta');
  if (ctaLink) {
    ctaLink.href = 'contact.html?bill=' + Math.round(bill);
  }

  // ---- WhatsApp send: build/refresh the link every time results change ----
  const whatsappUrl = buildWhatsappUrl(lead, {
    bill, kw, monthlySavings, paybackYears, propertyType,
  });
  const whatsappBtn = document.getElementById('calc-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.href = whatsappUrl;
    whatsappBtn.classList.remove('is-disabled');
    whatsappBtn.removeAttribute('aria-disabled');
  }
  // Auto-open once per visit, right after the first successful calculation —
  // this is the "mandatory" part: getting results also opens WhatsApp with
  // the request pre-filled, and the visitor just needs to tap Send there.
  // Later recalculations (e.g. adjusting the bill) just refresh the button
  // above rather than re-opening a tab each time.
  if (!hasAutoOpenedWhatsapp) {
    window.open(whatsappUrl, '_blank', 'noopener');
    hasAutoOpenedWhatsapp = true;
  }

  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- Reset ----------
   Clears every field the user filled in (lead + calculator + EMI panel)
   back to defaults, hides the results, restores the "fill in your
   details" placeholder, and disables the WhatsApp button again until
   the user recalculates. */
function resetCalculator() {
  Object.keys(CALC_FIELD_DEFAULTS).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = CALC_FIELD_DEFAULTS[id];
  });

  const errorEl = document.getElementById('calc-lead-error');
  if (errorEl) errorEl.hidden = true;

  const resultsEl = document.getElementById('calc-results-content');
  if (resultsEl) resultsEl.hidden = true;

  const placeholderEl = document.getElementById('calc-placeholder');
  if (placeholderEl) placeholderEl.hidden = false;

  const postSubsidyBlock = document.getElementById('emi-post-subsidy-block');
  if (postSubsidyBlock) postSubsidyBlock.hidden = true;

  ['emi-loan-amount', 'emi-monthly', 'emi-old-bill', 'emi-loan-amount-post', 'emi-monthly-post'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '\u2014';
  });

  const whatsappBtn = document.getElementById('calc-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.classList.add('is-disabled');
    whatsappBtn.setAttribute('aria-disabled', 'true');
    whatsappBtn.removeAttribute('href');
  }

  // Let the next successful calculation auto-open WhatsApp again.
  hasAutoOpenedWhatsapp = false;

  const nameInput = document.getElementById('calc-name');
  if (nameInput) nameInput.focus();
}

document.getElementById('calc-run').addEventListener('click', runCalculator);
document.getElementById('calc-bill').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); runCalculator(); }
});
document.getElementById('calc-phone').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); runCalculator(); }
});
const calcResetBtn = document.getElementById('calc-reset');
if (calcResetBtn) calcResetBtn.addEventListener('click', resetCalculator);

// Belt-and-braces guard in case the CSS pointer-events rule is ever
// overridden — the button shouldn't be clickable while disabled.
const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');
if (calcWhatsappBtn) {
  calcWhatsappBtn.addEventListener('click', (e) => {
    if (calcWhatsappBtn.classList.contains('is-disabled')) e.preventDefault();
  });
}
