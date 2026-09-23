
document.addEventListener('DOMContentLoaded', function() {

    const CART_STORAGE_KEY = 'mrCoffeeCart';


    let cart = [];
    let currentProductForAddons = null; 


    const currentYearSpan = document.getElementById('currentYear');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartIconCountElement = document.getElementById('cartIconCount');


    const appDownloadModal = document.getElementById('appDownloadModal');
    const closeModalButton = document.getElementById('closeModalButton'); 
    const customAlertModal = document.getElementById('customAlertModal');
    const customAlertCloseButton = document.getElementById('customAlertCloseButton');
    const customAlertTitle = document.getElementById('customAlertTitle');
    const customAlertMessage = document.getElementById('customAlertMessage');


    const menuList = document.getElementById('menu-list');
    const menuFilterButtons = document.querySelectorAll('.menu-filter-button');


    const addonSelectionModal = document.getElementById('addonSelectionModal');
    const closeAddonModalButton = document.getElementById('closeAddonModalButton');
    const addonModalTitle = document.getElementById('addonModalTitle');
    const addonProductName = document.getElementById('addonProductName');
    const addonProductPrice = document.getElementById('addonProductPrice');
    const addonOptionsContainer = document.getElementById('addonOptionsContainer');
    const currentAddonItemTotal = document.getElementById('currentAddonItemTotal');
    const confirmAddonsButton = document.getElementById('confirmAddonsButton');


    const orderForm = document.getElementById('orderForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const formSuccessMessageDiv = document.getElementById('formSuccessMessage');
    const cartItemsListContainer = document.getElementById('cartItemsListContainer');
    const cartSubtotalDisplay = document.getElementById('cartSubtotalDisplay');



    const products = [
        { id: 1, name: "Classic Espresso", category: "espresso", price: "2.50", description: "A single shot of rich, intense espresso.", image: "img/espresso.jpeg", possibleAddons: [{name: "Extra Shot", price: 1.00}, {name: "Soy Milk", price: 0.75}, {name: "Whipped Cream", price: 0.50}] },
        { id: 2, name: "Doppio", category: "espresso", price: "3.00", description: "A double shot of our signature espresso.", image: "img/doppio.webp", possibleAddons: [{name: "Extra Shot", price: 1.00}, {name: "Almond Milk", price: 0.75}] },
        { id: 3, name: "Americano", category: "espresso", price: "3.25", description: "Espresso shots topped with hot water.", image: "img/americano.jpg", possibleAddons: [{name: "Sugar Free Syrup", price: 0.50}] },
        { id: 4, name: "Caramel Frappe", category: "frappe", price: "4.75", description: "Blended coffee with caramel and whipped cream.", image: "img/caramel-frappe.jpg", possibleAddons: [{name: "Extra Caramel Drizzle", price: 0.50}, {name: "Extra Whipped Cream", price: 0.50}] },
        { id: 5, name: "Mocha Frappe", category: "frappe", price: "4.95", description: "Rich chocolate and coffee, blended with ice.", image: "img/mocha-frappe.jpg", possibleAddons: [{name: "Chocolate Shavings", price: 0.50}] },
        { id: 6, name: "Vanilla Bean Frappe", category: "frappe", price: "4.50", description: "Creamy vanilla blended to perfection.", image: "img/vanilla-frappe.jpg", possibleAddons: [] },
        { id: 7, name: "Pour Over", category: "brewed", price: "3.50", description: "Manually brewed for a clean, bright cup.", image: "img/pour-over.jpeg", possibleAddons: [] },
        { id: 8, name: "Cold Brew", category: "brewed", price: "4.00", description: "Smooth, low-acid coffee steeped for hours.", image: "img/cold-brew.jpg", possibleAddons: [{name: "Cold Foam", price: 1.00}] },
        { id: 9, name: "French Press", category: "brewed", price: "3.75", description: "Full-bodied coffee with rich flavor.", image: "img/french-press.webp", possibleAddons: [] },
        { id: 10, name: "Croissant", category: "bread", price: "2.75", description: "Buttery, flaky, and freshly baked.", image: "img/croissant.jpg", possibleAddons: [{name: "Jam", price: 0.50}, {name: "Butter", price: 0.25}] },
        { id: 11, name: "Banana Bread", category: "bread", price: "3.00", description: "Moist and delicious, a perfect treat.", image: "img/banana-bread.jpg", possibleAddons: [] },
        { id: 12, name: "Blueberry Muffin", category: "bread", price: "2.95", description: "Packed with juicy blueberries.", image: "img/blueberry-muffin.jpg", possibleAddons: [] },
        { id: 13, name: "Earl Grey Tea", category: "tea", price: "2.50", description: "Classic black tea with bergamot.", image: "img/earl-grey-tea.jpg", possibleAddons: [{name: "Honey", price: 0.50}, {name: "Lemon Slice", price: 0.25}] },
        { id: 14, name: "Green Tea", category: "tea", price: "2.50", description: "Refreshing and healthy green tea.", image: "img/green-tea.jpg", possibleAddons: [] },
        { id: 15, name: "Chamomile Tea", category: "tea", price: "2.75", description: "Soothing and calming herbal tea.", image: "img/chamomile-tea.jpg", possibleAddons: [] }
    ];


    function loadCart() {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
        updateCartIconCount();
        if (cartItemsListContainer) { 
            displayCartOnOrderPage();
        }
    }

    function saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartIconCount();
        if (cartItemsListContainer) {
            displayCartOnOrderPage();
        }
    }

    function updateCartIconCount() {
        if (cartIconCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartIconCountElement.textContent = totalItems;
            cartIconCountElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    }


    function openAddonSelectionModal(product) {
        currentProductForAddons = product;
        addonProductName.textContent = product.name;
        addonProductPrice.textContent = `Base Price: $${parseFloat(product.price).toFixed(2)}`;
        addonOptionsContainer.innerHTML = ''; 

        if (product.possibleAddons && product.possibleAddons.length > 0) {
            product.possibleAddons.forEach(addon => {
                const checkboxHtml = `
                    <label>
                        <input type="checkbox" name="itemAddon" value="${addon.name}" data-price="${addon.price.toFixed(2)}" class="item-addon-checkbox">
                        <span>${addon.name} (+$${addon.price.toFixed(2)})</span>
                    </label>
                `;
                addonOptionsContainer.insertAdjacentHTML('beforeend', checkboxHtml);
            });

            addonOptionsContainer.querySelectorAll('.item-addon-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', calculateCurrentItemAddonTotal);
            });
        } else {
            addonOptionsContainer.innerHTML = '<p class="no-addons-message">No specific add-ons available for this item.</p>';
        }

        calculateCurrentItemAddonTotal(); 
        showModal(addonSelectionModal);
    }


    function calculateCurrentItemAddonTotal() {
        if (!currentProductForAddons) return;

        let itemBasePrice = parseFloat(currentProductForAddons.price);
        let selectedAddonsPrice = 0;

        addonOptionsContainer.querySelectorAll('.item-addon-checkbox:checked').forEach(checkbox => {
            selectedAddonsPrice += parseFloat(checkbox.dataset.price);
        });

        const total = itemBasePrice + selectedAddonsPrice;
        currentAddonItemTotal.textContent = `$${total.toFixed(2)}`;
    }


    function addSelectedItemToCart() {
        if (!currentProductForAddons) return;

        const selectedAddons = [];
        addonOptionsContainer.querySelectorAll('.item-addon-checkbox:checked').forEach(checkbox => {
            selectedAddons.push({
                name: checkbox.value,
                price: parseFloat(checkbox.dataset.price)
            });
        });

        const existingItemIndex = cart.findIndex(item =>
            item.id === currentProductForAddons.id &&
            JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons) 
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({
                ...currentProductForAddons,
                quantity: 1,
                selectedAddons: selectedAddons
            });
        }
        saveCart();
        hideModal(addonSelectionModal);
        showCustomAlert('Added to Cart', `${currentProductForAddons.name} has been added to your cart.`);
        currentProductForAddons = null;
    }

    function updateQuantityInCart(productId, change, itemAddons = []) {
        const itemIndex = cart.findIndex(item =>
            item.id === productId &&
            JSON.stringify(item.selectedAddons) === JSON.stringify(itemAddons)
        );
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCart();
        }
    }

    function removeFromCart(productId, itemAddons = []) {
        cart = cart.filter(item =>
            !(item.id === productId && JSON.stringify(item.selectedAddons) === JSON.stringify(itemAddons))
        );
        saveCart();
    }

    function displayCartOnOrderPage() {
        if (!cartItemsListContainer || !cartSubtotalDisplay) return;

        cartItemsListContainer.innerHTML = ''; 
        let currentCartSubtotal = 0;

        if (cart.length === 0) {
            cartItemsListContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="menu.html">Continue shopping?</a></p>';
            cartSubtotalDisplay.textContent = '$0.00';
            calculateOrderPageTotalPrice();
            return;
        }

        cart.forEach((item, index) => {
            let itemPriceWithAddons = parseFloat(item.price);
            item.selectedAddons.forEach(addon => {
                itemPriceWithAddons += parseFloat(addon.price);
            });

            const itemSubtotal = itemPriceWithAddons * item.quantity;
            currentCartSubtotal += itemSubtotal;

            const addonsHtml = item.selectedAddons.length > 0 ?
                `<ul class="cart-item-addons">
                    ${item.selectedAddons.map(addon => `<li>+ ${addon.name} ($${parseFloat(addon.price).toFixed(2)})</li>`).join('')}
                </ul>` : '';

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            itemElement.dataset.cartIndex = index;
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</p>
                    ${addonsHtml}
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus-btn" data-id="${item.id}" data-addons='${JSON.stringify(item.selectedAddons)}' aria-label="Decrease quantity of ${item.name}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-id="${item.id}" data-addons='${JSON.stringify(item.selectedAddons)}' aria-label="Increase quantity of ${item.name}">+</button>
                </div>
                <p class="cart-item-subtotal">$${itemSubtotal.toFixed(2)}</p>
                <button class="remove-item-btn" data-id="${item.id}" data-addons='${JSON.stringify(item.selectedAddons)}' aria-label="Remove ${item.name} from cart">&times;</button>
            `;
            cartItemsListContainer.appendChild(itemElement);
        });

        cartSubtotalDisplay.textContent = `$${currentCartSubtotal.toFixed(2)}`;
        attachCartItemEventListeners();
        calculateOrderPageTotalPrice();
    }

    function attachCartItemEventListeners() {
        document.querySelectorAll('.minus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const addons = JSON.parse(e.target.dataset.addons || '[]');
                updateQuantityInCart(productId, -1, addons);
            });
        });
        document.querySelectorAll('.plus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const addons = JSON.parse(e.target.dataset.addons || '[]');
                updateQuantityInCart(productId, 1, addons);
            });
        });
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const addons = JSON.parse(e.target.dataset.addons || '[]');
                removeFromCart(productId, addons);
            });
        });
    }
    
    function calculateOrderPageTotalPrice() {
        if (!totalPriceElement) return;

        let total = 0;
        cart.forEach(item => {
            let itemPriceWithAddons = parseFloat(item.price);
            item.selectedAddons.forEach(addon => {
                itemPriceWithAddons += parseFloat(addon.price);
            });
            total += itemPriceWithAddons * item.quantity;
        });
        
        totalPriceElement.value = `$${total.toFixed(2)}`;
    }



    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.innerHTML = mobileMenu.classList.contains('hidden') ?
                `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>` :
                `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
        });
    }


    function showModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('hidden');
            setTimeout(() => modalElement.classList.add('visible'), 20);
        }
    }

    function hideModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('visible');
            setTimeout(() => modalElement.classList.add('hidden'), 300);
        }
    }


    const rewardButtons = document.querySelectorAll('.reward-button');
    if (appDownloadModal && rewardButtons.length > 0) {
        rewardButtons.forEach(button => {
            button.addEventListener('click', () => showModal(appDownloadModal));
        });
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => hideModal(appDownloadModal));
        }
        appDownloadModal.addEventListener('click', (event) => {
            if (event.target === appDownloadModal) hideModal(appDownloadModal);
        });
    }


    function showCustomAlert(title, message) {
        if (customAlertModal && customAlertTitle && customAlertMessage) {
            customAlertTitle.textContent = title;
            customAlertMessage.textContent = message;
            showModal(customAlertModal);
        } 
    }

    if (customAlertCloseButton && customAlertModal) {
        customAlertCloseButton.addEventListener('click', () => hideModal(customAlertModal));
        customAlertModal.addEventListener('click', (event) => {
            if (event.target === customAlertModal) hideModal(customAlertModal);
        });
    }


    if (addonSelectionModal) {
        closeAddonModalButton.addEventListener('click', () => hideModal(addonSelectionModal));
        addonSelectionModal.addEventListener('click', (event) => {
            if (event.target === addonSelectionModal) hideModal(addonSelectionModal);
        });
        confirmAddonsButton.addEventListener('click', addSelectedItemToCart);
    }


    function displayProducts(filter = "all") {
        if (!menuList) return;
        menuList.innerHTML = "";
        const filteredProducts = products.filter(product => filter === "all" || product.category === filter);

        if (filteredProducts.length === 0) {
            menuList.innerHTML = `<p class="empty-cart-message">No products found for this category.</p>`;
            return;
        }

        filteredProducts.forEach(product => {
            const productElementHTML = `
                <div class="product-card" data-category="${product.category}" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <p class="price">$${parseFloat(product.price).toFixed(2)}</p>
                        <button class="add-to-order-button">Add to Cart</button> 
                    </div>
                </div>
            `;
            menuList.insertAdjacentHTML('beforeend', productElementHTML);
        });
        
        document.querySelectorAll('.add-to-order-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const card = event.target.closest('.product-card');
                const productId = parseInt(card.dataset.productId);
                const productToConfigure = products.find(p => p.id === productId);
                if (productToConfigure) {
                    openAddonSelectionModal(productToConfigure);
                }
            });
        });
    }

    if (menuList && menuFilterButtons.length > 0) {
        menuFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                menuFilterButtons.forEach(btn => btn.classList.remove('active-filter'));
                button.classList.add('active-filter');
                displayProducts(button.dataset.filter);
            });
        });
        displayProducts();
    }


    function showError(inputId, message) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        if (inputElement) inputElement.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    function clearError(inputId) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        if (inputElement) inputElement.classList.remove('error');
        if (errorElement) errorElement.classList.add('hidden');
    }


    function containsRegexChars(inputString) {
        const regexChars = /[*+?^${}()|[\]\\]/g; 
        return regexChars.test(inputString);
    }
    
    function validateOrderForm() {
        let isValid = true;
        ['name', 'email', 'phone', 'address', 'delivery', 'paymentMethod'].forEach(clearError);

        const nameInput = document.getElementById('name');
        const namePattern = /^[a-zA-Z\s]+$/;
        if (!nameInput.value.trim()) {
            showError('name', 'Full name cannot be empty.'); 
            isValid = false;
        } else if (nameInput.value.trim().length < 3) {
            showError('name', 'Full name must be at least 3 characters long.'); 
            isValid = false;
        } else if (!namePattern.test(nameInput.value.trim())) {
            showError('name', 'Full name must contain only letters and spaces.'); 
            isValid = false;
        }


        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim()) {
            showError('email', 'Email address cannot be empty.'); isValid = false;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                 showError('email', 'Please enter a valid email address.'); isValid = false;
            } else if (containsRegexChars(emailInput.value.trim())) { 
                showError('email', 'Email address contains invalid characters.'); isValid = false;
            }
        }
        
        const phoneInput = document.getElementById('phone');
        if (!phoneInput.value.trim()) {
            showError('phone', 'Phone number cannot be empty.'); isValid = false;
        } else {
            const phonePattern = /^\d{10,13}$/;
            if (!phonePattern.test(phoneInput.value.trim())) {
                showError('phone', 'Phone number must be 10-13 digits and contain only numbers.'); isValid = false;
            } else if (containsRegexChars(phoneInput.value.trim())) {
                showError('phone', 'Phone number contains invalid characters.'); isValid = false;
            }
        }

        const addressInput = document.getElementById('address');
        const addressValue = addressInput.value.trim();

        const addressPattern = /^[a-zA-Z0-9\s,.\-\/#]{10,}$/;

        if (!addressValue) {
            showError('address', 'Delivery address cannot be empty.');
            isValid = false;
        } else if (!addressPattern.test(addressValue)) {
            showError('address', 'Delivery address must be at least 10 characters long and contain only valid characters (letters, numbers, spaces, and , . - / #).');
            isValid = false;
        }

        
        const paymentMethodInput = document.getElementById('paymentMethod');
        if (!paymentMethodInput.value) {
            showError('paymentMethod', 'Please select a payment method.'); isValid = false;
        }

        const deliveryOptions = document.querySelector('input[name="deliveryOption"]:checked');
        if (!deliveryOptions) {
            showError('delivery', 'Please select a delivery option.'); isValid = false;
        }


        if (cart.length === 0) {
            showCustomAlert("Empty Cart", "Your cart is empty. Please add items from the menu before placing an order.");
            isValid = false;
        }

        return isValid;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateOrderForm()) {
                orderForm.classList.add('hidden');
                if (formSuccessMessageDiv) formSuccessMessageDiv.classList.remove('hidden');
                

                const orderData = {
                    customerDetails: {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('address').value,
                        deliveryOption: document.querySelector('input[name="deliveryOption"]:checked').value,
                        paymentMethod: document.getElementById('paymentMethod').value,
                    },
                    items: cart.map(item => ({ 
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        basePrice: item.price,
                        selectedAddons: item.selectedAddons 
                    })),
                    totalPrice: totalPriceElement.value
                };
                console.log('Order Submitted:', JSON.stringify(orderData, null, 2)); 
                
                showCustomAlert("Order Placed!", "Your order has been successfully submitted. Thank you!");
                

                cart = [];
                localStorage.removeItem(CART_STORAGE_KEY);
                updateCartIconCount();
                if (cartItemsListContainer) displayCartOnOrderPage();
            } else {
                showCustomAlert("Validation Error", "Please correct the errors in the form before submitting.");
            }
        });
    }


    loadCart(); 
});
