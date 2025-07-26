// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Populate status dropdown for add inventory
    function populateAddStatusDropdown() {
        fetch('/api/inventorystatus')
            .then(response => response.json())
            .then(statuses => {
                const statusSelect = document.getElementById('addStatusSelect');
                if (!statusSelect) return;
                statusSelect.innerHTML = '<option value="">-- Select Status --</option>';
                statuses.forEach(status => {
                    const option = document.createElement('option');
                    option.value = status.id;
                    option.textContent = status.name;
                    statusSelect.appendChild(option);
                });
            });
    }
    // Show scrollable popup for item search results
    function showItemSearchPopup(items) {
        let popup = document.getElementById('itemSearchPopup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'itemSearchPopup';
            popup.style.position = 'absolute';
            popup.style.zIndex = '9999';
            popup.style.background = '#fff';
            popup.style.border = '1px solid #ccc';
            popup.style.maxHeight = '200px';
            popup.style.overflowY = 'auto';
            popup.style.width = '100%';
            popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            document.body.appendChild(popup);
        }
        popup.innerHTML = '';
        if (items.length === 0) {
            const noResult = document.createElement('div');
            noResult.textContent = 'No items found.';
            noResult.className = 'dropdown-item';
            popup.appendChild(noResult);
        } else {
            items.forEach(item => {
                const option = document.createElement('div');
                option.className = 'dropdown-item';
                option.style.cursor = 'pointer';
                option.textContent = `${item.itemcode} - ${item.itemname}`;
                option.dataset.itemId = item.id;
                option.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    document.getElementById('addItemSearch').value = option.textContent;
                    document.getElementById('addItemSearch').dataset.selectedItemId = item.id;
                    hideItemSearchPopup();
                });
                popup.appendChild(option);
            });
        }
        // Position popup below the search field
        const searchInput = document.getElementById('addItemSearch');
        const rect = searchInput.getBoundingClientRect();
        popup.style.left = rect.left + 'px';
        popup.style.top = (rect.bottom + window.scrollY) + 'px';
        popup.style.width = rect.width + 'px';
        popup.style.display = 'block';
    }

    function hideItemSearchPopup() {
        const popup = document.getElementById('itemSearchPopup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    function fetchItemSearchResults(searchTerm = '') {
        let url = '/api/items';
        fetch(url)
            .then(response => response.json())
            .then(items => {
                let filteredItems = items;
                if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    filteredItems = items.filter(item =>
                        (item.itemcode && item.itemcode.toLowerCase().includes(term)) ||
                        (item.itemname && item.itemname.toLowerCase().includes(term))
                    );
                }
                showItemSearchPopup(filteredItems);
            });
    }

    // Declare DOM variables FIRST (only once)
    const addInventoryForm = document.getElementById('addInventoryForm');
    const addInventoryModal = document.getElementById('addInventoryModal');
    const editInventoryForm = document.getElementById('editInventoryForm');
    const editInventoryModal = document.getElementById('editInventoryModal');
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const inventoryTable = document.querySelector('.table'); // Get the table element
    const addItemSearch = document.getElementById('addItemSearch');

    // Call this when add modal is opened
    $('#addInventoryModal').on('show.bs.modal', function () {
        // Populate item dropdown with pagination
        let itemPage = 0;
        const itemSize = 50;
        const itemSelect = document.getElementById('addItemSelect');
        if (!itemSelect) return;
        function fetchItems(page) {
            fetch(`/api/items?page=${page}&size=${itemSize}`)
                .then(response => response.json())
                .then(data => {
                    const items = data.content || [];
                    if (page === 0) {
                        itemSelect.innerHTML = '<option value="">-- Select Item --</option>';
                    }
                    items.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = `${item.itemcode} - ${item.itemname}`;
                        option.dataset.itemcode = item.itemcode || '';
                        itemSelect.appendChild(option);
                    });
                    // Add Load More button if more pages
                    if (!data.last) {
                        if (!document.getElementById('loadMoreItemBtn')) {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'btn btn-link';
                            btn.id = 'loadMoreItemBtn';
                            btn.textContent = 'Load More';
                            itemSelect.parentNode.appendChild(btn);
                        }
                        document.getElementById('loadMoreItemBtn').onclick = function() {
                            itemPage++;
                            fetchItems(itemPage);
                        };
                    } else {
                        const btn = document.getElementById('loadMoreItemBtn');
                        if (btn) btn.remove();
                    }
                })
                .catch(() => {
                    itemSelect.innerHTML = '<option value="">Failed to load items</option>';
                    const btn = document.getElementById('loadMoreItemBtn');
                    if (btn) btn.remove();
                });
        }
        fetchItems(itemPage);
        // Auto-fill inventory code with INV + random 6 digits when item is selected
        itemSelect.addEventListener('change', function () {
            const inventoryCodeInput = document.getElementById('addInventoryCode');
            if (inventoryCodeInput) {
                // Generate random 6 digit number
                const randomDigits = Math.floor(100000 + Math.random() * 900000);
                inventoryCodeInput.value = 'INV' + randomDigits;
            }
        });
    });
    if (addItemSearch) {
        addItemSearch.value = '';
        addItemSearch.dataset.selectedItemId = '';
        addItemSearch.addEventListener('input', function () {
            const searchTerm = addItemSearch.value.trim();
            if (searchTerm.length > 0) {
                fetchItemSearchResults(searchTerm);
            } else {
                hideItemSearchPopup();
            }
        });
        addItemSearch.addEventListener('blur', function () {
            setTimeout(hideItemSearchPopup, 200); // Delay to allow click
        });
        // When an item is selected from the popup, set the dropdown value
        document.body.addEventListener('mousedown', function (e) {
            if (e.target.classList.contains('dropdown-item') && e.target.dataset.itemId) {
                const itemId = e.target.dataset.itemId;
                const itemSelect = document.getElementById('addItemSelect');
                if (itemSelect) {
                    itemSelect.value = itemId;
                    itemSelect.classList.add('selected');
                    // Also trigger change event for validation
                    itemSelect.dispatchEvent(new Event('change'));
                }
                // Set the search field value to the selected item's text
                if (addItemSearch) {
                    addItemSearch.value = e.target.textContent;
                }
            }
        });
    }
        populateAddStatusDropdown();
        // Populate status dropdown for main filter
        populateStatusDropdown();

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
                        document.getElementById('editInventoryModalLabel').textContent = 'Edit Inventory Item';
                        document.getElementById('editInventoryId').value = item.id ?? '';
                        document.getElementById('editQuantityInput').value = item.availableqty ?? '';
                        const statusSelect = document.getElementById('editTransactionStatusSelect');
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
                        $(editInventoryModal).modal('show');
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

    // Pagination state
    let currentPage = 0;
    let pageSize = 10;
    let totalPages = 1;
    let lastSearchTerm = '';
    let lastStatus = '';
    let lastSortBy = '';

    // Function to render Bootstrap-styled pagination controls
    function renderPaginationControls(page, totalPages, totalElements) {
        let container = document.getElementById('paginationControls');
        if (!container) {
            // Create container if not exists
            const card = document.querySelector('.table');
            container = document.createElement('div');
            container.id = 'paginationControls';
            container.className = 'd-flex justify-content-center my-3';
            card.parentNode.insertBefore(container, card.nextSibling);
        }
        if (totalPages > 1 || totalElements > pageSize) {
            let html = `
                <nav aria-label="Inventory pagination">
                  <ul class="pagination">
                    <li class="page-item ${page === 0 ? 'disabled' : ''}">
                      <button class="page-link" id="prevPageBtn">Previous</button>
                    </li>
                    <li class="page-item disabled">
                      <span class="page-link" id="pageInfo">Page ${page + 1} of ${totalPages} (${totalElements} items)</span>
                    </li>
                    <li class="page-item ${page >= totalPages - 1 ? 'disabled' : ''}">
                      <button class="page-link" id="nextPageBtn">Next</button>
                    </li>
                  </ul>
                </nav>
            `;
            container.innerHTML = html;
            // Attach event listeners
            document.getElementById('prevPageBtn').onclick = function() {
                if (currentPage > 0) {
                    fetchInventoryItems(lastSearchTerm, lastStatus, lastSortBy, currentPage - 1, pageSize);
                }
            };
            document.getElementById('nextPageBtn').onclick = function() {
                if (currentPage < totalPages - 1) {
                    fetchInventoryItems(lastSearchTerm, lastStatus, lastSortBy, currentPage + 1, pageSize);
                }
            };
            container.style.display = '';
        } else {
            container.style.display = 'none';
        }
    }

    // Function to fetch and display inventory items with pagination
    function fetchInventoryItems(searchTerm = '', status = '', sortBy = '', page = 0, size = 10) {
        lastSearchTerm = searchTerm;
        lastStatus = status;
        lastSortBy = sortBy;
        currentPage = page;
        pageSize = size;
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
        params.append('page', page);
        params.append('size', size);
        if (params.toString()) {
            url += '?' + params.toString();
        }
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                inventoryTableBody.innerHTML = '';
                if (!data || !data.content || data.content.length === 0) {
                    const noDataRow = document.createElement('tr');
                    noDataRow.innerHTML = '<td colspan="8">No inventory items found.</td>';
                    inventoryTableBody.appendChild(noDataRow);
                    renderPaginationControls(data.number || 0, data.totalPages || 1, data.totalElements || 0);
                    return;
                }
                data.content.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id ?? ''}</td>
                        <td>${item.item ? (item.item.itemcode ?? '') : ''}</td>
                        <td>${item.item ? (item.item.itemname ?? '') : ''}</td>
                        <td>${item.availableqty ?? ''}</td>
                        <td>${item.inventorystatus ? (item.inventorystatus.name ?? '') : ''}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-inventory-btn" data-id="${item.id ?? ''}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-inventory-btn" data-id="${item.id ?? ''}">Delete</button>
                        </td>
                    `;
                    inventoryTableBody.appendChild(row);
                });
                renderPaginationControls(data.number, data.totalPages, data.totalElements);
            })
            .catch(error => {
                inventoryTableBody.innerHTML = '<tr><td colspan="8">Error loading inventory. Please try again.</td></tr>';
                renderPaginationControls(0, 1, 0);
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
        if (addInventoryForm) {
            addInventoryForm.reset();
        }
        document.getElementById('addInventoryModalLabel').textContent = 'Add Inventory Item';
        $('#addInventoryModal').modal('show');
    });

    // Add Inventory form submission
    if (addInventoryForm) {
        addInventoryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Get form values for add
            const itemSelect = document.getElementById('addItemSelect');
            const itemId = itemSelect.value;
            // Inventory code
            const inventoryCodeInput = document.getElementById('addInventoryCode');
            const inventorycode = inventoryCodeInput ? inventoryCodeInput.value : '';
            // Use correct input IDs for available and total qty
            const availableqtyStr = document.getElementById('addAvailableQty') ? document.getElementById('addAvailableQty').value : '';
            const statusId = document.getElementById('addStatusSelect') ? document.getElementById('addStatusSelect').value : '';

            // Stricter validation
            if (!itemId || itemId === '') {
                alert('Please select an item.');
                itemSelect.focus();
                return;
            }
            if (inventorycode === '') {
                alert('Inventory Code is required.');
                if (inventoryCodeInput) inventoryCodeInput.focus();
                return;
            }
            if (!/^INV\d{6}$/.test(inventorycode)) {
                alert('Inventory Code must start with "INV" followed by 6 digits (e.g., INV123456).');
                if (inventoryCodeInput) inventoryCodeInput.focus();
                return;
            }
            if (availableqtyStr === '' || isNaN(availableqtyStr)) {
                alert('Available Qty is required and must be a number.');
                return;
            }

            const availableqty = parseFloat(availableqtyStr);
            const totalqty = 1000;

            

            if (!statusId) {
                alert('Status is required.');
                return;
            }
            // Prepare data for POST
            const inventoryData = {
                item: { id: itemId },
                inventorycode,
                availableqty,
                totalqty,
                inventorystatus: { id: statusId }
            };

            fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inventoryData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add inventory item');
                return response.json();
            })
            .then(data => {
                $('#addInventoryModal').modal('hide');
                fetchInventoryItems(); // Reload the table
                alert('Inventory item added successfully.');
            })
            .catch(error => {
                console.error('Error adding inventory item:', error);
                alert('Error adding inventory item.');
            });
        });
    }
    // Edit Inventory form submission
    if (editInventoryForm) {
        editInventoryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Get form values for edit
            const id = document.getElementById('editInventoryId').value;
            const availableqtyStr = document.getElementById('editQuantityInput').value;
            const statusName = document.getElementById('editTransactionStatusSelect').value;

            // Stricter validation
            if (!id) {
                alert('No inventory item selected for editing.');
                return;
            }
            if (availableqtyStr === '' || isNaN(availableqtyStr)) {
                alert('Available Qty is required and must be a number.');
                return;
            }

            const availableqty = parseFloat(availableqtyStr);
            if (availableqty < 0) {
                alert('Available Qty must be a non-negative number.');
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
                        availableqty: availableqty,
                        totalqty: 1000,
                        inventorystatus: { id: selectedStatus.id, name: selectedStatus.name }
                    };
                    // Send PUT request
                    fetch('/api/inventory/' + id, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(inventoryData)
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to update inventory item');
                        return response.json();
                    })
                    .then(data => {
                        $('#editInventoryModal').modal('hide');
                        fetchInventoryItems(); // Reload the table
                        alert('Inventory item updated successfully.');
                    })
                    .catch(error => {
                        console.error('Error updating inventory item:', error);
                        alert('Error updating inventory item.');
                    });
                });
        });
    }

    // Event listener for the Apply Filter/Search button
    document.getElementById('applyFilterBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchName').value.trim();
        const status = document.getElementById('filterStatus').value;
        fetchInventoryItems(searchTerm, status, currentSortField ? `${currentSortField},${currentSortDirection}` : '', 0, pageSize);
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
// ...existing code...
// Ensure table loads data on initial page load
fetchInventoryItems();
}); // <-- Close DOMContentLoaded handler


