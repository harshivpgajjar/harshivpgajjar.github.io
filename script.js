document.addEventListener('DOMContentLoaded', function() {
    // Age Verification
    const ageVerification = document.getElementById('age-verification');
    const mainContent = document.getElementById('main-content');
    const verifyAgeBtn = document.getElementById('verifyAge');
    const rejectAgeBtn = document.getElementById('rejectAge');
    
    // Check if age was previously verified
    if (localStorage.getItem('ageVerified') === 'true') {
        ageVerification.style.display = 'none';
        mainContent.style.display = 'block';
    }
    
    // Age verification buttons
    if (verifyAgeBtn) {
        verifyAgeBtn.addEventListener('click', function() {
            ageVerification.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Save in localStorage
            try {
                localStorage.setItem('ageVerified', 'true');
            } catch (e) {
                console.error("localStorage is not available:", e);
            }
        });
    }
    
    if (rejectAgeBtn) {
        rejectAgeBtn.addEventListener('click', function() {
            // Redirect if under 19
            window.location.href = 'https://www.google.com';
        });
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Cart Sidebar Toggle
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (cartIcon && cartSidebar && closeCart) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
        });
        
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
        
        // Close cart when clicking outside
        document.addEventListener('click', function(event) {
            if (cartSidebar.classList.contains('active') && 
                !cartSidebar.contains(event.target) && 
                !cartIcon.contains(event.target)) {
                cartSidebar.classList.remove('active');
            }
        });
    }
    
    // User Login/Register Modal
    const userIcon = document.getElementById('userIcon');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    if (userIcon && loginModal && closeLoginModal) {
        userIcon.addEventListener('click', function() {
            loginModal.style.display = 'flex';
        });
        
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    // Admin Login Redirect
    const showAdminLogin = document.getElementById('showAdminLogin');
    if (showAdminLogin) {
        showAdminLogin.addEventListener('click', function(e) {
            e.preventDefault();
            
            const username = prompt('Enter admin username:');
            const password = prompt('Enter admin password:');
            
            // Simple admin authentication (in real app, this would be server-side)
            if (username === 'admin' && password === 'admin123') {
                window.location.href = 'admin.html';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }
    
    // Cart Functionality - This is a simplified version
    // In a real application, this would be more complex and include server interactions
    
    let cartItemsArray = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Initialize cart count
    if (cartCount) {
        cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card') || this.closest('.deal-card');
                if (!productCard) return;
                
                const productTitle = productCard.querySelector('.product-title, .deal-title').textContent;
                const productPrice = productCard.querySelector('.product-price, .current-price').textContent.replace('$', '');
                const productImg = productCard.querySelector('.product-img img, .deal-img img').getAttribute('src');
                
                // Check if product already in cart
                const existingItemIndex = cartItemsArray.findIndex(item => item.title === productTitle);
                
                if (existingItemIndex !== -1) {
                    cartItemsArray[existingItemIndex].quantity += 1;
                } else {
                    cartItemsArray.push({
                        title: productTitle,
                        price: parseFloat(productPrice),
                        img: productImg,
                        quantity: 1
                    });
                }
                
                // Update localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
                
                // Update cart count
                if (cartCount) {
                    cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
                }
                
                // Update cart items display
                updateCartDisplay();
                
                // Show cart sidebar
                if (cartSidebar) {
                    cartSidebar.classList.add('active');
                }
                
                // Show success message
                const successToast = document.createElement('div');
                successToast.className = 'success-toast';
                successToast.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Item added to cart</span>
                `;
                document.body.appendChild(successToast);
                
                setTimeout(() => {
                    successToast.classList.add('show');
                    setTimeout(() => {
                        successToast.classList.remove('show');
                        setTimeout(() => {
                            document.body.removeChild(successToast);
                        }, 300);
                    }, 2000);
                }, 100);
            });
        });
    }
    
    // Cart Display Update
    function updateCartDisplay() {
        if (!cartItems) return;
        
        if (cartItemsArray.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty.</div>';
            if (cartTotal) cartTotal.textContent = '$0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cartItemsArray.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.title}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn minus" data-index="${index}">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" readonly>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            
            cartItems.innerHTML += cartItemHTML;
        });
        
        if (cartTotal) cartTotal.textContent = '$' + total.toFixed(2);
        
        // Add event listeners for quantity buttons and remove buttons
        const minusButtons = cartItems.querySelectorAll('.minus');
        const plusButtons = cartItems.querySelectorAll('.plus');
        const removeButtons = cartItems.querySelectorAll('.remove-item');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cartItemsArray[index].quantity > 1) {
                    cartItemsArray[index].quantity -= 1;
                    localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
                    updateCartDisplay();
                    cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cartItemsArray[index].quantity += 1;
                localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
                updateCartDisplay();
                cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cartItemsArray.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
                updateCartDisplay();
                cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
            });
        });
    }
    
    // Initial cart display update
    updateCartDisplay();
    
    // Initialize any sliders or carousels
    if (typeof $.fn.slick !== 'undefined') {
        $('.testimonial-slider').slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true
        });
    }
    
    // "View More" buttons functionality
    const viewMoreButtons = document.querySelectorAll('.view-more');
    if (viewMoreButtons.length > 0) {
        viewMoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                // In a real application, this would load more products
                // For this demo, we'll just show a message
                alert('In a real application, this would load more products.');
            });
        });
    }
    
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // In a real application, this would filter products
                // For this demo, we'll just show a message
                alert('In a real application, this would filter products based on the selected criteria.');
            });
        });
    }
    
    // Form submission handling
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (form.id === 'contactForm') {
                    e.preventDefault();
                    alert('Thank you for your message! We will get back to you shortly.');
                    form.reset();
                } else if (form.id === 'loginForm') {
                    e.preventDefault();
                    alert('This is a demo. Login functionality would be implemented in a real application.');
                }
            });
        });
    }

    // Product Tabs (if on product detail page)
    const tabLinks = document.querySelectorAll('.tab-link');
    if (tabLinks.length > 0) {
        tabLinks.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabLinks.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show selected tab content
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Product thumbnails (if on product detail page)
    const productThumbnails = document.querySelectorAll('.product-thumbnail');
    if (productThumbnails.length > 0) {
        productThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                document.querySelector('.product-main-image img').setAttribute('src', imgSrc);
                
                // Update active thumbnail
                productThumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Quantity selector (if on product detail page)
    const quantityPlus = document.querySelector('.product-detail .quantity-btn.plus');
    const quantityMinus = document.querySelector('.product-detail .quantity-btn.minus');
    const quantityInput = document.querySelector('.product-detail .quantity-input');
    
    if (quantityPlus && quantityMinus && quantityInput) {
        quantityPlus.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            quantity++;
            quantityInput.value = quantity;
        });
        
        quantityMinus.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
            }
        });
    }
});