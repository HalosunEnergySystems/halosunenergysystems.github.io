// ===========================================================
// Halosun — EMI Calculator addition
// Loan amount is based on the system cost BEFORE subsidy
// (#res-cost), since that is the amount typically financed —
// the subsidy is usually credited/reimbursed after installation,
// not deducted upfront from the loan.
// Once a subsidy applies, a second "after subsidy is credited"
// figure is shown, recomputing the loan amount and EMI on the
// cost AFTER subsidy (#res-net), with the same down payment %,
// tenure and interest rate.
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
  const resCostEl = document.getElementById('res-cost');   // system cost, before subsidy
  const resNetEl = document.getElementById('res-net');     // cost after subsidy
  const billEl = document.getElementById('calc-bill');
  if (!resCostEl) return;

  const systemCost = parseRupeevalue(resCostEl.textContent);
  if (!systemCost || systemCost <= 0) return;

  const netCost = resNetEl ? parseRupeevalue(resNetEl.textContent) : 0;

  const downPaymentPct = parseFloat(document.getElementById('emi-downpayment').value) || 0;
  const tenureYears = parseFloat(document.getElementById('emi-tenure').value) || 5;
  const ratePct = parseFloat(document.getElementById('emi-rate').value) || 10;

  // --- Primary EMI: financed on full system cost, before subsidy ---
  const loanAmount = systemCost * (1 - downPaymentPct / 100);
  const monthlyEMI = computeEMI(loanAmount, ratePct, tenureYears);
  document.getElementById('emi-loan-amount').textContent = formatRupees(loanAmount);
  document.getElementById('emi-monthly').textContent = formatRupees(monthlyEMI) + ' /mo';

  const oldBillEl = document.getElementById('emi-old-bill');
  if (billEl && billEl.value) {
    oldBillEl.textContent = formatRupees(parseFloat(billEl.value)) + ' /mo';
  } else {
    oldBillEl.textContent = '—';
  }

  // --- Secondary EMI: once the subsidy is credited, recompute on the
  //     lower post-subsidy cost, keeping down payment %, tenure and
  //     rate the same. Only shown when a subsidy actually applies
  //     (residential systems; commercial has no subsidy, so netCost
  //     equals systemCost and this stays hidden). ---
  const postSubsidyBlock = document.getElementById('emi-post-subsidy-block');
  if (postSubsidyBlock) {
    const subsidyApplies = netCost > 0 && netCost < systemCost;
    if (subsidyApplies) {
      const loanAmountPost = netCost * (1 - downPaymentPct / 100);
      const monthlyEMIPost = computeEMI(loanAmountPost, ratePct, tenureYears);
      document.getElementById('emi-loan-amount-post').textContent = formatRupees(loanAmountPost);
      document.getElementById('emi-monthly-post').textContent = formatRupees(monthlyEMIPost) + ' /mo';
      postSubsidyBlock.hidden = false;
    } else {
      postSubsidyBlock.hidden = true;
    }
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
