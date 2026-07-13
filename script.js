// ============================================
// MODERNTRADITION_23 — shared JavaScript
// Three small features live here:
// 1. Mobile menu toggle (works on every page)
// 2. Video category filter (only runs on videos.html)
// 3. Live subscriber count (only runs on about.html, once an API key is set)
// ============================================

// ---- 1. Mobile menu toggle ----
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ---- 2. Video filter (videos.html only) ----
// If these elements don't exist on the current page, this just does nothing.
const filterBar = document.getElementById('filterBar');
const videoGrid = document.getElementById('videoGrid');

if (filterBar && videoGrid) {
  const buttons = filterBar.querySelectorAll('.filter-btn');
  const cards = videoGrid.querySelectorAll('.card');

  filterBar.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (!button) return;

    // Update which button looks "active"
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    // Show/hide cards based on their data-category attribute
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.style.display = matches ? '' : 'none';
    });
  });
}

// ---- 3. Live subscriber count (about.html only) ----
// This is OFF by default — it needs a free YouTube Data API key before
// it'll do anything. Until then, the "250" already in the HTML just
// stays put, so nothing breaks.
//
// To turn it on:
// 1. Go to console.cloud.google.com, create a free project
// 2. Enable "YouTube Data API v3" for that project
// 3. Create an API key (APIs & Services > Credentials)
// 4. IMPORTANT: click into the key's settings and restrict it to your
//    website's domain (HTTP referrers) — otherwise anyone could copy
//    your key off the page source and use up your free quota.
// 5. Paste the key below between the quotes.
const YT_API_KEY = ""; // <-- paste your API key here
const YT_CHANNEL_HANDLE = "ModernTradition_23";

async function updateSubscriberCount() {
  const el = document.getElementById('subscriberCount');
  if (!el || !YT_API_KEY) return; // no key yet — leave the static number alone

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${YT_CHANNEL_HANDLE}&key=${YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const count = data?.items?.[0]?.statistics?.subscriberCount;
    if (count) {
      el.textContent = formatSubscriberCount(count);
    }
  } catch (err) {
    console.error('Could not load live subscriber count:', err);
  }
}

function formatSubscriberCount(n) {
  n = Number(n);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

updateSubscriberCount();
