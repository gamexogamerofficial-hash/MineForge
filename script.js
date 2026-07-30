/**
 * ==========================================================================
 * MINEFORGE - INTERACTIVE LOGIC (HIGH PERFORMANCE & INSTANT LOAD)
 * Features: Account Portal, Order ID Generator, Tracking Engine, Instant Theme Switcher
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initThemeSwitcher();
  initNavigation();
  initClientAccountPortal();
  initPricingControls();
  initOrderSystem();
  initOrderTracking();
  initTestimonialSlider();
  initFAQAccordion();
  initCopyButtons();
  initPolicyModals();
  initScrollToTop();
});

/* ==========================================================================
   1. INSTANT LOADING SCREEN (FAST & ZERO LAG)
   ========================================================================== */
function initLoadingScreen() {
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 150); // Instant 150ms hide for blazing fast loading
  }
}

/* ==========================================================================
   2. DARK / LIGHT MODE SWITCHER (PERSISTED IN LOCALSTORAGE - NO LAG)
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  const icon = themeBtn ? themeBtn.querySelector('i') : null;

  const savedTheme = localStorage.getItem('mineforge_theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    if (icon) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      const isLight = body.classList.contains('light-mode');
      if (icon) {
        if (isLight) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        } else {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      }
      localStorage.setItem('mineforge_theme', isLight ? 'light' : 'dark');
      showToast(isLight ? 'Light Mode Enabled ☀️' : 'Dark Mode Enabled 🌙');
    });
  }
}

/* ==========================================================================
   3. CLEAN NAVIGATION & MOBILE HAMBURGER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   4. CLIENT ACCOUNT / LOGIN & REGISTRATION SYSTEM
   ========================================================================== */
function initClientAccountPortal() {
  const accountBtn = document.getElementById('btn-account');
  const accountModal = document.getElementById('account-modal');
  const closeBtn = document.getElementById('account-modal-close');
  const tabBtns = document.querySelectorAll('.account-tab-btn');
  const tabPanes = document.querySelectorAll('.account-tab-pane');

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('btn-logout');

  updateAccountUI();

  if (accountBtn && accountModal) {
    accountBtn.addEventListener('click', () => {
      accountModal.classList.add('active');
      const currentUser = getCurrentUser();
      if (currentUser) {
        switchAccountTab('dashboard-tab');
        renderUserDashboard(currentUser);
      } else {
        switchAccountTab('login-tab');
      }
    });
  }

  if (closeBtn && accountModal) {
    closeBtn.addEventListener('click', () => {
      accountModal.classList.remove('active');
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === accountModal) {
      accountModal.classList.remove('active');
    }
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchAccountTab(target);
    });
  });

  function switchAccountTab(tabId) {
    tabBtns.forEach(b => {
      if (b.getAttribute('data-tab') === tabId) b.classList.add('active');
      else b.classList.remove('active');
    });
    tabPanes.forEach(p => {
      if (p.id === tabId) p.classList.add('active');
      else p.classList.remove('active');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const discord = document.getElementById('reg-discord').value.trim();
      const password = document.getElementById('reg-password').value;

      if (!name || !email || !password) {
        showToast('Please fill in required fields!');
        return;
      }

      const users = JSON.parse(localStorage.getItem('mineforge_users') || '{}');
      if (users[email]) {
        showToast('Email already registered! Please Login.');
        switchAccountTab('login-tab');
        return;
      }

      const newUser = {
        name,
        email,
        discord,
        password,
        createdAt: new Date().toLocaleDateString(),
        orders: []
      };

      users[email] = newUser;
      localStorage.setItem('mineforge_users', JSON.stringify(users));
      localStorage.setItem('mineforge_current_user', email);

      showToast('🎉 Welcome to MineForge, ' + name + '!');
      updateAccountUI();
      switchAccountTab('dashboard-tab');
      renderUserDashboard(newUser);
      registerForm.reset();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const users = JSON.parse(localStorage.getItem('mineforge_users') || '{}');
      const user = users[email];

      if (!user || user.password !== password) {
        showToast('❌ Invalid Email or Password!');
        return;
      }

      localStorage.setItem('mineforge_current_user', email);
      showToast('🔓 Logged in successfully!');
      updateAccountUI();
      switchAccountTab('dashboard-tab');
      renderUserDashboard(user);
      loginForm.reset();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('mineforge_current_user');
      showToast('Logged out of MineForge');
      updateAccountUI();
      if (accountModal) accountModal.classList.remove('active');
    });
  }
}

function getCurrentUser() {
  const email = localStorage.getItem('mineforge_current_user');
  if (!email) return null;
  const users = JSON.parse(localStorage.getItem('mineforge_users') || '{}');
  return users[email] || null;
}

function updateAccountUI() {
  const accountBtn = document.getElementById('btn-account');
  const currentUser = getCurrentUser();

  if (accountBtn) {
    if (currentUser) {
      const shortName = currentUser.name.split(' ')[0];
      accountBtn.innerHTML = `<i class="fa-solid fa-circle-user"></i> <span>${shortName}</span>`;
      accountBtn.classList.add('logged-in');
    } else {
      accountBtn.innerHTML = `<i class="fa-solid fa-user"></i> <span>Account</span>`;
      accountBtn.classList.remove('logged-in');
    }
  }
}

function renderUserDashboard(user) {
  const nameEl = document.getElementById('dash-user-name');
  const emailEl = document.getElementById('dash-user-email');
  const discordEl = document.getElementById('dash-user-discord');
  const avatarEl = document.getElementById('dash-user-avatar');
  const ordersListEl = document.getElementById('dash-orders-list');

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (discordEl) discordEl.textContent = user.discord ? 'Discord: @' + user.discord : 'No Discord linked';
  if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

  if (ordersListEl) {
    const allOrders = JSON.parse(localStorage.getItem('mineforge_orders') || '{}');
    const userOrderIDs = user.orders || [];

    if (userOrderIDs.length === 0) {
      ordersListEl.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 8px; color: var(--accent-primary);"></i>
          <p>Aap ne abhi tak koi order nahi diya hai.</p>
          <a href="#order" class="btn btn-primary" style="margin-top: 12px; padding: 8px 18px; font-size: 0.85rem;" onclick="document.getElementById('account-modal').classList.remove('active')">Place Custom Order</a>
        </div>
      `;
      return;
    }

    let html = '';
    userOrderIDs.forEach(id => {
      const order = allOrders[id] || { status: 'In Progress', type: 'Custom Mod / Plugin', date: 'Recent' };
      html += `
        <div class="user-order-item">
          <div>
            <strong style="color: var(--accent-primary); font-family: 'Orbitron', sans-serif;">${id}</strong>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${order.type || 'Minecraft Project'}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="order-status-badge status-${order.status.replace(/\s+/g, '-')}">${order.status}</span>
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="trackOrderFromAccount('${id}')">Track</button>
          </div>
        </div>
      `;
    });
    ordersListEl.innerHTML = html;
  }
}

window.trackOrderFromAccount = function(orderId) {
  const accountModal = document.getElementById('account-modal');
  if (accountModal) accountModal.classList.remove('active');

  const trackingInput = document.getElementById('track-id-input');
  const trackingBtn = document.getElementById('btn-track-submit');

  if (trackingInput && trackingBtn) {
    trackingInput.value = orderId;
    document.getElementById('tracking-box').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      trackingBtn.click();
    }, 300);
  }
};

/* ==========================================================================
   5. PRICING CONTROLS
   ========================================================================== */
function initPricingControls() {
  const selectBtns = document.querySelectorAll('.btn-select-plan');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      const budgetSelect = document.getElementById('order-budget');
      const orderFormSection = document.getElementById('order');

      if (budgetSelect) {
        if (planName === 'Basic') budgetSelect.value = '$25 - $75';
        else if (planName === 'Standard') budgetSelect.value = '$75 - $150';
        else if (planName === 'Premium') budgetSelect.value = '$150+';
      }

      if (orderFormSection) {
        orderFormSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`${planName} Plan selected in Order Form! ✨`);
    });
  });
}

/* ==========================================================================
   6. ORDER FORM SUBMISSION & UNIQUE MINEFORGE ID GENERATOR (`MF-XXXX`)
   ========================================================================== */
function initOrderSystem() {
  const form = document.getElementById('order-form');
  const fileInput = document.getElementById('order-file');
  const fileBox = document.getElementById('file-upload-box');
  const fileNameDisplay = document.getElementById('uploaded-file-name');

  const confirmModal = document.getElementById('order-confirm-modal');
  const confirmClose = document.getElementById('confirm-close-btn');
  const orderIdDisplay = document.getElementById('generated-order-id');

  if (fileBox && fileInput) {
    fileBox.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = '📄 ' + fileInput.files[0].name;
      }
    });
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    const nameInput = document.getElementById('order-name');
    const emailInput = document.getElementById('order-email');
    const discordInput = document.getElementById('order-discord');
    if (nameInput) nameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    if (discordInput) discordInput.value = currentUser.discord || '';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const randomID = 'MF-' + Math.floor(1000 + Math.random() * 9000);
      const name = document.getElementById('order-name').value.trim();
      const email = document.getElementById('order-email').value.trim();
      const type = document.getElementById('order-type').value;
      const framework = document.getElementById('order-framework').value;
      const desc = document.getElementById('order-desc').value.trim();

      const newOrder = {
        id: randomID,
        name: name,
        email: email,
        type: `${type} (${framework})`,
        description: desc,
        status: 'In Progress',
        step: 2,
        date: new Date().toLocaleDateString()
      };

      const allOrders = JSON.parse(localStorage.getItem('mineforge_orders') || '{}');
      allOrders[randomID] = newOrder;
      localStorage.setItem('mineforge_orders', JSON.stringify(allOrders));

      const currentUser = getCurrentUser();
      if (currentUser) {
        if (!currentUser.orders) currentUser.orders = [];
        currentUser.orders.unshift(randomID);
        const users = JSON.parse(localStorage.getItem('mineforge_users') || '{}');
        users[currentUser.email] = currentUser;
        localStorage.setItem('mineforge_users', JSON.stringify(users));
      }

      if (orderIdDisplay) orderIdDisplay.textContent = randomID;
      if (confirmModal) confirmModal.classList.add('active');

      form.reset();
      if (fileNameDisplay) fileNameDisplay.textContent = '';
      showToast(`Order Placed! Your ID: ${randomID}`);
    });
  }

  if (confirmClose && confirmModal) {
    confirmClose.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   7. LIVE ORDER TRACKING ENGINE
   ========================================================================== */
function initOrderTracking() {
  const trackBtn = document.getElementById('btn-track-submit');
  const trackInput = document.getElementById('track-id-input');
  const resultBox = document.getElementById('tracking-result-box');

  const statusIdEl = document.getElementById('display-track-id');
  const statusBadgeEl = document.getElementById('display-track-status');
  const statusDescEl = document.getElementById('display-track-desc');

  const demoOrders = {
    "MF-1001": { status: "Pending", step: 1, type: "Custom RPG Mod (Fabric 1.20)", desc: "Order receive ho gaya hai. Developer aapke project specifications review kar raha hai." },
    "MF-1002": { status: "In Progress", step: 2, type: "Skyblock Core Plugin (Paper)", desc: "Development shuru ho chuki hai. Custom economy aur island mechanics build ki ja rahi hain." },
    "MF-1003": { status: "Completed", step: 3, type: "Velocity Proxy Anti-DDoS", desc: "Project mukammal ho chuka hai aur 100% tested hai. Delivery files email/Discord par bhej di gayi hain." }
  };

  function displayOrderResult(id) {
    const allOrders = JSON.parse(localStorage.getItem('mineforge_orders') || '{}');
    const order = allOrders[id] || demoOrders[id];

    if (!order) {
      showToast(`❌ Order ID "${id}" nahi mila! Kripya sahi MineForge ID (e.g. MF-1001) darj karen.`);
      if (resultBox) resultBox.classList.remove('active');
      return;
    }

    if (statusIdEl) statusIdEl.textContent = id;
    if (statusBadgeEl) {
      statusBadgeEl.textContent = order.status;
      statusBadgeEl.className = `order-status-badge status-${order.status.replace(/\s+/g, '-')}`;
    }
    if (statusDescEl) {
      statusDescEl.textContent = order.desc || `${order.type || 'Minecraft Project'} - ${order.status}. Fast & reliable MineForge development.`;
    }

    const stepNumber = order.step || 2;
    for (let i = 1; i <= 3; i++) {
      const stepEl = document.getElementById(`step-${i}`);
      if (stepEl) {
        if (i <= stepNumber) stepEl.classList.add('completed');
        else stepEl.classList.remove('completed');
      }
    }

    if (resultBox) resultBox.classList.add('active');
  }

  if (trackBtn && trackInput) {
    trackBtn.addEventListener('click', () => {
      const query = trackInput.value.trim().toUpperCase();
      if (!query) {
        showToast('Please enter an Order ID (e.g. MF-1001)');
        return;
      }
      displayOrderResult(query);
    });

    trackInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') trackBtn.click();
    });
  }

  document.querySelectorAll('.demo-id-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const chipId = chip.getAttribute('data-id');
      if (trackInput) trackInput.value = chipId;
      displayOrderResult(chipId);
    });
  });
}

/* ==========================================================================
   8. CLIENT TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (slides.length === 0) return;
  let currentSlide = 0;
  let autoplayTimer;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
    currentSlide = index;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIdx = (currentSlide + 1) % slides.length;
      showSlide(nextIdx);
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIdx);
      resetAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      const nextIdx = (currentSlide + 1) % slides.length;
      showSlide(nextIdx);
    }, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   10. CONTACT COPY TO CLIPBOARD BUTTONS
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`📋 Copied: "${textToCopy}" to clipboard!`);
        });
      } else {
        showToast(`📋 Contact info: ${textToCopy}`);
      }
    });
  });
}

/* ==========================================================================
   11. FOOTER POLICY MODALS
   ========================================================================== */
function initPolicyModals() {
  const policyModal = document.getElementById('policy-modal');
  const closeBtn = document.getElementById('policy-modal-close');
  const policyLinks = document.querySelectorAll('.policy-link');

  const titleEl = document.getElementById('policy-title');
  const bodyEl = document.getElementById('policy-body');

  const policyTexts = {
    privacy: {
      title: "MineForge Privacy Policy",
      content: `
        <p>At MineForge, we respect your privacy and protect your personal information.</p>
        <p>1. <strong>Data Collection</strong>: We only collect necessary details (Name, Email, Discord Username, Minecraft Server Specs) required to develop and deliver your custom Mods and Plugins.</p>
        <p>2. <strong>Security</strong>: All custom source code, server files, and project specifications are treated as strictly confidential and never shared with third parties.</p>
      `
    },
    terms: {
      title: "MineForge Terms & Conditions",
      content: `
        <p>By ordering from MineForge, you agree to the following terms:</p>
        <p>1. <strong>Project Scope</strong>: All deliverables are constructed according to the initial specifications agreed upon during the consultation.</p>
        <p>2. <strong>Licensing</strong>: Upon completion and full payment, you receive full commercial rights to use the custom Mod or Plugin on your Minecraft servers.</p>
      `
    },
    refund: {
      title: "MineForge Refund Policy",
      content: `
        <p>We stand behind the quality of our Minecraft development services.</p>
        <p>1. <strong>100% Satisfaction Guarantee</strong>: If we are unable to deliver the promised feature or mod according to technical specifications, a full refund will be issued.</p>
        <p>2. <strong>Bug Fix Warranty</strong>: We provide free bug fixes and optimizations for 30 days after project delivery.</p>
      `
    }
  };

  policyLinks.forEach(link => {
    link.addEventListener('click', () => {
      const type = link.getAttribute('data-policy');
      const data = policyTexts[type];
      if (data && policyModal) {
        titleEl.textContent = data.title;
        bodyEl.innerHTML = data.content;
        policyModal.classList.add('active');
      }
    });
  });

  if (closeBtn && policyModal) {
    closeBtn.addEventListener('click', () => {
      policyModal.classList.remove('active');
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === policyModal) {
      policyModal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   12. SCROLL TO TOP & HELPER TOAST
   ========================================================================== */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
