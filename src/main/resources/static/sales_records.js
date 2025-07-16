document.addEventListener('DOMContentLoaded', function() {
    addDateFilterUI();
    fetchSales();
});

function addDateFilterUI() {
    const container = document.querySelector('.filter-container') || document.body;
    let filterDiv = document.getElementById('dateFilterDiv');
    if (!filterDiv) {
        filterDiv = document.createElement('div');
        filterDiv.id = 'dateFilterDiv';
        filterDiv.className = 'mb-3';
        filterDiv.innerHTML = `
            <label class="mr-2">From: <input type="date" id="fromDate" class="mr-2"></label>
            <label class="mr-2">To: <input type="date" id="toDate" class="mr-2"></label>
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
        const from = document.getElementById('fromDate').value;
        const to = document.getElementById('toDate').value;
        fetchSales(from, to);
    };
    document.getElementById('clearFilterBtn').onclick = function() {
        document.getElementById('fromDate').value = '';
        document.getElementById('toDate').value = '';
        fetchSales();
    };
}

function fetchSales(fromDate, toDate) {
    let url = '/api/sales';
    if (fromDate || toDate) {
        const params = [];
        if (fromDate) params.push(`from=${encodeURIComponent(fromDate)}`);
        if (toDate) params.push(`to=${encodeURIComponent(toDate)}`);
        url += '?' + params.join('&');
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
        // Use sale.employee.employee_number if available
        let empNum = sale.employee && sale.employee.employee_number ? sale.employee.employee_number : '';
        let dateStr = sale.added_datetime ? new Date(sale.added_datetime).toLocaleString() : '';
        tr.innerHTML = `
            <td>${sale.salesnumber}</td>
            <td>${dateStr}</td>
            <td>${sale.total_amount}</td>
            <td>${sale.paid_amount}</td>
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
    // Use sale.employee.employee_number if available
    let empNum = sale.employee && sale.employee.employee_number ? sale.employee.employee_number : '';
    let dateStr = sale.added_datetime ? new Date(sale.added_datetime).toLocaleString() : '';
    return `
    <div class="mb-3">
        <h5>Sale #: <span class="text-primary">${sale.salesnumber}</span></h5>
        <div>Date: ${dateStr}</div>
        <div>Total Amount: <b>${sale.total_amount}</b></div>
        <div>Paid Amount: <b>${sale.paid_amount}</b></div>
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
