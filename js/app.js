// ===== NOVE STORE =====
const APP = {
  ADMIN_EMAIL: 'cr8381062@gmail.com',
  STORE_NAME: 'Nove Store',
  STORE_LOGO: '',
  PAYPAL_CLIENT_ID: '', // optional placeholder
  lang: 'ar',
  currentUser: null,
  products: [],
  cart: [],
  orders: [],

  translations: {
    ar: {
      welcome: 'مرحباً',
      sign_in: 'تسجيل الدخول',
      sign_out: 'تسجيل الخروج',
      admin_panel: 'لوحة الإدارة',
      store: 'المتجر',
      admin_staff: 'إضافة مشرف',
      dashboard: 'لوحة المعلومات',
      products_manage: 'المنتجات',
      categories_manage: 'التصنيفات',
      orders_manage: 'الطلبات',
      users_manage: 'المستخدمون',
      settings_manage: 'الإعدادات',
      access_denied: 'الدخول مرفوض',
      access_denied_desc: 'أنت غير مخول بالدخول إلى لوحة الإدارة.',
      back_to_store: 'العودة إلى المتجر',
      browse: 'تصفح المنتجات',
      learn_more: 'اعرف المزيد',
      our_products: 'منتجاتنا',
      our_products_desc: 'سكربتات وبوتات احترافية لسيرفرات FiveM و Discord',
      all: 'الكل',
      add_to_cart: 'أضف إلى السلة',
      email_label: 'البريد الإلكتروني',
      password_label: 'كلمة المرور',
      name_label: 'الاسم الكامل',
      tab_login: 'تسجيل الدخول',
      tab_register: 'إنشاء حساب',
      fill_all_fields: 'يرجى ملء جميع الحقول',
      password_short: 'كلمة المرور قصيرة جداً',
      email_exists: 'البريد الإلكتروني موجود بالفعل',
      wrong_credentials: 'بيانات الدخول غير صحيحة',
      cart_empty: 'سلتك فارغة',
      checkout: 'إتمام الشراء',
      remove: 'حذف'
    },
    en: {
      welcome: 'Welcome',
      sign_in: 'Sign Out',
      sign_out: 'Sign Out',
      admin_panel: 'Admin Panel',
      store: 'Store',
      admin_staff: 'Add Admin',
      dashboard: 'Dashboard',
      products_manage: 'Products',
      categories_manage: 'Categories',
      orders_manage: 'Orders',
      users_manage: 'Users',
      settings_manage: 'Settings',
      access_denied: 'Access Denied',
      access_denied_desc: 'You are not authorized to access the admin panel.',
      back_to_store: 'Back to Store',
      browse: 'Browse Products',
      learn_more: 'Learn More',
      our_products: 'Our Products',
      our_products_desc: 'Professional scripts and bots for your FiveM and Discord servers',
      all: 'All',
      add_to_cart: 'Add to Cart',
      email_label: 'Email',
      password_label: 'Password',
      name_label: 'Full Name',
      tab_login: 'Login',
      tab_register: 'Register',
      fill_all_fields: 'Please fill all fields',
      password_short: 'Password is too short',
      email_exists: 'Email already exists',
      wrong_credentials: 'Invalid credentials',
      cart_empty: 'Your cart is empty',
      checkout: 'Checkout',
      remove: 'Remove'
    }
  },

  t(key) {
    return (this.translations[this.lang] && this.translations[this.lang][key]) ||
           (this.translations.en && this.translations.en[key]) || key;
  },

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('nove_lang', lang);
    this.applyStaticTranslations();
  },

  toggleLang() {
    this.setLang(this.lang === 'ar' ? 'en' : 'ar');
    const lt = document.getElementById('lang-toggle');
    if (lt) lt.textContent = this.lang === 'ar' ? 'EN' : 'ع';
    document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.lang;
  },

  applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  },

  // ===== DATA =====
  getDefaultProducts() {
    return [
      { id: 'p1', name: 'ESX Starter Pack', category: 'fivem', price: 15.00, desc: 'Complete ESX base scripts for a fresh FiveM server.', image: '' },
      { id: 'p2', name: 'QBCore Framework', category: 'fivem', price: 20.00, desc: 'Powerful QBCore framework with optimized resources.', image: '' },
      { id: 'p3', name: 'Advanced Discord Bot', category: 'discord', price: 25.00, desc: 'Full-featured Discord bot with moderation and economy.', image: '' },
      { id: 'p4', name: 'Admin Panel Plus', category: 'fivem', price: 12.00, desc: 'Enhanced admin panel with player management tools.', image: '' },
      { id: 'p5', name: 'Discord Ticket Bot', category: 'discord', price: 18.00, desc: 'Ticket system bot for Discord support channels.', image: '' }
    ];
  },

  loadData() {
    this.products = JSON.parse(localStorage.getItem('nove_products')) || this.getDefaultProducts();
    this.cart = JSON.parse(localStorage.getItem('nove_cart')) || [];
    this.orders = JSON.parse(localStorage.getItem('nove_orders')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('nove_user')) || null;
    this.lang = localStorage.getItem('nove_lang') || 'ar';
  },

  saveProducts() { localStorage.setItem('nove_products', JSON.stringify(this.products)); },
  saveCart() { localStorage.setItem('nove_cart', JSON.stringify(this.cart)); },
  saveOrders() { localStorage.setItem('nove_orders', JSON.stringify(this.orders)); },

  // ===== AUTH =====
  registerUser(user) {
    const users = JSON.parse(localStorage.getItem('nove_users')) || [];
    const existing = users.find(u => u.email === user.email);
    if (!existing) {
      user.joinedAt = new Date().toISOString();
      users.push(user);
      localStorage.setItem('nove_users', JSON.stringify(users));
    }
  },

  isAdmin() {
    return this.currentUser && this.currentUser.email === this.ADMIN_EMAIL;
  },

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'nove_store_salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async registerWithEmail(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    if (!name || !email || !password) { this.showToast(this.t('fill_all_fields'), 'error'); return; }
    if (password.length < 6) { this.showToast(this.t('password_short'), 'error'); return; }
    const users = JSON.parse(localStorage.getItem('nove_users')) || [];
    if (users.find(u => u.email === email)) { this.showToast(this.t('email_exists'), 'error'); return; }
    const hashed = await this.hashPassword(password);
    const user = { id: 'email_' + Date.now(), name, email, password: hashed, avatar: '', isAdmin: email === this.ADMIN_EMAIL, joinedAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem('nove_users', JSON.stringify(users));
    this.currentUser = { ...user };
    delete this.currentUser.password;
    localStorage.setItem('nove_user', JSON.stringify(this.currentUser));
    this.updateAuthUI();
    this.closeModal('auth-modal');
    this.showToast(this.t('welcome') + ', ' + name + '!', 'success');
  },

  async loginWithEmail(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    if (!email || !password) { this.showToast(this.t('fill_all_fields'), 'error'); return; }
    const users = JSON.parse(localStorage.getItem('nove_users')) || [];
    const hashed = await this.hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashed);
    if (!user) { this.showToast(this.t('wrong_credentials'), 'error'); return; }
    this.currentUser = { ...user };
    delete this.currentUser.password;
    localStorage.setItem('nove_user', JSON.stringify(this.currentUser));
    this.updateAuthUI();
    this.closeModal('auth-modal');
    this.showToast(this.t('welcome') + ', ' + user.name + '!', 'success');
  },

  showAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById('auth-login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('auth-register-form').style.display = tab === 'register' ? 'block' : 'none';
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('nove_user');
    this.updateAuthUI();
    const isAdminPage = window.location.pathname.includes('admin.html');
    window.location.href = isAdminPage ? '../index.html' : 'index.html';
  },

  updateAuthUI() {
    const authBtns = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    if (!authBtns || !userMenu) return;
    if (this.currentUser) {
      authBtns.style.display = 'none';
      userMenu.style.display = 'block';
      document.querySelector('.user-name').textContent = this.currentUser.name;
      document.querySelector('.user-email').textContent = this.currentUser.email;
      const av = document.querySelector('.user-avatar');
      av.src = this.currentUser.avatar || this.generateAvatar(this.currentUser.name[0] || 'U');
    } else {
      authBtns.style.display = 'block';
      userMenu.style.display = 'none';
    }
  },

  generateAvatar(letter) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' fill='#5865f2'/><text x='20' y='26' font-size='18' fill='#fff' text-anchor='middle' font-family='sans-serif' font-weight='bold'>${letter}</text></svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  },

  toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
  },

  // ===== CART =====
  addToCart(productId) {
    const p = this.products.find(x => x.id === productId);
    if (!p) return;
    const item = this.cart.find(i => i.id === productId);
    if (item) item.qty = (item.qty || 1) + 1;
    else this.cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
    this.saveCart();
    this.updateCartBadge();
    this.showToast(p.name + ' added to cart', 'success');
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
    this.saveCart();
    this.updateCartBadge();
    this.renderCart();
  },

  getCartTotal() {
    return this.cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0).toFixed(2);
  },

  updateCartBadge() {
    const b = document.querySelector('.cart-badge');
    const count = this.cart.reduce((s, i) => s + (i.qty || 1), 0);
    if (b) { b.textContent = count; b.classList.toggle('hidden', count === 0); }
    this.updateAddToCartButtons();
  },

  updateAddToCartButtons() {
    document.querySelectorAll('[data-add]').forEach(btn => {
      const id = btn.getAttribute('data-add');
      const item = this.cart.find(i => i.id === id);
      btn.textContent = item ? `${this.t('add_to_cart')} (${item.qty})` : this.t('add_to_cart');
    });
  },

  // ===== PRODUCTS RENDERING =====
  renderProducts(filter = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const items = filter === 'all' ? this.products : this.products.filter(p => p.category === filter);
    grid.innerHTML = items.map(p => `
      <div class="product-card">
        ${p.image ? `<img class="product-image" src="${p.image}" alt="${p.name}">` : `<div class="product-image placeholder">${p.name[0]}</div>`}
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-price">$${p.price.toFixed ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</div>
        <button class="btn-primary" onclick="APP.addToCart('${p.id}')">${this.t('add_to_cart')}</button>
      </div>`).join('');
  },

  filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    this.renderProducts(category);
  },

  // ===== MODALS =====
  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  openCart() {
    this.renderCart();
    document.getElementById('cart-modal').classList.add('active');
  },

  renderCart() {
    const body = document.querySelector('#cart-modal .modal-body');
    if (!body) return;
    if (this.cart.length === 0) {
      body.innerHTML = `<p style="text-align:center; padding:2rem;">${this.t('cart_empty')}</p>`;
      return;
    }
    body.innerHTML = `
      <h2>${this.t('checkout')}</h2>
      ${this.cart.map(i => `
        <div class="cart-item">
          <span>${i.name} x${i.qty}</span>
          <span>$${(i.price * i.qty).toFixed(2)}</span>
          <button onclick="APP.removeFromCart('${i.id}')">&#10005;</button>
        </div>`).join('')}
      <div class="cart-total"><strong>Total: $${this.getCartTotal()}</strong></div>
      <button class="btn-primary" onclick="APP.simulateCheckout()" style="width:100%; margin-top:1rem;">${this.t('checkout')}</button>
    `;
  },

  simulateCheckout() {
    if (!this.currentUser) {
      this.showToast('Please sign in first', 'error');
      return;
    }
    const order = {
      id: 'ord_' + Date.now(),
      userId: this.currentUser.id,
      email: this.currentUser.email,
      items: this.cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total: this.getCartTotal(),
      status: 'paid',
      date: new Date().toISOString()
    };
    this.orders.push(order);
    this.saveOrders();
    this.cart = [];
    this.saveCart();
    this.updateCartBadge();
    this.closeModal('cart-modal');
    this.showToast('Order placed successfully!', 'success');
  },

  showToast(message, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = message;
    t.className = 'toast ' + type;
    t.style.display = 'block';
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.style.display = 'none'; }, 2500);
  },

  // ===== ADMIN (rendered into #admin-content in admin.html) =====
  showAdminSection(section) {
    const content = document.getElementById('admin-content');
    if (!content) return;
    if (section === 'dashboard') return this.renderAdminDashboard(content);
    if (section === 'products') return this.renderAdminProducts(content);
    if (section === 'orders') return this.renderAdminOrders(content);
    if (section === 'users') return this.renderAdminUsers(content);
    if (section === 'admins') { content.innerHTML = `<h2>Add Admin</h2><p>Manage additional admins here.</p>`; return; }
    if (section === 'settings') return this.renderAdminSettings(content);
  },

  renderAdminDashboard(c) {
    const revenue = this.orders.reduce((s, o) => s + parseFloat(o.total), 0).toFixed(2);
    const users = JSON.parse(localStorage.getItem('nove_users')) || [];
    c.innerHTML = `
      <h2>${this.t('dashboard')}</h2>
      <div class="admin-stats">
        <div class="stat-card"><h3>$${revenue}</h3><p>Revenue</p></div>
        <div class="stat-card"><h3>${this.orders.length}</h3><p>Orders</p></div>
        <div class="stat-card"><h3>${users.length}</h3><p>Users</p></div>
        <div class="stat-card"><h3>${this.products.length}</h3><p>Products</p></div>
      </div>
      <h3 style="margin-top:1.5rem;">Recent Orders</h3>
      ${this.orders.slice().reverse().slice(0,5).map(o => `
        <div class="order-row">${o.email} - <strong>$${o.total}</strong> - ${new Date(o.date).toLocaleString()}</div>`).join('') || `<p>No orders yet</p>`}
    `;
  },

  renderAdminProducts(c) {
    c.innerHTML = `
      <h2>${this.t('products_manage')}</h2>
      <button class="btn-primary" onclick="APP.showAdminSection('products')">+ Add Product</button>
      ${this.products.map(p => `
        <div class="product-row">
          <span>${p.name}</span><span>$${Number(p.price).toFixed(2)}</span>
          <button onclick="APP.deleteProduct('${p.id}')">Delete</button>
        </div>`).join('')}
    `;
  },

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
    this.showAdminSection('products');
  },

  renderAdminOrders(c) {
    c.innerHTML = `<h2>${this.t('orders_manage')}</h2>` +
      (this.orders.length === 0 ? `<p>No orders</p>` : this.orders.map(o => `
        <div class="order-row">${o.email} - $${o.total} - ${o.status} - ${new Date(o.date).toLocaleString()}</div>`).join(''));
  },

  renderAdminUsers(c) {
    const users = JSON.parse(localStorage.getItem('nove_users')) || [];
    c.innerHTML = `<h2>${this.t('users_manage')}</h2>` +
      (users.length === 0 ? `<p>No users</p>` : users.map(u => `
        <div class="product-row"><span>${u.name}</span><span>${u.email}</span><span>${u.isAdmin ? '👑' : ''}</span></div>`).join(''));
  },

  renderAdminSettings(c) {
    const storeName = this.STORE_NAME;
    const paypal = this.PAYPAL_CLIENT_ID;
    c.innerHTML = `
      <h2>${this.t('settings_manage')}</h2>
      <div class="form-group"><label>Store Name</label><input id="setting-store-name" value="${storeName}"></div>
      <div class="form-group"><label>PayPal Client ID</label><input id="setting-paypal" value="${paypal}" placeholder="optional"></div>
      <button class="btn-primary" onclick="APP.saveAdminSettings()">Save</button>
    `;
  },

  saveAdminSettings() {
    this.STORE_NAME = document.getElementById('setting-store-name').value || 'Nove Store';
    this.PAYPAL_CLIENT_ID = document.getElementById('setting-paypal').value;
    localStorage.setItem('nove_settings', JSON.stringify({ storeName: this.STORE_NAME, paypal: this.PAYPAL_CLIENT_ID }));
    document.querySelectorAll('.nav-brand-text').forEach(el => { el.innerHTML = this.STORE_NAME.toUpperCase().replace(' ', '') + ' <span>STORE</span>'; });
    this.showToast('Settings saved', 'success');
  }
};