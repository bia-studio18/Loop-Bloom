/* =====================================================
   Loop & Bloom - Main JavaScript
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Update cart count on load
    updateCartCount();
    
    // Render products if on a page that needs them
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        renderProducts(productsGrid);
    }
    
    // Featured products on homepage
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
        renderProducts(featuredGrid, 4);
    }
});

function renderProducts(container, limit = null) {
    let products = getProducts();
    
    if (limit) {
        products = products.slice(0, limit);
    }
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#8B7E78;">No products yet. Add some from Admin!</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-heart placeholder-icon\\'></i>'">` 
                    : `<i class="fas fa-heart placeholder-icon"></i>`
                }
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3>${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i> Add
                    </button>
                    <a href="product.html?id=${product.id}" class="btn btn-outline btn-sm">
                        View
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}
