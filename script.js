document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('checkout-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotal = document.getElementById('cart-total');
    let cart = [];

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.target.closest('.product-item');
            const productName = product.getAttribute('data-name');
            const productPrice = parseFloat(product.getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            updateCartDisplay();
        });
    });

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let counter = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${item.name} (${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
            counter += item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        cartCounter.textContent = counter;

        if (cart.length > 0) {
            cartButton.style.display = 'block';
        } else {
            cartButton.style.display = 'none';
        }
    }

    window.toggleCartModal = function() {
        const modal = document.getElementById('cartModal');
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    };

    window.onclick = function(event) {
        const modal = document.getElementById('cartModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
