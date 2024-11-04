// Pilihan Mata Uang
const currencyDropdown = document.getElementById('currency');
const currencies = ['Rp', '$', '€', '£', '¥'];

currencies.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency;
    option.textContent = currency;
    currencyDropdown.appendChild(option);
});

// Event Listeners
document.getElementById('generate-pdf').addEventListener('click', generatePDF);
document.getElementById('add-item').addEventListener('click', addItem);
document.getElementById('removedLineItem').addEventListener('click', removeLastItem); // Event untuk - Line Item
document.getElementById('currency').addEventListener('change', updateCurrency);
document.getElementById('tax-rate').addEventListener('input', updateAmounts);

let selectedCurrencySymbol = 'Rp'; // Default currency symbol

// Fungsi Generate PDF
function generatePDF() {
    const element = document.getElementById('invoice');
    const opt = {
        margin: 0.3,
        filename: 'invoice_hd.pdf',
        image: { type: 'jpeg', quality: 1.0 }, // Maksimalkan kualitas gambar
        html2canvas: { scale: 3, useCORS: true }, // Tingkatkan skala untuk resolusi lebih tinggi
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}


// Fungsi Tambah Baris Item
function addItem() {
    const table = document.getElementById('invoice-items').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    // Membuat sel untuk setiap kolom (Item, Quantity, Rate, Amount)
    const itemCell = newRow.insertCell(0);
    const quantityCell = newRow.insertCell(1);
    const rateCell = newRow.insertCell(2);
    const amountCell = newRow.insertCell(3);

    itemCell.innerHTML = '<input type="text" placeholder="Item Description">';
    quantityCell.innerHTML = '<input type="number" value="1" class="quantity" oninput="updateItemAmount(this)">';
    rateCell.innerHTML = '<input type="text" value="0" class="rate" oninput="updateItemAmount(this)">';
    amountCell.className = 'amount';
    amountCell.textContent = '0';

    updateAmounts(); // Memperbarui subtotal, tax, dan total setelah menambahkan item baru
}

// Fungsi Hapus Baris Terakhir
function removeLastItem() {
    const tableBody = document.getElementById('invoice-items').getElementsByTagName('tbody')[0];
    
    // Hanya hapus jika ada lebih dari satu baris di tabel
    if (tableBody.rows.length > 1) {
        tableBody.deleteRow(tableBody.rows.length - 1); // Menghapus baris terakhir
        updateAmounts(); // Memperbarui subtotal, tax, dan total setelah menghapus item
    }
}

// Fungsi Update Jumlah Item
function updateItemAmount(input) {
    const row = input.closest('tr');
    const quantity = row.querySelector('.quantity').value;
    const rate = parseFloat(row.querySelector('.rate').value) || 0;
    const amount = quantity * rate;
    row.querySelector('.amount').textContent = amount.toFixed(2);
    updateAmounts();
}

// Fungsi Update Simbol Mata Uang
function updateCurrency() {
    selectedCurrencySymbol = document.getElementById('currency').value;
    updateAmounts();
}

// Fungsi Update Subtotal, Pajak, dan Total
function updateAmounts() {
    const rows = document.querySelectorAll('#invoice-items tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.amount').textContent) || 0;
        subtotal += amount;
    });

  

    // Update tampilan
    document.getElementById('subtotal').textContent = selectedCurrencySymbol + ' ' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = selectedCurrencySymbol + ' ' + tax.toFixed(2);
    document.getElementById('total').textContent = selectedCurrencySymbol + ' ' + total.toFixed(2);
}
// Event Listener untuk tombol Add Tax
document.getElementById('add-tax').addEventListener('click', function() {
    const taxRow = document.getElementById('tax-row');
    
    // Jika tax-row sedang ditampilkan, sembunyikan dan reset nilai pajak
    if (taxRow.style.display === 'flex') {
        taxRow.style.display = 'none';
        document.getElementById('tax-rate').value = 0; // Reset nilai pajak ke 0
    } else {
        taxRow.style.display = 'flex';
    }
    updateAmounts(); // Perbarui total setelah tax diaktifkan atau dihapus
});

// Event Listener untuk tombol Add Discount
document.getElementById('add-discount').addEventListener('click', function() {
    const discountRow = document.getElementById('discount-row');
    
    // Jika discount-row sedang ditampilkan, sembunyikan dan reset nilai diskon
    if (discountRow.style.display === 'flex') {
        discountRow.style.display = 'none';
        document.getElementById('discount-rate').value = 0; // Reset nilai diskon ke 0
    } else {
        discountRow.style.display = 'flex';
    }
    updateAmounts(); // Perbarui total setelah discount diaktifkan atau dihapus
});

// Event Listener untuk perubahan input tax dan discount
document.getElementById('tax-rate').addEventListener('input', updateAmounts);
document.getElementById('discount-rate').addEventListener('input', updateAmounts);

function updateAmounts() {
    const rows = document.querySelectorAll('#invoice-items tbody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.amount').textContent) || 0;
        subtotal += amount;
    });

    // Ambil nilai tax dan discount jika kolomnya ditampilkan, jika tidak gunakan nilai 0
    const taxRate = document.getElementById('tax-row').style.display === 'flex' ? parseFloat(document.getElementById('tax-rate').value) || 0 : 0;
    const tax = (subtotal * taxRate) / 100;

    const discountRate = document.getElementById('discount-row').style.display === 'flex' ? parseFloat(document.getElementById('discount-rate').value) || 0 : 0;
    const discount = (subtotal * discountRate) / 100;

    const total = subtotal + tax - discount;

    // Update tampilan
    document.getElementById('subtotal').textContent = selectedCurrencySymbol + ' ' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = selectedCurrencySymbol + ' ' + tax.toFixed(2);
    document.getElementById('discount').textContent = '- ' + selectedCurrencySymbol + ' ' + discount.toFixed(2);
    document.getElementById('total').textContent = selectedCurrencySymbol + ' ' + total.toFixed(2);
}
