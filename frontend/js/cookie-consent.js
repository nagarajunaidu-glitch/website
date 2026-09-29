/**
 * DIGIT MAXZ - COOKIE CONSENT & PRIVACY MANAGEMENT
 */

document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookieConsentBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');
  const essentialBtn = document.getElementById('essentialCookiesBtn');

  if (!banner) return;

  const consentStatus = localStorage.getItem('dmz_cookie_consent');
  if (!consentStatus) {
    // Show banner after short 1.2s delay for seamless page render
    setTimeout(() => {
      banner.classList.add('show');
    }, 1200);
  }

  function setConsent(level) {
    localStorage.setItem('dmz_cookie_consent', level);
    localStorage.setItem('dmz_consent_timestamp', new Date().toISOString());
    banner.classList.remove('show');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => setConsent('all'));
  }
  if (essentialBtn) {
    essentialBtn.addEventListener('click', () => setConsent('essential'));
  }
});
