const editSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256">
                        <rect width="256" height="256" fill="none"></rect>
                        <polygon points="128 160 96 160 96 128 192 32 224 64 128 160" fill="rgb(20, 255, 80)"
                            stroke="rgb(20, 255, 80)" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
                        </polygon>
                        <path d="M216,120v88a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h88" fill="none"
                            stroke="rgb(20, 255, 80)" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
                        </path>
                    </svg>`;

const removeSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="rgb(255, 109, 109)" viewBox="0 0 256 256">
                        <rect width="256" height="256" fill="none"></rect>
                        <path
                            d="M215.99609,48H176V40a24.02718,24.02718,0,0,0-24-24H104A24.02718,24.02718,0,0,0,80,40v8H39.99609a8,8,0,0,0,0,16h8V208a16.01833,16.01833,0,0,0,16,16h128a16.01833,16.01833,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8.00917,8.00917,0,0,1,8-8h48a8.00917,8.00917,0,0,1,8,8Z">
                        </path>
                    </svg>`;

const input = document.querySelector('form input');
const btn = document.querySelector('.submit');
const list = document.querySelector('.list');
const clear = document.querySelector('.clear');

let groceries = [];
let editElement = null;

// Function

const buildElement = (generator) => {
    const { tag, classes, data, text } = generator;
    const element = document.createElement(tag);
    if (classes) element.classList.add(classes);
    if (data) element.dataset[data.dataAttr] = data.dataInfo;
    if (text) element.textContent = text;
    return element;
}

const printInfoMsg = (msg, add) => {
    const info = document.querySelector('.info');
    info.textContent = msg;
    info.classList.remove(info.classList.item(1));
    info.classList.add(add);
    setTimeout(() => {
        info.classList.remove(add);
    }, 3000);
}

const addItem = (item) => {
    const id = new Date().getTime().toString();

    item = item[0].toUpperCase() + item.slice(1);
    groceries.push(
        {
            name: item,
            id: id
        }
    );

    printInfoMsg('Item added to the list.', 'green');

    const itemContainer = buildElement({
        tag: 'div',
        classes: 'item',
        data: {
            dataAttr: 'id',
            dataInfo: id
        }
    });
    const itemName = buildElement({ tag: 'p', text: item });
    const edit = buildElement({
        tag: 'button',
        data: {
            dataAttr: 'type',
            dataInfo: 'edit'
        }
    });
    edit.innerHTML = editSVG;
    const remove = buildElement({
        tag: 'button',
        data: {
            dataAttr: 'type',
            dataInfo: 'remove'
        }
    });
    remove.innerHTML = removeSVG;

    itemContainer.appendChild(itemName);
    itemContainer.appendChild(edit);
    itemContainer.appendChild(remove);

    list.appendChild(itemContainer);
}

const editItem = (newItem) => {
    editElement[0].textContent = newItem;
    editElement[1].name = newItem;

    printInfoMsg('Item edited successfully.', 'green');

    btn.textContent = 'Submit';
    editElement = null;
}

const removeItem = (itemIdToRemove) => {
    groceries = groceries.filter(item => item.id !== itemIdToRemove);

    printInfoMsg('Item deleted successfully.', 'red');
    if (list.firstElementChild) clear.classList.add('hasElement');
    else clear.classList.remove('hasElement');
}

// Code

btn.addEventListener('click', e => {
    e.preventDefault();

    let item = input.value;

    if (item === '' || item === ' ') {
        printInfoMsg('Please, enter value.', 'red');
    }
    else {
        if (btn.textContent === 'Submit') {
            addItem(item);
        }
        else {
            editItem(item);
        }
    }

    if (list.firstElementChild) clear.classList.add('hasElement');
    else clear.classList.remove('hasElement');

    input.value = '';
    input.focus();
}, false);

list.addEventListener('click', e => {
    if (!e.target.closest('button')) return;

    const btnClicked = e.target.closest('button');
    const itemElement = btnClicked.parentElement;
    const itemId = itemElement.dataset.id;
    const btnType = btnClicked.dataset.type;

    if (btnType === 'edit') {
        btn.textContent = 'Edit';
        editElement = [itemElement.querySelector('p'), groceries.find(item => item.id === itemId)];
        input.value = editElement[1].name;
    }
    else {
        btnClicked.parentElement.remove();
        removeItem(itemId);
    }

    input.focus();
}, false);

clear.addEventListener('click', () => {
    while(list.firstElementChild) list.firstElementChild.remove();

    while(groceries[0]) groceries.shift();

    printInfoMsg('All items were removed successfully.', 'red');

    clear.classList.remove('hasElement');
}, false);