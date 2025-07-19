// sales.js - Handles cart management and item search for the New Sale page

// Reset all sale form fields and cart
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
                        row.querySelector('.available- qty').value = inv.availableqty;
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