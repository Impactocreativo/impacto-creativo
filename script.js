let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', updateWhatsAppLink);
    }

    const cartIconContainer = document.querySelector('.cart-icon-container');
    if (cartIconContainer) {
        cartIconContainer.addEventListener('click', openModal);
    }

    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeModal();
            }
        });
    }

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });
}

function addToCart(event) {
    const productItem = event.target.closest('.product-item');
    if (!productItem) return;
    const productName = productItem.querySelector('h4').innerText;
    const productPrice = productItem.querySelector('.product-price').innerText.replace('$', '');

    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1
        });
    }
    updateCartModal();
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    } else {
        if (emptyMessage) emptyMessage.style.display = 'none';
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <span>${item.name}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCounter) cartCounter.innerText = totalItems;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) cartTotalElement.innerText = `$${total.toFixed(2)}`;
}

function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

function openModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = "none";
}

function formatWhatsAppMessage() {
    let message = "Hola, me gustaría hacer un pedido con los siguientes productos:\n\n";
    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} unidades\n`;
    });
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: $${total.toFixed(2)}`;
    return message;
}

function updateWhatsAppLink() {
    const whatsappLink = document.getElementById('checkout-btn');
    if (whatsappLink && cart.length > 0) {
        const message = encodeURIComponent(formatWhatsAppMessage());
        whatsappLink.href = `https://wa.me/59899063756?text=${message}`;
    } else if (whatsappLink) {
        whatsappLink.href = '#';
    }
}

