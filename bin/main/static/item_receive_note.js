document.addEventListener('DOMContentLoaded', () => {
    // --- Purchase Order Search Logic ---
    let purchaseOrderPage = 0;
    const purchaseOrderSize = 20;
    let lastQuery = '';
    let lastResults = [];
    let lastPageData = null;
    const purchaseOrderSearch = document.getElementById('purchaseOrderSearch');
    const purchaseOrderResults = document.getElementById('purchaseOrderResults');
    const selectedPurchaseOrderId = document.getElementById('selectedPurchaseOrderId');
    const formErrorMsg = document.getElementById('formErrorMsg');

    function fetchPurchaseOrders(query, page = 0) {
        let url = `/api/purchaseorders?page=${page}&size=${purchaseOrderSize}`;
        if (query) {
            url += `&search=${encodeURIComponent(query)}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                lastPageData = data;
                let filtered = (data.content || []).filter(po => po.porderstatus_id === 1 || (po.porderstatus && po.porderstatus.id === 1));
                lastResults = page === 0 ? filtered : lastResults.concat(filtered);
                renderPurchaseOrderResults(lastResults, data);
            })
            .catch(error => {
                console.error('Error fetching purchase orders for search:', error);
                purchaseOrderResults.innerHTML = '<div class="list-group-item">Error loading purchase orders</div>';
                purchaseOrderResults.style.display = 'block';
            });
    }

    function renderPurchaseOrderResults(results, pageData) {
        if (!results || results.length === 0) {
            purchaseOrderResults.innerHTML = '<div class="list-group-item">No results found</div>';
        } else {
            purchaseOrderResults.innerHTML = results.map(po => {
                let dateStr = '';
                if (po.requireddate) {
                    dateStr = po.requireddate;
                } else if (po.date) {
                    dateStr = po.date;
                } else if (po.purchaseorderdate) {
                    dateStr = po.purchaseorderdate;
                } else if (po.createdDate) {
                    dateStr = po.createdDate;
                }
                if (dateStr && dateStr.length >= 10) {
                    dateStr = dateStr.substring(0, 10);
                }
                return `<button type="button" class="list-group-item list-group-item-action" data-id="${po.id}" data-code="${po.purchaseordercode}">
                    <strong>${po.purchaseordercode}${dateStr ? ' - ' + dateStr : ''}</strong>
                </button>`;
            }).join('');
            // Add Load More button if more pages
            if (pageData && !pageData.last) {
                purchaseOrderResults.innerHTML += '<button type="button" class="list-group-item list-group-item-action" id="loadMorePurchaseOrderBtn">Load More</button>';
            }
        }
        purchaseOrderResults.style.display = 'block';
    }

    purchaseOrderSearch.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        lastQuery = query;
        purchaseOrderPage = 0;
        lastResults = [];
        if (!query) {
            purchaseOrderResults.style.display = 'none';
            purchaseOrderResults.innerHTML = '';
            selectedPurchaseOrderId.value = '';
            clearReceivedItemsTable();
            return;
        }
        fetchPurchaseOrders(query, purchaseOrderPage);
    });

    purchaseOrderResults.addEventListener('click', function(e) {
        if (e.target.closest('button[data-id]')) {
            const btn = e.target.closest('button[data-id]');
            const poId = btn.getAttribute('data-id');
            const poCode = btn.getAttribute('data-code');
            purchaseOrderSearch.value = poCode;
            selectedPurchaseOrderId.value = poId;
            purchaseOrderResults.style.display = 'none';
            fetchPurchaseOrderDetails(poId);
        } else if (e.target.id === 'loadMorePurchaseOrderBtn') {
            purchaseOrderPage++;
            fetchPurchaseOrders(lastQuery, purchaseOrderPage);
        }
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

    // Add event listener for input changes in received quantity to calculate line price and validate
    document.getElementById('receivedItemsTableBody').addEventListener('input', (event) => {
        if (event.target.classList.contains('received-qty')) {
            validateReceivedQty(event.target);
            calculateLinePrice(event.target);
            calculateTotalAndGrossAmount();
        }
    });

    // Add event listener for discount rate changes
    document.getElementById('discountRate').addEventListener('input', () => {
        validateDiscountRate();
        calculateTotalAndGrossAmount();
    });

    // Add event listener for received date validation
    document.getElementById('receivedDate').addEventListener('change', validateReceivedDate);

    // Form submit validation
    const grnForm = document.getElementById('grnForm');
    grnForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (validateForm()) {
            createGRN();
        }
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
    tableBody.innerHTML = '';
    items.forEach(itemDetail => {
        const row = document.createElement('tr');
        const itemCode = itemDetail.item ? itemDetail.item.itemcode : 'N/A';
        const itemName = itemDetail.item ? itemDetail.item.itemname : 'N/A';
        const orderedQty = itemDetail.orderedqty !== undefined ? itemDetail.orderedqty : 0;
        const purchasePrice = itemDetail.purchaseprice !== undefined ? itemDetail.purchaseprice : 0;
        const itemId = itemDetail.item ? itemDetail.item.id : '';
        row.innerHTML = `
            <td>${itemCode}</td>
            <td>${itemName}</td>
            <td class="ordered-qty">${orderedQty}</td>
            <td><input type="number" class="form-control received-qty" data-item-id="${itemId}" data-purchase-price="${purchasePrice}" value="${orderedQty}" min="0" max="${orderedQty}" step="1"></td>
            <td>${purchasePrice.toFixed(2)}</td>
            <td class="line-price">${(orderedQty * purchasePrice).toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
    calculateTotalAndGrossAmount();
}
function clearReceivedItemsTable() {
    const tableBody = document.getElementById('receivedItemsTableBody');
    tableBody.innerHTML = '';
    document.getElementById('totalAmount').value = '';
    document.getElementById('grossAmount').value = '';
}

// --- Validation Functions ---
function validateReceivedQty(input) {
    const row = input.closest('tr');
    const orderedQty = parseFloat(row.querySelector('.ordered-qty').textContent);
    let val = parseFloat(input.value);
    if (isNaN(val) || val < 0) {
        input.value = 0;
        val = 0;
    }
    if (val > orderedQty) {
        input.value = orderedQty;
        val = orderedQty;
    }
    // Optionally, show error message inline or highlight
    input.classList.toggle('is-invalid', val < 0 || val > orderedQty);
}

function validateDiscountRate() {
    const discountInput = document.getElementById('discountRate');
    let val = parseFloat(discountInput.value);
    if (isNaN(val) || val < 0) {
        discountInput.value = 0;
        val = 0;
    }
    if (val > 100) {
        discountInput.value = 100;
        val = 100;
    }
    discountInput.classList.toggle('is-invalid', val < 0 || val > 100);
}

function validateReceivedDate() {
    const receivedDate = document.getElementById('receivedDate');
    const today = new Date();
    const inputDate = new Date(receivedDate.value);
    let valid = true;
    if (!receivedDate.value) {
        valid = false;
    } else if (inputDate > today) {
        valid = false;
    }
    receivedDate.classList.toggle('is-invalid', !valid);
    return valid;
}

function validateForm() {
    let valid = true;
    let errorMsg = [];
    // Validate purchase order
    const poId = document.getElementById('selectedPurchaseOrderId').value;
    if (!poId) {
        valid = false;
        errorMsg.push('Please select a Purchase Order.');
    }
    // Validate received date
    if (!validateReceivedDate()) {
        valid = false;
        errorMsg.push('Please enter a valid Received Date (not in the future).');
    }
    // Validate discount rate
    const discountInput = document.getElementById('discountRate');
    let discountVal = parseFloat(discountInput.value);
    if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
        valid = false;
        errorMsg.push('Discount Rate must be between 0 and 100.');
    }
    // Validate received quantities
    let hasValidQty = false;
    document.querySelectorAll('#receivedItemsTableBody tr').forEach(row => {
        const qtyInput = row.querySelector('.received-qty');
        const orderedQty = parseFloat(row.querySelector('.ordered-qty').textContent);
        let val = parseFloat(qtyInput.value);
        if (!isNaN(val) && val > 0 && val <= orderedQty) {
            hasValidQty = true;
        }
        if (isNaN(val) || val < 0 || val > orderedQty) {
            qtyInput.classList.add('is-invalid');
            valid = false;
        } else {
            qtyInput.classList.remove('is-invalid');
        }
    });
    if (!hasValidQty) {
        valid = false;
        errorMsg.push('Please enter received quantities for at least one item (must be > 0 and ≤ ordered quantity).');
    }
    // Show error message if any
    const formErrorMsg = document.getElementById('formErrorMsg');
    if (!valid) {
        formErrorMsg.innerHTML = errorMsg.join('<br>');
        formErrorMsg.classList.remove('d-none');
    } else {
        formErrorMsg.classList.add('d-none');
    }
    return valid;
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

        if (!isNaN(receivedQty) && receivedQty > 0) {
             itemreceivenoteItems.push({
                item: { id: parseInt(itemId) },
                orderqty: receivedQty,
                purchaseprice: purchasePrice,
                lineprice: linePrice
            });
        }
    });

    // Get totalamount and grossamount from the form
    const totalAmount = document.getElementById('totalAmount').value;
    const grossAmount = document.getElementById('grossAmount').value;

    const grnData = {
        purchaseorder: { id: parseInt(purchaseOrderId) },
        receiveddate: receivedDate,
        discountrate: parseFloat(discountRate),
        totalamount: parseFloat(totalAmount),
        grossamount: parseFloat(grossAmount),
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
             return response.text().then(text => { throw new Error(`HTTP error! status: ${response.status}, Details: ${text}`); });
        }
        return response.json();
    })
    .then(data => {
        console.log('GRN created successfully:', data);
        alert('GRN created successfully!');
        document.getElementById('grnForm').reset();
        clearReceivedItemsTable();
        document.getElementById('formErrorMsg').classList.add('d-none');
    })
    .catch(error => {
        console.error('Error creating GRN:', error);
        document.getElementById('formErrorMsg').innerHTML = 'Error creating GRN. ' + error.message;
        document.getElementById('formErrorMsg').classList.remove('d-none');
    });
}
