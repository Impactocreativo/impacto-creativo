// Variable para almacenar los productos en el carrito
let cartItems = [];

// Función para mostrar/ocultar el modal del carrito
function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

// Función para actualizar el contenido del modal y el contador
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-from-cart-btn" data-name="${item.name}">X</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartCounter.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Event listeners para los botones "Agregar al Carrito"
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const productItem = event.target.closest('.product-item');
        const productName = productItem.getAttribute('data-name');
        const productPrice = parseFloat(productItem.getAttribute('data-price'));
        const existingItem = cartItems.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name: productName, price: productPrice, quantity: 1 });
        }

        updateCartModal();
        alert(`¡${productName} agregado al carrito!`);
    });
});

// Event listener para los botones "Comprar"
document.querySelectorAll('.buy-now-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const productItem = event.target.closest('.product-item');
        const productName = productItem.getAttribute('data-name');
        const productPrice = parseFloat(productItem.getAttribute('data-price'));
        const existingItem = cartItems.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name: productName, price: productPrice, quantity: 1 });
        }

        updateCartModal();
        alert(`¡${productName} agregado al carrito!`);
        
        // Simular la redirección a una página de pago
        // Puedes cambiar esta línea para que haga lo que necesites
        window.location.href = '#'; 
    });
});

// Event listener para los botones de eliminar del carrito
document.getElementById('cart-items').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const productName = event.target.getAttribute('data-name');
        cartItems = cartItems.filter(item => item.name !== productName);
        updateCartModal();
    }
});

// Event listener para el botón de Pagar del modal
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cartItems.length > 0) {
        alert('¡Compra realizada con éxito! Nos pondremos en contacto contigo.');
        cartItems = [];
        updateCartModal();
        toggleCartModal();
    } else {
        alert('Tu carrito está vacío.');
    }
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});