// burger menu
document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
});

window.onload = function () {
    const totalAmountContainer = document.getElementById('totalAmount');
    const savedTotal = localStorage.getItem('totalPrice');

    if (savedTotal) {
        totalAmountContainer.textContent = savedTotal;
    } else {
        totalAmountContainer.textContent = '0.00';
    }
};

//productdisplay
window.onload = function () {
    const productContainer = document.getElementById('productContainer');
    const totalAmountContainer = document.getElementById('totalAmount');

    function fetchProducts() {
        // Запрос к серверу для получения данных корзины
        fetch('https://67deb105471aaaa742854d38.mockapi.io/PP/PostInfo', {
            method: 'GET',  // Используем GET запрос для получения данных
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);  
            if (Array.isArray(data)) {
                renderProducts(data);  // Отображаем продукты, если ответ - массив
            } else {
                console.log('Expected an array, but got:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
    }

    function renderProducts(products) {
        productContainer.innerHTML = '';
        let totalAmount = 0;

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-item');
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
            `;
            productContainer.appendChild(productCard);
            totalAmount += product.price * product.quantity;  // Учитываем количество товара
        });
        totalAmountContainer.textContent = totalAmount.toFixed(2);
    }

    fetchProducts();  // Запуск функции получения данных при загрузке страницы
};

