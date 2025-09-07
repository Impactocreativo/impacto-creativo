let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateCartModal();
});

// Configuración de eventos
function setupEventListeners() {
    // Botones agregar al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Botón checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', updateWhatsAppLink);

    // Icono carrito
    const cartIconContainer = document.querySelector('.cart-icon-container');
    if (cartIconContainer) cartIconContainer.addEventListener('click', openModal);

    // Modal cerrar con click fuera
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', event => {
            if (event.target === cartModal) closeModal();
        });
    }

    // Botones de cerrar modal
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Delegación de eventos para cantidades
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', event => {
            if (event.target.classList.contains('qty-btn')) {
                const index = event.target.dataset.index;
                const delta = parseInt(event.target.dataset.delta, 10);
                changeQuantity(index, delta);
            }
        });
    }
}

// Agregar producto
function addToCart(event) {
    const productItem = event.target.closest('.product-item');
    if (!productItem) return;

    const productName = productItem.querySelector('h4').innerText;
    const productPrice = parseFloat(
        productItem.querySelector('.product-price').innerText.replace('$', '')
    );

    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    saveCart();
    updateCartModal();
    showToast(`✅ ${productName} agregado al carrito`);
}

// Actualizar modal
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartItemsContainer.innerHTML = '';
    } else {
        emptyMessage.style.display = 'none';
        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button class="qty-btn" data-index="${index}" data-delta="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-index="${index}" data-delta="1">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.innerText = totalItems;

    // Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.innerText = `$${total.toFixed(2)}`;
}

// Cambiar cantidad
function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCart();
        updateCartModal();
    }
}

// Modal abrir/cerrar
function openModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
    document.body.classList.add('no-scroll');
}
function closeModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

// Guardar en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// WhatsApp
function formatWhatsAppMessage() {
    let message = "Hola, me gustaría hacer un pedido con los siguientes productos:\n\n";
    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} unidades\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nTotal: $${total.toFixed(2)}`;
    return message;
}
function updateWhatsAppLink() {
    const whatsappLink = document.getElementById('checkout-btn');
    if (cart.length > 0) {
        const message = encodeURIComponent(formatWhatsAppMessage());
        whatsappLink.href = `https://wa.me/59899063756?text=${message}`;
    } else {
        showToast("⚠️ Tu carrito está vacío");
        whatsappLink.href = '#';
    }
}

// Toasts
function showToast(message) {
    let toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}



