async function fetchRecords() {
    const supplierId = document.getElementById('supplierDropdownSelect').value;
    const date = document.getElementById('date').value;
    const page = window.currentPage || 0;
    const size = 10; // records per page
    let url = '/api/itemreceivenotes';
    const params = [];
    if (supplierId) params.push(`supplierId=${encodeURIComponent(supplierId)}`);
    if (date) params.push(`date=${encodeURIComponent(date)}`);
    params.push(`page=${page}`);
    params.push(`size=${size}`);
    if (params.length > 0) url += '?' + params.join('&');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch records');
        const data = await response.json();
        renderTable(data.content);
        renderPagination(data);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Fetch suppliers and populate dropdown
async function populateSupplierDropdown() {
    const dropdown = document.getElementById('supplierDropdownSelect');
    dropdown.innerHTML = '<option value="">All Suppliers</option>';
    try {
        const response = await fetch('/api/suppliers');
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const suppliers = await response.json();
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.suppliername + ' (' + supplier.id + ')';
            dropdown.appendChild(option);
        });
    } catch (err) {
        // Optionally show error or leave dropdown as is
    }
}
function renderTable(records) {
    // Records are rendered in the order received from backend (sorted by date descending, newest first)
    const tbody = document.querySelector('#irnTable tbody');
    tbody.innerHTML = '';
    if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No records found.</td></tr>';
        return;
    }
    records.forEach(irn => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${irn.id}</td>
            <td>${irn.receiveddate ? irn.receiveddate : ''}</td>
            <td>${irn.totalamount ?? ''}</td>
            <td>${irn.discountrate ?? ''}</td>
            <td>${irn.grossamount ?? ''}</td>
            <td>${irn.purchaseorder && irn.purchaseorder.purchaseordercode ? irn.purchaseorder.purchaseordercode : ''}</td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => fetchAndShowIrnDetail(irn.id));
        tbody.appendChild(row);
    });
}

function renderPagination(data) {
    let paginationDiv = document.getElementById('paginationControls');
    if (!paginationDiv) {
        paginationDiv = document.createElement('div');
        paginationDiv.id = 'paginationControls';
        paginationDiv.className = 'd-flex justify-content-center my-3';
        document.getElementById('irnTable').after(paginationDiv);
    }
    paginationDiv.innerHTML = '';
    if (!data || data.totalPages <= 1) return;
    const page = data.number;
    const totalPages = data.totalPages;
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'btn btn-outline-primary mx-1';
    prevBtn.disabled = page === 0;
    prevBtn.onclick = () => { window.currentPage = page - 1; fetchRecords(); };
    paginationDiv.appendChild(prevBtn);

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = (i + 1);
        btn.className = 'btn btn-outline-secondary mx-1' + (i === page ? ' active' : '');
        btn.disabled = i === page;
        btn.onclick = () => { window.currentPage = i; fetchRecords(); };
        paginationDiv.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.className = 'btn btn-outline-primary mx-1';
    nextBtn.disabled = page === totalPages - 1;
    nextBtn.onclick = () => { window.currentPage = page + 1; fetchRecords(); };
    paginationDiv.appendChild(nextBtn);
}

async function fetchAndShowIrnDetail(irnId) {
    try {
        const response = await fetch(`/api/itemreceivenotes/${irnId}`);
        if (!response.ok) throw new Error('Failed to fetch details');
        const irn = await response.json();
        showIrnDetailModal(irn);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function showIrnDetailModal(irn) {
    document.getElementById('detailIrnId').textContent = irn.id ?? '';
    document.getElementById('detailIrnNo').textContent = irn.irnno ?? '';
    document.getElementById('detailReceivedDate').textContent = irn.receiveddate ?? '';
    document.getElementById('detailTotalAmount').textContent = irn.totalamount ?? '';
    document.getElementById('detailDiscountRate').textContent = irn.discountrate ?? '';
    document.getElementById('detailGrossAmount').textContent = irn.grossamount ?? '';
    document.getElementById('detailPurchaseOrderCode').textContent = irn.purchaseorder && irn.purchaseorder.purchaseordercode ? irn.purchaseorder.purchaseordercode : '';

    // Items table: show items from purchaseorder.purchaseOrderItems
    const itemsTbody = document.getElementById('detailItemsTableBody');
    itemsTbody.innerHTML = '';
    if (irn.purchaseorder && Array.isArray(irn.purchaseorder.purchaseOrderItems) && irn.purchaseorder.purchaseOrderItems.length > 0) {
        irn.purchaseorder.purchaseOrderItems.forEach(poItem => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${poItem.item && poItem.item.itemname ? poItem.item.itemname : ''}</td>
                <td>${poItem.orderedqty ?? ''}</td>
                <td>${poItem.purchaseprice ?? ''}</td>
                <td>${poItem.lineprice ?? ''}</td>
            `;
            itemsTbody.appendChild(tr);
        });
    } else {
        itemsTbody.innerHTML = '<tr><td colspan="4">No items found.</td></tr>';
    }

    // Show modal (Bootstrap 5)
    const modal = new bootstrap.Modal(document.getElementById('irnDetailModal'));
    modal.show();
}

function resetFilters() {
    document.getElementById('supplierDropdownSelect').value = '';
    document.getElementById('date').value = '';
    window.currentPage = 0;
    fetchRecords();
}

// Initial load
window.onload = function() {
    window.currentPage = 0;
    populateSupplierDropdown().then(fetchRecords);
};
