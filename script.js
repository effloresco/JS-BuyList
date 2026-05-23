let products = [];
const savedData = localStorage.getItem('buyList');
if (savedData) {
    products = JSON.parse(savedData);
} else {
    products = [
        { id: 1, name: 'Помідори', count: 2, isBought: true },
        { id: 2, name: 'Печиво', count: 2, isBought: false },
        { id: 3, name: 'Сир', count: 1, isBought: false }
    ];
}

const productListUI = document.querySelector('.product-list');
const inputField = document.querySelector('.input-group input');
const addButton = document.querySelector('.btn-add');
const statsLeftUI = document.querySelector('.stats-group:first-child .stats-content');
const statsBoughtUI = document.querySelector('.stats-group:last-child .stats-content');

function closeAllEditing() {
    let needsRender = false;
    products.forEach(p => {
        if (p.isEditing) {
            const input = document.querySelector('.edit-input');
            if (input) {
                p.name = input.value.trim() || p.name;
            }
            p.isEditing = false;
            needsRender = true;
        }
    });
    if (needsRender) render();
}

document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.edit-input') && !e.target.closest('.product-name')) {
        closeAllEditing();
    }
});

function updateStatsUI(product) {
    const tag = document.createElement('span');
    tag.className = `tag ${product.isBought ? 'bought' : ''}`;
    tag.innerHTML = `${product.name} <span class="tag-count">${product.count}</span>`;
    if (product.isBought) statsBoughtUI.appendChild(tag);
    else statsLeftUI.appendChild(tag);
}

function render() {
    productListUI.innerHTML = '';
    statsLeftUI.innerHTML = '';
    statsBoughtUI.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = `product-row ${product.isBought ? 'is-bought' : ''}`;

        li.innerHTML = `
            ${product.isEditing
                ? `<input type="text" class="edit-input" value="${product.name}">`
                : `<span class="product-name">${product.name}</span>`
            }
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

        if (product.isEditing) {
            const inputEdit = li.querySelector('.edit-input');

            setTimeout(() => {
                if (document.activeElement !== inputEdit && product.isEditing) {
                    inputEdit.focus();
                }
            }, 0);

            const saveAndClose = () => {
                if (!product.isEditing) return;
                product.name = inputEdit.value.trim() || product.name;
                product.isEditing = false;
                render();
            };

            inputEdit.onkeydown = (e) => {
                if (e.key === 'Enter') saveAndClose();
                if (e.key === 'Escape') {
                    product.isEditing = false;
                    render();
                }
            };

            inputEdit.onblur = () => {
                saveAndClose();
            };
        } else {
            const nameSpan = li.querySelector('.product-name');
            if (nameSpan && !product.isBought) {
                nameSpan.setAttribute('tabindex', '0');

                const startEditing = (e) => {
                    e.stopPropagation();
                    products.forEach(p => p.isEditing = false);
                    product.isEditing = true;
                    render();
                };

                nameSpan.onclick = startEditing;

                nameSpan.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        startEditing(e);
                    }
                };
            }
        }

        const plusBtn = li.querySelector('.btn-plus');
        if (plusBtn) plusBtn.onclick = () => {
            closeAllEditing(); product.count++;
            render();
        };

        const minusBtn = li.querySelector('.btn-minus');
        if (minusBtn) minusBtn.onclick = () => {
            closeAllEditing();
            if (product.count > 1) {
                product.count--; render();
            }
        };

        li.querySelector('.btn-status').onclick = () => {
            product.isBought = !product.isBought;
            product.isEditing = false;
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
        updateStatsUI(product);
    });

    saveData();
}

function addNewProduct() {
    const name = inputField.value.trim();
    if (name) {
        closeAllEditing();
        products.push({ id: Date.now(), name, count: 1, isBought: false, isEditing: false });
        inputField.value = '';
        inputField.focus();
        render();
    }
}

addButton.onclick = addNewProduct;
inputField.onkeydown = (e) => {
    if (e.key === 'Enter') addNewProduct();
};

function saveData() {
    localStorage.setItem('buyList', JSON.stringify(products));
}

render();