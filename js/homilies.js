/**
 * OUR LADY QUEEN OF PEACE CATHOLIC CHURCH (OLQP)
 * HOMILIES MODULE — SEARCH, FILTERING & INTERACTIVE AUDIO PLAYER
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomilyFilters();
  initHomilySearch();
  initHomilyPlayerModal();
});

/**
 * 1. Liturgical Season Filter Tabs
 */
function initHomilyFilters() {
  const filterBtns = document.querySelectorAll('.homily-filter-btn, .filter-btn');
  const homilyCards = document.querySelectorAll('.homily-card-item, .card[data-season]');

  if (!filterBtns.length || !homilyCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      const searchInput = document.getElementById('homily-search');
      if (searchInput) searchInput.value = '';

      homilyCards.forEach(card => {
        const season = card.getAttribute('data-season') || '';
        if (filterValue === 'all' || season.toLowerCase() === filterValue.toLowerCase()) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 2. Real-time Homily Keyword Search
 */
function initHomilySearch() {
  const searchInput = document.getElementById('homily-search');
  const homilyCards = document.querySelectorAll('.homily-card-item, .card[data-season]');

  if (!searchInput || !homilyCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Reset filter buttons when typing in search
    const filterBtns = document.querySelectorAll('.homily-filter-btn, .filter-btn');
    if (query.length > 0) {
      filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
    }

    homilyCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/**
 * 3. Sacred Homily Audio Player Modal & Simulation Engine
 */
function initHomilyPlayerModal() {
  const playButtons = document.querySelectorAll('.btn-play-homily');
  const modalOverlay = document.getElementById('homily-modal');
  if (!modalOverlay) return;

  const modalTitle = modalOverlay.querySelector('.modal-homily-title, #player-title');
  const modalSpeaker = modalOverlay.querySelector('.modal-homily-speaker');
  const modalScripture = modalOverlay.querySelector('.modal-homily-scripture');
  const closeBtn = modalOverlay.querySelector('.modal-close-btn');

  // Audio simulator elements
  let isPlaying = false;
  let currentSeconds = 252; // 04:12 initial
  const totalSeconds = 1125; // 18:45 total
  let playInterval = null;

  const playPauseBtn = modalOverlay.querySelector('button[title="Play/Pause"]');
  const rewindBtn = modalOverlay.querySelector('button[title="Rewind 15s"]');
  const forwardBtn = modalOverlay.querySelector('button[title="Fast forward 15s"]');
  const timeCounters = modalOverlay.querySelectorAll('span');
  const progressBar = modalOverlay.querySelector('div[style*="background: linear-gradient"]');

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updatePlayerUI() {
    if (timeCounters.length >= 2) {
      timeCounters[0].textContent = formatTime(currentSeconds);
      timeCounters[1].textContent = formatTime(totalSeconds);
    }
    if (progressBar) {
      const pct = (currentSeconds / totalSeconds) * 100;
      progressBar.style.width = `${pct}%`;
    }
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
    if (playPauseBtn) {
      if (isPlaying) {
        // Show Pause icon
        playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        playInterval = setInterval(() => {
          if (currentSeconds < totalSeconds) {
            currentSeconds++;
            updatePlayerUI();
          } else {
            pauseAudio();
          }
        }, 1000);
      } else {
        pauseAudio();
      }
    }
  }

  function pauseAudio() {
    isPlaying = false;
    clearInterval(playInterval);
    if (playPauseBtn) {
      // Show Play icon
      playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }

  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      currentSeconds = Math.max(0, currentSeconds - 15);
      updatePlayerUI();
    });
  }

  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      currentSeconds = Math.min(totalSeconds, currentSeconds + 15);
      updatePlayerUI();
    });
  }

  // Click on track to seek
  const progressTrack = progressBar?.parentElement;
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentSeconds = Math.floor(pct * totalSeconds);
      updatePlayerUI();
    });
  }

  // Launch modal on card button click
  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Sunday Homily';
      const speaker = btn.getAttribute('data-speaker') || 'Rev. Fr. Casmir Okonkwo';
      const scripture = btn.getAttribute('data-scripture') || 'Holy Gospel';

      if (modalTitle) modalTitle.textContent = title;
      if (modalSpeaker) modalSpeaker.textContent = speaker;
      if (modalScripture) modalScripture.textContent = scripture;

      modalOverlay.classList.add('is-active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Start playing
      currentSeconds = 15;
      updatePlayerUI();
      if (!isPlaying) togglePlayPause();
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('is-active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    pauseAudio();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
      closeModal();
    }
  });
}
