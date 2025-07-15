document.addEventListener('DOMContentLoaded', () => {
    fetchPurchaseOrdersForSelect();

    const purchaseOrderSelect = document.getElementById('purchaseOrderSelect');
    purchaseOrderSelect.addEventListener('change', (event) => {
        const purchaseOrderId = event.target.value;
        if (purchaseOrderId) {
            fetchPurchaseOrderDetails(purchaseOrderId);
        } else {
            clearReceivedItemsTable();
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
    });

    // Add event listener for discount rate changes
    document.getElementById('discountRate').addEventListener('input', () => {
        calculateTotalAndGrossAmount();
    });
});

function fetchPurchaseOrdersForSelect() {
    fetch('/api/purchaseorders') // Call the backend API
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            populatePurchaseOrderSelect(data);
        })
        .catch(error => {
            console.error('Error fetching purchase orders for select:', error);
            // Optionally display an error message to the user
        });
}

function populatePurchaseOrderSelect(orders) {
    const selectElement = document.getElementById('purchaseOrderSelect');
    selectElement.innerHTML = '<option value="">-- Select a Purchase Order --</option>'; // Clear existing options
    orders.forEach(order => {
        const option = document.createElement('option');
        option.value = order.id;
        option.textContent = order.purchaseordercode; // Display purchase order code
        selectElement.appendChild(option);
    });
}

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

function calculateLinePrice(inputElement) {
    const row = inputElement.closest('tr');
    const receivedQty = parseFloat(inputElement.value);
    const purchasePrice = parseFloat(inputElement.dataset.purchasePrice);
    const linePriceCell = row.querySelector('.line-price');

    if (!isNaN(receivedQty) && !isNaN(purchasePrice)) {
        linePriceCell.textContent = (receivedQty * purchasePrice).toFixed(2);
    } else {
        linePriceCell.textContent = '0.00';
    }
}

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

    if (!isNaN(discountRate) && discountRate >= 0 && discountRate <= 100) { // Validate discount rate
        const discountAmount = totalAmount * (discountRate / 100);
        grossAmount = totalAmount - discountAmount;
    } else if (!isNaN(discountRate) && (discountRate < 0 || discountRate > 100)) {
         alert('Discount rate must be between 0 and 100.');
         discountRateInput.value = discountRate < 0 ? 0 : 100;
         calculateTotalAndGrossAmount(); // Recalculate with corrected rate
         return;
    }

    document.getElementById('grossAmount').value = grossAmount.toFixed(2);
}

function createGRN() {
    const purchaseOrderId = document.getElementById('purchaseOrderSelect').value;
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
        fetchPurchaseOrdersForSelect(); // Refresh the PO list
    })
    .catch(error => {
        console.error('Error creating GRN:', error);
        alert('Error creating GRN. See console for details.');
        // TODO: Display error message to the user
    });
}
