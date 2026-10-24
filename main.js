/**
 * PRANAV S - PERSONAL PORTFOLIO JAVASCRIPT
 * Interactive 3D Card Tilt, Color Aspect Switcher, Gmail Portal & Modal Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAspects();
  initTiltEffects();
  initGmailPortal();
  initSpecsModal();
  initNavigation();
  initToastSystem();
});

/* ==========================================================================
   1. THEME & COLOR ASPECT SYSTEM
   ========================================================================== */
function initThemeAspects() {
  const themeToggle = document.getElementById('themePickerToggle');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  const savedTheme = localStorage.getItem('pranav_theme_aspect') || 'sepia';

  // Apply saved theme
  setTheme(savedTheme);

  if (themeToggle && themeDropdown) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!themeDropdown.contains(e.target) && !themeToggle.contains(e.target)) {
        themeDropdown.classList.remove('open');
      }
    });

    // Theme option selections
    themeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const themeVal = option.getAttribute('data-theme-val');
        setTheme(themeVal);
        themeDropdown.classList.remove('open');
        showToast(`Theme aspect updated to ${option.querySelector('span:last-child').textContent}`);
      });
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pranav_theme_aspect', theme);

    themeOptions.forEach((opt) => {
      if (opt.getAttribute('data-theme-val') === theme) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   2. 3D CARD TILT EFFECT (Vanilla JS, Zero Dependencies)
   ========================================================================== */
function initTiltEffects() {
  // Only apply tilt on fine pointer devices (desktops/laptops)
  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left; // x position within element
        const cardY = e.clientY - rect.top;  // y position within element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -8; // Max 8 deg
        const rotateY = ((cardX - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

/* ==========================================================================
   3. GMAIL PORTAL & TOGGLE SYSTEM
   ========================================================================== */
function initGmailPortal() {
  const tabQuick = document.getElementById('tabQuickConnect');
  const tabCompose = document.getElementById('tabComposeMsg');
  const contentQuick = document.getElementById('contentQuickConnect');
  const contentCompose = document.getElementById('contentComposeMsg');

  // Toggle Tab Switching
  if (tabQuick && tabCompose && contentQuick && contentCompose) {
    tabQuick.addEventListener('click', () => {
      tabQuick.classList.add('active');
      tabQuick.setAttribute('aria-selected', 'true');
      tabCompose.classList.remove('active');
      tabCompose.setAttribute('aria-selected', 'false');

      contentQuick.classList.add('active');
      contentCompose.classList.remove('active');
    });

    tabCompose.addEventListener('click', () => {
      tabCompose.classList.add('active');
      tabCompose.setAttribute('aria-selected', 'true');
      tabQuick.classList.remove('active');
      tabQuick.setAttribute('aria-selected', 'false');

      contentCompose.classList.add('active');
      contentQuick.classList.remove('active');
    });
  }

  // Copy Email Address Button
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyText = document.getElementById('copyBtnText');
  const emailVal = 'pranavrubix2007@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailVal).then(() => {
          showCopyFeedback();
        }).catch(() => {
          fallbackCopy(emailVal);
        });
      } else {
        fallbackCopy(emailVal);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopyFeedback();
  }

  function showCopyFeedback() {
    if (copyBtn && copyText) {
      copyBtn.classList.add('copied');
      copyText.textContent = 'Copied!';
      showToast('Copied pranavrubix2007@gmail.com to clipboard');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2500);
    }
  }

  // Direct Compose Form Launch into Gmail
  const sendBtn = document.getElementById('sendViaGmailBtn');
  const clearBtn = document.getElementById('clearComposeBtn');
  const subjectInput = document.getElementById('composeSubject');
  const messageInput = document.getElementById('composeMessage');

  if (sendBtn && subjectInput && messageInput) {
    sendBtn.addEventListener('click', () => {
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      if (!message) {
        showToast('Please type a message before sending.');
        messageInput.focus();
        return;
      }

      const encodedSubject = encodeURIComponent(subject || 'Portfolio Collaboration Inquiry');
      const encodedBody = encodeURIComponent(message);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=pranavrubix2007@gmail.com&su=${encodedSubject}&body=${encodedBody}`;

      // Open Gmail composer in new tab
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening Gmail with your prefilled message!');
    });
  }

  if (clearBtn && subjectInput && messageInput) {
    clearBtn.addEventListener('click', () => {
      subjectInput.value = '';
      messageInput.value = '';
      showToast('Compose message cleared');
    });
  }
}

/* ==========================================================================
   4. CAPSTONE ARCHITECTURE & SPECS MODAL
   ========================================================================== */
function initSpecsModal() {
  const modal = document.getElementById('specsModal');
  const openBtn = document.getElementById('openSpecsModalBtn');
  const closeBtn1 = document.getElementById('closeSpecsModalBtn');
  const closeBtn2 = document.getElementById('closeSpecsModalBtn2');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll shadow on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    // Close mobile drawer when clicking any link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Active section indicator on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('data-nav') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

/* ==========================================================================
   6. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastContainer;

function initToastSystem() {
  toastContainer = document.getElementById('toastContainer');
}

function showToast(message, duration = 3000) {
  if (!toastContainer) {
    toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, duration);
}
