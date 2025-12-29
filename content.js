let styleElement = null;
let pauseTimeout = null;
let observer = null;

const cssStyles = `
  * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  
  /* Standard CSS targeting */
  button[aria-label*="Copy"], 
  button[aria-label*="copy"],
  div[aria-labelledby*="radix-_r_f5_"],
  .copy-button, 
  [class*="CopyButton"] {
    display: none !important;
  }

  /* Class applied by JS for text-based matching */
  .llm-copy-block-hidden {
    display: none !important;
  }
`;

function scanForCopyButtons() {
  // Find all buttons on the page
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach(btn => {
    // Check if the button or its children contain the exact text "Copy"
    if (btn.innerText.trim() === "Copy" || btn.getAttribute('aria-label') === "Copy") {
      btn.classList.add('llm-copy-block-hidden');
    }
  });
}

function enableBlocking() {
  // 1. Inject the blocking CSS
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.textContent = cssStyles;
    document.head.appendChild(styleElement);
  }

  // 2. Scan immediately for existing buttons
  scanForCopyButtons();

  // 3. Start observing for new buttons (chat streaming)
  if (!observer) {
    observer = new MutationObserver((mutations) => {
      scanForCopyButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('copy', preventEvent, true);
  document.addEventListener('cut', preventEvent, true);
  document.addEventListener('contextmenu', preventEvent, true);
  document.addEventListener('keydown', preventKeyShortcuts, true);
}

function disableBlocking() {
  // Remove the CSS styles
  // (Note: We do NOT remove the classes from elements. Without the CSS rule, the class does nothing.)
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }

  // Stop the observer to save resources
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  document.removeEventListener('copy', preventEvent, true);
  document.removeEventListener('cut', preventEvent, true);
  document.removeEventListener('contextmenu', preventEvent, true);
  document.removeEventListener('keydown', preventKeyShortcuts, true);
}

function preventEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

function preventKeyShortcuts(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x')) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function checkState() {
  chrome.storage.local.get(['pausedUntil'], (result) => {
    const now = Date.now();
    
    if (pauseTimeout) clearTimeout(pauseTimeout);

    if (result.pausedUntil && result.pausedUntil > now) {
      disableBlocking();
      const remainingTime = result.pausedUntil - now;
      pauseTimeout = setTimeout(checkState, remainingTime); 
    } else {
      enableBlocking();
    }
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.pausedUntil) {
    checkState();
  }
});

checkState();
