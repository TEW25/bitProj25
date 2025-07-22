let currentPage = 0;
let pageSize = 10;
let lastPage = 0;
let lastDate = null;

document.addEventListener('DOMContentLoaded', function() {
    addDateFilterUI();
    addPaginationUI();
    // Set filter to today (local date) and show today's sales
    const todayStr = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format
    document.getElementById('filterDate').value = todayStr;
    fetchSales(todayStr, currentPage);
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
        <button class="btn btn-success btn-sm ml-2" id="exportExcelBtn"><i class="bi bi-file-earmark-excel"></i> Export as Excel</button>
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
        // Reset to today (local date)
        const todayStr = new Date().toLocaleDateString('en-CA');
        document.getElementById('filterDate').value = todayStr;
        fetchSales(todayStr);
    };

    document.getElementById('exportExcelBtn').onclick = function() {
        exportTableToExcelXLSX('salesTable', 'sales_records');
    };
}

// Export table to real .xlsx using SheetJS
function exportTableToExcelXLSX(tableId, filename = '') {
    const table = document.getElementById(tableId);
    if (!table) return;
    /* Convert table to worksheet */
    const wb = XLSX.utils.table_to_book(table, {sheet: "Sales Records"});
    filename = filename ? filename + '.xlsx' : 'export.xlsx';
    XLSX.writeFile(wb, filename);
}

function fetchSales(date, page = 0) {
    lastDate = date;
    let url = '/api/sales';
    let params = [];
    if (date) {
        params.push(`date=${encodeURIComponent(date)}`);
    }
    params.push(`page=${page}`);
    params.push(`size=${pageSize}`);
    if (params.length) {
        url += '?' + params.join('&');
    }
    fetch(url)
        .then(res => res.json())
        .then(data => {
            populateSalesTable(data.content);
            updatePagination(data);
        })
        .catch(() => alert('Failed to load sales records.'));
}

function populateSalesTable(sales) {
    const tbody = document.querySelector('#salesTable tbody');
    tbody.innerHTML = '';
    // Sort sales by added_datetime descending (newest first)
    sales.sort((a, b) => {
        const dateA = new Date(a.added_datetime || a.date || 0).getTime();
        const dateB = new Date(b.added_datetime || b.date || 0).getTime();
        return dateB - dateA;
    });
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

function addPaginationUI() {
    let table = document.getElementById('salesTable');
    if (!table) return;
    let paginationDiv = document.getElementById('salesPagination');
    if (!paginationDiv) {
        paginationDiv = document.createElement('nav');
        paginationDiv.id = 'salesPagination';
        paginationDiv.className = 'mt-3';
        table.parentNode.insertBefore(paginationDiv, table.nextSibling);
    }
    paginationDiv.innerHTML = `<ul class="pagination justify-content-center"></ul>`;
}

function updatePagination(pageData) {
    lastPage = pageData.totalPages;
    currentPage = pageData.number;
    let paginationDiv = document.getElementById('salesPagination');
    if (!paginationDiv) return;
    let ul = paginationDiv.querySelector('ul');
    ul.innerHTML = '';
    // Previous button
    ul.appendChild(createPageItem('Previous', currentPage > 0 ? currentPage - 1 : null, currentPage === 0));
    // Page numbers
    for (let i = 0; i < pageData.totalPages; i++) {
        ul.appendChild(createPageItem(i + 1, i, i === currentPage));
    }
    // Next button
    ul.appendChild(createPageItem('Next', currentPage < pageData.totalPages - 1 ? currentPage + 1 : null, currentPage === pageData.totalPages - 1));
}

function createPageItem(text, page, disabled) {
    let li = document.createElement('li');
    li.className = 'page-item' + (disabled ? ' disabled' : '');
    let a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.innerText = text;
    if (!disabled && page !== null) {
        a.onclick = function(e) {
            e.preventDefault();
            fetchSales(lastDate, page);
        };
    }
    li.appendChild(a);
    return li;
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
