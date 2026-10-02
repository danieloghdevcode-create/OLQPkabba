/**
 * OUR LADY QUEEN OF PEACE CATHOLIC CHURCH (OLQP)
 * GALLERY MODULE — FILTERING & FULL KEYBOARD ACCESSIBLE LIGHTBOX
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initGalleryLightbox();
});

/**
 * 1. Category Filtering
 */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn, .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || cat.toLowerCase() === filterValue.toLowerCase()) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 2. Full-Screen Accessible Lightbox with Keyboard & Touch Support
 */
function initGalleryLightbox() {
  const lightbox = document.getElementById('gallery-lightbox') || document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img, .lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.modal-close-btn, .lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const galleryTriggers = Array.from(document.querySelectorAll('.gallery-trigger'));

  let currentIndex = 0;

  function getVisibleTriggers() {
    return galleryTriggers.filter(trigger => {
      const parent = trigger.closest('.gallery-item');
      return !parent || parent.style.display !== 'none';
    });
  }

  function showImage(index) {
    const visible = getVisibleTriggers();
    if (!visible.length) return;

    if (index < 0) index = visible.length - 1;
    if (index >= visible.length) index = 0;

    currentIndex = index;
    const target = visible[currentIndex];
    const imgSrc = target.getAttribute('data-img') || target.getAttribute('href') || target.querySelector('img')?.src;
    const caption = target.getAttribute('data-caption') || target.querySelector('img')?.alt || '';

    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
      lightboxImg.onload = () => {
        lightboxImg.style.transition = 'opacity 0.25s ease';
        lightboxImg.style.opacity = '1';
      };
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }

    // Preload next image
    const nextIdx = (currentIndex + 1) % visible.length;
    const nextSrc = visible[nextIdx].getAttribute('data-img') || visible[nextIdx].getAttribute('href');
    if (nextSrc) {
      const preloadImg = new Image();
      preloadImg.src = nextSrc;
    }
  }

  function openLightbox(index) {
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showImage(index);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const visible = getVisibleTriggers();
      const index = visible.indexOf(trigger);
      openLightbox(index !== -1 ? index : 0);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-dialog') || e.target.classList.contains('modal-dialog')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}
