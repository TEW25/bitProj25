document.addEventListener('DOMContentLoaded', function() {
    addDateFilterUI();
    // Set filter to today and show today's sales
    const todayStr = new Date().toISOString().slice(0, 10);
    document.getElementById('filterDate').value = todayStr;
    fetchSales(todayStr);
});

function addDateFilterUI() {
    const container = document.querySelector('.filter-container') || document.body;
    let filterDiv = document.getElementById('dateFilterDiv');
    if (!filterDiv) {
        filterDiv = document.createElement('div');
        filterDiv.id = 'dateFilterDiv';
        filterDiv.className = 'mb-3';
        filterDiv.innerHTML = `
            <label class="mr-2">Date: <input type="date" id="filterDate" class="mr-2"></label>
            <button class="btn btn-primary btn-sm" id="filterBtn">Filter</button>
            <button class="btn btn-secondary btn-sm ml-2" id="clearFilterBtn">Clear</button>
        `;
        // Insert above the table if possible
        const table = document.getElementById('salesTable');
        if (table && table.parentNode) {
            table.parentNode.insertBefore(filterDiv, table);
        } else {
            container.insertBefore(filterDiv, container.firstChild);
        }
    }
    document.getElementById('filterBtn').onclick = function() {
        const date = document.getElementById('filterDate').value;
        fetchSales(date);
    };
    document.getElementById('clearFilterBtn').onclick = function() {
        // Reset to today
        const todayStr = new Date().toISOString().slice(0, 10);
        document.getElementById('filterDate').value = todayStr;
        fetchSales(todayStr);
    };
}

function fetchSales(date) {
    let url = '/api/sales';
    if (date) {
        url += `?date=${encodeURIComponent(date)}`;
    }
    fetch(url)
        .then(res => res.json())
        .then(data => populateSalesTable(data))
        .catch(() => alert('Failed to load sales records.'));
}

function populateSalesTable(sales) {
    const tbody = document.querySelector('#salesTable tbody');
    tbody.innerHTML = '';
    sales.forEach(sale => {
        const tr = document.createElement('tr');
        tr.classList.add('sale-row');
        let empNum = sale.employee && sale.employee.employee_number ? sale.employee.employee_number : '';
        let dateStr = sale.added_datetime ? new Date(sale.added_datetime).toLocaleString() : '';
        tr.innerHTML = `
            <td>${sale.salesnumber}</td>
            <td>${dateStr}</td>
            <td>${sale.total_amount}</td>
            <td>${sale.paid_amount}</td>
            <td>${sale.paymentType || sale.payment_type || ''}</td>
            <td>${sale.balanceAmount || sale.balance_amount || ''}</td>
            <td>${sale.discount}</td>
            <td>${sale.subtotal}</td>
            <td>${empNum}</td>
        `;
        tr.addEventListener('click', () => showSaleDetails(sale.id));
        tbody.appendChild(tr);
    });
}

function showSaleDetails(saleId) {
    fetch(`/api/sales/${saleId}`)
        .then(res => res.json())
        .then(sale => {
            const content = document.getElementById('saleDetailsContent');
            content.innerHTML = renderSaleDetails(sale);
            const modal = new bootstrap.Modal(document.getElementById('saleDetailsModal'));
            modal.show();
        })
        .catch(() => alert('Failed to load sale details.'));
}

function renderSaleDetails(sale) {
    let empNum = sale.employee && sale.employee.employee_number ? sale.employee.employee_number : '';
    let dateStr = sale.added_datetime ? new Date(sale.added_datetime).toLocaleString() : '';
    return `
    <div class="mb-3">
        <h5>Sale #: <span class="text-primary">${sale.salesnumber}</span></h5>
        <div>Date: ${dateStr}</div>
        <div>Total Amount: <b>${sale.total_amount}</b></div>
        <div>Paid Amount: <b>${sale.paid_amount}</b></div>
        <div>Payment Type: <b>${sale.paymentType || sale.payment_type || ''}</b></div>
        <div>Balance Amount: <b>${sale.balanceAmount || sale.balance_amount || ''}</b></div>
        <div>Discount: <b>${sale.discount}</b></div>
        <div>Subtotal: <b>${sale.subtotal}</b></div>
        <div>Added By: ${empNum}</div>
    </div>
    <h6>Items</h6>
    <div class="table-responsive">
    <table class="table table-sm table-details">
        <thead class="table-light">
            <tr>
                <th>Item Name</th>
                <th>Sales Price</th>
                <th>Quantity</th>
                <th>Line Total</th>
            </tr>
        </thead>
        <tbody>
            ${sale.items && sale.items.length ? sale.items.map(item => `
                <tr>
                    <td>${item.item ? (item.item.itemname || item.item.name || '') : ''}</td>
                    <td>${item.sales_price}</td>
                    <td>${item.quantity}</td>
                    <td>${item.line_price}</td>
                </tr>
            `).join('') : '<tr><td colspan="4">No items</td></tr>'}
        </tbody>
    </table>
    </div>
    `;
}
