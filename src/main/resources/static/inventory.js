// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded. Initializing inventory script.'); // Added log
    const inventoryForm = document.getElementById('inventoryForm');
    const inventoryModal = document.getElementById('inventoryModal');
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const inventoryTable = document.querySelector('.table'); // Get the table element

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

        // Get form values
        const id = document.getElementById('inventoryId').value;
        // Need to get item, supplier, quantity, status, remarks, date
        // The current form only has name, quantity, price, status
        // This form needs to be updated in inventory.html to match the required fields.

        // For now, let's use the existing fields and send a basic request
        const name = document.getElementById('inventoryName').value.trim(); // This should be item selection
        const quantity = document.getElementById('inventoryQuantity').value; // This should be quantity added/removed
        const price = document.getElementById('inventoryPrice').value; // This field is not in the plan for add/adjust
        const status = document.getElementById('inventoryStatus').value; // This is the inventory status

        // Basic Validation (needs update based on new fields)
        if (name === '') {
            alert('Item selection is required.'); // Update validation message
            return;
        }

        if (quantity === '' || isNaN(quantity) || parseInt(quantity) === 0) { // Quantity should not be zero
            alert('Valid Quantity is required and must be a non-zero number.'); // Update validation message
            return;
        }

        if (status === '') {
             alert('Status is required.');
             return;
        }

        // Construct data object based on the plan
        // This needs to be updated once the form fields are correct
        const inventoryData = {
            // id: id, // Include ID for PUT requests
            // item: { id: selectedItemId }, // Need to get selected item ID
            // supplier: { id: selectedSupplierId }, // Need to get selected supplier ID (optional)
            // availableqty: calculate based on type (Add/Remove) and existing qty
            // totalqty: calculate based on type (Add/Remove) and existing qty
            // inventorystatus: { id: selectedStatusId }, // Need to get selected status ID
            // remarks: remarksValue, // Need remarks field
            // date: dateValue // Need date field
        };

        // Determine URL and method
        let url = '/api/inventory';
        let method = 'POST';

        if (id) {
            // If ID exists, it's an edit operation (adjust stock)
            url = '/api/inventory/' + id;
            method = 'PUT';
            // For PUT, we might need to fetch the existing inventory item first
            // to calculate new availableqty and totalqty based on the adjustment quantity.
            // This is more complex and might require a dedicated backend endpoint for stock adjustment.
            alert('Stock adjustment functionality is not fully implemented yet.');
            return;
        }

        // For POST (Add to Inventory), we need item, supplier, quantity, status, remarks, date
        // The current form doesn't provide all these fields.
        alert('Add to Inventory functionality is not fully implemented yet due to missing form fields.');
        return;

        // // Example AJAX call (will be uncommented and updated once form is ready)
        // $.ajax({
        //     url: url,
        //     method: method,
        //     contentType: 'application/json',
        //     data: JSON.stringify(inventoryData),
        //     success: function(response) {
        //         $('#inventoryModal').modal('hide');
        //         fetchInventoryItems(); // Reload the table
        //     },
        //     error: function(error) {
        //         console.error('Error saving inventory item:', error);
        //         alert('Error saving inventory item.');
        //     }
        // });
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
