// burgermenu
document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
});

const apiUrl = 'https://67deb105471aaaa742854d38.mockapi.io/PP/PostInfo';

window.onload = function () {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const totalAmountContainer = document.getElementById('totalAmount');

    let cart = [];

    function fetchCart() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load cart data');
                }
                return response.json();
            })
            .then(data => {
                cart = data;
                renderCartItems();
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
            });
    }

    function updateCartOnServer(cartItem) {
        fetch(`${apiUrl}/${cartItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update cart on server');
            }
            return response.json();
        })
        .then(updatedItem => {
            const index = cart.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                cart[index] = updatedItem;
            }
            renderCartItems();
        })
        .catch(error => {
            console.error('Error updating cart:', error);
        });
    }

    function removeItemFromCart(productId) {
        const productToRemove = cart.find(item => item.id === productId);
        if (productToRemove) {
            if (productToRemove.quantity > 1) {
                productToRemove.quantity -= 1;
                updateCartOnServer(productToRemove);
            } else {
                // Если количество 1, то удаляем товар полностью с сервера
                fetch(`${apiUrl}/${productId}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to remove item from server');
                    }
                    // Удаляем товар из локальной корзины
                    cart = cart.filter(item => item.id !== productId);
                    renderCartItems();
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                });
            }
        }
    }

    function addItemToCart(productId) {
        const productToAdd = cart.find(item => item.id === productId);
        if (productToAdd) {
            productToAdd.quantity += 1;
            updateCartOnServer(productToAdd);
        }
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;

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
            totalAmount += product.price * product.quantity;
        });

        totalAmountContainer.textContent = totalAmount.toFixed(2);
    }

    fetchCart();
};

