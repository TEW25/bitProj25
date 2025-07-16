// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Declare DOM variables FIRST
    const inventoryForm = document.getElementById('inventoryForm');
    const inventoryModal = document.getElementById('inventoryModal');
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const inventoryTable = document.querySelector('.table'); // Get the table element


    // Event delegation for Delete button in inventory table
    inventoryTableBody.addEventListener('click', function (event) {
        const deleteBtn = event.target.closest('.delete-inventory-btn');
        if (deleteBtn) {
            const inventoryId = deleteBtn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this inventory item?')) {
                fetch(`/api/inventory/${inventoryId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    // Refresh table after delete
                    fetchInventoryItems();
                })
                .catch(error => {
                    console.error('Error deleting inventory item:', error);
                    alert('Error deleting inventory item.');
                });
            }
        }
    });

    // Event delegation for Edit button in inventory table
    inventoryTableBody.addEventListener('click', function (event) {
        const editBtn = event.target.closest('.edit-inventory-btn');
        if (editBtn) {
            const inventoryId = editBtn.getAttribute('data-id');
            // Fetch inventory item details
            fetch(`/api/inventory/${inventoryId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch inventory item');
                    return response.json();
                })
                .then(item => {
                    // Set modal title
                    document.getElementById('inventoryModalLabel').textContent = 'Edit Inventory Item';
                    document.getElementById('inventoryId').value = item.id ?? '';
                    // Only set values for the three fields in the modal
                    document.getElementById('quantityInput').value = item.availableqty ?? '';
                    document.getElementById('quantityInput').disabled = false;
                    document.getElementById('quantityInput').min = 0;
                    document.getElementById('quantityInput').placeholder = 'Available Qty';
                    document.getElementById('totalQtyInput').value = item.totalqty ?? '';
                    document.getElementById('totalQtyInput').disabled = false;
                    const statusSelect = document.getElementById('transactionStatusSelect');
                    statusSelect.disabled = false;
                    // Populate status dropdown with all statuses
                    fetch('/api/inventorystatus')
                        .then(resp => resp.json())
                        .then(statuses => {
                            statusSelect.innerHTML = '';
                            statuses.forEach(status => {
                                const option = document.createElement('option');
                                option.value = status.name;
                                option.textContent = status.name;
                                statusSelect.appendChild(option);
                            });
                            statusSelect.value = item.inventorystatus ? item.inventorystatus.name : '';
                        });
                    $(inventoryModal).modal('show');
                })
                .catch(error => {
                    console.error('Error loading inventory item for edit:', error);
                    alert('Error loading inventory item for edit.');
                });
        }
    });
    console.log('DOM fully loaded. Initializing inventory script.'); // Added log

    let currentSortField = '';
    let currentSortDirection = 'asc'; // 'asc' or 'desc'

    // Function to fetch and display inventory items
    function fetchInventoryItems(searchTerm = '', status = '', sortBy = '') {
        console.log('Fetching inventory items...'); // Added log
        let url = '/api/inventory';
        const params = new URLSearchParams();

        if (searchTerm) {
            params.append('searchTerm', searchTerm);
        }
        if (status) {
            params.append('status', status);
        }
        if (sortBy) {
            params.append('sortBy', sortBy);
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }

        console.log('Fetching from URL:', url); // Added log

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // Handle HTTP errors
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data); // Added log
                inventoryTableBody.innerHTML = ''; // Clear existing rows
                console.log('Table body cleared.'); // Added log

                if (!data || data.length === 0) {
                    console.warn('No inventory data found or data is empty.'); // Added log
                    const noDataRow = document.createElement('tr');
                    noDataRow.innerHTML = '<td colspan="8">No inventory items found.</td>';
                    inventoryTableBody.appendChild(noDataRow);
                    return; // Exit if no data
                }

                console.log('Populating table with data...'); // Added log
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id ?? ''}</td>
                        <td>${item.item ? (item.item.itemcode ?? '') : ''}</td>
                        <td>${item.item ? (item.item.itemname ?? '') : ''}</td>
                        <td>${item.supplier ? (item.supplier.suppliername ?? '') : ''}</td>
                        <td>${item.availableqty ?? ''}</td>
                        <td>${item.totalqty ?? ''}</td>
                        <td>${item.inventorystatus ? (item.inventorystatus.name ?? '') : ''}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-inventory-btn" data-id="${item.id ?? ''}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-inventory-btn" data-id="${item.id ?? ''}">Delete</button>
                        </td>
                    `;
                    inventoryTableBody.appendChild(row);
                });
                console.log('Table population complete.'); // Added log
            })
            .catch(error => {
                console.error('Error loading inventory:', error); // Improved error logging
                // Display an error message in the table
                inventoryTableBody.innerHTML = '<tr><td colspan="8">Error loading inventory. Please try again.</td></tr>';
            });
    }

    // Function to populate status dropdown
    function populateStatusDropdown() {
        fetch('/api/inventorystatus')
            .then(response => {
                 if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const filterStatusDropdown = document.getElementById('filterStatus');
                // Clear existing options except the default 'All Statuses'
                filterStatusDropdown.innerHTML = '<option value="">All Statuses</option>';
                data.forEach(status => {
                    const option = document.createElement('option');
                    option.value = status.name; // Assuming status object has a 'name' field
                    option.textContent = status.name; // Assuming status object has a 'name' field
                    filterStatusDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error loading inventory statuses:', error);
                // Optionally add an error option to the dropdown
                const filterStatusDropdown = document.getElementById('filterStatus');
                 const errorOption = document.createElement('option');
                 errorOption.value = '';
                 errorOption.textContent = 'Error loading statuses';
                 errorOption.disabled = true;
                 filterStatusDropdown.appendChild(errorOption);
            });
    }

    // Event listener for the Add Inventory button
    addInventoryBtn.addEventListener('click', function () {
        // Clear the form and set the modal title for adding
        inventoryForm.reset();
        document.getElementById('inventoryModalLabel').textContent = 'Add Inventory Item';
        document.getElementById('inventoryId').value = ''; // Clear hidden ID
        $(inventoryModal).modal('show'); // Use jQuery to show the modal
    });

    // Event listener for form submission
    inventoryForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values for edit
        const id = document.getElementById('inventoryId').value;
        const availableqty = document.getElementById('quantityInput').value;
        const totalqty = document.getElementById('totalQtyInput').value;
        const statusName = document.getElementById('transactionStatusSelect').value;

        // Basic validation
        if (!id) {
            alert('No inventory item selected for editing.');
            return;
        }
        if (availableqty === '' || isNaN(availableqty)) {
            alert('Available Qty is required and must be a number.');
            return;
        }
        if (totalqty === '' || isNaN(totalqty)) {
            alert('Total Qty is required and must be a number.');
            return;
        }
        if (!statusName) {
            alert('Status is required.');
            return;
        }

        // Get status id from name
        fetch('/api/inventorystatus')
            .then(resp => resp.json())
            .then(statuses => {
                const selectedStatus = statuses.find(s => s.name === statusName);
                if (!selectedStatus) {
                    alert('Selected status not found.');
                    return;
                }
                // Prepare data for PUT
                const inventoryData = {
                    id: id,
                    availableqty: parseFloat(availableqty),
                    totalqty: parseFloat(totalqty),
                    inventorystatus: { id: selectedStatus.id, name: selectedStatus.name }
                };
                // Send PUT request
                fetch('/api/inventory/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inventoryData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to update inventory item');
                    return response.json();
                })
                .then(data => {
                    $('#inventoryModal').modal('hide');
                    fetchInventoryItems(); // Reload the table
                    alert('Inventory item updated successfully.');
                })
                .catch(error => {
                    console.error('Error updating inventory item:', error);
                    alert('Error updating inventory item.');
                });
            });
    });

    // Event listener for the Apply Filter/Search button
    document.getElementById('applyFilterBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchName').value.trim();
        const status = document.getElementById('filterStatus').value;
        fetchInventoryItems(searchTerm, status, currentSortField ? `${currentSortField},${currentSortDirection}` : '');
    });

    // Event listener for table header clicks (for sorting)
    inventoryTable.querySelectorAll('th[data-sort-field]').forEach(header => {
        header.style.cursor = 'pointer'; // Indicate sortable column
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-sort-field');

            // If clicking the same header, toggle direction
            if (currentSortField === field) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                // If clicking a new header, set field and default to asc
                currentSortField = field;
                currentSortDirection = 'asc';
            }

            // Remove existing sort indicators
            inventoryTable.querySelectorAll('th i').forEach(icon => icon.remove());

            // Add sort indicator to the clicked header
            const sortIndicator = document.createElement('i');
            sortIndicator.classList.add('fas', `fa-sort-${currentSortDirection}`); // Requires Font Awesome
            this.appendChild(sortIndicator);

            // Fetch data with new sorting
            const searchTerm = document.getElementById('searchName').value.trim();
            const status = document.getElementById('filterStatus').value;
            fetchInventoryItems(searchTerm, status, `${currentSortField},${currentSortDirection}`);
        });
    });

    // Initial load of inventory items and statuses (when the page loads)
    fetchInventoryItems(); // Call this function on page load
    populateStatusDropdown(); // Call this function on page load

    // TODO: Add function to handle edit button clicks (populate modal with item data)
    // TODO: Add function to handle delete button clicks
});
