/* =====================================================
   Loop & Bloom - Products Data & Storage
===================================================== */

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Blush Satin Scrunchie",
        category: "Scrunchies",
        price: 350,
        image: "https://images.unsplash.com/photo-1621786033365-6c4c2c2c2c2c?w=400&h=400&fit=crop",
        description: "Soft satin scrunchie in beautiful blush pink. Gentle on hair and perfect for everyday wear.",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Peach Dream Scrunchie",
        category: "Scrunchies",
        price: 320,
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop",
        description: "Cute peach-colored scrunchie made with love. Soft fabric that doesn't pull your hair.",
        badge: ""
    },
    {
        id: 3,
        name: "Cherry Blossom Bracelet",
        category: "Bracelets",
        price: 450,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
        description: "Handmade beaded bracelet with soft pink and peach tones. Adjustable size.",
        badge: "New"
    },
    {
        id: 4,
        name: "Pearl Charm Bracelet",
        category: "Bracelets",
        price: 550,
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
        description: "Elegant bracelet with faux pearls and pink accents. Perfect gift for her.",
        badge: ""
    },
    {
        id: 5,
        name: "Mini Bloom Bag",
        category: "Mini Bags",
        price: 1200,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
        description: "Adorable mini bag in soft pink. Perfect for carrying your essentials in style.",
        badge: "Popular"
    },
    {
        id: 6,
        name: "Peachy Pouch",
        category: "Mini Bags",
        price: 890,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop",
        description: "Cute peach-toned mini pouch. Handmade with care for everyday use.",
        badge: ""
    },
    {
        id: 7,
        name: "Rose Gold Scrunchie Set",
        category: "Scrunchies",
        price: 650,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
        description: "Set of 3 beautiful scrunchies in rose gold and pink shades.",
        badge: "Set"
    },
    {
        id: 8,
        name: "Floral Bead Bracelet",
        category: "Bracelets",
        price: 480,
        image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop",
        description: "Delicate floral bead bracelet with peach and pink beads. Handmade.",
        badge: "New"
    }
];

// Get products from localStorage or use defaults
function getProducts() {
    const stored = localStorage.getItem('loopbloom_products');
    if (stored) {
        return JSON.parse(stored);
    }
    // First time - save defaults
    localStorage.setItem('loopbloom_products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('loopbloom_products', JSON.stringify(products));
}

// Get single product by ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === parseInt(id));
}

// Cart functions
function getCart() {
    const cart = localStorage.getItem('loopbloom_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('loopbloom_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    
    saveCart(cart);
    showToast('Added to cart! 💕');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty = Math.max(1, qty);
        saveCart(cart);
    }
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartCount() {
    const countEls = document.querySelectorAll('.cart-count');
    const count = getCartCount();
    countEls.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF6B9D;
        color: white;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 8px 25px rgba(255, 107, 157, 0.35);
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

// Format price in PKR
function formatPrice(price) {
    return 'Rs. ' + price.toLocaleString('en-PK');
}
