/* --- CORE PRODUCT DATA DATABASE ARRAYS --- */
const PRODUCTS = [
    { id: 1, title: "Espresso Macchiato", category: "Coffee", price: 5.95, featured: true, rating: 4.9, img: "src/espresso-macchiato.jpg", desc: "Our rich espresso marked with dollop of steamed milk and foam. A European-style classic." },
    { id: 2, title: "Chocolate Cream Frappuccino", category: "Frappuccino", price: 5.45, featured: true, rating: 4.8, img: "src/chocolate-cream.jpg", desc: "A rich and creamy blend of chocolate flavoured sauce, milk and ice. Topped with whipped cream." },
    { id: 3, title: "Full Leaf Brewed Tea", category: "Tea", price: 4.95, featured: true, rating: 4.7, img: "src/brewed-tea.jpg", desc: "Enjoy a new tea experience in our stores or in the comfort of their own home through a curated selection of packaged full leaf tea sachets." },
    { id: 4, title: "Hot Brewed Coffee", category: "Coffee", price: 4.65, featured: false, rating: 4.6, img: "src/brewed-coffee.jpg", desc: "Swing by and warm up while enjoying any of our three roasts brewed daily." },
    { id: 5, title: "Iced Green Tea Lemonade", category: "Tea", price: 4.25, featured: false, rating: 4.5, img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=300", desc: "Premium green tea blended systematically with refreshing lemonade and ice shaken together to lock in crisp natural flavors." },
    { id: 6, title: "French Butter Croissant", category: "Bakery", price: 3.75, featured: false, rating: 4.8, img: "src/french-butter.jpeg", desc: "This croissant is pure pleasure. A beautiful golden color, crisp, moist and buttery, meltingly smooth, with a final note of caramel. It is made with 100% pure butter." }
];

const STORES = [
    { id: 1, name: "Downtown Metropolis Hub", distance: 1.2, address: "742 Evergreen Terrace, Core City", hours: "5:00 AM - 10:00 PM" },
    { id: 2, name: "Financial District Commons", distance: 4.5, address: "101 Wall Boulevard Avenue, Exchange Tower", hours: "6:00 AM - 8:00 PM" },
    { id: 3, name: "Suburban Retail Oasis", distance: 6.1, address: "99 Green Ridge Lane, Galleria Plaza", hours: "5:30 AM - 9:00 PM" }
];

/* --- STATE APPLICATION ENGINE VARIABLES --- */
let cart = JSON.parse(localStorage.getItem('sb_cart_system')) || [];
let activeCategory = 'all';

// Initialize Web Application Environment Lifecycle
window.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
    renderMenuProducts();
    renderStoreLocations();
    updateCartBadges();
    calculateStars();
    setupExitIntentTracking();
});

/* --- SPA INTERNALS ROUTER PLATFORM --- */
function navigateTo(pageId, event) {
    if(event) event.preventDefault();
    
    if(pageId === 'cart') renderCartPage();
    
    // Toggle view visibility flags
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    const targetPage = document.getElementById(`page-${pageId}`);
    if(targetPage) targetPage.classList.add('active-page');

    // Set link visibility highlighting state loops
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if(link.textContent.toLowerCase() === pageId) link.classList.add('active');
        if(pageId === 'home' && link.textContent.toLowerCase() === 'home') link.classList.add('active');
    });

    // Collapse Mobile Navigation if active
    document.getElementById('navMenu').classList.remove('mobile-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('mobile-open');
}

/* --- DARK / LIGHT THEMING CORE ENGINE --- */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const icon = document.getElementById('themeIcon');
    
    if(currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        icon.className = 'fa-solid fa-moon';
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fa-solid fa-sun';
    }
}

/* --- PRODUCTS UI CONTENT COMPILERS --- */
function createProductCardMarkup(item) {
    return `
        <div class="product-card">
            <span class="product-category">${item.category}</span>
            <img src="${item.img}" alt="${item.title}" loading="lazy">
            <h3 class="product-title">${item.title}</h3>
            <div class="stars">
                ${Array(Math.floor(item.rating)).fill('<i class="fa-solid fa-star"></i>').join('')}
                ${item.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                <span style="font-size:0.8rem; color:var(--sb-muted)">(${item.rating})</span>
            </div>
            <p class="product-price">$${item.price.toFixed(2)}</p>
            <div class="card-actions">
                <button class="btn btn-secondary" onclick="openQuickView(${item.id})">Quick View</button>
                <button class="btn btn-primary" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus"></i> Add</button>
            </div>
        </div>
    `;
}

function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if(grid) grid.innerHTML = PRODUCTS.filter(p => p.featured).map(createProductCardMarkup).join('');
}

function renderMenuProducts() {
    const grid = document.getElementById('menuProductsGrid');
    if(!grid) return;
    
    let workingSet = PRODUCTS;
    if(activeCategory !== 'all') {
        workingSet = workingSet.filter(p => p.category === activeCategory);
    }
    grid.innerHTML = workingSet.map(createProductCardMarkup).join('');
}

/* --- FILTERING & PATTERN SEARCH CONTROLLERS --- */
function filterCategory(cat, btnElement) {
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    renderMenuProducts();
}

function filterMenu() {
    const query = document.getElementById('menuSearch').value.toLowerCase();
    const grid = document.getElementById('menuProductsGrid');
    
    let filtered = PRODUCTS.filter(p => {
        const matchesCategory = (activeCategory === 'all' || p.category === activeCategory);
        const matchesQuery = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });
    
    if(filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--sb-muted)">No items matches your search specifications.</div>`;
    } else {
        grid.innerHTML = filtered.map(createProductCardMarkup).join('');
    }
}

/* --- STORE LOCATOR CONTROLS --- */
function renderStoreLocations(filteredSet = STORES) {
    const container = document.getElementById('storeListContainer');
    if(!container) return;
    
    if(filteredSet.length === 0) {
        container.innerHTML = `<p style="color:var(--sb-muted)">No stores located within specified metrics bounds.</p>`;
        return;
    }
    container.innerHTML = filteredSet.map(store => `
        <div class="store-card" id="store-card-${store.id}" onclick="selectStore(${store.id}, '${store.name}')">
            <h3 style="font-size:1.1rem; margin-bottom:4px;"><i class="fa-solid fa-shop" style="color:var(--sb-green)"></i> ${store.name}</h3>
            <p style="font-size:0.9rem; color:var(--sb-muted)">${store.address}</p>
            <p style="font-size:0.85rem; font-weight:700; margin-top:4px;">${store.hours} • ${store.distance} miles away</p>
        </div>
    `).join('');
}

function filterStores() {
    const val = document.getElementById('storeDistanceFilter').value;
    if(val === 'all') {
        renderStoreLocations(STORES);
    } else {
        const maxDist = parseFloat(val);
        renderStoreLocations(STORES.filter(s => s.distance <= maxDist));
    }
}

function selectStore(id, name) {
    document.querySelectorAll('.store-card').forEach(c => c.classList.remove('active'));
    const targetCard = document.getElementById(`store-card-${id}`);
    if(targetCard) targetCard.classList.add('active');
    document.getElementById('mapStatusText').textContent = `Tracking live routing telemetry for: ${name}`;
}

/* --- REWARDS CALCULATOR CALCULATIONS --- */
function calculateStars() {
    const spendField = document.getElementById('calcSpend');
    const paymentField = document.getElementById('calcPayment');
    const resultField = document.getElementById('starsResult');
    const milestoneField = document.getElementById('rewardsMilestoneText');
    
    if(!spendField || !paymentField) return;

    const spend = parseFloat(spendField.value) || 0;
    const multiplier = parseInt(paymentField.value);
    const totalStars = spend * multiplier;
    
    if(resultField) resultField.textContent = `${totalStars} Stars`;
    
    let milestoneMsg = "Keep going to unlock premium items!";
    if(totalStars >= 200) milestoneMsg = "🎉 Level reached! You can unlock a handcrafted signature drink or warm breakfast sandwich!";
    else if(totalStars >= 100) milestoneMsg = "☕ High level reached! You can unlock free brewed hot coffee or structural bakery goodies!";
    else if(totalStars >= 25) milestoneMsg = "✨ Unlock customization: Add extra espresso shots or syrup pumps on the house!";
    
    if(milestoneField) milestoneField.textContent = milestoneMsg;
}

/* --- CORE CART & LOCAL STORAGE OPERATIONAL LOOPS --- */
function addToCart(id) {
    const item = PRODUCTS.find(p => p.id === id);
    const position = cart.findIndex(c => c.id === id);
    
    if(position > -1) {
        cart[position].quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    commitCartState();
    showGlobalNotification(`Added ${item.title} to Order Base`);
}

function changeQty(id, delta) {
    const idx = cart.findIndex(c => c.id === id);
    if(idx === -1) return;
    
    cart[idx].quantity += delta;
    if(cart[idx].quantity <= 0) {
        cart.splice(idx, 1);
    }
    
    commitCartState();
    renderCartPage();
}

function commitCartState() {
    localStorage.setItem('sb_cart_system', JSON.stringify(cart));
    updateCartBadges();
}

function updateCartBadges() {
    const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const badge = document.getElementById('cartBadgeCount');
    if(badge) badge.textContent = totalItems;
}

function renderCartPage() {
    const container = document.getElementById('cartItemsContainer');
    if(!container) return;

    if(cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <i class="fa-solid fa-basket-shopping" style="font-size:3.5rem; color:var(--sb-muted); margin-bottom:12px;"></i>
                <p style="color:var(--sb-muted)">Your order basket is currently completely vacant.</p>
                <button class="btn btn-primary" style="margin-top:16px;" onclick="navigateTo('menu')">Browse Products Menu</button>
            </div>
        `;
        updateSummaryData(0);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.title}">
            <div class="cart-item-details">
                <h4 style="margin-bottom:4px;">${item.title}</h4>
                <p style="color:var(--sb-green); font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span style="font-weight:700; font-size:1.1rem; width:20px; text-align:center;">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    updateSummaryData(subtotal);
}

function updateSummaryData(subtotal) {
    const tax = subtotal * 0.0875; 
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('summarySubtotal');
    const taxEl = document.getElementById('summaryTax');
    const totalEl = document.getElementById('summaryTotal');

    if(subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if(taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if(totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function simulateCheckout() {
    if(cart.length === 0) {
        alert("Cannot complete transaction checkout cycle on empty basket.");
        return;
    }
    alert("🚀 Routing Order to Kitchen Simulation System! Processing token balances via Stripe simulation sandbox infrastructure. Order securely logged!");
    cart = [];
    commitCartState();
    navigateTo('home');
}

/* --- MODALS & QUICK VIEW IMPLEMENTATION --- */
function openQuickView(id) {
    const p = PRODUCTS.find(prod => prod.id === id);
    const target = document.getElementById('modalContent');
    
    if(!target) return;

    target.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:30px; align-items:center;">
            <div>
                <img src="${p.img}" alt="${p.title}" style="max-height:280px; width:100%; object-fit:contain;">
            </div>
            <div>
                <span class="product-category">${p.category}</span>
                <h2 style="text-align:left; margin-bottom:12px; margin-top:4px;">${p.title}</h2>
                <p style="font-size:1.25rem; font-weight:700; color:var(--sb-green); margin-bottom:16px;">$${p.price.toFixed(2)}</p>
                <p style="color:var(--sb-dark); margin-bottom:24px; font-size:0.95rem;">${p.desc}</p>
                <button class="btn btn-primary" style="width:100%;" onclick="addToCart(${p.id}); closeModal();">Add Product to Basket System</button>
            </div>
        </div>
    `;
    document.getElementById('quickViewModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('quickViewModal').style.display = 'none';
}

/* --- FORM VALIDATIONS & HANDLERS --- */
function handleNewsletterSubmit(e, isPopup) {
    e.preventDefault();
    alert("✨ Subscription secure! Your premium promo token voucher has been generated and queued inside your mail framework delivery pipes.");
    if(isPopup) closeExitPopup();
}

function handleRewardsSubmit(e) {
    e.preventDefault();
    alert("🎉 Profile verified! Welcome to Starbucks Rewards System ecosystem. 100 registration bonus stars credited automatically.");
    document.getElementById('rewardsSignUpForm').reset();
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert("📬 Support transmission completed successfully. An expert optimization customer relations manager has been assigned to your ticket.");
    document.getElementById('contactForm').reset();
}

/* --- EXIT INTENT OPTIMIZATION TRIGGERS --- */
function setupExitIntentTracking() {
    let triggered = false;
    document.addEventListener('mouseleave', (e) => {
        if(e.clientY < 20 && !triggered) {
            triggered = true;
            const popup = document.getElementById('exitIntentPopup');
            if(popup) popup.style.display = 'flex';
        }
    });
}

function closeExitPopup() {
    document.getElementById('exitIntentPopup').style.display = 'none';
}

// Notification UI System Utility Helper
function showGlobalNotification(msg) {
    const snack = document.createElement('div');
    snack.style.position = 'fixed';
    snack.style.bottom = '30px';
    snack.style.right = '30px';
    snack.style.backgroundColor = 'var(--sb-dark-green)';
    snack.style.color = 'white';
    snack.style.padding = '14px 24px';
    snack.style.borderRadius = '8px';
    snack.style.zIndex = '9999';
    snack.style.boxShadow = 'var(--shadow-lg)';
    snack.style.fontWeight = 'bold';
    snack.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--sb-accent); margin-right:8px;"></i> ${msg}`;
    
    document.body.appendChild(snack);
    setTimeout(() => snack.remove(), 3500);
}