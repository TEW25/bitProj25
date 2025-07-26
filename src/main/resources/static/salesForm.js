// salesForm.js - Handles form inputs, totals, and sale submission for the New Sale page

function resetSaleForm() {
    document.getElementById('subtotal').value = '';
    document.getElementById('globalDiscount').value = 0;
    document.getElementById('totalAmount').value = '';
    document.getElementById('paidAmount').value = 0;
    document.getElementById('balanceAmount').value = '';
    document.getElementById('paymentType').selectedIndex = 0;
    // Remove all cart rows
    const tbody = document.getElementById('cartTableBody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    // Add a fresh row
    addCartRow();
}

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

document.addEventListener('DOMContentLoaded', function () {
    // Add first item row by default
    addCartRow();

    // Add item row on button click
    document.getElementById('addItemBtn').addEventListener('click', addCartRow);

    // Update totals on global discount or paid amount change
    document.getElementById('globalDiscount').addEventListener('input', updateTotals);
    document.getElementById('paidAmount').addEventListener('input', updateTotals);

    // Inject modal HTML
    fetch('sales_success_modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('salesSuccessModalContainer').innerHTML = html;
            // Attach reset handler after modal is loaded
            $(document).on('hidden.bs.modal', '#salesSuccessModal', function () {
                resetSaleForm();
            });
        });
    // Submit sale
    document.getElementById('submitSaleBtn').addEventListener('click', submitSale);
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
    // Get employeeId from global variable (set in sales.js)
    let employeeId = null;
    if (typeof loggedInEmpId !== 'undefined' && loggedInEmpId !== null) {
        employeeId = loggedInEmpId;
        console.log(employeeId)
    } else if (window.loggedInEmpId) {
        employeeId = window.loggedInEmpId;
        console.log(employeeId)
    }
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
        items: items,
        employeeId: employeeId
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
        // Show modal with sale details
        showSalesSuccessModal(data);
    })
    .catch(error => {
        console.error('Error submitting sale:', error);
        alert('Error submitting sale. Please try again.');
    });
}

function showSalesSuccessModal(sale) {
    // Compose sale details HTML
    let itemsHtml = '';
    function showZero(val) {
        if (val === undefined || val === null || val === "" || val === false) return "";
        if (val === 0 || val === "0" || val === 0.00 || val === "0.00") return "0";
        return val;
    }
    if (sale.items && sale.items.length > 0) {
        itemsHtml = `<div class="card shadow-sm mb-3"><div class="card-body p-0">
        <div class="table-responsive">
        <table class="table table-bordered table-hover table-striped align-middle mb-0" style="table-layout:fixed;width:100%"><thead class="table-light sticky-top"><tr>
            <th style="width:40%">Item</th>
            <th style="width:20%">Qty</th>
            <th style="width:20%">Unit Price</th>
            <th style="width:20%">Line Total</th>
        </tr></thead><tbody>`;
        sale.items.forEach(item => {
            itemsHtml += `<tr>
                <td style="word-break:break-word;">${item.item ? (item.item.itemcode + ' - ' + item.item.itemname) : ''}</td>
                <td>${showZero(item.quantity)}</td>
                <td>${showZero(item.sales_price)}</td>
                <td>${showZero(item.line_price)}</td>
            </tr>`;
        });
        itemsHtml += '</tbody></table></div></div></div>';
    }
    function showDiscount(val) {
        if (val === undefined || val === null || val === "" || val === 0 || val === "0" || val === 0.00 || val === "0.00") return "None";
        return val;
    }
    let html = `
        <div class="mb-2"><strong>Sales Number:</strong> ${sale.salesnumber || ''}</div>
        <div class="mb-2"><strong>Total Amount:</strong> ${showZero(sale.total_amount || sale.totalAmount)}</div>
        <div class="mb-2"><strong>Paid Amount:</strong> ${showZero(sale.paid_amount || sale.paidAmount)}</div>
        <div class="mb-2"><strong>Balance:</strong> ${showZero(sale.balance_amount || sale.balanceAmount)}</div>
        <div class="mb-2"><strong>Discount:</strong> ${showDiscount(sale.discount)}</div>
        <div class="mb-2"><strong>Subtotal:</strong> ${showZero(sale.subtotal)}</div>
        <div class="mb-2"><strong>Payment Type:</strong> ${sale.paymentType || ''}</div>
        <div class="mb-2"><strong>Date:</strong> ${sale.added_datetime || ''}</div>
        <hr>
        <h5>Items</h5>
        ${itemsHtml}
    `;
    document.getElementById('salesSuccessDetails').innerHTML = html;
    // Show modal (Bootstrap 5)
    var modal = document.getElementById('salesSuccessModal');
    var bsModal = bootstrap.Modal.getOrCreateInstance(modal);
    bsModal.show();
}
