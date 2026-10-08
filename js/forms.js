/**
 * OUR LADY QUEEN OF PEACE CATHOLIC CHURCH (OLQP)
 * FORMS MODULE — VALIDATION, GIVING PRESETS & REVERENT CONFIRMATION MODALS
 */

document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initGivingPresets();
});

/**
 * 1. Client-side Form Validation Engine
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstErrorInput = null;

      // Find required inputs
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const group = input.closest('.form-group') || input.parentElement;
        const value = input.value.trim();

        if (input.type === 'checkbox') {
          if (!input.checked) {
            isValid = false;
            if (group) group.classList.add('has-error');
            if (!firstErrorInput) firstErrorInput = input;
          } else {
            if (group) group.classList.remove('has-error');
          }
        } else if (!value) {
          isValid = false;
          if (group) group.classList.add('has-error');
          if (!firstErrorInput) firstErrorInput = input;
        } else if (input.type === 'email' && !validateEmail(value)) {
          isValid = false;
          if (group) group.classList.add('has-error');
          if (!firstErrorInput) firstErrorInput = input;
        } else {
          if (group) group.classList.remove('has-error');
        }

        // Real-time cleanup on input/change
        const clearError = () => {
          if (input.type === 'checkbox') {
            if (input.checked && group) group.classList.remove('has-error');
          } else if (input.value.trim() && group) {
            if (input.type !== 'email' || validateEmail(input.value.trim())) {
              group.classList.remove('has-error');
            }
          }
        };

        input.addEventListener('input', clearError);
        input.addEventListener('change', clearError);
      });

      if (!isValid && firstErrorInput) {
        firstErrorInput.focus();
      }

      if (isValid) {
        handleFormSuccess(form);
      }
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 2. Form Submission Success & Modal Handler
 */
function handleFormSuccess(form) {
  // If form is configured for direct WhatsApp delivery
  if (form.getAttribute('data-whatsapp') === 'true') {
    const waNumber = form.getAttribute('data-whatsapp-number') || '2348065542337';
    let messageText = "Good day Catechist,\nI am sending a message from the church website:\n\n";

    const nameInput = form.querySelector('[name="requestor_name"]') || form.querySelector('[name="name"]') || form.querySelector('#requestor-name') || form.querySelector('#contact-name');
    const phoneInput = form.querySelector('[name="phone"]') || form.querySelector('#requestor-phone') || form.querySelector('#contact-phone');
    const subjectInput = form.querySelector('[name="subject"]') || form.querySelector('#contact-subject');
    const detailsInput = form.querySelector('[name="intention_for"]') || form.querySelector('[name="message"]') || form.querySelector('#intention-for') || form.querySelector('#contact-message');

    if (nameInput && nameInput.value.trim()) {
      messageText += `*Name:* ${nameInput.value.trim()}\n`;
    }
    if (phoneInput && phoneInput.value.trim()) {
      messageText += `*Phone:* ${phoneInput.value.trim()}\n`;
    }
    if (subjectInput && subjectInput.value.trim()) {
      messageText += `*Subject:* ${subjectInput.value.trim()}\n`;
    }
    if (detailsInput && detailsInput.value.trim()) {
      messageText += `*Message / Details:* ${detailsInput.value.trim()}\n`;
    }

    const encodedMessage = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    // Reset form fields
    form.reset();

    // Direct redirect to WhatsApp immediately (no modal)
    window.location.href = waUrl;
    return;
  }

  const modalId = form.getAttribute('data-success-modal');
  let targetModal = modalId ? document.getElementById(modalId) : null;
  if (!targetModal) targetModal = document.getElementById('generic-success-modal');

  if (targetModal) {
    targetModal.classList.add('is-active');
    targetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset form
    form.reset();

    // Reset preset buttons if any
    const presets = form.querySelectorAll('.give-preset');
    presets.forEach(p => p.classList.remove('active'));

    const closeBtn = targetModal.querySelector('.modal-close-btn') || targetModal.querySelector('.btn-close-modal');
    const closeModal = () => {
      targetModal.classList.remove('is-active');
      targetModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    targetModal.addEventListener('click', (e) => {
      if (e.target === targetModal || e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && targetModal.classList.contains('is-active')) {
        closeModal();
      }
    });
  } else {
    // Reverent fallback
    alert('Thank you! Your submission has been received by Our Lady Queen of Peace Parish.');
    form.reset();
  }
}

/**
 * 3. Stewardship Online Giving Presets Handler
 */
function initGivingPresets() {
  const presetButtons = document.querySelectorAll('.give-preset');
  const amountInput = document.getElementById('give-amount');

  if (!presetButtons.length || !amountInput) return;

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.textContent.replace(/[^0-9]/g, '');
      if (val) {
        amountInput.value = val;
        // Trigger input event to clear validation error if present
        amountInput.dispatchEvent(new Event('input'));
      }
    });
  });

  amountInput.addEventListener('input', () => {
    // If entered value does not match active preset, remove active class
    presetButtons.forEach(b => {
      const val = b.textContent.replace(/[^0-9]/g, '');
      if (val === amountInput.value.trim()) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  });
}
