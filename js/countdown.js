// ===========================================================
// Halosun — Live countdown timer (days:hours:min:sec)
// Finds every element with a [data-countdown="<ISO date>"]
// attribute and ticks its days/hours/minutes/seconds spans down
// to that date, once per second, until the page is closed.
//
// Expected markup inside the [data-countdown] element:
//   <span data-unit="days">00</span>
//   <span data-unit="hours">00</span>
//   <span data-unit="minutes">00</span>
//   <span data-unit="seconds">00</span>
// and, for the "window closed" fallback text:
//   <span class="deadline-closed-msg">...</span>
//
// If the target date is in the past (or invalid), the timer units
// are hidden and the closed-message text is shown instead — the
// banner never displays negative numbers.
// ===========================================================
(function () {
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // Updates one banner's numbers for the current instant.
  // Returns false once the deadline has passed (so the caller can
  // stop the interval instead of ticking forever after zero).
  function tick(el, target) {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      el.classList.add('deadline-ended');
      return false;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const daysEl = el.querySelector('[data-unit="days"]');
    const hoursEl = el.querySelector('[data-unit="hours"]');
    const minutesEl = el.querySelector('[data-unit="minutes"]');
    const secondsEl = el.querySelector('[data-unit="seconds"]');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    return true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-countdown]').forEach((el) => {
      const target = new Date(el.getAttribute('data-countdown'));
      if (isNaN(target.getTime())) return; // bad/missing date — leave banner as-is

      const stillRunning = tick(el, target);
      if (!stillRunning) return; // already past deadline, nothing to schedule

      const intervalId = setInterval(() => {
        if (!tick(el, target)) clearInterval(intervalId);
      }, 1000);
    });
  });
})();
