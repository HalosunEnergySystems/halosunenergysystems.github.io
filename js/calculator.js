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

/* ---------- Lead notification (Google Apps Script) ----------
   Reuses the SAME Apps Script Web App endpoint the contact form
   (js/form.js) already posts to — no new service to set up.
   Sent using the same field names Code.gs already expects
   (name, phone, email, city, propertyType, monthlyBill, message,
   submittedAt); the calculator-specific numbers (system size,
   savings, payback) are folded into "message" as readable text so
   nothing on the Apps Script side needs to change. */
const FORM_CONFIG = {
  endpointUrl: 'https://script.google.com/macros/s/AKfycbz6pPce1eTVj4WYkrC6jslRFw1ruCHh4GZ5Bt8TlE_yzvFmewf44ZGC4tqBEoY08V8/exec',
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
let lastLead = null; // set on successful calculation, cleared on reset
let lastCalcValues = null; // raw numbers from the last calculation, used to re-render results text if the language is switched afterwards

// Writes the calculated numbers into the result DOM elements, using
// whatever language is currently selected. Pulled out of runCalculator()
// so a later language switch can re-render the same numbers in the new
// language (via refreshCalcResultsLanguage) without recalculating or
// resubmitting the lead.
function renderCalcResults(values) {
  const { kw, generatedUnits, systemCost, subsidy, netCost, monthlySavings, paybackYears, lifetimeSavings } = values;
  const calcLang = getCurrentPdfLang();
  const unitsMonthSuffix = pdfLabel('pdf-units-month-suffix', calcLang, 'units/month');
  const perMonthSuffix = pdfLabel('pdf-per-month-suffix', calcLang, '/month');
  const yearsSuffix = pdfLabel('pdf-years-suffix', calcLang, 'years');
  const notApplicableText = pdfLabel('pdf-not-applicable', calcLang, 'Not applicable');

  document.getElementById('res-size').textContent = kw + ' kWp';
  document.getElementById('res-units').textContent = Math.round(generatedUnits) + ' ' + unitsMonthSuffix;
  document.getElementById('res-cost').textContent = formatINR(systemCost);
  document.getElementById('res-subsidy-central').textContent = subsidy.central > 0 ? formatINR(subsidy.central) : notApplicableText;
  document.getElementById('res-subsidy-state').textContent = subsidy.state > 0 ? formatINR(subsidy.state) : notApplicableText;
  document.getElementById('res-subsidy-total').textContent = subsidy.total > 0 ? formatINR(subsidy.total) : notApplicableText;
  document.getElementById('res-net').textContent = formatINR(netCost);
  document.getElementById('res-savings').textContent = formatINR(monthlySavings) + perMonthSuffix;
  document.getElementById('res-payback').textContent = paybackYears > 0 ? paybackYears.toFixed(1) + ' ' + yearsSuffix : '—';
  document.getElementById('res-lifetime').textContent = formatINR(Math.max(lifetimeSavings, 0));
}

// Called from js/i18n.js's applyLanguage() whenever the visitor toggles
// language, so numbers already on screen (and therefore the PDF, which
// just reads the DOM) switch language too instead of staying stuck in
// whichever language was active at calculation time.
function refreshCalcResultsLanguage() {
  if (lastCalcValues) renderCalcResults(lastCalcValues);
  if (typeof updateEMI === 'function') updateEMI();
}

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

/* ---------- Lead notification (Google Apps Script) ----------
   Fires once per successful calculation (i.e. every time the visitor
   clicks Calculate with a valid name/phone/bill). Uses the same
   no-cors POST pattern as js/form.js — Apps Script Web Apps don't
   return CORS headers, so the response can't be read, but the
   request still reaches the script and it does the rest (email +
   Sheet row, same as the contact form). Never blocks or breaks the
   calculator itself if this fails. */
function sendLeadToBackend(lead, summary) {
  if (!FORM_CONFIG.endpointUrl || FORM_CONFIG.endpointUrl.includes('PASTE_YOUR')) {
    console.warn('Apps Script endpoint not configured — skipping lead notification.');
    return;
  }

  const messageLines = [
    'Submitted from the Savings Calculator.',
    `Recommended system size: ${summary.kw} kWp`,
    `Estimated monthly savings: ${formatINR(summary.monthlySavings)}`,
    `Payback period: ${summary.paybackYears > 0 ? summary.paybackYears.toFixed(1) + ' years' : '\u2014'}`,
    `Property type: ${summary.propertyType === 'commercial' ? 'Commercial / Industrial' : 'Residential'}`,
  ];

  const payload = {
    name: lead.name,
    phone: lead.phone,
    email: '', // calculator doesn't currently collect this
    city: '',  // calculator doesn't currently collect this
    propertyType: summary.propertyType === 'commercial' ? 'Commercial' : 'Residential',
    monthlyBill: summary.bill,
    message: messageLines.join('\n'),
    submittedAt: new Date().toISOString(),
  };

  fetch(FORM_CONFIG.endpointUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error('Lead notification failed:', err);
  });
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

  // Store the raw numbers (not pre-formatted strings) so the display
  // can be re-rendered later — e.g. if the visitor switches language
  // AFTER calculating, without re-running the calculation or
  // resubmitting the lead to WhatsApp/backend.
  lastCalcValues = { kw, generatedUnits, systemCost, subsidy, netCost, monthlySavings, paybackYears, lifetimeSavings };
  renderCalcResults(lastCalcValues);

  resultsEl.hidden = false;
  const placeholderEl = document.getElementById('calc-placeholder');
  if (placeholderEl) placeholderEl.hidden = true;

  lastLead = lead;
  const pdfBtn = document.getElementById('calc-pdf-btn');
  if (pdfBtn) pdfBtn.disabled = false;

  // Carry the bill amount over to the contact page's lead form via URL param,
  // since the calculator and the lead form now live on separate pages.
  const ctaLink = document.getElementById('calc-cta');
  if (ctaLink) {
    ctaLink.href = 'contact.html?bill=' + Math.round(bill);
  }

  // ---- WhatsApp send + backend lead notification: built from the same
  //      summary so both channels always show identical figures ----
  const summary = { bill, kw, monthlySavings, paybackYears, propertyType };
  const whatsappUrl = buildWhatsappUrl(lead, summary);
  sendLeadToBackend(lead, summary);
  const whatsappBtn = document.getElementById('calc-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.href = whatsappUrl;
    whatsappBtn.classList.remove('is-disabled');
    whatsappBtn.removeAttribute('aria-disabled');
  }
  // Scroll/paint the revealed results BEFORE we potentially switch focus
  // away to a new WhatsApp tab below — otherwise the browser can defer
  // repainting this now-background tab until the user switches back to it.
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-open once per visit, right after the first successful calculation —
  // this is the "mandatory" part: getting results also opens WhatsApp with
  // the request pre-filled, and the visitor just needs to tap Send there.
  // Later recalculations (e.g. adjusting the bill) just refresh the button
  // above rather than re-opening a tab each time.
  if (!hasAutoOpenedWhatsapp) {
    hasAutoOpenedWhatsapp = true;
    // Deferred slightly so this tab finishes painting the results (and the
    // scroll above) before we switch focus away to the new WhatsApp tab.
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener');
    }, 300);
  }
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
  lastLead = null;

  const pdfBtn = document.getElementById('calc-pdf-btn');
  if (pdfBtn) pdfBtn.disabled = true;

  const nameInput = document.getElementById('calc-name');
  if (nameInput) nameInput.focus();
}

/* ---------- PDF estimate ----------
   Builds a one-page branded PDF from whatever is currently on screen —
   it reads the already-formatted result/EMI text straight out of the
   DOM rather than recomputing anything, so it always matches exactly
   what the visitor sees (including any EMI inputs they've adjusted).

   Language: the PDF follows whatever language is currently selected on
   the page (js/i18n.js, persisted in localStorage under 'halosun-lang').
   English uses jsPDF's built-in Helvetica font. Hindi needs a real
   Unicode font embedded into the PDF — Helvetica has no Devanagari
   glyphs at all — so for 'hi' we lazy-load a subset of Noto Sans
   Devanagari (js/fonts/*.b64.js) and embed it via jsPDF's addFont(). */
function pdfText(id, fallback, opts) {
  const el = document.getElementById(id);
  let text = el ? el.textContent.trim() : '';
  const keepRupeeSign = opts && opts.keepRupeeSign;
  if (!keepRupeeSign) {
    // Helvetica (WinAnsi) doesn't include the ₹ Rupee sign (Unicode 2010) —
    // it rendered as a garbled glyph. Swap it for plain "Rs." in that case.
    text = text.replace(/\u20B9/g, 'Rs. ');
  }
  text = text && text !== '—' && text !== '\u2014' ? text : (fallback || '\u2014');
  return fixDevanagariOrder(text);
}

// Looks up a PDF label from the same TRANSLATIONS dictionary js/i18n.js
// uses for on-page text (falls back to the English string if a key or
// the whole dictionary isn't available for any reason).
function pdfLabel(key, lang, fallbackEn) {
  const entry = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS[key] : null;
  if (entry && entry[lang]) return entry[lang];
  return (entry && entry.en) || fallbackEn || key;
}

// jsPDF draws each character glyph in raw string order — it has no
// Indic text-shaping engine, so it doesn't reorder Devanagari's
// pre-base vowel sign ि (U+093F). Unicode stores ि AFTER the consonant
// (or conjunct cluster) it belongs to, but it must be drawn BEFORE it
// (e.g. सिस्टम is typed स+ि+स+्+ट+म but ि visually precedes स). Without
// this fix words like "सिस्टम" or "अनुशंसित" render with the vowel
// sign in the wrong place. This swaps ि to the front of the consonant
// cluster (base consonant plus any conjunct chain before it) it
// attaches to, so it lands in the correct visual position.
const DEVANAGARI_MATRA_FIX_RE = /([\u0900-\u0939\u0958-\u095F](?:\u094D[\u0900-\u0939\u0958-\u095F])*)(\u093F)/g;
function fixDevanagariOrder(text) {
  if (!text) return text;
  return String(text).replace(DEVANAGARI_MATRA_FIX_RE, '$2$1');
}

function getCurrentPdfLang() {
  try {
    return localStorage.getItem('halosun-lang') === 'hi' ? 'hi' : 'en';
  } catch (e) {
    return 'en';
  }
}

// Loads a base64 font file (js/fonts/*.b64.js, each sets one
// window.NOTO_DEVANAGARI_*_BASE64 global) by injecting a <script> tag,
// only once per page load, and returns a promise that resolves once
// the corresponding global is available.
const _loadedFontScripts = {};
function loadFontScript(src, globalVarName) {
  if (window[globalVarName]) return Promise.resolve();
  if (_loadedFontScripts[src]) return _loadedFontScripts[src];
  _loadedFontScripts[src] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load font script: ' + src));
    document.head.appendChild(script);
  });
  return _loadedFontScripts[src];
}

// Registers the Devanagari font (regular + bold) with a jsPDF doc
// instance so `doc.setFont('NotoDevanagari', 'normal' | 'bold')` works.
// Fonts are fetched lazily (only when a Hindi PDF is actually being
// generated) so the ~460KB of font data never loads for English visitors.
async function registerDevanagariFont(doc) {
  await Promise.all([
    loadFontScript('js/fonts/NotoSansDevanagari-Regular.b64.js', 'NOTO_DEVANAGARI_REGULAR_BASE64'),
    loadFontScript('js/fonts/NotoSansDevanagari-Bold.b64.js', 'NOTO_DEVANAGARI_BOLD_BASE64'),
  ]);
  doc.addFileToVFS('NotoSansDevanagari-Regular.ttf', window.NOTO_DEVANAGARI_REGULAR_BASE64);
  doc.addFont('NotoSansDevanagari-Regular.ttf', 'NotoDevanagari', 'normal');
  doc.addFileToVFS('NotoSansDevanagari-Bold.ttf', window.NOTO_DEVANAGARI_BOLD_BASE64);
  doc.addFont('NotoSansDevanagari-Bold.ttf', 'NotoDevanagari', 'bold');
}

function loadImageAsDataURL(url) {
  return fetch(url)
    .then((res) => (res.ok ? res.blob() : Promise.reject(new Error('image fetch failed'))))
    .then((blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

// Brand palette (matches css/styles.css design tokens)
const PDF_COLOR = {
  ink: [15, 32, 56],        // --ink
  inkSoft: [24, 47, 76],    // --ink-soft
  sun: [217, 169, 78],      // --sun
  sunTint: [250, 243, 229], // pale wash of --sun for card backgrounds
  ember: [232, 93, 44],     // --ember
  slate: [36, 48, 61],      // --slate
  mist: [124, 139, 155],    // --mist
  line: [225, 220, 205],    // warm-tinted hairline
  zebra: [247, 244, 236],   // faint warm stripe for alternating rows
};

async function generatePdfEstimate() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('The PDF library did not load — please check your internet connection and try again.');
    return;
  }
  const pdfBtn = document.getElementById('calc-pdf-btn');
  if (pdfBtn) pdfBtn.disabled = true;

  try {
    const lang = getCurrentPdfLang();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Base font family for this document: Helvetica for English, the
    // embedded Devanagari font for Hindi. setFont() calls below all use
    // this instead of hardcoding 'helvetica' so the whole PDF switches.
    let fontFamily = 'helvetica';
    if (lang === 'hi') {
      try {
        await registerDevanagariFont(doc);
        fontFamily = 'NotoDevanagari';
      } catch (fontErr) {
        // Font failed to load (e.g. offline) — fall back to Helvetica
        // rather than blocking the PDF. Hindi text just won't render
        // correctly in this fallback case; English text still will.
        console.error('Devanagari font load failed, falling back to Helvetica:', fontErr);
      }
    }
    const t = (key, fallbackEn) => fixDevanagariOrder(pdfLabel(key, lang, fallbackEn));

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 18;
    const rightX = pageWidth - marginX;
    let y;

    // ---- Header band: full-width navy strip with logo + name ----
    const bandH = 34;
    doc.setFillColor(...PDF_COLOR.ink);
    doc.rect(0, 0, pageWidth, bandH, 'F');
    doc.setFillColor(...PDF_COLOR.sun);
    doc.rect(0, bandH, pageWidth, 1.2, 'F'); // thin gold seam under the band

    let textStartX = marginX;
    try {
      const logoDataUrl = await loadImageAsDataURL('assets/logo-header-footer.png');
      // Fit the logo inside an 18mm box while preserving its real aspect
      // ratio, so non-square logos (e.g. a taller, stacked mark) don't
      // get stretched to fill a fixed square.
      const logoProps = doc.getImageProperties(logoDataUrl);
      const maxBoxSize = 18; // mm
      const aspectRatio = logoProps.width / logoProps.height;
      let logoW = maxBoxSize;
      let logoH = maxBoxSize;
      if (aspectRatio >= 1) {
        logoH = maxBoxSize / aspectRatio;
      } else {
        logoW = maxBoxSize * aspectRatio;
      }
      doc.addImage(logoDataUrl, 'PNG', marginX, (bandH - logoH) / 2, logoW, logoH);
      textStartX = marginX + logoW + 5;
    } catch (e) {
      // Logo unavailable — fall back to text-only header, no big deal.
    }
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text('HALOSUN ENERGY SYSTEMS', textStartX, 18);
    const nameWidth = doc.getTextWidth('HALOSUN ENERGY SYSTEMS');
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...PDF_COLOR.sun);
    doc.text(t('footer-tagline', 'Design \u00b7 Build \u00b7 Power'), textStartX + nameWidth / 2, 25, { align: 'center' });

    const today = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(210, 217, 227);
    doc.text(t('pdf-doc-title', 'Solar Savings Estimate'), rightX, 15, { align: 'right' });
    doc.text(t('pdf-generated', 'Generated:') + ' ' + today, rightX, 20.5, { align: 'right' });

    // ---- Title + prepared-for line ----
    y = bandH + 13;
    const leadName = fixDevanagariOrder((lastLead && lastLead.name) || document.getElementById('calc-name').value.trim() || t('pdf-valued-customer', 'Valued Customer'));
    const leadPhone = (lastLead && lastLead.phone) || document.getElementById('calc-phone').value.trim();
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...PDF_COLOR.ink);
    const preparedForLine = t('pdf-prepared-for', 'Prepared for') + (lang === 'hi' ? ': ' : ' ')
      + leadName + (leadPhone ? '  \u00b7  ' + leadPhone : '');
    doc.text(preparedForLine, marginX, y);

    // ---- Hero stat cards: the two numbers a visitor cares about most ---
    y += 8;
    const cardGap = 8;
    const cardW = (rightX - marginX - cardGap) / 2;
    const cardH = 24;
    function heroCard(x, label, value) {
      doc.setFillColor(...PDF_COLOR.sunTint);
      doc.setDrawColor(...PDF_COLOR.sun);
      doc.roundedRect(x, y, cardW, cardH, 3, 3, 'FD');
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...PDF_COLOR.ember);
      doc.text(label.toUpperCase(), x + 6, y + 8);
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...PDF_COLOR.ink);
      doc.text(value, x + 6, y + 18);
    }
    heroCard(marginX, t('res-savings-label', 'Est. Monthly Savings'), pdfText('res-savings', null, { keepRupeeSign: lang === 'hi' }));
    heroCard(marginX + cardW + cardGap, t('res-payback-label', 'Payback Period'), pdfText('res-payback'));
    y += cardH + 10;

    // ---- Helpers to draw a section heading and label/value rows ----
    let rowIndex = 0;
    function row(label, value, opts) {
      opts = opts || {};
      const bold = opts.bold;
      if (rowIndex % 2 === 1) {
        doc.setFillColor(...PDF_COLOR.zebra);
        doc.rect(marginX - 2, y - 5.3, (rightX - marginX) + 4, 7.8, 'F');
      }
      rowIndex += 1;
      doc.setFont(fontFamily, 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...PDF_COLOR.mist);
      doc.text(label, marginX, y);
      doc.setFont(fontFamily, bold ? 'bold' : 'normal');
      doc.setTextColor(...(bold ? PDF_COLOR.ember : PDF_COLOR.slate));
      doc.text(value, rightX, y, { align: 'right' });
      y += 7.8;
    }
    function sectionHeading(label) {
      y += 3;
      doc.setFillColor(...PDF_COLOR.sunTint);
      doc.rect(marginX, y - 5, rightX - marginX, 8, 'F');
      doc.setFillColor(...PDF_COLOR.ember);
      doc.rect(marginX, y - 5, 2.2, 8, 'F'); // colored accent tab on the left edge
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...PDF_COLOR.ink);
      doc.text(label, marginX + 6, y + 0.6);
      y += 9;
      rowIndex = 0;
    }

    const keepRupee = { keepRupeeSign: lang === 'hi' };
    sectionHeading(t('pdf-section-summary', 'System & Savings Summary'));
    row(t('res-size-label', 'Recommended system size'), pdfText('res-size'));
    row(t('res-units-label', 'Estimated generation'), pdfText('res-units'));
    row(t('res-cost-label', 'System cost (before subsidy)'), pdfText('res-cost', null, keepRupee));
    row(t('res-subsidy-central-label', 'Central subsidy (PM Surya Ghar)'), pdfText('res-subsidy-central', null, keepRupee));
    row(t('res-subsidy-state-label', 'State subsidy (UPNEDA)'), pdfText('res-subsidy-state', null, keepRupee));
    row(t('res-subsidy-total-label', 'Total subsidy'), pdfText('res-subsidy-total', null, keepRupee));
    row(t('res-net-label', 'Your cost after subsidy'), pdfText('res-net', null, keepRupee), { bold: true });
    row(t('res-lifetime-label', 'Estimated 25-year savings'), pdfText('res-lifetime', null, keepRupee), { bold: true });

    // ---- EMI section (only if the visitor has actually calculated an EMI) ----
    const emiLoanAmount = pdfText('emi-loan-amount', null, keepRupee);
    if (emiLoanAmount !== '\u2014') {
      sectionHeading(t('pdf-section-emi', 'Financing (EMI) \u2014 Optional'));
      const downPct = document.getElementById('emi-downpayment').value || '10';
      const tenureYrs = document.getElementById('emi-tenure').value || '10';
      const ratePct = document.getElementById('emi-rate').value || '5.75';
      row(t('pdf-down-payment', 'Down payment'), downPct + '%');
      row(t('pdf-loan-tenure', 'Loan tenure'), tenureYrs + ' ' + t('pdf-years-suffix', 'years'));
      row(t('pdf-interest-rate', 'Interest rate'), ratePct + t('pdf-pa-suffix', '% p.a.'));
      row(t('emi-loan-amount-label', 'Loan amount'), emiLoanAmount);
      row(t('emi-monthly-label', 'Estimated monthly EMI'), pdfText('emi-monthly', null, keepRupee), { bold: true });

      const postSubsidyBlock = document.getElementById('emi-post-subsidy-block');
      if (postSubsidyBlock && !postSubsidyBlock.hidden) {
        row(t('emi-loan-amount-post-label', 'Reduced loan amount after subsidy disbursal'), pdfText('emi-loan-amount-post', null, keepRupee));
        row(t('emi-monthly-post-label', 'Reduced monthly EMI'), pdfText('emi-monthly-post', null, keepRupee), { bold: true });
      }
    }

    // ---- Footer disclaimer + contact ----
    y += 3;
    doc.setDrawColor(...PDF_COLOR.sun);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, rightX, y);
    doc.setLineWidth(0.2);
    y += 6;
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLOR.mist);
    const disclaimer = t('pdf-disclaimer',
      'This is an illustrative estimate only, based on the figures you entered — not a final quotation. '
      + 'Actual system size, pricing, subsidy eligibility and loan terms depend on a site visit and lender approval.');
    const wrapped = doc.splitTextToSize(disclaimer, rightX - marginX);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 4 + 5;

    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...PDF_COLOR.ink);
    doc.text('Halosun Energy Systems', marginX, y);
    doc.setFont(fontFamily, 'normal');
    doc.setTextColor(...PDF_COLOR.mist);
    doc.text('  \u2022  +91 92506 78826  \u2022  info@halosunenergysystems.com', marginX + doc.getTextWidth('Halosun Energy Systems'), y);

    const safeName = leadName.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'estimate';
    doc.save('Halosun-Solar-Estimate-' + safeName + '.pdf');
  } catch (err) {
    console.error('PDF generation failed:', err);
    alert('Sorry, something went wrong generating the PDF. Please try again.');
  } finally {
    const btn = document.getElementById('calc-pdf-btn');
    if (btn) btn.disabled = false;
  }
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

const calcPdfBtn = document.getElementById('calc-pdf-btn');
if (calcPdfBtn) calcPdfBtn.addEventListener('click', generatePdfEstimate);

// Belt-and-braces guard in case the CSS pointer-events rule is ever
// overridden — the button shouldn't be clickable while disabled.
const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');
if (calcWhatsappBtn) {
  calcWhatsappBtn.addEventListener('click', (e) => {
    if (calcWhatsappBtn.classList.contains('is-disabled')) e.preventDefault();
  });
}
