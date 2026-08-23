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
   what the visitor sees (including any EMI inputs they've adjusted). */
function pdfText(id, fallback) {
  const el = document.getElementById(id);
  const text = el ? el.textContent.trim() : '';
  return text && text !== '—' && text !== '\u2014' ? text : (fallback || '\u2014');
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

async function generatePdfEstimate() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('The PDF library did not load — please check your internet connection and try again.');
    return;
  }
  const pdfBtn = document.getElementById('calc-pdf-btn');
  if (pdfBtn) pdfBtn.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 18;
    const rightX = pageWidth - marginX;
    let y = 20;

    // ---- Header: logo (best effort) + company name ----
    let textStartX = marginX;
    try {
      const logoDataUrl = await loadImageAsDataURL('assets/logo-header-footer.png');
      // Fit the logo inside a 14mm box while preserving its real aspect
      // ratio — a fixed 14x14 square was stretching non-square logos
      // (e.g. a taller, stacked mark) to fill it.
      const logoProps = doc.getImageProperties(logoDataUrl);
      const maxBoxSize = 14; // mm
      const aspectRatio = logoProps.width / logoProps.height;
      let logoW = maxBoxSize;
      let logoH = maxBoxSize;
      if (aspectRatio >= 1) {
        logoH = maxBoxSize / aspectRatio;
      } else {
        logoW = maxBoxSize * aspectRatio;
      }
      doc.addImage(logoDataUrl, 'PNG', marginX, 12, logoW, logoH);
      textStartX = marginX + logoW + 4;
    } catch (e) {
      // Logo unavailable — fall back to text-only header, no big deal.
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 30, 45);
    doc.text('HALOSUN ENERGY SYSTEMS', textStartX, 19);
    const nameWidth = doc.getTextWidth('HALOSUN ENERGY SYSTEMS');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 120, 135);
    doc.text('Design \u00b7 Build \u00b7 Power', textStartX + nameWidth / 2, 25, { align: 'center' });

    doc.setDrawColor(210, 210, 210);
    doc.line(marginX, 30, rightX, 30);

    // ---- Title + date ----
    y = 40;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20, 30, 45);
    doc.text('Solar Savings Estimate', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text('Generated: ' + today, rightX, y, { align: 'right' });

    y += 8;
    const leadName = (lastLead && lastLead.name) || document.getElementById('calc-name').value.trim() || 'Valued Customer';
    const leadPhone = (lastLead && lastLead.phone) || document.getElementById('calc-phone').value.trim();
    doc.setFontSize(10.5);
    doc.setTextColor(60, 70, 85);
    doc.text('Prepared for: ' + leadName + (leadPhone ? ' (' + leadPhone + ')' : ''), marginX, y);

    // ---- Helper to draw a label/value row ----
    function row(label, value, opts) {
      opts = opts || {};
      const bold = opts.bold;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(70, 80, 95);
      doc.text(label, marginX, y);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(20, 30, 45);
      doc.text(value, rightX, y, { align: 'right' });
      doc.setDrawColor(230, 230, 230);
      doc.line(marginX, y + 2.2, rightX, y + 2.2);
      y += 8;
    }
    function sectionHeading(label) {
      y += 3;
      doc.setFillColor(235, 240, 245);
      doc.rect(marginX, y - 5, rightX - marginX, 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(20, 30, 45);
      doc.text(label, marginX + 2, y);
      y += 8;
    }

    y += 6;
    sectionHeading('System & Savings Summary');
    row('Recommended system size', pdfText('res-size'));
    row('Estimated generation', pdfText('res-units'));
    row('System cost (before subsidy)', pdfText('res-cost'));
    row('Central subsidy (PM Surya Ghar)', pdfText('res-subsidy-central'));
    row('State subsidy (UPNEDA)', pdfText('res-subsidy-state'));
    row('Total subsidy', pdfText('res-subsidy-total'));
    row('Your cost after subsidy', pdfText('res-net'), { bold: true });
    row('Estimated monthly savings', pdfText('res-savings'), { bold: true });
    row('Payback period', pdfText('res-payback'));
    row('Estimated 25-year savings', pdfText('res-lifetime'), { bold: true });

    // ---- EMI section (only if the visitor has actually calculated an EMI) ----
    const emiLoanAmount = pdfText('emi-loan-amount');
    if (emiLoanAmount !== '\u2014') {
      sectionHeading('Financing (EMI) \u2014 Optional');
      const downPct = document.getElementById('emi-downpayment').value || '10';
      const tenureYrs = document.getElementById('emi-tenure').value || '10';
      const ratePct = document.getElementById('emi-rate').value || '5.75';
      row('Down payment', downPct + '%');
      row('Loan tenure', tenureYrs + ' years');
      row('Interest rate', ratePct + '% p.a.');
      row('Loan amount', emiLoanAmount);
      row('Estimated monthly EMI', pdfText('emi-monthly'), { bold: true });

      const postSubsidyBlock = document.getElementById('emi-post-subsidy-block');
      if (postSubsidyBlock && !postSubsidyBlock.hidden) {
        row('Reduced loan amount after subsidy disbursal', pdfText('emi-loan-amount-post'));
        row('Reduced monthly EMI', pdfText('emi-monthly-post'), { bold: true });
      }
    }

    // ---- Footer disclaimer + contact ----
    y += 4;
    doc.setDrawColor(210, 210, 210);
    doc.line(marginX, y, rightX, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    const disclaimer = 'This is an illustrative estimate only, based on the figures you entered — not a final quotation. '
      + 'Actual system size, pricing, subsidy eligibility and loan terms depend on a site visit and lender approval.';
    const wrapped = doc.splitTextToSize(disclaimer, rightX - marginX);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 4 + 4;

    doc.setFontSize(9);
    doc.setTextColor(70, 80, 95);
    doc.text('Halosun Energy Systems  \u2022  +91 92506 78826  \u2022  info@halosunenergysystems.com', marginX, y);

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
