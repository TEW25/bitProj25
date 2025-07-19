// sales.js - Handles the New Sale page logic

document.addEventListener('DOMContentLoaded', function () {
    // Add first item row by default
    addCartRow();

    // Add item row on button click
    document.getElementById('addItemBtn').addEventListener('click', addCartRow);

    // Update totals on global discount or paid amount change
    document.getElementById('globalDiscount').addEventListener('input', updateTotals);
    document.getElementById('paidAmount').addEventListener('input', updateTotals);

    // Submit sale
    document.getElementById('submitSaleBtn').addEventListener('click', submitSale);
});

function addCartRow() {
    const tbody = document.getElementById('cartTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="position-relative">
                <input type="text" class="form-control item-search" placeholder="Search by code or name" autofocus>
                <div class="dropdown-menu w-100 item-search-dropdown" style="display: none;"></div>
            </div>
        </td>
        <td><input type="text" class="form-control available-qty" readonly></td>
        <td><input type="number" class="form-control quantity" min="1" value="1"></td>
        <td><input type="number" class="form-control unit-price" min="0" step="0.01" readonly></td>
        <td><input type="number" class="form-control discount" min="0" max="100" value="0"></td>
        <td><input type="text" class="form-control line-total" readonly></td>
        <td><button type="button" class="btn btn-danger btn-sm remove-row">Remove</button></td>
    `;
    tbody.appendChild(row);

    // Attach events
    const searchInput = row.querySelector('.item-search');
    searchInput.addEventListener('input', handleItemSearch);
    searchInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            handleItemSearch({target: this});
        }
    });
    
    row.querySelector('.quantity').addEventListener('input', updateLineTotal);
    row.querySelector('.unit-price').addEventListener('input', updateLineTotal);
    row.querySelector('.discount').addEventListener('input', updateLineTotal);
    row.querySelector('.remove-row').addEventListener('click', function () {
        row.remove();
        updateTotals();
    });
}

function handleItemSearch(e) {
    const input = e.target;
    const value = input.value.trim();
    const row = input.closest('tr');
    const dropdown = input.parentElement.querySelector('.item-search-dropdown');
    
    if (value.length < 2) {
        dropdown.style.display = 'none';
        return;
    }
    
    // Show loading state
    dropdown.innerHTML = '<div class="dropdown-item">Searching...</div>';
    dropdown.style.display = 'block';
    
    // Fetch items from backend
    fetch(`/api/inventory/available-items?search=${encodeURIComponent(value)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            dropdown.innerHTML = '';
            
            if (!items || items.length === 0) {
                const option = document.createElement('div');
                option.className = 'dropdown-item';
                option.textContent = 'No items found';
                dropdown.appendChild(option);
            } else {
                items.forEach(inv => {
                    const item = inv.item || {};
                    const option = document.createElement('div');
                    option.className = 'dropdown-item';
                    option.innerHTML = `
                        <div><strong>${item.itemcode || ''}</strong> - ${item.itemname || ''}</div>
                        <small class="text-muted">Available: ${inv.availableqty || 0}</small>
                    `;
                    option.addEventListener('click', () => {
                        input.value = `${item.itemcode || ''} - ${item.itemname || ''}`;
                        row.dataset.itemId = item.id;
                        row.querySelector('.available-qty').value = inv.availableqty;
                        // Try multiple possible price fields
                        let unitPrice = item.price || item.unitprice || item.salesprice || inv.unitprice || inv.price || 0;
                        row.querySelector('.unit-price').value = unitPrice;
                        row.querySelector('.quantity').max = inv.availableqty;
                        row.querySelector('.quantity').disabled = inv.availableqty <= 0;
                        updateLineTotal.call(row.querySelector('.quantity'));
                        dropdown.style.display = 'none';
                    });
                    dropdown.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error searching items:', error);
            dropdown.innerHTML = '<div class="dropdown-item text-danger">Error loading items</div>';
        });
}

// Add event listener to close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.position-relative')) {
        document.querySelectorAll('.item-search-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

function updateLineTotal() {
    const row = this.closest('tr');
    const qty = parseFloat(row.querySelector('.quantity').value) || 0;
    const price = parseFloat(row.querySelector('.unit-price').value) || 0;
    const discount = parseFloat(row.querySelector('.discount').value) || 0;
    const available = parseFloat(row.querySelector('.available-qty').value) || 0;
    // Validate quantity
    if (qty > available) {
        row.querySelector('.quantity').value = available;
        alert('Not enough quantity available!');
    }
    const lineTotal = qty * price * (1 - discount / 100);
    row.querySelector('.line-total').value = lineTotal.toFixed(2);
    updateTotals();
}

function updateTotals() {
    let subtotal = 0;
    document.querySelectorAll('#cartTableBody tr').forEach(row => {
        subtotal += parseFloat(row.querySelector('.line-total').value) || 0;
    });
    document.getElementById('subtotal').value = subtotal.toFixed(2);
    const globalDiscount = parseFloat(document.getElementById('globalDiscount').value) || 0;
    const total = subtotal * (1 - globalDiscount / 100);
    document.getElementById('totalAmount').value = total.toFixed(2);
    const paid = parseFloat(document.getElementById('paidAmount').value) || 0;
    const balance = total - paid;
    document.getElementById('balanceAmount').value = balance.toFixed(2);
}

function submitSale() {
    // Validate
    const rows = document.querySelectorAll('#cartTableBody tr');
    if (rows.length === 0) {
        alert('Add at least one item.');
        return;
    }
    let valid = true;
    const items = [];
    rows.forEach(row => {
        const itemId = row.dataset.itemId;
        const qty = parseFloat(row.querySelector('.quantity').value) || 0;
        const price = parseFloat(row.querySelector('.unit-price').value) || 0;
        const discount = parseFloat(row.querySelector('.discount').value) || 0;
        const lineTotal = parseFloat(row.querySelector('.line-total').value) || 0;
        if (!itemId || qty <= 0 || price < 0) valid = false;
        items.push({ itemId, quantity: qty, salesPrice: price, discount, linePrice: lineTotal });
    });
    if (!valid) {
        alert('Please fill all item details correctly.');
        return;
    }
    // Prepare sale data
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
    const paidAmount = parseFloat(document.getElementById('paidAmount').value) || 0;
    const balanceAmount = parseFloat(document.getElementById('balanceAmount').value) || 0;
    const discount = parseFloat(document.getElementById('globalDiscount').value) || 0;
    const paymentType = document.getElementById('paymentType').value;
    const sale = {
        subtotal: subtotal,
        totalAmount: totalAmount,
        total_amount: totalAmount,
        paidAmount: paidAmount,
        paid_amount: paidAmount,
        balanceAmount: balanceAmount,
        balance_amount: balanceAmount,
        discount: discount,
        paymentType: paymentType,
        items: items
    };
    // Send to backend
    fetch('/api/sales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sale)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit sale');
        }
        return response.json();
    })
    .then(data => {
        alert('Sale submitted successfully! Sales Number: ' + (data.salesnumber || '')); 
        // Optionally, reset form or reload page
        location.reload();
    })
    .catch(error => {
        console.error('Error submitting sale:', error);
        alert('Error submitting sale. Please try again.');
    });
}
