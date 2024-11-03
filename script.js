// Buat pilihan mata uang secara manual tanpa API
const currencyDropdown = document.getElementById('currency');

// Tambahkan opsi mata uang "Rp" dan "$"
const currencies = ['Rp', '$', '€', '£', '¥'];
currencies.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = currency;
    currencyDropdown.appendChild(option);
});

document.getElementById('generate-pdf').addEventListener('click', generatePDF);
document.getElementById('add-item').addEventListener('click', addItem);
document.getElementById('currency').addEventListener('change', updateCurrency);
document.getElementById('tax-rate').addEventListener('input', updateAmounts);

let selectedCurrencySymbol = 'Rp'; // Default currency symbol is 'Rp'

function generatePDF() {
    const element = document.getElementById('invoice');
    const opt = {
        margin: 0.3,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function addItem() {
    const table = document.getElementById('invoice-items').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const itemCell = newRow.insertCell(0);
    const quantityCell = newRow.insertCell(1);
    const rateCell = newRow.insertCell(2);
    const amountCell = newRow.insertCell(3);

    itemCell.innerHTML = '<input type="text" placeholder="Item Description">';
    quantityCell.innerHTML = '<input type="number" value="1" class="quantity" oninput="updateItemAmount(this)">';
    rateCell.innerHTML = '<input type="text" value="0" class="rate" oninput="updateItemAmount(this)">';
    amountCell.className = 'amount';
    amountCell.textContent = '0'; // Hanya angka, tanpa simbol mata uang
}

function updateItemAmount(input) {
    const row = input.closest('tr');
    const quantity = row.querySelector('.quantity').value;
    const rate = parseFloat(row.querySelector('.rate').value) || 0;
    const amount = quantity * rate;

    row.querySelector('.amount').textContent = amount.toFixed(2); // Update Amount
    updateAmounts();
}

function updateCurrency() {
    // Ambil nilai currency yang dipilih dari dropdown
    selectedCurrencySymbol = document.getElementById('currency').value;
    updateAmounts(); // Perbarui tampilan amounts dengan simbol mata uang yang dipilih
}

function updateAmounts() {
    const rows = document.querySelectorAll('#invoice-items tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.amount').textContent) || 0;
        subtotal += amount;
    });

    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    // Tampilkan simbol mata uang di depan angka subtotal, tax, dan total
    document.getElementById('subtotal').textContent = selectedCurrencySymbol + ' ' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = selectedCurrencySymbol + ' ' + tax.toFixed(2);
    document.getElementById('total').textContent = selectedCurrencySymbol + ' ' + total.toFixed(2);
}
