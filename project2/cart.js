// burgermenu
document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
});

//cart load
window.onload = function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const totalAmountContainer = document.getElementById('totalAmount');
    const cartCountContainer = document.getElementById('cartCount');

    function updateTotalAmount() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        totalAmountContainer.textContent = total.toFixed(2);
    }

    function updateCartCount() {
        let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountContainer.textContent = totalCount;
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="200">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <p>Quantity: <span id="quantity-${product.id}">${product.quantity}</span></p>
                <button class="remove-item" data-id="${product.id}">Remove</button>
                <button class="add-item" data-id="${product.id}">Add</button>
            `;
            const removeBtn = itemDiv.querySelector('.remove-item');
            removeBtn.addEventListener('click', function () {
                removeItemFromCart(product.id);
            });

            const addBtn = itemDiv.querySelector('.add-item');
            addBtn.addEventListener('click', function () {
                addItemToCart(product.id);
            });

            cartItemsContainer.appendChild(itemDiv);
        });
        updateTotalAmount();
        updateCartCount();
    }

    function removeItemFromCart(itemId) {
        let itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    }

    function addItemToCart(itemId) {
        let itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += 1;
        } else {
            let product = { id: itemId, quantity: 1, image: "default.jpg", price: 0 };
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    renderCartItems();
};