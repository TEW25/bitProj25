async function fetchRecords() {
    const supplierId = document.getElementById('supplierDropdownSelect').value;
    const date = document.getElementById('date').value;
    let url = '/api/itemreceivenotes';
    const params = [];
    if (supplierId) params.push(`supplierId=${encodeURIComponent(supplierId)}`);
    if (date) params.push(`date=${encodeURIComponent(date)}`);
    if (params.length > 0) url += '?' + params.join('&');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch records');
        const data = await response.json();
        renderTable(data);
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
    const tbody = document.querySelector('#irnTable tbody');
    tbody.innerHTML = '';
    if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No records found.</td></tr>';
        return;
    }
    records.forEach(irn => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${irn.id}</td>
            <td>${irn.irnno}</td>
            <td>${irn.receiveddate ? irn.receiveddate : ''}</td>
            <td>${irn.totalamount ?? ''}</td>
            <td>${irn.discountrate ?? ''}</td>
            <td>${irn.grossamount ?? ''}</td>
            <td>${irn.purchaseorder ? irn.purchaseorder.id : ''}</td>
            <td>${irn.irnstatus ? irn.irnstatus.statusname : ''}</td>
        `;
        tbody.appendChild(row);
    });
}

function resetFilters() {
    document.getElementById('supplierDropdownSelect').value = '';
    document.getElementById('date').value = '';
    fetchRecords();
}

// Initial load
window.onload = function() {
    populateSupplierDropdown().then(fetchRecords);
};
