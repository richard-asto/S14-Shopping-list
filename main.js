const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const submitBtn = form.querySelector('button');
const message = document.getElementById('message');
const confirmBox = document.getElementById('confirm-box');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');
const confirmText = document.getElementById('confirm-text');

let editItem = null;

/*-- Acceso a Local Storage (Persistencia)--*/
const getItems = () =>
    JSON.parse(localStorage.getItem('items')) || [];

const setItems = items =>
    localStorage.setItem('items', JSON.stringify(items));

/*-- Funcion de renderizado de la lista --*/
function render(items = getItems()) {
    list.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.dataset.value = item;
        li.innerHTML = `
            <span>${item}</span>
            <button class="remove-item">
            <i data-lucide="trash-2"></i>
            </button>
            `;
        list.appendChild(li);
    });
    lucide.createIcons();
    toggleUI(items.length);
}

/*-- Funcion de control visual de la interfaz --*/
function toggleUI(hasItems) {
    clearBtn.style.display = hasItems ? 'flex' : 'none';
    filter.style.display = hasItems ? 'block' : 'none';

    submitBtn.innerHTML = `<i data-lucide="square-plus"></i> Add Item`;
    submitBtn.style.background = 'var(--blue-main)';
    editItem = null;
    input.value = '';

    lucide.createIcons();
}

/*-- Funcion mostrar mensaje --*/
function showMessage(text) {
    message.textContent = text;
    message.style.display = 'block';

    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

/*-- Funcion de mensaje confirmacion de eliminacion --*/
function showConfirm(message, onConfirm) {
    confirmText.textContent = message;
    confirmBox.classList.remove('hidden');

    confirmYes.onclick = () => {
        confirmBox.classList.add('hidden');
        onConfirm();
    };

    confirmNo.onclick = () => {
        confirmBox.classList.add('hidden');
    };

    lucide.createIcons();
}

/*-- Agregar o editar ítems (Submit del formulario) --*/
form.addEventListener('submit', e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) {
        showMessage('Please add an item');
        return;
    }
    let items = getItems();
    if (editItem) {
        items = items.map(i => i === editItem ? value : i);
    } else {
        if (items.includes(value)) {
            showMessage('Item already exists');
            return;
        }
        items.push(value);
    }

    setItems(items);
    render(items);
});

/*-- Delegación de eventos (editar / eliminar) --*/
list.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    /*-- Eliminar Item --*/
    if (e.target.closest('.remove-item')) {
        showConfirm(
            'Are you sure you want to delete this item?',
            () => {
                const items = getItems().filter(i => i !== li.dataset.value);
                setItems(items);
                render(items);
            }
        );
    }
    /*-- Editar Item --*/
    else {
        editItem = li.dataset.value;
        input.value = editItem;
        submitBtn.innerHTML = `<i data-lucide="square-pen"></i> Update Item`;
        submitBtn.style.background = 'var(--blue-strong)';
        lucide.createIcons();
    }
});

/*-- Eliminar todos los ítems --*/
clearBtn.addEventListener('click', () => {
    showConfirm(
        'Are you sure you want to clear all items?',
        () => {
            localStorage.removeItem('items');
            render([]);
        }
    );
});

/*-- Filtrado en tiempo real --*/
filter.addEventListener('input', e => {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('#item-list li').forEach(li => {
        li.style.display =
            li.dataset.value.toLowerCase().includes(text)
                ? 'flex'
                : 'none';
    });
});

/*-- Inicialización --*/
document.addEventListener('DOMContentLoaded', () => {
    render();
    lucide.createIcons();
});