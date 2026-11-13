/* =====================================================
   Loop & Bloom - Cart Page Logic
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const emptyState = document.getElementById('empty-cart');
    
    if (!container) return;
    
    const cart = getCart();
    const products = getProducts();
    
    if (cart.length === 0) {
        container.innerHTML = '';
        if (summary) summary.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    if (summary) summary.style.display = 'block';
    
    let total = 0;
    
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        
        const itemTotal = product.price * item.qty;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-img">
                    ${product.image 
                        ? `<img src="${product.image}" alt="${product.name}">` 
                        : `<i class="fas fa-heart" style="font-size:28px;color:#FFB6C1;"></i>`
                    }
                </div>
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <div class="price">${formatPrice(product.price)} × ${item.qty}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${product.id}, ${item.qty - 1})">−</button>
                    <span style="font-weight:600;min-width:24px;text-align:center;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${product.id}, ${item.qty + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${product.id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    // Update summary
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = formatPrice(total);
    
    // Build Instagram message
    const orderText = buildOrderMessage(cart, products, total);
    const instaBtn = document.getElementById('instagram-order-btn');
    if (instaBtn) {
        // Opens Instagram profile - user can paste the order message
        instaBtn.href = 'https://www.instagram.com/loop_bloom.pk/';
        instaBtn.onclick = () => {
            // Copy order details to clipboard
            navigator.clipboard.writeText(orderText).then(() => {
                showToast('Order details copied! Paste in Instagram DM 💕');
            }).catch(() => {
                showToast('Opening Instagram... 💕');
            });
        };
    }
}

function changeQty(productId, newQty) {
    if (newQty < 1) {
        removeItem(productId);
        return;
    }
    updateQty(productId, newQty);
    renderCart();
}

function removeItem(productId) {
    removeFromCart(productId);
    renderCart();
    showToast('Removed from cart');
}

function buildOrderMessage(cart, products, total) {
    let message = 'Hi Loop & Bloom! 💕\n\nI would like to order:\n\n';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            message += `• ${product.name} × ${item.qty} — ${formatPrice(product.price * item.qty)}\n`;
        }
    });
    
    message += `\nTotal: ${formatPrice(total)}\n\nPlease let me know the next steps. Thank you!`;
    return message;
}
