/**
 * OUR LADY QUEEN OF PEACE CATHOLIC CHURCH (OLQP)
 * CALENDAR MODULE — MONTHLY LITURGICAL CALENDAR WITH EVENT POPUPS
 */

document.addEventListener('DOMContentLoaded', () => {
  initParishCalendar();
});

function initParishCalendar() {
  const calendarGrid = document.getElementById('calendar-days-grid');
  const monthTitle = document.getElementById('current-month-display');
  const prevBtn = document.getElementById('cal-prev-month');
  const nextBtn = document.getElementById('cal-next-month');
  const todayBtn = document.getElementById('cal-today-btn');

  if (!calendarGrid || !monthTitle) return;

  // Catholic Parish Liturgical Events Data
  const parishEvents = [
    { day: 1, monthOffset: 0, title: 'All Saints Day (Solemnity)', type: 'solemnity', time: '8:00 AM & 6:00 PM', desc: 'Holy Day of Obligation. Masses celebrated with choral sacred music and solemn blessing.' },
    { day: 2, monthOffset: 0, title: 'All Souls Day Memorial Mass', type: 'mass', time: '9:00 AM & 6:30 PM', desc: 'Commemoration of all the faithful departed. Blessing of the parish Book of Remembrance.' },
    { day: 5, monthOffset: 0, title: 'Solemn Eucharistic Adoration', type: 'prayer', time: '6:00 PM - 8:00 PM', desc: 'Silent exposition of the Blessed Sacrament followed by Sacred Benediction.' },
    { day: 8, monthOffset: 0, title: 'Sunday Holy Mass (Ordinary Time)', type: 'mass', time: '6:30 AM & 8:00 AM', desc: 'Day of the Lord. English Mass at 6:30 AM and Yoruba Mass at 8:00 AM.' },
    { day: 12, monthOffset: 0, title: 'St. Vincent de Paul Society Meeting', type: 'meeting', time: '7:00 PM', desc: 'Outreach and planning session for Thanksgiving charity hampers and emergency assistance.' },
    { day: 15, monthOffset: 0, title: 'Sacrament of Holy Baptism', type: 'sacrament', time: '8:00 AM Mass & 1:00 PM Rite', desc: 'Community reception of infant baptisms in the parish marble baptismal font.' },
    { day: 19, monthOffset: 0, title: 'CYON Youth Night', type: 'youth', time: '6:30 PM - 8:30 PM', desc: 'Catholic Youth Organization of Nigeria gathering for praise and worship, scriptural reflection, and fellowship in the parish hall.' },
    { day: 22, monthOffset: 0, title: 'Solemnity of Christ the King', type: 'solemnity', time: '10:00 AM Eucharistic Procession', desc: 'Parish patronal procession with the Blessed Sacrament through Peace Valley, followed by Benediction.' },
    { day: 26, monthOffset: 0, title: 'Parish Thanksgiving Day Mass', type: 'mass', time: '9:00 AM Solemn Mass', desc: 'Bilingual Thanksgiving Mass with blessing of family bread and food basket offerings.' },
    { day: 29, monthOffset: 0, title: 'First Sunday of Advent', type: 'season', time: 'All Sunday Masses', desc: 'Blessing and lighting of the first purple candle on the parish Advent wreath.' }
  ];

  let currentDate = new Date();
  let viewYear = currentDate.getFullYear();
  let viewMonth = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function renderCalendar(year, month) {
    calendarGrid.innerHTML = '';
    monthTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous month filler days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevMonthDays - x + 1;
      const cell = document.createElement('div');
      cell.className = 'cal-day other-month';
      cell.innerHTML = `<span class="cal-day-num">${dayNum}</span>`;
      calendarGrid.appendChild(cell);
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day current-month';

      const isToday = (
        d === currentDate.getDate() &&
        month === currentDate.getMonth() &&
        year === currentDate.getFullYear()
      );

      if (isToday) cell.classList.add('is-today');

      // Check for events matching day
      const daysEvents = parishEvents.filter(ev => ev.day === d);

      let eventsHtml = '';
      if (daysEvents.length > 0) {
        eventsHtml = `<div class="cal-event-chips">` +
          daysEvents.map(ev => `
            <button type="button" class="cal-event-chip chip-${ev.type}" data-title="${ev.title}" data-time="${ev.time}" data-desc="${ev.desc}">
              ${ev.title}
            </button>
          `).join('') + `</div>`;
      }

      cell.innerHTML = `<span class="cal-day-num">${d}</span>${eventsHtml}`;
      calendarGrid.appendChild(cell);
    }

    // Attach Event Details Listener
    const chips = calendarGrid.querySelectorAll('.cal-event-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        openEventModal({
          title: chip.getAttribute('data-title'),
          time: chip.getAttribute('data-time'),
          desc: chip.getAttribute('data-desc')
        });
      });
    });
  }

  function openEventModal(eventData) {
    const modal = document.getElementById('calendar-event-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('.cal-modal-title, #cal-modal-title');
    const timeEl = modal.querySelector('.cal-modal-time');
    const descEl = modal.querySelector('.cal-modal-desc');

    if (titleEl) titleEl.textContent = eventData.title;
    if (timeEl) timeEl.textContent = eventData.time;
    if (descEl) descEl.textContent = eventData.desc;

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  const calModal = document.getElementById('calendar-event-modal');
  if (calModal) {
    const closeBtn = calModal.querySelector('.modal-close-btn, .modal-close-btn-inline');
    const close = () => {
      calModal.classList.remove('is-active');
      calModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    calModal.addEventListener('click', (e) => {
      if (e.target === calModal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && calModal.classList.contains('is-active')) {
        close();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderCalendar(viewYear, viewMonth);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderCalendar(viewYear, viewMonth);
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      viewYear = currentDate.getFullYear();
      viewMonth = currentDate.getMonth();
      renderCalendar(viewYear, viewMonth);
    });
  }

  // Initial render
  renderCalendar(viewYear, viewMonth);
}
