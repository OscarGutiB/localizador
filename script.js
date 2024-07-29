const items = {};
const itemList = document.getElementById('itemList');
const totalElement = document.getElementById('total');
const changeElement = document.getElementById('change');
const dailyTotalElement = document.getElementById('dailyTotal');
const amountReceivedInput = document.getElementById('amountReceived');

let dailyTotal = 0; // Variable para almacenar el total diario recaudado

const buttons = document.querySelectorAll('.item-button');
const resetButton = document.getElementById('resetButton');
const calculateChangeButton = document.getElementById('calculateChange');
const addTotalToDailyTotalNoChangeButton = document.getElementById('addTotalToDailyTotalNoChange');

// Teclado numérico
const numericKeys = document.querySelectorAll('.key');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        const item = button.getAttribute('data-item');
        const price = parseFloat(button.getAttribute('data-price'));

        if (!item || isNaN(price)) return; // Si el botón está vacío o el precio no es un número, no hace nada

        if (items[item]) {
            items[item].quantity += 1;
        } else {
            items[item] = { price: price, quantity: 1 };
        }

        updateList();
        updateTotal();
    });
});

resetButton.addEventListener('click', function() {
    Object.keys(items).forEach(item => {
        delete items[item];
    });
    updateList();
    updateTotal();
    amountReceivedInput.value = ''; // Limpiar el campo de monto recibido
    changeElement.textContent = '0.00'; // Reiniciar el cambio a 0
});

calculateChangeButton.addEventListener('click', function() {
    const total = parseFloat(totalElement.textContent);
    const amountReceived = parseFloat(amountReceivedInput.value) || 0;
    const change = amountReceived - total;
    changeElement.textContent = change >= 0 ? change.toFixed(2) : '0.00';

    // Actualizar el total diario recaudado solo si hay cambio
    if (change >= 0) {
        dailyTotal += total;
        dailyTotalElement.textContent = dailyTotal.toFixed(2);
    }
});

addTotalToDailyTotalNoChangeButton.addEventListener('click', function() {
    const total = parseFloat(totalElement.textContent);
    dailyTotal += total;
    dailyTotalElement.textContent = dailyTotal.toFixed(2);

    // Limpiar la lista de artículos y el total
    resetButton.click();
});

function updateList() {
    itemList.innerHTML = '';
    Object.keys(items).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item} x${items[item].quantity} - €${(items[item].price * items[item].quantity).toFixed(2)}
            <button class="decrease-button" data-item="${item}">-</button>
        `;
        itemList.appendChild(li);
    });

    // Agregar evento a los botones de disminuir cantidad
    const decreaseButtons = document.querySelectorAll('.decrease-button');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = button.getAttribute('data-item');
            if (items[item]) {
                items[item].quantity -= 1;
                if (items[item].quantity === 0) {
                    delete items[item];
                }
                updateList();
                updateTotal();
            }
        });
    });
}

function updateTotal() {
    const total = Object.keys(items).reduce((sum, item) => {
        return sum + (items[item].price * items[item].quantity);
    }, 0);
    totalElement.textContent = total.toFixed(2);
}

// Lógica del teclado numérico
numericKeys.forEach(key => {
    key.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const action = this.getAttribute('data-action');
        let inputElement = document.querySelector('input:not([readonly])'); // Selecciona el primer campo de entrada no readonly

        if (inputElement) {
            if (action === 'clear') {
                inputElement.value = '';
            } else if (value === '.') {
                // Si el valor es un punto, agregarlo solo si no está ya presente
                if (!inputElement.value.includes('.')) {
                    inputElement.value += value;
                }
            } else {
                inputElement.value += value;
            }
        }
    });
});
