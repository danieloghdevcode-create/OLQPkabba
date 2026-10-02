/**
 * OUR LADY QUEEN OF PEACE CATHOLIC CHURCH (OLQP)
 * EVENTS FILTERING & INTERACTION MODULE
 */

document.addEventListener('DOMContentLoaded', () => {
  initEventFilters();
});

function initEventFilters() {
  const filterBtns = document.querySelectorAll('.event-filter-btn');
  const eventCards = document.querySelectorAll('.event-card-item');

  if (!filterBtns.length || !eventCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      eventCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
