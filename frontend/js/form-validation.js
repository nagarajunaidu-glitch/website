/**
 * DIGIT MAXZ - LEAD CAPTURE & FORM VALIDATION SYSTEM
 * Handles field validation, UTM attribution, localStorage database persistence,
 * simulated CRM dispatch, and smooth transition to Thank You page.
 */

class LeadCaptureSystem {
  constructor() {
    this.initAttribution();
    this.bindForms();
  }

  // Capture UTMs & Initial Landing Page into Session Storage
  initAttribution() {
    if (!sessionStorage.getItem('dmz_landing_page')) {
      sessionStorage.setItem('dmz_landing_page', window.location.href);
      sessionStorage.setItem('dmz_referrer', document.referrer || 'Direct');
    }

    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    utmKeys.forEach(key => {
      const val = params.get(key);
      if (val && !sessionStorage.getItem(`dmz_${key}`)) {
        sessionStorage.setItem(`dmz_${key}`, val);
      }
    });
  }

  getAttributionData() {
    return {
      landing_page: sessionStorage.getItem('dmz_landing_page') || window.location.href,
      referrer: sessionStorage.getItem('dmz_referrer') || 'Direct',
      current_page: window.location.pathname,
      utm_source: sessionStorage.getItem('dmz_utm_source') || 'organic',
      utm_medium: sessionStorage.getItem('dmz_utm_medium') || 'web',
      utm_campaign: sessionStorage.getItem('dmz_utm_campaign') || 'none',
      utm_content: sessionStorage.getItem('dmz_utm_content') || 'none',
      utm_term: sessionStorage.getItem('dmz_utm_term') || 'none',
      device_type: window.innerWidth < 768 ? 'Mobile' : (window.innerWidth < 1024 ? 'Tablet' : 'Desktop'),
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      submitted_at: new Date().toISOString()
    };
  }

  bindForms() {
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('.lead-form, [data-lead-form]');
      if (!form) return;

      e.preventDefault();
      this.handleFormSubmit(form);
    });

    // Real-time input clearing of error states
    document.addEventListener('input', (e) => {
      const input = e.target;
      const group = input.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        group.classList.remove('has-error');
        input.classList.remove('error');
      }
    });
  }

  validateForm(form) {
    let isValid = true;
    const errors = {};

    // Name
    const nameField = form.querySelector('[name="name"]');
    if (nameField) {
      if (!nameField.value.trim() || nameField.value.trim().length < 2) {
        isValid = false;
        this.setError(nameField, 'Please enter your full name (minimum 2 characters)');
      } else {
        this.clearError(nameField);
      }
    }

    // Work Email
    const emailField = form.querySelector('[name="email"]');
    if (emailField) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
        isValid = false;
        this.setError(emailField, 'Please enter a valid work email address');
      } else {
        this.clearError(emailField);
      }
    }

    // Phone / WhatsApp
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField) {
      const phoneClean = phoneField.value.replace(/[^0-9+]/g, '');
      if (!phoneField.value.trim() || phoneClean.length < 7) {
        isValid = false;
        this.setError(phoneField, 'Please enter a valid phone or WhatsApp number');
      } else {
        this.clearError(phoneField);
      }
    }

    // Service Selection
    const serviceField = form.querySelector('[name="service"]');
    if (serviceField) {
      if (!serviceField.value.trim()) {
        isValid = false;
        this.setError(serviceField, 'Please select the service you require');
      } else {
        this.clearError(serviceField);
      }
    }

    // Message / Requirements
    const messageField = form.querySelector('[name="message"], [name="requirements"]');
    if (messageField) {
      if (!messageField.value.trim() || messageField.value.trim().length < 8) {
        isValid = false;
        this.setError(messageField, 'Please share brief details of your project requirements');
      } else {
        this.clearError(messageField);
      }
    }

    return isValid;
  }

  setError(input, message) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      let errorSpan = group.querySelector('.error-text');
      if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-text';
        group.appendChild(errorSpan);
      }
      errorSpan.textContent = message;
    }
    input.classList.add('error');
  }

  clearError(input) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
    input.classList.remove('error');
  }

  async handleFormSubmit(form) {
    if (!this.validateForm(form)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-submitting');
      submitBtn.innerHTML = `
        <span class="form-loading-spinner" style="display:inline-block"></span>
        <span class="btn-text" style="margin-left: 8px;">Processing Request...</span>
      `;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Generate unique Lead ID
    const leadId = `DMZ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const leadRecord = {
      lead_id: leadId,
      full_name: data.name || '',
      business_name: data.business_name || 'Not provided',
      work_email: data.email || '',
      phone_whatsapp: data.phone || '',
      website_url: data.website_url || 'Not provided',
      service_required: data.service || 'General Enquiry',
      budget_range: data.budget || 'Not specified',
      project_timeline: data.timeline || 'Flexible',
      business_location: data.location || 'Global',
      requirements: data.message || data.requirements || '',
      attribution: this.getAttributionData()
    };

    // Send lead to Backend API
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadRecord)
      }).catch(err => console.log('API dispatch notice:', err));
    } catch (e) {}

    // Save lead to LocalStorage (persists across sessions)
    try {
      const existingLeads = JSON.parse(localStorage.getItem('digitmaxz_leads') || '[]');
      existingLeads.unshift(leadRecord);
      localStorage.setItem('digitmaxz_leads', JSON.stringify(existingLeads));
      console.log('✅ Lead securely stored in Digit Maxz Lead Management:', leadRecord);
    } catch (err) {
      console.error('Storage error:', err);
    }

    // Analytics conversion event dispatch
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Lead Generation',
        event_label: leadRecord.service_required,
        value: leadRecord.budget_range
      });
    }

    window.dispatchEvent(new CustomEvent('digitmaxz_lead_submitted', { detail: leadRecord }));

    // Simulate smooth processing delay then redirect to Thank You page
    setTimeout(() => {
      // Find path to thank-you relative to current folder
      const isSubDir = window.location.pathname.includes('/') && window.location.pathname.split('/').filter(Boolean).length > 0;
      const targetBase = isSubDir ? '../thank-you/' : 'thank-you/';
      const thankYouUrl = `${targetBase}?ref=${encodeURIComponent(leadId)}&service=${encodeURIComponent(leadRecord.service_required)}&name=${encodeURIComponent(leadRecord.full_name)}`;

      window.location.href = thankYouUrl;
    }, 850);
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.digitMaxzLeadCapture = new LeadCaptureSystem();
});
