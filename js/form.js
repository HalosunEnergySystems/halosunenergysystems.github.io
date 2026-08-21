/* ===================================================================
   Lead form submission
   Paste your deployed Google Apps Script Web App URL below.
   See apps-script/Code.gs and README.md for setup instructions.
=================================================================== */
const FORM_CONFIG = {
  endpointUrl: 'https://script.google.com/macros/s/AKfycbz6pPce1eTVj4WYkrC6jslRFw1ruCHh4GZ5Bt8TlE_yzvFmewf44ZGC4tqBEoY08V8/exec',
};

// If arriving from the calculator page with ?bill=4000, prefill the field.
(function prefillBillFromCalculator() {
  const params = new URLSearchParams(window.location.search);
  const bill = params.get('bill');
  const billField = document.getElementById('lf-bill');
  if (bill && billField && !billField.value) {
    billField.value = bill;
  }
})();

document.getElementById('lead-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const statusEl = document.getElementById('lf-status');
  const submitBtn = document.getElementById('lf-submit');

  // Honeypot: if this hidden field got filled, it's almost certainly a bot.
  if (document.getElementById('lf-hp').value) {
    statusEl.textContent = 'Thanks — we\u2019ll be in touch shortly.';
    statusEl.className = 'form-status ok';
    form.reset();
    return;
  }

  if (FORM_CONFIG.endpointUrl.includes('PASTE_YOUR')) {
    statusEl.textContent = 'Form isn\u2019t connected yet — add your Apps Script URL in js/form.js.';
    statusEl.className = 'form-status err';
    return;
  }

  const payload = {
    name: document.getElementById('lf-name').value,
    phone: document.getElementById('lf-phone').value,
    email: document.getElementById('lf-email').value,
    city: document.getElementById('lf-city').value,
    propertyType: document.getElementById('lf-property').value,
    monthlyBill: document.getElementById('lf-bill').value,
    message: document.getElementById('lf-message').value,
    submittedAt: new Date().toISOString(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  try {
    // Google Apps Script Web Apps don't return CORS headers to fetch(),
    // so we send in no-cors mode. We can't read the response, but the
    // request itself reaches the script and Apps Script does the rest
    // (email + Sheet row). Client-side validation above covers accuracy.
    await fetch(FORM_CONFIG.endpointUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    statusEl.textContent = 'Thanks! We\u2019ve received your request and will call you shortly.';
    statusEl.className = 'form-status ok';
    form.reset();
  } catch (err) {
    statusEl.textContent = 'Something went wrong sending this. Please call or email us directly.';
    statusEl.className = 'form-status err';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Request Free Visit';
  }
});
