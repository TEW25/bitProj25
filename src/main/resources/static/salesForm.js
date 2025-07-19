// salesForm.js - Handles form inputs, totals, and sale submission for the New Sale page

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
        itemsHtml = `<table class="table table-bordered" style="table-layout:fixed;width:100%"><thead><tr>
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
        itemsHtml += '</tbody></table>';
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
    // Show modal (Bootstrap 4)
    $('#salesSuccessModal').modal('show');
}