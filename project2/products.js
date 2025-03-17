// burgermenu
document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    burgerMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
});

//popup
fetch('https://67d294b090e0670699be2f8a.mockapi.io/ecw/products')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network has error");
        }
        return response.json();
    })
    .then(data => {
        const ProductContainer = document.getElementById('ProductConteiner');
        const popup = document.getElementById('popup');
        const popupImg = document.getElementById('popup-img');
        const popupName = document.getElementById('popup-name');
        const popupPrice = document.getElementById('popup-price');
        const popupDescription = document.getElementById('popup-description');
        const closeBtn = document.querySelector('.close-btn');
        const quantityElement = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decrease');
        const increaseBtn = document.getElementById('increase');
        const addToCartBtn = document.getElementById('addToCart');

        let selectedProduct = null;
        let quantity = 1;

        data.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add("some");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="200">
                <h2>${product.name}</h2>
                <p>Price: ${product.price}$</p>
            `;

            productCard.addEventListener('click', () => {
                selectedProduct = product;
                popupImg.src = product.image;
                popupImg.alt = product.name;
                popupName.textContent = product.name;
                popupPrice.textContent = `Price: ${product.price}$`;
                popupDescription.textContent = product.discription || "No discription available";
                quantity = 1;
                quantityElement.textContent = quantity;
                popup.style.display = "flex";
            });

            ProductContainer.appendChild(productCard);
        });

        closeBtn.addEventListener('click', () => {
            popup.style.display = "none";
        });

        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });

        increaseBtn.addEventListener('click', () => {
            quantity++;
            quantityElement.textContent = quantity;
        });

        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });

        addToCartBtn.addEventListener('click', () => {
            if (!selectedProduct) return;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existingItem = cart.find(item => item.id === selectedProduct.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ ...selectedProduct, quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            popup.style.display = "none";
            showAddedToCartMessage();
        });
    })
    .catch(error => {
        console.error("ERROR", error);
    });
    
//add to cart massage
    function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.backgroundColor = '#28a745';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.fontSize = '23px';
    message.style.display = 'flex';
    message.style.alignItems = 'center';
    message.style.zIndex = '9999';
    message.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    message.innerHTML = '<span style="margin-right: 10px;">&#10003;</span> Added to Cart!';
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            message.remove();
        }, 500); 
    }, 3000);
}