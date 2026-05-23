let products = [
    { id: 1, name: 'Помідори', count: 2, isBought: true },
    { id: 2, name: 'Печиво', count: 2, isBought: false },
    { id: 3, name: 'Сир', count: 1, isBought: false }
];

const productListUI = document.querySelector('.product-list');
const inputField = document.querySelector('.input-group input');
const addButton = document.querySelector('.btn-add');

function render() {
    productListUI.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.className = `product-row ${product.isBought ? 'is-bought' : ''}`;
        li.innerHTML = `
            <span class="product-name">${product.name}</span>
            <div class="controls">
                ${!product.isBought ? `
                    <button class="btn-round btn-minus ${product.count === 1 ? 'disabled' : ''}"
                        ${product.count === 1 ? 'disabled' : ''}>−</button>
                    <span class="count-label">${product.count}</span>
                    <button class="btn-round btn-plus">+</button>
                ` : `<span class="count-label">${product.count}</span>`}
            </div>
            <div class="actions">
                <button class="btn-status">${product.isBought ? 'Не куплено' : 'Куплено'}</button>
                ${!product.isBought ? `<button class="btn-remove">×</button>` : ''}
            </div>
        `;

        const plusBtn = li.querySelector('.btn-plus');
        const minusBtn = li.querySelector('.btn-minus');
        if (plusBtn) plusBtn.onclick = () => {
            product.count++;
            render();
        };

        if (minusBtn) minusBtn.onclick = () => {
            if (product.count > 1) {
                product.count--;
                render();
            }
        };

        li.querySelector('.btn-status').onclick = () => {
            product.isBought = !product.isBought;
            render();
        };

        const removeBtn = li.querySelector('.btn-remove');
        if (removeBtn) {
            removeBtn.onclick = () => {
                products = products.filter(p => p.id !== product.id);
                render();
            };
        }
        productListUI.appendChild(li);
    });
}

function addNewProduct() {
    const name = inputField.value.trim();
    if (name) {
        products.push({ id: Date.now(), name, count: 1, isBought: false });
        inputField.value = '';
        inputField.focus();
        render();
    }
}

addButton.onclick = addNewProduct;
inputField.onkeydown = (e) => { if (e.key === 'Enter') addNewProduct(); };

render();