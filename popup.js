document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('pauseBtn');
  const status = document.getElementById('status');

  function updateUI() {
    chrome.storage.local.get(['pausedUntil'], (result) => {
      const now = Date.now();
      if (result.pausedUntil && result.pausedUntil > now) {
        const remaining = Math.ceil((result.pausedUntil - now) / 1000);
        status.textContent = `Paused (${remaining}s)`;
        status.style.color = "green";
        btn.disabled = true;
      } else {
        status.textContent = "Protection Active";
        status.style.color = "red";
        btn.disabled = false;
      }
    });
  }

  updateUI();
  setInterval(updateUI, 1000);

  btn.addEventListener('click', () => {
    const pauseDuration = 60 * 1000; 
    const pausedUntil = Date.now() + pauseDuration;
    chrome.storage.local.set({ pausedUntil: pausedUntil }, () => {
      updateUI();
    });
  });
});
