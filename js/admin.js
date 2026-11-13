/* =====================================================
   Loop & Bloom - Admin Panel Logic
   (with Gallery Image Uploader)
===================================================== */

const ADMIN_PASSWORD = 'loopbloom123';  // Change this password if you want

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('loopbloom_admin') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        showLogin();
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem('loopbloom_admin', 'true');
                showAdminPanel();
            } else {
                alert('Wrong password! Try again.');
            }
        });
    }
    
    // Product form
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // Image file uploader
    const fileInput = document.getElementById('product-image-file');
    if (fileInput) {
        fileInput.addEventListener('change', handleImageUpload);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('loopbloom_admin');
            location.reload();
        });
    }
});

function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-section').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    renderAdminProducts();
}

// Convert selected image to Base64
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 1.5MB to avoid localStorage issues)
    if (file.size > 1.5 * 1024 * 1024) {
        alert('Image is too large! Please choose an image smaller than 1.5MB.\nTip: Take a photo or compress it first.');
        e.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64 = event.target.result;
        
        // Save to hidden input
        document.getElementById('product-image').value = base64;
        
        // Show preview
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        previewImg.src = base64;
        preview.style.display = 'flex';
        
        showToast('Image selected! 💕');
    };
    reader.readAsDataURL(file);
}

function renderAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;
    
    const products = getProducts();
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#8B7E78;padding:40px;">No products yet. Add your first product above!</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="admin-product-row">
            <div style="width:60px;height:60px;border-radius:10px;background:#FFE0CC;overflow:hidden;flex-shrink:0;">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">` 
                    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><i class="fas fa-heart" style="color:#FFB6C1;"></i></div>`
                }
            </div>
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <span>${product.category} • ${formatPrice(product.price)}</span>
            </div>
            <div class="admin-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function saveProduct() {
    const idInput = document.getElementById('product-id');
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const price = parseInt(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const badge = document.getElementById('product-badge').value.trim();
    
    if (!name || !price) {
        alert('Please fill in name and price.');
        return;
    }
    
    let products = getProducts();
    const editId = idInput.value ? parseInt(idInput.value) : null;
    
    if (editId) {
        // Update existing
        products = products.map(p => {
            if (p.id === editId) {
                return { ...p, name, category, price, image, description, badge };
            }
            return p;
        });
        showToast('Product updated! 💕');
    } else {
        // Add new
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category,
            price,
            image,
            description,
            badge
        });
        showToast('Product added! 💕');
    }
    
    saveProducts(products);
    renderAdminProducts();
    resetForm();
}

function editProduct(id) {
    const product = getProductById(id);
    if (!product) return;
    
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-badge').value = product.badge || '';
    
    // Show image preview if exists
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    if (product.image) {
        previewImg.src = product.image;
        preview.style.display = 'flex';
    } else {
        preview.style.display = 'none';
    }
    
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Product';
    
    // Scroll to form
    document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderAdminProducts();
    showToast('Product deleted');
}

function resetForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('product-form').reset();
    document.getElementById('product-image').value = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('submit-btn').innerHTML = '<i class="fas fa-plus"></i> Add Product';
}
