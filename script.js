document.addEventListener('DOMContentLoaded', () => {
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCounterSpan = document.getElementById('cart-counter');
    const productGrid = document.querySelector('.product-grid');

    let cart = [];

    // Muestra el modal del carrito
    cartIconContainer.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCart();
    });

    // Oculta el modal al hacer clic en la X o fuera de él
    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Agrega los botones a los productos
    if (productGrid) {
        document.querySelectorAll('.product-item').forEach(item => {
            const button = document.createElement('button');
            button.className = 'add-to-cart-btn';
            button.textContent = 'Agregar al carrito';
            item.appendChild(button);

            button.addEventListener('click', () => {
                const name = item.querySelector('h3').textContent;
                const priceText = item.querySelector('.product-price').textContent;
                const price = parseFloat(priceText.replace('$', '').replace(',', '.'));
                
                addItemToCart(name, price);
            });
        });
    }

    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartCounter();
        renderCart();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <p>${item.name} x${item.quantity}</p>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    }

    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounterSpan.textContent = totalItems;
    }

});



