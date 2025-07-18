document.addEventListener('DOMContentLoaded', () => {
    fetchPurchaseOrders();
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

function fetchPurchaseOrders() {
    fetch('/api/purchaseorders')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            purchaseOrdersData = data;
            populatePurchaseOrderTable(purchaseOrdersData);
            addSortingListeners(); // Ensure sorting listeners are added after data is populated
        })
        .catch(error => {
            console.error('Error fetching purchase orders:', error);
            // Optionally display an error message to the user
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
    tableBody.innerHTML = ''; // Clear existing rows

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.purchaseordercode}</td>
            <td>${order.requireddate}</td>
            <td>${order.totalamount.toFixed(2)}</td>
            <td>${order.supplier ? order.supplier.suppliername : 'N/A'}</td> <!-- Handle potential null supplier -->
            <td>${order.porderstatus ? order.porderstatus.name : 'N/A'}</td> <!-- Handle potential null status -->
            <td><button class="btn btn-info btn-sm view-details" data-id="${order.id}">View Details</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to the "View Details" buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (event) => {
            const orderId = event.target.dataset.id;
            showPurchaseOrderDetail(orderId);
        });
    });
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
