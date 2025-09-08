let cart = JSON.parse(localStorage.getItem('cart')) || [];
let lastScrollTop = 0;
const header = document.querySelector('.main-header');

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateCartUI(); 
});

function setupEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', updateWhatsAppLink);
    }

    const cartIcon = document.querySelector('.cart-icon-container');
    if (cartIcon) {
        cartIcon.addEventListener('click', openModal);
    }

    const closeModalBtn = document.querySelector('.close-button');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
}

function addToCart(event) {
    const productItem = event.target.closest('.product-item');
    const productName = productItem.getAttribute('data-name');
    const productPrice = productItem.getAttribute('data-price');
    
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'block';
    }

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price);
        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span> - $${itemPrice.toFixed(2)}</span>
            </div>
            <div class="item-quantity">
                <button onclick="changeQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.name}', 1)">+</button>
                <button class="remove-item-btn" onclick="removeItem('${item.name}')">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    if (cartTotalSpan) cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    if (cartCounter) cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function changeQuantity(productName, change) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += change;
        if (existingItem.quantity <= 0) {
            removeItem(productName);
        }
    }
    updateCartUI();
}

function removeItem(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartUI();
}

function formatWhatsAppMessage() {
    let message = "Hola, me gustaría hacer un pedido con los siguientes productos:\n";
    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} unidades\n`;
    });
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
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

function openModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = "none";
}

// Código para ocultar la barra de navegación al hacer scroll
window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // Desplazamiento hacia abajo
        header.classList.add('header-hidden');
    } else {
        // Desplazamiento hacia arriba
        header.classList.remove('header-hidden');
    }
    
    lastScrollTop = scrollTop;
});
