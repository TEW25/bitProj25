document.addEventListener('DOMContentLoaded', () => {
    fetchPurchaseOrders();
});

function fetchPurchaseOrders() {
    fetch('/api/purchaseorders')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            populatePurchaseOrderTable(data);
        })
        .catch(error => {
            console.error('Error fetching purchase orders:', error);
            // Optionally display an error message to the user
        });
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
