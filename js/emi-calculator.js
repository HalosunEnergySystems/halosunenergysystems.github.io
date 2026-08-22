// ===========================================================
// Halosun — EMI Calculator addition
// Reads the "cost after subsidy" value the main calculator
// (calculator.js) already computes and displays in #res-net,
// then works out a monthly EMI from down payment / tenure / rate.
// Does not touch calculator.js — purely reads its output.
// ===========================================================

function parseRupeevalue(text) {
  // Strips ₹, commas, and any non-numeric characters, keeps decimal point
  const cleaned = (text || '').replace(/[^0-9.]/g, '');
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}

function formatRupees(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function computeEMI(principal, annualRatePct, tenureYears) {
  const monthlyRate = (annualRatePct / 12) / 100;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function updateEMI() {
  const resNetEl = document.getElementById('res-net');
  const billEl = document.getElementById('calc-bill');
  if (!resNetEl) return;

  const netCost = parseRupeevalue(resNetEl.textContent);
  if (!netCost || netCost <= 0) return;

  const downPaymentPct = parseFloat(document.getElementById('emi-downpayment').value) || 0;
  const tenureYears = parseFloat(document.getElementById('emi-tenure').value) || 5;
  const ratePct = parseFloat(document.getElementById('emi-rate').value) || 10;

  const loanAmount = netCost * (1 - downPaymentPct / 100);
  const monthlyEMI = computeEMI(loanAmount, ratePct, tenureYears);

  document.getElementById('emi-loan-amount').textContent = formatRupees(loanAmount);
  document.getElementById('emi-monthly').textContent = formatRupees(monthlyEMI) + ' /mo';

  const oldBillEl = document.getElementById('emi-old-bill');
  if (billEl && billEl.value) {
    oldBillEl.textContent = formatRupees(parseFloat(billEl.value)) + ' /mo';
  } else {
    oldBillEl.textContent = '—';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const calcRunBtn = document.getElementById('calc-run');
  const emiInputs = ['emi-downpayment', 'emi-tenure', 'emi-rate'];

  if (calcRunBtn) {
    // Run after the main calculator's own click handler has updated #res-net.
    calcRunBtn.addEventListener('click', () => {
      setTimeout(updateEMI, 50);
    });
  }

  emiInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateEMI);
  });

  // Also catch the case where results become visible via any other trigger
  const resultsPanel = document.getElementById('calc-results');
  if (resultsPanel) {
    const observer = new MutationObserver(() => {
      if (!resultsPanel.hidden) updateEMI();
    });
    observer.observe(resultsPanel, { attributes: true, attributeFilter: ['hidden'] });
  }
});
