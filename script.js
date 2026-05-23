let products = [
    { id: 1, name: 'Помідори', count: 2, isBought: true },
    { id: 2, name: 'Печиво', count: 2, isBought: false },
    { id: 3, name: 'Сир', count: 1, isBought: false }
];

const productListUI = document.querySelector('.product-list');

function render() {
    productListUI.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = `product-row ${product.isBought ? 'is-bought' : ''}`;
        
        li.innerHTML = `
            <span class="product-name">${product.name}</span>
            <div class="controls">
                <span class="count-label">${product.count}</span>
            </div>
            <div class="actions">
                <button class="btn-status">
                    ${product.isBought ? 'Не куплено' : 'Куплено'}
                </button>
            </div>
        `;
        productListUI.appendChild(li);
    });
}

render();