/**
 * Live Cryptographic Demonstrations & Interactive Visualizers
 * 1. Live TOTP Generator (RFC 6238 Simulation)
 * 2. Anchor Merkle Tree Integrity & Tamper Detector
 */

function initCryptoLab() {
  initLiveTOTP();
  initMerkleVisualizer();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCryptoLab);
} else {
  initCryptoLab();
}

// ==========================================
// 1. LIVE TOTP SIMULATOR (RFC 6238)
// ==========================================
function initLiveTOTP() {
  const totpCodeDisplay = document.getElementById('live-totp-code');
  const totpProgressCircle = document.getElementById('totp-progress-ring');
  const totpTimerText = document.getElementById('totp-timer-text');
  const totpSecretSelect = document.getElementById('totp-service-select');
  const copyBtn = document.getElementById('totp-copy-btn');

  if (!totpCodeDisplay || !totpProgressCircle) return;

  const circumference = 2 * Math.PI * 18; // r = 18 in SVG
  totpProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

  function updateTOTP() {
    const now = Math.floor(Date.now() / 1000);
    const period = 30;
    const remaining = period - (now % period);
    const service = totpSecretSelect ? totpSecretSelect.value : 'github';

    // Update code
    const epochStep = Math.floor(now / period);
    let hash = 0;
    const seed = service + epochStep;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    const val = (Math.abs(hash) % 900000 + 100000).toString();
    totpCodeDisplay.textContent = `${val.slice(0, 3)} ${val.slice(3)}`;

    // Update Progress Ring
    const offset = circumference - (remaining / period) * circumference;
    totpProgressCircle.style.strokeDashoffset = offset;
    if (totpTimerText) {
      totpTimerText.textContent = `${remaining}s`;
    }

    if (remaining <= 5) {
      totpProgressCircle.classList.remove('stroke-sky-400');
      totpProgressCircle.classList.add('stroke-rose-500');
      totpTimerText.classList.add('text-rose-400');
    } else {
      totpProgressCircle.classList.add('stroke-sky-400');
      totpProgressCircle.classList.remove('stroke-rose-500');
      totpTimerText.classList.remove('text-rose-400');
    }
  }

  setInterval(updateTOTP, 1000);
  updateTOTP();

  if (totpSecretSelect) {
    totpSecretSelect.addEventListener('change', updateTOTP);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = totpCodeDisplay.textContent.replace(/\s+/g, '');
      navigator.clipboard.writeText(text).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span class="text-emerald-400">Copied!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = orig;
        }, 2000);
      });
    });
  }
}

// ==========================================
// 2. MERKLE TREE & INTEGRITY DEMO (ANCHOR)
// ==========================================
function initMerkleVisualizer() {
  const leafNodes = document.querySelectorAll('.merkle-leaf');
  const rootHashEl = document.getElementById('merkle-root-hash');
  const verificationBadge = document.getElementById('merkle-status-badge');
  const tamperBtn = document.getElementById('merkle-tamper-btn');
  const resetBtn = document.getElementById('merkle-reset-btn');

  if (!leafNodes.length || !rootHashEl) return;

  const defaultLeaves = [
    '4a8c9b2e',
    '7f1d0a5c',
    '3b6e8a1f',
    '9d2c4e6a'
  ];

  let currentLeaves = [...defaultLeaves];
  let isTampered = false;

  function calculateMerkleRoot(leaves) {
    // Simulated Merkle Tree SHA-256 derivation
    const parent1 = hashPair(leaves[0], leaves[1]);
    const parent2 = hashPair(leaves[2], leaves[3]);
    const root = hashPair(parent1, parent2);
    return { parent1, parent2, root };
  }

  function hashPair(a, b) {
    let num = 0;
    const combo = a + b;
    for (let i = 0; i < combo.length; i++) {
      num = ((num << 5) - num) + combo.charCodeAt(i);
      num |= 0;
    }
    return Math.abs(num).toString(16).padStart(8, '0');
  }

  function renderTree() {
    const { parent1, parent2, root } = calculateMerkleRoot(currentLeaves);

    currentLeaves.forEach((val, idx) => {
      const leafEl = document.getElementById(`merkle-leaf-${idx}`);
      if (leafEl) {
        leafEl.textContent = val;
        if (isTampered && idx === 1) {
          leafEl.classList.add('text-rose-400', 'border-rose-500', 'bg-rose-950/40');
          leafEl.classList.remove('text-sky-300', 'border-sky-500/30', 'bg-slate-800/60');
        } else {
          leafEl.classList.remove('text-rose-400', 'border-rose-500', 'bg-rose-950/40');
          leafEl.classList.add('text-sky-300', 'border-sky-500/30', 'bg-slate-800/60');
        }
      }
    });

    const p1El = document.getElementById('merkle-parent-0');
    const p2El = document.getElementById('merkle-parent-1');
    if (p1El) p1El.textContent = parent1;
    if (p2El) p2El.textContent = parent2;

    if (rootHashEl) {
      rootHashEl.textContent = `0x${root}8ef3914a2b6c9817...`;
    }

    if (verificationBadge) {
      if (isTampered) {
        verificationBadge.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Tamper Detected · Ed25519 Sig Invalid
          </span>
        `;
      } else {
        verificationBadge.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Verified Cryptographic Provenance
          </span>
        `;
      }
    }
  }

  renderTree();

  if (tamperBtn) {
    tamperBtn.addEventListener('click', () => {
      isTampered = true;
      currentLeaves[1] = 'DEADBEEF'; // Injected fraudulent payload
      renderTree();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      isTampered = false;
      currentLeaves = [...defaultLeaves];
      renderTree();
    });
  }
}
