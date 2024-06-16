let cart = new Map();
let totalPrice = 0.00;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        let productId = button.parentElement.getAttribute('data-id');
        let productName = button.parentElement.getAttribute('data-name');
        let productPrice = parseFloat(button.parentElement.getAttribute('data-price'));

        addToCart(productId, productName, productPrice);
        updateCartCount();
        saveCart();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

function addToCart(id, name, price) {
    if (cart.has(id)) {
        let product = cart.get(id);
        product.quantity += 1;
    } else {
        cart.set(id, { name, price, quantity: 1 });
    }

    updateTotalPrice();
    showCartItems();
}

function updateTotalPrice() {
    totalPrice = Array.from(cart.values()).reduce((total, product) => total + (product.price * product.quantity), 0);
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function updateCartCount() {
    let totalItems = Array.from(cart.values()).reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function showCartItems() {
    let cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cart.forEach((product, id) => {
        let itemElement = document.createElement('tr');
        itemElement.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
                <div class="qty">
                    <button onclick="diminuir('${id}')">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="aumentar('${id}')">+</button>
                </div>
            </td>
            <td>${(product.price * product.quantity).toFixed(2)}</td>
            <td><button onclick="removeFromCart('${id}')"><i class='bx bx-x'></i></button></td>
        `;

        cartItemsContainer.appendChild(itemElement);
    });
}

function removeFromCart(id) {
    if (cart.has(id)) {
        let product = cart.get(id);
        if (product.quantity > 1) {
            product.quantity -= 1;
        } else {
            cart.delete(id);
        }

        updateTotalPrice();
        updateCartCount();
        showCartItems();
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));
}

function loadCart() {
    let savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = new Map(savedCart);
        updateTotalPrice();
        updateCartCount();
        showCartItems();
    }
}

function aumentar(id) {
    let product = cart.get(id);
    product.quantity += 1;
    showCartItems();
    updateTotalPrice();
    updateCartCount();
    saveCart();
}

function diminuir(id) {
    let product = cart.get(id);
    if (product.quantity > 1) {
        product.quantity -= 1;
    } else {
        removeFromCart(id);
    }
    showCartItems();
    updateTotalPrice();
    updateCartCount();
    saveCart();
}