/**
 * DIGIT MAXZ - UNIVERSAL CONTEXT-AWARE LEAD MODAL
 * Manages modal visibility, dynamic service pre-selection, and contextual CTAs.
 */

class LeadModalManager {
  constructor() {
    this.modal = document.getElementById('leadModal');
    if (!this.modal) return;

    this.container = this.modal.querySelector('.modal-container');
    this.closeBtn = this.modal.querySelector('.modal-close-btn');
    this.serviceSelect = this.modal.querySelector('#modalServiceSelect');
    this.submitBtn = this.modal.querySelector('#modalSubmitBtn');
    this.modalTitle = this.modal.querySelector('#modalHeading');
    this.lastFocusedEl = null;

    this.initTriggers();
    this.bindEvents();
  }

  initTriggers() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-modal]');
      if (!trigger) return;

      e.preventDefault();
      const service = trigger.getAttribute('data-service') || '';
      const ctaText = trigger.getAttribute('data-cta-text') || 'Request My Quote';
      const title = trigger.getAttribute('data-modal-title') || 'Tell Us About Your Project';
      const budget = trigger.getAttribute('data-budget') || '';

      this.open({ service, ctaText, title, budget });
    });
  }

  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  open({ service, ctaText, title, budget }) {
    this.lastFocusedEl = document.activeElement;

    // Pre-populate service dropdown
    if (this.serviceSelect && service) {
      const options = Array.from(this.serviceSelect.options);
      const match = options.find(opt => opt.value.toLowerCase() === service.toLowerCase() || opt.text.toLowerCase().includes(service.toLowerCase()));
      if (match) {
        this.serviceSelect.value = match.value;
      }
    }

    // Set contextual submit button text
    if (this.submitBtn && ctaText) {
      const btnTextSpan = this.submitBtn.querySelector('.btn-text');
      if (btnTextSpan) {
        btnTextSpan.textContent = ctaText;
      } else {
        this.submitBtn.textContent = ctaText;
      }
    }

    // Set contextual modal title
    if (this.modalTitle && title) {
      this.modalTitle.textContent = title;
    }

    // Pre-select budget if provided
    if (budget) {
      const budgetRadio = this.modal.querySelector(`input[name="budget"][value="${budget}"]`);
      if (budgetRadio) budgetRadio.checked = true;
    }

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on first input
    const firstInput = this.modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    if (this.lastFocusedEl) {
      this.lastFocusedEl.focus();
    }
  }
}

// Global modal instance initialized on DOM load
window.digitMaxzModal = null;
document.addEventListener('DOMContentLoaded', () => {
  window.digitMaxzModal = new LeadModalManager();
});
