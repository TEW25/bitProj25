let supplierSearchTimeout;

async function searchSuppliersByName(query) {
    if (!query) {
        renderSupplierDropdown([]);
        return;
    }
    try {
        const response = await fetch(`/api/suppliers/search?name=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const suppliers = await response.json();
        renderSupplierDropdown(suppliers);
    } catch (err) {
        renderSupplierDropdown([]);
    }
}

function renderSupplierDropdown(suppliers) {
    const dropdown = document.getElementById('supplierDropdown');
    dropdown.innerHTML = '';
    if (!suppliers.length) {
        dropdown.style.display = 'none';
        return;
    }
    suppliers.forEach(supplier => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.textContent = supplier.suppliername + ' (' + supplier.id + ')';
        option.onclick = () => selectSupplier(supplier);
        dropdown.appendChild(option);
    });
    dropdown.style.display = 'block';
}

function selectSupplier(supplier) {
    document.getElementById('supplierSearch').value = supplier.suppliername;
    document.getElementById('supplierSearch').dataset.supplierId = supplier.id;
    document.getElementById('supplierDropdown').style.display = 'none';
}

function setupSupplierSearch() {
    const input = document.getElementById('supplierSearch');
    input.addEventListener('input', function() {
        clearTimeout(supplierSearchTimeout);
        const query = this.value.trim();
        supplierSearchTimeout = setTimeout(() => searchSuppliersByName(query), 300);
    });
    document.addEventListener('click', function(e) {
        if (!document.getElementById('supplierSearchField').contains(e.target)) {
            document.getElementById('supplierDropdown').style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', setupSupplierSearch);
