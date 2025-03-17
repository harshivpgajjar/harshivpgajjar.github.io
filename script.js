document.addEventListener('DOMContentLoaded', function() {
    // ===== Age Verification =====
    const ageVerification = document.getElementById('age-verification');
    const mainContent = document.getElementById('main-content');
    const verifyAgeBtn = document.getElementById('verifyAge');
    const rejectAgeBtn = document.getElementById('rejectAge');
    
    // Check if age was previously verified in this session
    if (sessionStorage.getItem('ageVerified') === 'true') {
        if (ageVerification) ageVerification.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
    }
    
    // Age verification buttons
    if (verifyAgeBtn) {
        verifyAgeBtn.addEventListener('click', function() {
            if (ageVerification) ageVerification.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            
            // Save in sessionStorage
            sessionStorage.setItem('ageVerified', 'true');
        });
    }
    
    if (rejectAgeBtn) {
        rejectAgeBtn.addEventListener('click', function() {
            // Redirect if under 19
            window.location.href = 'https://www.google.com';
        });
    }
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // ===== Cart Sidebar Toggle =====
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (cartSidebar) {
                cartSidebar.classList.add('active');
            }
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
            }
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(event.target) && 
            !cartIcon.contains(event.target)) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // ===== User Login/Register Modal =====
    const userIcon = document.getElementById('userIcon');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    if (userIcon && loginModal) {
        userIcon.addEventListener('click', function() {
            loginModal.style.display = 'flex';
        });
    }
    
    if (closeLoginModal && loginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (loginModal && event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // ===== Admin Login Redirect =====
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
    
    // ===== Cart Functionality =====
    
    // Load cart from localStorage
    let cartItemsArray = [];
    try {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            cartItemsArray = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        cartItemsArray = [];
    }
    
    // Initialize cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Get cart elements
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Add to Cart using event delegation for all pages
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.preventDefault();
            
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productCard = button.closest('.product-card') || button.closest('.deal-card');
            
            if (!productCard) return;
            
            const productTitle = productCard.querySelector('.product-title, .deal-title').textContent;
            const productPriceEl = productCard.querySelector('.product-price, .current-price');
            if (!productPriceEl) return;
            
            const productPrice = productPriceEl.textContent.replace('$', '');
            const productImgEl = productCard.querySelector('.product-img img, .deal-img img');
            if (!productImgEl) return;
            
            const productImg = productImgEl.getAttribute('src');
            
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
            try {
                localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
            } catch (e) {
                console.error('Error saving cart to localStorage:', e);
            }
            
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
            showToast('Item added to cart');
        }
    });
    
    // Success toast function
    function showToast(message) {
        const existingToast = document.querySelector('.success-toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        const successToast = document.createElement('div');
        successToast.className = 'success-toast';
        successToast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(successToast);
        
        // Add show class after a short delay for animation
        setTimeout(() => {
            successToast.classList.add('show');
            setTimeout(() => {
                successToast.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(successToast)) {
                        document.body.removeChild(successToast);
                    }
                }, 300);
            }, 2000);
        }, 100);
    }
    
    // Cart Display Update function
    function updateCartDisplay() {
        if (!cartItems) return;
        
        if (cartItemsArray.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty.</div>';
            if (cartTotal) cartTotal.textContent = '$0.00';
            if (checkoutBtn && checkoutBtn.classList) checkoutBtn.classList.add('disabled');
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
        if (checkoutBtn && checkoutBtn.classList) checkoutBtn.classList.remove('disabled');
        
        // Use event delegation for cart item actions
        applyCartEventListeners();
    }
    
    // Handle cart item interactions with event delegation
    function applyCartEventListeners() {
        if (!cartItems) return;
        
        cartItems.addEventListener('click', function(e) {
            // Minus button
            if (e.target.classList.contains('minus')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (cartItemsArray[index] && cartItemsArray[index].quantity > 1) {
                    cartItemsArray[index].quantity -= 1;
                    updateCart();
                }
            }
            
            // Plus button
            if (e.target.classList.contains('plus')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (cartItemsArray[index]) {
                    cartItemsArray[index].quantity += 1;
                    updateCart();
                }
            }
            
            // Remove button
            if (e.target.classList.contains('remove-item')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (cartItemsArray[index]) {
                    cartItemsArray.splice(index, 1);
                    updateCart();
                }
            }
        });
    }
    
    // Helper function to update cart state
    function updateCart() {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItemsArray));
        } catch (e) {
            console.error('Error saving cart to localStorage:', e);
        }
        
        updateCartDisplay();
        
        if (cartCount) {
            cartCount.textContent = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
        }
    }
    
    // Initial cart display update
    updateCartDisplay();
    
    // ===== Slick Slider Initialization =====
    if (typeof $.fn.slick !== 'undefined') {
        // Wait for DOM to be fully ready
        setTimeout(function() {
            try {
                $('.testimonial-slider').slick({
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    adaptiveHeight: true
                });
                
                // Additional sliders can be initialized here
                // Example:
                $('.featured-slider').slick({
                    dots: false,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            } catch (e) {
                console.error('Error initializing slick slider:', e);
            }
        }, 100);
    }
    
    // ===== Form Submit Handlers =====
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
    // ===== Product Tabs =====
    const tabLinks = document.querySelectorAll('.tab-link');
    if (tabLinks.length > 0) {
        tabLinks.forEach(tab => {
            tab.addEventListener('click', function() {
                tabLinks.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
});
