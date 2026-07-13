// Start: Founder's Starter Kit — Premium Modern-Retro Cyber-Village Boilerplate
// Pre-loaded default file states for new Neocities Workspace profiles.
// The HTML deliberately uses <link>/<script src> so the editor tabs (styles.css /
// script.js) flow correctly into the live preview injector.

export const FOUNDER_HTML = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Teratak Siber Pengasas</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- Start: Neon Marquee Banner -->
  <div class="marquee" role="banner">
    <div class="marquee__track">
      <span>✦ SELAMAT DATANG KE KAMPUNG SIBER ✦ PENDUDUK BARU DITERIMA ✦ BINA TERATAK ANDA ✦</span>
      <span>✦ SELAMAT DATANG KE KAMPUNG SIBER ✦ PENDUDUK BARU DITERIMA ✦ BINA TERATAK ANDA ✦</span>
    </div>
  </div>
  <!-- End: Neon Marquee Banner -->

  <!-- Start: Avatar Wrapper -->
  <header class="hero">
    <div class="avatar" aria-label="Avatar pengasas">
      <span class="avatar__pixel">🛸</span>
    </div>
    <h1 class="hero__title" data-greet>Teratak Siber Pengasas</h1>
    <p class="hero__sub">Rumah digital retro-moden dalam kampung siber anda.</p>
  </header>
  <!-- End: Avatar Wrapper -->

  <!-- Start: Content Grid -->
  <main class="grid">
    <section class="card">
      <h2>Tentang Saya</h2>
      <p>Tulis kisah pengasas di sini. Ini ialah ruang seminar bersih untuk anda bentuk.</p>
    </section>
    <section class="card">
      <h2>Projek</h2>
      <p>Papar eksperimen siber anda dalam grid neon ini.</p>
    </section>
    <section class="card">
      <h2>Kawan Siber</h2>
      <p>Senarai pautan ke teratak rakan anda.</p>
    </section>
  </main>
  <!-- End: Content Grid -->

  <!-- Start: Pixel Audio Player -->
  <div class="player">
    <button id="sound-toggle" class="player__btn" aria-pressed="false">🔈 Bunyi: MATI</button>
    <span class="player__hint">Klik untuk mainkan bunyi piksel.</span>
  </div>
  <!-- End: Pixel Audio Player -->

  <footer class="foot">© Kampung Siber Retro — Dibina dengan Neocities Workspace</footer>

  <script src="script.js"></script>
</body>
</html>`;

export const FOUNDER_CSS = `:root {
  --bg: #060814;
  --neon-cyan: #00ffff;
  --neon-magenta: #ff007f;
  --grid: rgba(0, 255, 255, 0.18);
  --text: #c8f7ff;
  --font-pixel: "Courier New", monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background:
    radial-gradient(circle at 50% -10%, rgba(255, 0, 127, 0.18), transparent 55%),
    linear-gradient(180deg, #060814 0%, #0a0e1f 100%);
  color: var(--text);
  font-family: var(--font-pixel);
  min-height: 100vh;
  padding: 1.5rem;
  background-attachment: fixed;
}

/* Start: Neon Marquee Banner */
.marquee {
  overflow: hidden;
  border: 1px solid var(--neon-cyan);
  border-radius: 8px;
  background: rgba(0, 255, 255, 0.04);
  box-shadow: 0 0 18px rgba(0, 255, 255, 0.25);
}
.marquee__track {
  display: flex;
  width: max-content;
  animation: scroll 16s linear infinite;
  white-space: nowrap;
}
.marquee__track span {
  padding: 0.6rem 1rem;
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
  font-weight: bold;
  letter-spacing: 2px;
}
@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
/* End: Neon Marquee Banner */

/* Start: Avatar Wrapper */
.hero { text-align: center; margin: 2rem 0; }
.avatar {
  width: 96px; height: 96px;
  margin: 0 auto 1rem;
  display: grid; place-items: center;
  border: 1px solid var(--neon-magenta);
  border-radius: 50%;
  background: rgba(255, 0, 127, 0.06);
  box-shadow: 0 0 22px rgba(255, 0, 127, 0.55);
  transition: transform 0.3s ease;
}
.avatar:hover { transform: scale(1.08) rotate(6deg); }
.avatar__pixel { font-size: 2.4rem; }
.hero__title {
  color: var(--neon-magenta);
  text-shadow: 0 0 12px var(--neon-magenta);
  font-size: 1.8rem;
}
.hero__sub { color: var(--neon-cyan); opacity: 0.8; margin-top: 0.4rem; }
/* End: Avatar Wrapper */

/* Start: Content Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  max-width: 980px;
  margin: 0 auto;
}
.card {
  border: 1px solid var(--neon-cyan);
  border-radius: 10px;
  padding: 1.1rem;
  background: rgba(0, 255, 255, 0.03);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.card:hover {
  box-shadow: 0 0 24px rgba(0, 255, 255, 0.45);
  transform: translateY(-4px);
}
.card h2 {
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
  margin-bottom: 0.5rem;
}
/* End: Content Grid */

/* Start: Pixel Audio Player */
.player { text-align: center; margin: 2rem 0 1rem; }
.player__btn {
  border: 1px solid var(--neon-magenta);
  background: rgba(255, 0, 127, 0.08);
  color: var(--neon-magenta);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-family: var(--font-pixel);
  font-weight: bold;
  cursor: pointer;
  text-shadow: 0 0 6px var(--neon-magenta);
  transition: box-shadow 0.3s ease;
}
.player__btn:hover { box-shadow: 0 0 18px rgba(255, 0, 127, 0.6); }
.player__hint { display: block; margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.7; }
/* End: Pixel Audio Player */

.foot { text-align: center; margin-top: 2rem; font-size: 0.75rem; opacity: 0.5; }
`;

export const FOUNDER_JS = `// Start: Founder Starter Kit Interactive Logic
(function () {
  // Start: localStorage Greeting Widget
  const title = document.querySelector("[data-greet]");
  const visits = Number(localStorage.getItem("ks_visits") || "0") + 1;
  localStorage.setItem("ks_visits", String(visits));
  if (title) {
    title.textContent =
      visits === 1
        ? "Teratak Siber Pengasas — Lawatan Pertama!"
        : "Teratak Siber Pengasas — Lawatan ke-" + visits;
  }
  // End: localStorage Greeting Widget

  // Start: Pixel Audio Sound Player (Web Audio API)
  const toggle = document.getElementById("sound-toggle");
  let audioCtx = null;
  let playing = false;

  function beep() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = 440;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      playing = !playing;
      toggle.setAttribute("aria-pressed", String(playing));
      toggle.textContent = playing ? "🔊 Bunyi: HIDUP" : "🔈 Bunyi: MATI";
      if (playing) beep();
    });
  }
  // End: Pixel Audio Sound Player
})();
// End: Founder Starter Kit Interactive Logic
`;

export const FOUNDER_DEFAULTS = {
  html: FOUNDER_HTML,
  css: FOUNDER_CSS,
  js: FOUNDER_JS,
};
// End: Founder's Starter Kit