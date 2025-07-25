
let currentPage = 0;
let pageSize = 10;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetchPurchaseOrders(currentPage);
    setupPaginationControls();
});


function addSortingListeners() {
    const requiredDateHeader = document.getElementById('sortRequiredDate');
    const statusHeader = document.getElementById('sortStatus');
    if (requiredDateHeader) {
        requiredDateHeader.onclick = () => sortTable('requireddate');
    }
    if (statusHeader) {
        statusHeader.onclick = () => sortTable('status');
    }
}


function fetchPurchaseOrders(page = 0) {
    fetch(`/api/purchaseorders?page=${page}&size=${pageSize}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            purchaseOrdersData = data.content || [];
            totalPages = data.totalPages || 1;
            populatePurchaseOrderTable(purchaseOrdersData);
            addSortingListeners();
            updatePaginationControls();
        })
        .catch(error => {
            console.error('Error fetching purchase orders:', error);
        });
}

let purchaseOrdersData = [];
let sortDirections = {
    requireddate: true, // true: ascending, false: descending
    status: true
};

function sortTable(column) {
    let sortedOrders = [...purchaseOrdersData];
    if (column === 'requireddate') {
        sortedOrders.sort((a, b) => {
            const dateA = new Date(a.requireddate);
            const dateB = new Date(b.requireddate);
            return sortDirections.requireddate ? dateA - dateB : dateB - dateA;
        });
        sortDirections.requireddate = !sortDirections.requireddate;
    } else if (column === 'status') {
        // Orders with porderstatus.id === 1 at top, id === 3 at bottom
        sortedOrders.sort((a, b) => {
            const getPriority = (order) => {
                if (order.porderstatus && order.porderstatus.id === 1) return -1; // top
                if (order.porderstatus && order.porderstatus.id === 3) return 1;  // bottom
                return 0; // middle
            };
            const aPriority = getPriority(a);
            const bPriority = getPriority(b);
            if (aPriority !== bPriority) return aPriority - bPriority;
            // If both are not id 1 or 3, sort by status name
            const statusA = a.porderstatus && a.porderstatus.name ? a.porderstatus.name.toLowerCase() : '';
            const statusB = b.porderstatus && b.porderstatus.name ? b.porderstatus.name.toLowerCase() : '';
            if (statusA < statusB) return sortDirections.status ? -1 : 1;
            if (statusA > statusB) return sortDirections.status ? 1 : -1;
            return 0;
        });
        sortDirections.status = !sortDirections.status;
    }
    populatePurchaseOrderTable(sortedOrders);
}

function addSortingListeners() {
    const requiredDateHeader = document.getElementById('sortRequiredDate');
    const statusHeader = document.getElementById('sortStatus');
    if (requiredDateHeader) {
        requiredDateHeader.onclick = () => sortTable('requireddate');
    }
    if (statusHeader) {
        statusHeader.onclick = () => sortTable('status');
    }
}

function populatePurchaseOrderTable(orders) {
    const tableBody = document.getElementById('purchaseOrderTableBody');
    tableBody.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.purchaseordercode}</td>
            <td>${order.requireddate}</td>
            <td>${order.totalamount.toFixed(2)}</td>
            <td>${order.supplier ? order.supplier.suppliername : 'N/A'}</td>
            <td>${order.porderstatus ? order.porderstatus.name : 'N/A'}</td>
            <td><button class="btn btn-info btn-sm view-details" data-id="${order.id}">View Details</button></td>
        `;
        tableBody.appendChild(row);
    });
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.target.dataset.id;
            showPurchaseOrderDetail(orderId);
        });
    });
}

function setupPaginationControls() {
    let container = document.getElementById('pagination-controls');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pagination-controls';
        container.className = 'd-flex justify-content-center my-3';
        document.querySelector('.container').appendChild(container);
    }
    container.innerHTML = `
        <button id="prevPageBtn" class="btn btn-outline-primary mx-2">Previous</button>
        <span id="pageInfo" class="mx-2"></span>
        <button id="nextPageBtn" class="btn btn-outline-primary mx-2">Next</button>
    `;
    document.getElementById('prevPageBtn').onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            fetchPurchaseOrders(currentPage);
        }
    };
    document.getElementById('nextPageBtn').onclick = () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            fetchPurchaseOrders(currentPage);
        }
    };
    updatePaginationControls();
}

function updatePaginationControls() {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    }
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
}

function showPurchaseOrderDetail(orderId) {
    fetch(`/api/purchaseorders/${orderId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(order => {
            if (order) {
                document.getElementById('detailId').textContent = order.id;

                // Show Cancel button only if status id === 1 (Cancelled)
                const cancelBtn = document.getElementById('cancelOrderBtn');
                if (order.porderstatus && order.porderstatus.id === 1) {
                    cancelBtn.classList.remove('d-none');
                    cancelBtn.onclick = function() {
                        cancelPurchaseOrder(order.id);
                    };
                } else {
                    cancelBtn.classList.add('d-none');
                    cancelBtn.onclick = null;
                }

// Sorting function should be top-level
function sortTable(column) {
    let sortedOrders = [...purchaseOrdersData];
    if (column === 'requireddate') {
        sortedOrders.sort((a, b) => {
            const dateA = new Date(a.requireddate);
            const dateB = new Date(b.requireddate);
            return sortDirections.requireddate ? dateA - dateB : dateB - dateA;
        });
        sortDirections.requireddate = !sortDirections.requireddate;
    } else if (column === 'status') {
        sortedOrders.sort((a, b) => {
            const statusA = a.porderstatus && a.porderstatus.name ? a.porderstatus.name.toLowerCase() : '';
            const statusB = b.porderstatus && b.porderstatus.name ? b.porderstatus.name.toLowerCase() : '';
            if (statusA < statusB) return sortDirections.status ? -1 : 1;
            if (statusA > statusB) return sortDirections.status ? 1 : -1;
            return 0;
        });
        sortDirections.status = !sortDirections.status;
    }
    populatePurchaseOrderTable(sortedOrders);
}
                document.getElementById('detailOrderCode').textContent = order.purchaseordercode;
                document.getElementById('detailRequiredDate').textContent = order.requireddate;
                document.getElementById('detailTotalAmount').textContent = order.totalamount.toFixed(2);
                document.getElementById('detailSupplier').textContent = order.supplier ? order.supplier.suppliername : 'N/A';
                document.getElementById('detailStatus').textContent = order.porderstatus ? order.porderstatus.name : 'N/A';

                const itemsTableBody = document.getElementById('detailItemsTableBody');
                itemsTableBody.innerHTML = ''; // Clear existing rows

                if (order.purchaseOrderItems) { // Assuming the list of items is named purchaseOrderItems in the backend entity
                    order.purchaseOrderItems.forEach(itemDetail => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${itemDetail.item ? itemDetail.item.itemname : 'N/A'}</td>
                            <td>${itemDetail.purchaseprice.toFixed(2)}</td>
                            <td>${itemDetail.orderedqty}</td>
                            <td>${itemDetail.lineprice.toFixed(2)}</td>
                        `;
                        itemsTableBody.appendChild(row);
                    });
                }

                $('#purchaseOrderDetailModal').modal('show'); // Use jQuery to show the modal
            }
        })
        .catch(error => {
            console.error(`Error fetching purchase order details for ID ${orderId}:`, error);
            // Optionally display an error message to the user
        });
}

// Cancel purchase order function
function cancelPurchaseOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this purchase order?')) return;
    fetch(`/api/purchaseorders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Hide modal, refresh table
        $('#purchaseOrderDetailModal').modal('hide');
        fetchPurchaseOrders();
    })
    .catch(error => {
        alert('Failed to cancel purchase order.');
        console.error('Cancel error:', error);
    });
}
