document.addEventListener('DOMContentLoaded', () => {
    // Definimos el carrito y el contador
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Función para actualizar el contador del carrito
    function updateCartCounter() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }

    // Función para mostrar los productos en el modal del carrito
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="item-quantity">
                    <button class="remove-btn" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="add-btn" data-name="${item.name}">+</button>
                </div>
                <button class="remove-item-btn" data-name="${item.name}">Quitar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `Total: $${total.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart)); // Guardar carrito en LocalStorage
        updateCheckoutLink();
    }

    // Función para agregar o actualizar un producto en el carrito
    function addToCart(productName, productPrice) {
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }
        
        renderCartItems();
        updateCartCounter();
    }
    
    // Función para actualizar el link de WhatsApp del checkout
    function updateCheckoutLink() {
        let message = 'Hola, quiero coordinar la compra de los siguientes productos:\n\n';
        let total = 0;
        cart.forEach(item => {
            message += `- ${item.name} x ${item.quantity} ($${(item.price * item.quantity).toFixed(2)})\n`;
            total += item.price * item.quantity;
        });
        message += `\nTotal: $${total.toFixed(2)}`;
        
        const encodedMessage = encodeURIComponent(message);
        checkoutBtn.href = `https://wa.me/59899063756?text=${encodedMessage}`;
    }

    // Manejador de eventos para los botones de "Agregar al Carrito"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productItem = e.target.closest('.product-item');
            const productName = productItem.dataset.name;
            const productPrice = parseFloat(productItem.dataset.price);
            
            addToCart(productName, productPrice);
        });
    });

    // Manejador de eventos para el modal (quitar/agregar items)
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const itemName = target.dataset.name;
        
        if (target.classList.contains('remove-item-btn') || target.classList.contains('remove-btn')) {
            const item = cart.find(i => i.name === itemName);
            if (item) {
                item.quantity--;
                if (item.quantity <= 0 || target.classList.contains('remove-item-btn')) {
                    cart = cart.filter(i => i.name !== itemName);
                }
            }
        } else if (target.classList.contains('add-btn')) {
            const item = cart.find(i => i.name === itemName);
            if (item) {
                item.quantity++;
            }
        }
        renderCartItems();
        updateCartCounter();
    });

    // Función para abrir/cerrar el modal
    window.toggleCartModal = function() {
        const modal = document.getElementById('cartModal');
        const body = document.body;
        
        if (modal.style.display === "block") {
            modal.style.display = "none";
            body.classList.remove('no-scroll'); // ¡Quita la clase para que el scroll vuelva!
        } else {
            modal.style.display = "block";
            body.classList.add('no-scroll'); // Agrega la clase para deshabilitar el scroll del fondo
            renderCartItems();
        }
    };
    
    // Cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
        const modal = document.getElementById('cartModal');
        if (event.target == modal) {
            toggleCartModal();
        }
    }

    // Inicializar al cargar la página
    updateCartCounter();
    renderCartItems();
});
