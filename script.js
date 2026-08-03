/**
 * ==========================================================================
 * MINEFORGE - INTERACTIVE LOGIC (HIGH PERFORMANCE & INSTANT LOAD)
 * Features: Account Portal, Order ID Generator, Tracking Engine, Instant Theme Switcher
 * Zero-Lag Guarantee & Automatic 120ms Loader Hide
 * ==========================================================================
 */

// Global state in localStorage
const MF_STORAGE_KEYS = {
  USERS: 'mineforge_users',
  CURRENT_USER: 'mineforge_current_user',
  ORDERS: 'mineforge_orders',
  THEME: 'mineforge_theme',
  AVAILABILITY: 'mineforge_availability'
};

// ==========================================================================
// OFFICIAL DISCORD OAUTH2 LOGIN CONFIGURATION (IMPLICIT GRANT)
// Replace 'YOUR_DISCORD_CLIENT_ID_HERE' with your real Client ID from https://discord.com/developers/applications
// ==========================================================================
const DISCORD_OAUTH_CONFIG = {
  CLIENT_ID: '1532611015412416752', // MineForge Studio Official Discord Application ID
  SCOPE: 'identify'
};

// Default Demo Orders in storage if empty
const DEFAULT_ORDERS = [
  {
    id: 'MF-1001',
    clientName: 'SteveMC',
    discordHandle: 'steve_dev',
    buildType: 'Fabric Mod Development',
    targetVersion: '1.21.4',
    status: 'In-Progress',
    desc: 'Custom magic spell animations and glowing item models.',
    date: '2026-08-03',
    timestamp: Date.now() - (2 * 3600 * 1000)
  },
  {
    id: 'MF-1002',
    clientName: 'AlexGamer',
    discordHandle: 'alex_pvp',
    buildType: 'Paper Plugin Development',
    targetVersion: '26.30',
    status: 'In-Progress',
    desc: 'Economy shop GUI with custom scoreboard rank integration.',
    date: '2026-08-03',
    timestamp: Date.now() - (5 * 3600 * 1000)
  }
];

// Ensure default storage initialized
function initStorage() {
  if (!localStorage.getItem(MF_STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(MF_STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
  }
  if (!localStorage.getItem(MF_STORAGE_KEYS.USERS)) {
    localStorage.setItem(MF_STORAGE_KEYS.USERS, JSON.stringify([]));
  }
}

/**
 * ==========================================================================
 * INSTANT LOADER HIDE (ZERO-LAG / NEVER GETS STUCK)
 * ==========================================================================
 */
function hideLoader() {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader && !pageLoader.classList.contains('hidden')) {
    pageLoader.classList.add('hidden');
  }
}

// Hide instantly as soon as DOM is ready, plus safety timer so offline local files NEVER hang
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoader, 100);
});
window.addEventListener('load', () => {
  setTimeout(hideLoader, 100);
});
// 250ms absolute fallback guarantee
setTimeout(hideLoader, 250);

/**
 * ==========================================================================
 * MAIN DOM LOGIC
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initThemeSwitcher();
  initHeaderScroll();
  initMobileNav();
  initActiveNavHighlight();
  initOrderForm();
  initOrderTracking();
  initAccountPortal();
  initOfficialDiscordOAuth();
  initTestimonialsSlider();
  initFAQAccordion();
  initScrollToTop();
  loadAvailabilityBadge();
});

/**
 * ==========================================================================
 * OFFICIAL DISCORD OAUTH2 IMPLICIT GRANT & SETUP GUIDE
 * ==========================================================================
 */
function toggleDiscordSetupGuide() {
  const guide = document.getElementById('discord-oauth-setup-guide');
  if (guide) {
    guide.style.display = guide.style.display === 'none' ? 'block' : 'none';
  }
}

function initOfficialDiscordOAuth() {
  // 1. Check if returning from Discord OAuth2 with access token in URL fragment
  const hash = window.location.hash;
  if (hash && hash.includes('access_token=')) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type') || 'Bearer';

    if (accessToken) {
      // Clean URL from hash
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

      fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `${tokenType} ${accessToken}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch Discord profile');
        return res.json();
      })
      .then(data => {
        const officialUsername = data.global_name || data.username;
        const officialHandle = `@${data.username}`;
        const avatarUrl = data.avatar
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.id || '0') % 5}.png`;

        let users = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.USERS) || '[]');
        let user = users.find(u => u.discord.toLowerCase() === officialHandle.toLowerCase() || u.discordId === data.id);

        if (!user) {
          user = {
            username: officialUsername,
            discord: officialHandle,
            discordId: data.id,
            avatar: avatarUrl,
            verifiedDiscord: true
          };
          users.push(user);
          localStorage.setItem(MF_STORAGE_KEYS.USERS, JSON.stringify(users));
        } else {
          user.username = officialUsername;
          user.discord = officialHandle;
          user.discordId = data.id;
          user.avatar = avatarUrl;
          user.verifiedDiscord = true;
          localStorage.setItem(MF_STORAGE_KEYS.USERS, JSON.stringify(users));
        }

        localStorage.setItem(MF_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        showToast(`Verified Official Discord: Welcome ${officialUsername}!`);
        renderAccountDashboard();
        openModal('account-modal');
      })
      .catch(err => {
        console.error('Discord OAuth Error:', err);
        showToast('Discord authorization failed. Try manual login.');
      });
    }
  }

  // 2. Attach click listener to Official Discord Login button
  const officialBtn = document.getElementById('btn-official-discord-login');
  if (officialBtn) {
    officialBtn.addEventListener('click', () => {
      if (!DISCORD_OAUTH_CONFIG.CLIENT_ID || DISCORD_OAUTH_CONFIG.CLIENT_ID === 'YOUR_DISCORD_CLIENT_ID_HERE') {
        showToast('Please paste your Discord Client ID in script.js line 21! See Setup Guide.');
        const setupBox = document.getElementById('discord-oauth-setup-guide');
        if (setupBox) setupBox.style.display = 'block';
        return;
      }

      // Clean base URL without index.html and ensuring trailing slash
      let cleanUrl = window.location.origin + window.location.pathname.replace(/index\.html$/i, '');
      if (!cleanUrl.endsWith('/')) {
        cleanUrl += '/';
      }
      console.log('Discord OAuth2 Redirect URI (Must match Discord Developer Portal -> OAuth2 -> Redirects):', cleanUrl);
      const redirectUri = encodeURIComponent(cleanUrl);
      const authUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_OAUTH_CONFIG.CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=${DISCORD_OAUTH_CONFIG.SCOPE}`;
      window.location.href = authUrl;
    });
  }
}

/**
 * ==========================================================================
 * 1. THEME SWITCHER (0-LAG SUN / MOON TOGGLE)
 * ==========================================================================
 */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  if (!themeBtn) return;

  const icon = themeBtn.querySelector('i');
  const savedTheme = localStorage.getItem(MF_STORAGE_KEYS.THEME) || 'dark';

  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }

  themeBtn.addEventListener('click', () => {
    // Trigger smooth 360-degree spin animation
    themeBtn.classList.remove('animated');
    void themeBtn.offsetWidth; // force DOM reflow
    themeBtn.classList.add('animated');

    const isLight = body.classList.toggle('light-mode');
    if (isLight) {
      body.classList.remove('dark-mode');
      localStorage.setItem(MF_STORAGE_KEYS.THEME, 'light');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
      showToast('Switched to Light Gaming Mode ☀️');
    } else {
      body.classList.add('dark-mode');
      localStorage.setItem(MF_STORAGE_KEYS.THEME, 'dark');
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
      showToast('Switched to Dark Cyber Mode 🌙');
    }
  });
}

/**
 * ==========================================================================
 * 2. HEADER SCROLL & MOBILE NAV
 * ==========================================================================
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  if (!hamburgerBtn || !navLinks) return;

  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/**
 * ==========================================================================
 * 2B. ACTIVE NAVIGATION HIGHLIGHT (CLICK + SCROLLSPY)
 * ==========================================================================
 */
function initActiveNavHighlight() {
  const navLinks = document.querySelectorAll('#nav-links .nav-link');
  if (!navLinks || navLinks.length === 0) return;

  // 1. Click Handler: immediately update active class on clicked link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 2. ScrollSpy Handler: automatically highlight active link on scroll
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 220; // offset for fixed header
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;

        sections.forEach(sec => {
          const sectionTop = sec.offsetTop;
          const sectionHeight = sec.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = sec.getAttribute('id');
          }
        });

        if (isAtBottom) {
          currentSectionId = 'contact';
        }

        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * ==========================================================================
 * 3. INSTANT ORDER FORM & MF-XXXX ID GENERATION
 * ==========================================================================
 */
function initOrderForm() {
  const orderForm = document.getElementById('order-form');
  const fileInput = document.getElementById('spec-file');
  const dropzone = document.getElementById('file-dropzone');
  const fileNameDisplay = document.getElementById('uploaded-file-name');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        if (fileNameDisplay) {
          fileNameDisplay.innerHTML = `<i class="fa-solid fa-file-circle-check"></i> Attached: ${e.target.files[0].name}`;
        }
      }
    });
  }

  if (!orderForm) return;

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = document.getElementById('client-name').value.trim();
    const discordHandle = document.getElementById('client-discord').value.trim();
    const buildType = document.getElementById('build-type').value;
    const targetVersion = document.getElementById('target-version').value.trim() || 'Latest';
    const buildDesc = document.getElementById('build-desc').value.trim();

    // Generate unique MF-XXXX ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MF-${randomNum}`;

    const newOrder = {
      id: orderId,
      clientName: clientName,
      discordHandle: discordHandle,
      buildType: buildType,
      targetVersion: targetVersion,
      status: 'Pending',
      desc: buildDesc,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    // Save order in storage
    const orders = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.ORDERS) || '[]');
    orders.unshift(newOrder);
    localStorage.setItem(MF_STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Show Confirmation Modal
    const modalIdElem = document.getElementById('modal-order-id');
    if (modalIdElem) modalIdElem.textContent = orderId;
    openModal('order-confirm-modal');

    orderForm.reset();
    if (fileNameDisplay) fileNameDisplay.innerHTML = '';

    // If user is logged in, sync dashboard
    renderAccountDashboard();
  });
}

/**
 * ==========================================================================
 * 4. ORDER TRACKING WIDGET
 * ==========================================================================
 */
function initOrderTracking() {
  const trackingForm = document.getElementById('tracking-form');
  const trackingInput = document.getElementById('tracking-id-input');
  const trackingResultBox = document.getElementById('tracking-result');

  // Quick demo ID chips
  document.querySelectorAll('.demo-id-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const demoId = chip.getAttribute('data-id');
      if (trackingInput) trackingInput.value = demoId;
      trackOrderById(demoId);
    });
  });

  if (!trackingForm) return;

  trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = trackingInput.value.trim().toUpperCase();
    if (idVal) trackOrderById(idVal);
  });
}

function trackOrderById(orderId) {
  const trackingResultBox = document.getElementById('tracking-result');
  if (!trackingResultBox) return;

  const orders = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.ORDERS) || '[]');
  const foundOrder = orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());

  if (!foundOrder) {
    showToast(`Order ID "${orderId}" not found. Try MF-1001 or MF-1002!`);
    return;
  }

  document.getElementById('display-order-id').textContent = foundOrder.id;
  document.getElementById('display-client-name').textContent = foundOrder.clientName;
  document.getElementById('display-build-type').textContent = `${foundOrder.buildType} (${foundOrder.targetVersion})`;

  const badgeElem = document.getElementById('display-status-badge');
  badgeElem.textContent = foundOrder.status;
  badgeElem.className = `order-status-badge status-${foundOrder.status.replace(/\s+/g, '-')}`;

  // Timeline Steps
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  [step1, step2, step3].forEach(step => step.classList.remove('completed'));

  if (foundOrder.status === 'Pending') {
    step1.classList.add('completed');
  } else if (foundOrder.status === 'In-Progress') {
    step1.classList.add('completed');
    step2.classList.add('completed');
  } else if (foundOrder.status === 'Completed') {
    step1.classList.add('completed');
    step2.classList.add('completed');
    step3.classList.add('completed');
  }

  trackingResultBox.classList.add('active');
  trackingResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * ==========================================================================
 * 5. CLIENT ACCOUNT & LOGIN PORTAL SYSTEM
 * ==========================================================================
 */
function initAccountPortal() {
  const btnOpen = document.getElementById('btn-open-account');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      renderAccountDashboard();
      openModal('account-modal');
    });
  }

  const discordLoginForm = document.getElementById('discord-login-form');
  if (discordLoginForm) {
    discordLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const discordHandle = document.getElementById('discord-login-handle').value.trim();
      const username = document.getElementById('discord-login-username').value.trim();

      let users = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.USERS) || '[]');
      let user = users.find(u => u.discord.toLowerCase() === discordHandle.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        user = {
          username: username,
          discord: discordHandle
        };
        users.push(user);
        localStorage.setItem(MF_STORAGE_KEYS.USERS, JSON.stringify(users));
      } else {
        // Keep updated
        user.username = username;
        user.discord = discordHandle;
        localStorage.setItem(MF_STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      localStorage.setItem(MF_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      showToast(`Welcome to your Dashboard, ${user.username}!`);
      renderAccountDashboard();
    });
  }

  // Check login on startup
  renderAccountDashboard();
}

function isAdminGamexo(user) {
  const currentUser = user || JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.CURRENT_USER) || 'null');
  if (!currentUser) return false;
  const name = (currentUser.username || '').toLowerCase();
  const disc = (currentUser.discord || '').toLowerCase();
  return name.includes('gamexo') || disc.includes('gamexo') || currentUser.isAdmin === true;
}

function setAvailabilityBadge(status) {
  localStorage.setItem(MF_STORAGE_KEYS.AVAILABILITY, status);
  loadAvailabilityBadge();
  showToast(`👑 Availability Status Updated: ${status.toUpperCase()}`);
}

function loadAvailabilityBadge() {
  const status = localStorage.getItem(MF_STORAGE_KEYS.AVAILABILITY) || 'open';
  const navBadge = document.getElementById('nav-availability-badge');
  const navDot = document.getElementById('nav-avail-dot');
  const navText = document.getElementById('nav-avail-text');
  
  const heroBadge = document.getElementById('hero-availability-badge');
  const heroDot = document.getElementById('hero-avail-dot');
  const heroText = document.getElementById('hero-avail-text');
  
  let color = '#00ffd5';
  let bg = 'rgba(0, 255, 213, 0.15)';
  let label = 'Open';
  let heroLabel = '🟢 Open — Currently accepting new projects.';
  
  if (status === 'limited') {
    color = '#ffb703';
    bg = 'rgba(255, 183, 3, 0.15)';
    label = 'Limited';
    heroLabel = '🟡 Limited — Only a few slots are available.';
  } else if (status === 'closed') {
    color = '#ff4d4d';
    bg = 'rgba(255, 77, 77, 0.15)';
    label = 'Closed';
    heroLabel = '🔴 Closed — Orders are temporarily closed. Please check back later.';
  }
  
  if (navBadge) {
    navBadge.style.borderColor = color;
    navBadge.style.color = color;
    navBadge.style.background = bg;
    if (navDot) {
      navDot.style.background = color;
      navDot.style.boxShadow = `0 0 8px ${color}`;
    }
    if (navText) navText.textContent = label;
  }
  
  if (heroBadge) {
    heroBadge.style.borderColor = color;
    heroBadge.style.color = color;
    heroBadge.style.background = bg;
    if (heroDot) {
      heroDot.style.background = color;
      heroDot.style.boxShadow = `0 0 10px ${color}`;
    }
    if (heroText) heroText.textContent = heroLabel;
  }
}

function requestCustomQuote(serviceName) {
  const orderSection = document.getElementById('order');
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth' });
  }
  const buildTypeSelect = document.getElementById('build-type');
  if (buildTypeSelect) {
    buildTypeSelect.value = serviceName;
    buildTypeSelect.style.transition = 'box-shadow 0.3s ease';
    buildTypeSelect.style.boxShadow = '0 0 25px rgba(0, 255, 213, 0.8)';
    setTimeout(() => {
      buildTypeSelect.style.boxShadow = '';
    }, 1500);
  }
  showToast(`💬 Selected: "${serviceName}" — Submit details for a custom Discord quote!`);
}

function editUserOrder(orderId) {
  let allOrders = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.ORDERS) || '[]');
  const order = allOrders.find(o => o.id === orderId);
  if (!order) {
    showToast('❌ Order not found!');
    return;
  }
  const hoursElapsed = (Date.now() - (order.timestamp || Date.now())) / (1000 * 60 * 60);
  if (hoursElapsed > 24) {
    showToast('🔒 24-hour edit window has expired for this order.');
    return;
  }
  const newDesc = prompt(`Edit feature description for ${orderId} (within 24h window):`, order.desc || '');
  if (newDesc !== null && newDesc.trim() !== '') {
    order.desc = newDesc.trim();
    localStorage.setItem(MF_STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
    renderAccountDashboard();
    showToast(`✏️ Order ${orderId} updated successfully!`);
  }
}

function deleteUserOrder(orderId) {
  let allOrders = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.ORDERS) || '[]');
  const order = allOrders.find(o => o.id === orderId);
  if (!order) {
    showToast('❌ Order not found!');
    return;
  }
  const hoursElapsed = (Date.now() - (order.timestamp || Date.now())) / (1000 * 60 * 60);
  if (hoursElapsed > 24) {
    showToast('🔒 24-hour delete window has expired for this order.');
    return;
  }
  if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
    allOrders = allOrders.filter(o => o.id !== orderId);
    localStorage.setItem(MF_STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
    renderAccountDashboard();
    showToast(`🗑️ Order ${orderId} has been deleted.`);
  }
}

window.isAdminGamexo = isAdminGamexo;
window.setAvailabilityBadge = setAvailabilityBadge;
window.loadAvailabilityBadge = loadAvailabilityBadge;
window.requestCustomQuote = requestCustomQuote;
window.editUserOrder = editUserOrder;
window.deleteUserOrder = deleteUserOrder;

function renderAccountDashboard() {
  const authContainer = document.getElementById('auth-view-container');
  const dashContainer = document.getElementById('dashboard-view-container');
  const navLabel = document.getElementById('nav-account-label');
  const navIcon = document.getElementById('nav-account-icon');
  const navAvatar = document.getElementById('nav-account-avatar');
  const currentUser = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.CURRENT_USER) || 'null');

  if (!currentUser) {
    if (authContainer) authContainer.style.display = 'block';
    if (dashContainer) dashContainer.style.display = 'none';
    if (navLabel) navLabel.textContent = 'Account';
    if (navIcon) {
      navIcon.className = 'fa-solid fa-user-shield';
      navIcon.style.display = 'inline-block';
    }
    if (navAvatar) navAvatar.style.display = 'none';
    return;
  }

  // Logged in
  if (authContainer) authContainer.style.display = 'none';
  if (dashContainer) dashContainer.style.display = 'block';
  if (navLabel) navLabel.textContent = currentUser.username;

  // Set navbar avatar image to user's Discord profile pic
  if (navAvatar && navIcon) {
    const avatarUrl = currentUser.avatar || ((currentUser.username && currentUser.username.toLowerCase().includes('gamexo')) ? 'assets/images/gamexo_avatar.jpg' : null);
    if (avatarUrl) {
      navAvatar.src = avatarUrl;
      navAvatar.style.display = 'inline-block';
      navIcon.style.display = 'none';
    } else {
      navAvatar.style.display = 'none';
      navIcon.className = 'fa-brands fa-discord';
      navIcon.style.display = 'inline-block';
    }
  }

  document.getElementById('dash-username').textContent = currentUser.username;
  const badgeHtml = currentUser.verifiedDiscord
    ? `<span style="background: rgba(88, 101, 242, 0.2); color: #5865F2; padding: 2px 8px; border-radius: var(--radius-full); font-size: 0.72rem; margin-left: 6px; font-weight: 700;"><i class="fa-solid fa-check"></i> Official Verified</span>`
    : '';
  document.getElementById('dash-discord').innerHTML = `<i class="fa-brands fa-discord" style="color: #5865F2;"></i> ${currentUser.discord || '@discord_user'} ${badgeHtml}`;

  const dashAvatarEl = document.getElementById('dash-avatar');
  if (dashAvatarEl) {
    const avatarUrl = currentUser.avatar || ((currentUser.username && currentUser.username.toLowerCase().includes('gamexo')) ? 'assets/images/gamexo_avatar.jpg' : null);
    if (avatarUrl) {
      dashAvatarEl.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid #00ffd5;" />`;
    } else {
      dashAvatarEl.textContent = (currentUser.username || 'U').charAt(0).toUpperCase();
    }
  }

  // Populate client orders (only real orders from this user!)
  const allOrders = JSON.parse(localStorage.getItem(MF_STORAGE_KEYS.ORDERS) || '[]');
  const clientOrders = allOrders.filter(o => 
    o.clientName.toLowerCase() === currentUser.username.toLowerCase() ||
    (o.discordHandle && currentUser.discord && o.discordHandle.toLowerCase() === currentUser.discord.toLowerCase())
  );

  document.getElementById('dash-order-count').textContent = `${clientOrders.length} Orders`;
  const ordersListElem = document.getElementById('dash-orders-list');
  if (!ordersListElem) return;

  if (clientOrders.length === 0) {
    ordersListElem.innerHTML = `
      <div style="text-align: center; padding: 32px 18px; background: rgba(255,255,255,0.02); border: 1.5px dashed rgba(255,255,255,0.18); border-radius: var(--radius-md); margin-bottom: 16px;">
        <div style="font-size: 2.6rem; color: var(--text-muted); margin-bottom: 10px;">
          <i class="fa-solid fa-box-open"></i>
        </div>
        <h5 style="color: #fff; font-size: 1.15rem; margin-bottom: 6px; font-family: 'Outfit', sans-serif;">Order Not Found</h5>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 18px; max-width: 290px; margin-left: auto; margin-right: auto;">
          Aapne abhi tak koi Minecraft mod ya plugin order nahi kiya hai.
        </p>
        <button class="btn btn-primary" style="padding: 10px 22px; font-size: 0.88rem; font-weight: 700;" onclick="closeModal('account-modal'); window.location.hash='#order';">
          <i class="fa-solid fa-plus"></i> Place New Order
        </button>
      </div>
    `;
    return;
  }

  const now = Date.now();
  ordersListElem.innerHTML = clientOrders.map(order => {
    const orderTime = order.timestamp || now;
    const hoursElapsed = (now - orderTime) / (1000 * 60 * 60);
    const canEditDelete = hoursElapsed <= 24;
    
    const editBtnHtml = canEditDelete
      ? `<button class="btn btn-sm" style="background: rgba(0,255,213,0.15); color: #00ffd5; border: 1px solid #00ffd5; padding: 5px 10px; font-size: 0.75rem; border-radius: 6px;" onclick="editUserOrder('${order.id}')" title="Edit Order (24h window)"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
         <button class="btn btn-sm" style="background: rgba(255,77,77,0.15); color: #ff4d4d; border: 1px solid #ff4d4d; padding: 5px 10px; font-size: 0.75rem; border-radius: 6px;" onclick="deleteUserOrder('${order.id}')" title="Delete Order (24h window)"><i class="fa-solid fa-trash"></i> Delete</button>`
      : `<span style="font-size: 0.7rem; color: #8ba1cf; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;" title="24-hour edit window has expired"><i class="fa-solid fa-lock"></i> Locked (24h+)</span>`;

    return `
    <div class="user-order-item" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
      <div>
        <div style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: var(--accent-primary); font-size: 1.05rem;">
          ${order.id}
        </div>
        <div style="font-size: 0.9rem; color: var(--text-main); font-weight: 600;">${order.buildType} (${order.targetVersion})</div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${order.date} • <span style="color: #00ffd5;">24h Window Active</span></div>
        ${order.desc ? `<div style="font-size: 0.8rem; color: #b4c6e7; margin-top: 4px; font-style: italic;">"${order.desc}"</div>` : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="order-status-badge status-${order.status.replace(/\s+/g, '-')}" style="font-size: 0.75rem;">${order.status}</span>
        ${editBtnHtml}
        <button class="btn btn-outline" style="padding: 5px 12px; font-size: 0.75rem;" onclick="trackFromDashboard('${order.id}')">
          Track
        </button>
      </div>
    </div>
    `;
  }).join('');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tab-btn-login');
  const tabSignup = document.getElementById('tab-btn-signup');
  const paneLogin = document.getElementById('pane-login');
  const paneSignup = document.getElementById('pane-signup');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    paneLogin.classList.add('active');
    paneSignup.classList.remove('active');
  } else {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    paneSignup.classList.add('active');
    paneLogin.classList.remove('active');
  }
}

function logoutClient() {
  localStorage.removeItem(MF_STORAGE_KEYS.CURRENT_USER);
  showToast('Signed out successfully.');
  renderAccountDashboard();
}

function trackFromDashboard(orderId) {
  closeModal('account-modal');
  const trackingInput = document.getElementById('tracking-id-input');
  if (trackingInput) trackingInput.value = orderId;
  trackOrderById(orderId);
  const orderSection = document.getElementById('order');
  if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * ==========================================================================
 * 6. TESTIMONIALS SLIDER
 * ==========================================================================
 */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!slides.length || !prevBtn || !nextBtn) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  // Auto advance every 6 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 6000);
}

/**
 * ==========================================================================
 * 7. FAQ ACCORDION
 * ==========================================================================
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * ==========================================================================
 * 8. SCROLL TO TOP
 * ==========================================================================
 */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * ==========================================================================
 * 9. MODAL & TOAST HELPER FUNCTIONS
 * ==========================================================================
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.onclick = (e) => {
      if (e.target === modal) {
        closeModal(modalId);
      }
    };
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function copyToClipboard(text, noticeMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(noticeMsg || 'Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy. Try manually.');
  });
}

function copyOrderIdFromModal() {
  const idElem = document.getElementById('modal-order-id');
  if (idElem) {
    copyToClipboard(idElem.textContent, 'Order ID copied to clipboard!');
  }
}

function copyEmailWithFeedback() {
  const emailStr = 'gamexogamerofficial@gmail.com';
  navigator.clipboard.writeText(emailStr).then(() => {
    showToast('✅ Official email copied: ' + emailStr);
    const box = document.getElementById('email-card-box');
    const handle = document.getElementById('email-handle-text');
    const icon = document.getElementById('email-copy-icon');
    if (box && handle && icon) {
      const origBorder = box.style.borderColor;
      const origBg = box.style.background;
      const origHandleText = handle.textContent;
      const origIconHtml = icon.innerHTML;

      box.style.borderColor = '#00ffd5';
      box.style.background = 'rgba(0, 255, 213, 0.15)';
      box.style.boxShadow = '0 0 25px rgba(0, 255, 213, 0.4)';
      handle.textContent = '✅ Copied to clipboard!';
      handle.style.color = '#00ffd5';
      icon.innerHTML = '<i class="fa-solid fa-check" style="color: #00ffd5;"></i>';

      setTimeout(() => {
        box.style.borderColor = origBorder;
        box.style.background = origBg;
        box.style.boxShadow = '';
        handle.textContent = origHandleText;
        handle.style.color = '';
        icon.innerHTML = origIconHtml;
      }, 2500);
    }
  }).catch(() => {
    showToast('Failed to copy. Try manually: gamexogamerofficial@gmail.com');
  });
}

// Close modals when clicking outside modal box
window.addEventListener('click', (e) => {
  document.querySelectorAll('.modal-overlay.active').forEach(modal => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});
