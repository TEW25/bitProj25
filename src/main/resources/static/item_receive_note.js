document.addEventListener('DOMContentLoaded', () => {

    // --- Purchase Order Search Logic ---
    let allPurchaseOrders = [];    
    const purchaseOrderSearch = document.getElementById('purchaseOrderSearch');
    const purchaseOrderResults = document.getElementById('purchaseOrderResults');
    const selectedPurchaseOrderId = document.getElementById('selectedPurchaseOrderId');

    // Fetch all purchase orders for searching
    fetch('/api/purchaseorders')
        .then(response => response.json())
        .then(data => {
            allPurchaseOrders = data;
        })
        .catch(error => {
            console.error('Error fetching purchase orders for search:', error);
        });

    purchaseOrderSearch.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (!query) {
            purchaseOrderResults.style.display = 'none';
            purchaseOrderResults.innerHTML = '';
            selectedPurchaseOrderId.value = '';
            clearReceivedItemsTable();
            return;
        }
        const filtered = allPurchaseOrders
            .filter(po => po.porderstatus_id === 1 || (po.porderstatus && po.porderstatus.id === 1))
            .filter(po =>
                (po.purchaseordercode && po.purchaseordercode.toLowerCase().includes(query)) ||
                (po.requireddate && po.requireddate.toLowerCase().includes(query))
            );
        if (filtered.length === 0) {
            purchaseOrderResults.innerHTML = '<div class="list-group-item">No results found</div>';
        } else {
            purchaseOrderResults.innerHTML = filtered.map(po => {
                let dateStr = '';
                // Use requireddate field for purchase order date
                if (po.requireddate) {
                    dateStr = po.requireddate;
                } else if (po.date) {
                    dateStr = po.date;
                } else if (po.purchaseorderdate) {
                    dateStr = po.purchaseorderdate;
                } else if (po.createdDate) {
                    dateStr = po.createdDate;
                }
                // Optionally format date if it's in ISO format
                if (dateStr && dateStr.length >= 10) {
                    dateStr = dateStr.substring(0, 10);
                }
                return `<button type="button" class="list-group-item list-group-item-action" data-id="${po.id}" data-code="${po.purchaseordercode}">
                    <strong>${po.purchaseordercode}${dateStr ? ' - ' + dateStr : ''}</strong>
                </button>`;
            }).join('');
        }
        purchaseOrderResults.style.display = 'block';
    });

    // Handle selection from popup
    purchaseOrderResults.addEventListener('click', function(e) {
        if (e.target.closest('button[data-id]')) {
            const btn = e.target.closest('button[data-id]');
            const poId = btn.getAttribute('data-id');
            const poCode = btn.getAttribute('data-code');
            purchaseOrderSearch.value = poCode;
            selectedPurchaseOrderId.value = poId;
            purchaseOrderResults.style.display = 'none';
            fetchPurchaseOrderDetails(poId);
        }
    });

    // Hide popup when clicking outside
    document.addEventListener('click', function(e) {
        if (!purchaseOrderResults.contains(e.target) && e.target !== purchaseOrderSearch) {
            purchaseOrderResults.style.display = 'none';
        }
    });

    const grnForm = document.getElementById('grnForm');
    grnForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createGRN();
    });

    // Add event listener for input changes in received quantity to calculate line price
    document.getElementById('receivedItemsTableBody').addEventListener('input', (event) => {
        if (event.target.classList.contains('received-qty')) {
            calculateLinePrice(event.target);
            calculateTotalAndGrossAmount();
        }
    // Error containers
    const receivedDate = document.getElementById('receivedDate');
    const discountRateInput = document.getElementById('discountRate');
    const grnForm = document.getElementById('grnForm');
    });

    // Add event listener for discount rate changes
    document.getElementById('discountRate').addEventListener('input', () => {
        calculateTotalAndGrossAmount();
    });
});


// fetchPurchaseOrdersForSelect and populatePurchaseOrderSelect are no longer needed

function fetchPurchaseOrderDetails(purchaseOrderId) {
    fetch(`/api/purchaseorders/${purchaseOrderId}`) // Call the backend API
        .then(response => {
            if (!response.ok) {
                 if (response.status === 404) {
                    throw new Error('Purchase Order not found.');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(purchaseOrderDetails => {
            if (purchaseOrderDetails && purchaseOrderDetails.purchaseOrderItems) {
                 populateReceivedItemsTable(purchaseOrderDetails.purchaseOrderItems);
            } else {
                clearReceivedItemsTable();
                console.warn('No items found for this Purchase Order.');
            }
        })
        .catch(error => {
            console.error(`Error fetching purchase order details for ID ${purchaseOrderId}:`, error);
            clearReceivedItemsTable();
            alert(`Error fetching purchase order details: ${error.message}`);
        });
}
function populateReceivedItemsTable(items) {
    const tableBody = document.getElementById('receivedItemsTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    items.forEach(itemDetail => {
        const row = document.createElement('tr');
        // Assuming itemDetail has item, orderedqty, and purchaseprice
        const itemCode = itemDetail.item ? itemDetail.item.itemcode : 'N/A';
        const itemName = itemDetail.item ? itemDetail.item.itemname : 'N/A';
        const orderedQty = itemDetail.orderedqty !== undefined ? itemDetail.orderedqty : 0;
        const purchasePrice = itemDetail.purchaseprice !== undefined ? itemDetail.purchaseprice : 0;
        const itemId = itemDetail.item ? itemDetail.item.id : '';

        row.innerHTML = `
            <td>${itemCode}</td>
            <td>${itemName}</td>
            <td>${orderedQty}</td>
            <td><input type="number" class="form-control received-qty" data-item-id="${itemId}" data-purchase-price="${purchasePrice}" value="${orderedQty}" min="0"></td>
            <td>${purchasePrice.toFixed(2)}</td>
            <td class="line-price">${(orderedQty * purchasePrice).toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
    calculateTotalAndGrossAmount(); // Calculate initial amounts
}
function clearReceivedItemsTable() {
    const tableBody = document.getElementById('receivedItemsTableBody');
    tableBody.innerHTML = '';
    document.getElementById('totalAmount').value = '';
    document.getElementById('grossAmount').value = '';
}
// Add event listener for input changes in received quantity to calculate line price and validate
    document.getElementById('receivedItemsTableBody').addEventListener('input', (event) => {
        if (event.target.classList.contains('received-qty')) {
            validateReceivedQty(event.target);
            calculateLinePrice(event.target);
            calculateTotalAndGrossAmount();
        }
    });



function calculateTotalAndGrossAmount() {
    const itemRows = document.querySelectorAll('#receivedItemsTableBody tr');
    let totalAmount = 0;

    itemRows.forEach(row => {
        const linePriceCell = row.querySelector('.line-price');
        const linePrice = parseFloat(linePriceCell.textContent);
        if (!isNaN(linePrice)) {
            totalAmount += linePrice;
        }
    });

    document.getElementById('totalAmount').value = totalAmount.toFixed(2);

    const discountRateInput = document.getElementById('discountRate');
    const discountRate = parseFloat(discountRateInput.value);
    let grossAmount = totalAmount;

    if (!isNaN(discountRate) && discountRate >= 0 && discountRate <= 100) {
        const discountAmount = totalAmount * (discountRate / 100);
        grossAmount = totalAmount - discountAmount;
    }

    document.getElementById('grossAmount').value = grossAmount.toFixed(2);
}


function createGRN() {
    const purchaseOrderId = document.getElementById('selectedPurchaseOrderId').value;
    const receivedDate = document.getElementById('receivedDate').value;
    const discountRate = document.getElementById('discountRate').value;

    const itemreceivenoteItems = [];
    document.querySelectorAll('#receivedItemsTableBody tr').forEach(row => {
        const itemId = row.querySelector('.received-qty').dataset.itemId;
        const receivedQty = parseFloat(row.querySelector('.received-qty').value);
        const purchasePrice = parseFloat(row.querySelector('.received-qty').dataset.purchasePrice);
        const linePrice = parseFloat(row.querySelector('.line-price').textContent);

        if (!isNaN(receivedQty) && receivedQty > 0) { // Only include items with received quantity > 0
             itemreceivenoteItems.push({
                item: { id: parseInt(itemId) },
                orderqty: receivedQty, // Note: Using orderqty field in backend for received quantity
                purchaseprice: purchasePrice,
                lineprice: linePrice
            });
        }
    });

    if (!purchaseOrderId) {
        alert('Please select a Purchase Order.');
        return;
    }

    if (itemreceivenoteItems.length === 0) {
        alert('Please enter received quantities for at least one item.');
        return;
    }

    const grnData = {
        purchaseorder: { id: parseInt(purchaseOrderId) },
        receiveddate: receivedDate,
        discountrate: parseFloat(discountRate),
        // totalamount and grossamount will be calculated on the backend
        itemreceivenoteItems: itemreceivenoteItems
    };

    fetch('/api/itemreceivenotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(grnData),
    })
    .then(response => {
        if (!response.ok) {
            // TODO: Handle backend errors and display appropriate message
             return response.text().then(text => { throw new Error(`HTTP error! status: ${response.status}, Details: ${text}`); });
        }
        return response.json(); // Assuming backend returns the created GRN object
    })
    .then(data => {
        console.log('GRN created successfully:', data);
        alert('GRN created successfully!');
        // TODO: Redirect or clear form after successful creation
        document.getElementById('grnForm').reset();
        clearReceivedItemsTable();
        // No need to refresh PO list for search box
    })
    .catch(error => {
        console.error('Error creating GRN:', error);
        alert('Error creating GRN. See console for details.');
        // TODO: Display error message to the user
    });
}
