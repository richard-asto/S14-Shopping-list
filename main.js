const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const submitBtn = form.querySelector('button');

let editItem = null;

/*-- Acceso a Local Storage (Persistencia)--*/
const getItems = () =>
    JSON.parse(localStorage.getItem('items')) || [];

const setItems = items =>
    localStorage.setItem('items', JSON.stringify(items));

/*-- Renderizado de la lista --*/
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

/*-- Control visual de la interfaz --*/
function toggleUI(hasItems) {
    clearBtn.style.display = hasItems ? 'flex' : 'none';
    filter.style.display = hasItems ? 'block' : 'none';

    submitBtn.innerHTML = `<i data-lucide="square-plus"></i> Add Item`;
    submitBtn.style.background = 'var(--blue-main)';
    editItem = null;
    input.value = '';

    lucide.createIcons();
}

/*-- Agregar o editar ítems (Submit del formulario) --*/
form.addEventListener('submit', e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return alert('Please add an item');

    let items = getItems();

    if (editItem) {
        items = items.map(i => i === editItem ? value : i);
    } else {
        if (items.includes(value)) return alert('Item already exists');
        items.push(value);
    }

    setItems(items);
    render(items);
});

/*-- Delegación de eventos (editar / eliminar) --*/
list.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    /*-- Eliminar ítems --*/
    if (e.target.closest('.remove-item')) {
        if (!confirm('Are you sure?')) return;
        const items = getItems().filter(i => i !== li.dataset.value);
        setItems(items);
        render(items);

    }
    /*-- Editar ítems --*/
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
    localStorage.removeItem('items');
    render([]);
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
