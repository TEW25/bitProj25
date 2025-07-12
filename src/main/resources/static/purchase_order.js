$(document).ready(function() {
    // Function to load suppliers into the dropdown
    function loadSuppliers() {
        $.ajax({
            url: '/api/suppliers/all',
            method: 'GET',
            success: function(suppliers) {
                const supplierSelect = $('#supplierSelect');
                supplierSelect.empty().append('<option value="">-- Select a Supplier --</option>');
                suppliers.forEach(supplier => {
                    supplierSelect.append(`<option value="${supplier.id}">${supplier.suppliername}</option>`);
                });
            },
            error: function(error) {
                console.error('Error loading suppliers:', error);
                alert('Failed to load suppliers.');
            }
        });
    }

    // Function to load brands into the dropdown
    function loadBrands() {
        $.ajax({
            url: '/api/brands/all',
            method: 'GET',
            success: function(brands) {
                const brandFilter = $('#brandFilter');
                brandFilter.empty().append('<option value="">All Brands</option>');
                brands.forEach(brand => {
                    brandFilter.append(`<option value="${brand.id}">${brand.name}</option>`);
                });
            },
            error: function(error) {
                console.error('Error loading brands:', error);
                alert('Failed to load brands.');
            }
        });
    }

    // Function to load categories into the dropdown
    function loadCategories() {
        $.ajax({
            url: '/api/categories/all',
            method: 'GET',
            success: function(categories) {
                const categoryFilter = $('#categoryFilter');
                categoryFilter.empty().append('<option value="">All Categories</option>');
                categories.forEach(category => {
                    categoryFilter.append(`<option value="${category.id}">${category.name}</option>`);
                });
            },
            error: function(error) {
                console.error('Error loading categories:', error);
                alert('Failed to load categories.');
            }
        });
    }

    // Function to load all items into the dropdown
    function loadAllItems() {
        const itemSelect = $('#itemSelect');
        itemSelect.empty().append('<option value="">-- Select an Item --</option>');
        $('#itemQuantity').prop('disabled', true).val(1);
        $('#itemPrice').val('');
        $('#linePrice').val('');
        $('#addItemBtn').prop('disabled', true);

        $.ajax({
            url: '/api/items',
            method: 'GET',
            success: function(items) {
                items.forEach(item => {
                    itemSelect.append(`<option value="${item.id}" data-price="${item.purchaseprice}">${item.itemcode} - ${item.itemname}</option>`);
                });
                itemSelect.prop('disabled', false);
            },
            error: function(error) {
                console.error('Error loading items:', error);
                alert('Failed to load items.');
            }
        });
    }

    // Function to load items based on filters
    function loadFilteredItems(brandId, categoryId) {
        const itemSelect = $('#itemSelect');
        itemSelect.empty().append('<option value="">-- Select an Item --</option>');
        $('#itemQuantity').prop('disabled', true).val(1);
        $('#itemPrice').val('').prop('disabled', true);
        $('#linePrice').val('');
        $('#addItemBtn').prop('disabled', true);

        const filters = {};
        if (brandId) {
            filters.brandId = brandId;
        }
        if (categoryId) {
            filters.statusId = categoryId; // Assuming category filter maps to statusId in backend for now, need to confirm or adjust backend
        }

        $.ajax({
            url: '/api/items',
            method: 'GET',
            data: filters,
            success: function(items) {
                items.forEach(item => {
                    itemSelect.append(`<option value="${item.id}" data-price="${item.purchaseprice}">${item.itemcode} - ${item.itemname}</option>`);
                });
                itemSelect.prop('disabled', false);
            },
            error: function(error) {
                console.error('Error loading items:', error);
                alert('Failed to load items.');
            }
        });
    }

    // Event listener for supplier selection change
    $('#supplierSelect').change(function() {
        // No longer loading items based on supplier here
    });

    // Event listener for item selection change
    $('#itemSelect').change(function() {
        const selectedItemOption = $(this).find(':selected');
        const itemId = selectedItemOption.val();
        const purchasePrice = selectedItemOption.data('price'); // Get the initial purchase price from data attribute
        const itemQuantityInput = $('#itemQuantity');
        const itemPriceInput = $('#itemPrice');
        const linePriceInput = $('#linePrice');
        const addItemBtn = $('#addItemBtn');

        if (itemId) {
            // Enable quantity and price inputs when an item is selected
            itemQuantityInput.prop('disabled', false);
            itemPriceInput.prop('disabled', false);
            
            // Set the initial purchase price
            if (purchasePrice !== undefined) {
                itemPriceInput.val(purchasePrice.toFixed(2));
            } else {
                itemPriceInput.val(''); // Clear if no price data
            }

            // Recalculate line price and check if add button should be enabled
            updateLinePriceAndAddItemButton();
        } else {
            // Disable inputs and button when no item is selected
            itemQuantityInput.prop('disabled', true).val(1);
            itemPriceInput.prop('disabled', true).val('');
            linePriceInput.val('');
            addItemBtn.prop('disabled', true);
        }
    });

    // Function to update line price and enable/disable add item button
    function updateLinePriceAndAddItemButton() {
        const quantityInput = $('#itemQuantity');
        const priceInput = $('#itemPrice');
        const linePriceInput = $('#linePrice');
        const addItemBtn = $('#addItemBtn');
        const itemSelect = $('#itemSelect');

        const quantity = parseInt(quantityInput.val());
        const price = parseFloat(priceInput.val());

        // Check if an item is selected and quantity/price are valid numbers
        if (itemSelect.val() && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price >= 0) {
            linePriceInput.val((quantity * price).toFixed(2));
            addItemBtn.prop('disabled', false);
        } else {
            linePriceInput.val('');
            addItemBtn.prop('disabled', true);
        }
    }

    // Event listener for quantity or price change to update line price and button state
    $('#itemQuantity, #itemPrice').on('input', function() {
        updateLinePriceAndAddItemButton();
    });

    // Function to add selected item to the order table
    $('#addItemBtn').click(function() {
        const itemSelect = $('#itemSelect');
        const selectedItemOption = itemSelect.find(':selected');
        const itemId = selectedItemOption.val();
        const itemCode = selectedItemOption.text().split(' - ')[0];
        const itemName = selectedItemOption.text().split(' - ')[1];
        // Get purchase price and line price from the input fields
        const purchasePrice = parseFloat($('#itemPrice').val());
        const quantity = parseInt($('#itemQuantity').val());
        const linePrice = parseFloat($('#linePrice').val());

        // Check if item is already in the table
        let existingRow = $(`#orderItemsTableBody tr[data-item-id="${itemId}"]`);

        if (existingRow.length) {
            // Update quantity and line price if item already exists
            let existingQuantity = parseInt(existingRow.find('td:nth-child(3)').text());
            let newQuantity = existingQuantity + quantity;
            let newLinePrice = newQuantity * purchasePrice; // Recalculate line price based on the *new* total quantity and the *current* purchase price
            existingRow.find('td:nth-child(3)').text(newQuantity);
            existingRow.find('td:nth-child(4)').text(purchasePrice.toFixed(2)); // Update purchase price in the table
            existingRow.find('td:nth-child(5)').text(newLinePrice.toFixed(2));
        } else {
            // Add new row to the table
            const newRow = `
                <tr data-item-id="${itemId}">
                    <td>${itemCode}</td>
                    <td>${itemName}</td>
                    <td>${quantity}</td>
                    <td>${purchasePrice.toFixed(2)}</td>
                    <td>${linePrice.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-item-btn">Remove</button>
                    </td>
                </tr>
            `;
            $('#orderItemsTableBody').append(newRow);
        }

        // Update total amount
        updateTotalAmount();

        // Clear item selection and quantity/price inputs
        itemSelect.val('');
        $('#itemQuantity').val(1).prop('disabled', true);
        $('#itemPrice').val('').prop('disabled', true);
        $('#linePrice').val('');
        $('#addItemBtn').prop('disabled', true);
    });

    // Function to update the total amount
    function updateTotalAmount() {
        let total = 0;
        $('#orderItemsTableBody tr').each(function() {
            const linePrice = parseFloat($(this).find('td:nth-child(5)').text());
            total += linePrice;
        });
        $('#totalAmount').val(total.toFixed(2));
    }

    // Event listener for removing an item from the order table
    $('#orderItemsTableBody').on('click', '.remove-item-btn', function() {
        $(this).closest('tr').remove();
        updateTotalAmount();
    });

    // Function to submit the purchase order
    $('#submitOrderBtn').click(function() {
        const supplierId = $('#supplierSelect').val();
        const totalAmount = parseFloat($('#totalAmount').val());
        const orderItems = [];

        $('#orderItemsTableBody tr').each(function() {
            const itemId = $(this).data('item-id');
            const quantity = parseInt($(this).find('td:nth-child(3)').text());
            const purchasePrice = parseFloat($(this).find('td:nth-child(4)').text());

            orderItems.push({
                item: { id: itemId }, // Assuming backend expects item ID within an item object
                orderedqty: quantity,
                purchaseprice: purchasePrice,
                // lineprice will be calculated on the backend
            });
        });

        if (!supplierId) {
            alert('Please select a supplier.');
            return;
        }

        if (orderItems.length === 0) {
            alert('Please add items to the order.');
            return;
        }

        const purchaseOrderData = {
            supplier: { id: supplierId }, // Assuming backend expects supplier ID within a supplier object
            totalamount: totalAmount,
            purchaseOrderItems: orderItems,
            // requireddate and porderstatus will be set on the backend
        };

        $.ajax({
            url: '/api/purchaseorders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(purchaseOrderData),
            success: function(response) {
                alert('Purchase Order created successfully!');
                // TODO: Clear the form or redirect
                $('#supplierSelect').val('').trigger('change');
                $('#orderItemsTableBody').empty();
                $('#totalAmount').val('0.00');
            },
            error: function(xhr, status, error) {
                console.error('Error creating purchase order:', xhr.responseText);
                alert('Failed to create purchase order: ' + xhr.responseText);
            }
        });
    });

    // Event listeners for filter changes
    $('#brandFilter').change(function() {
        const selectedBrandId = $(this).val();
        const selectedCategoryId = $('#categoryFilter').val();
        loadFilteredItems(selectedBrandId, selectedCategoryId);
    });

    $('#categoryFilter').change(function() {
        const selectedCategoryId = $(this).val();
        const selectedBrandId = $('#brandFilter').val();
        loadFilteredItems(selectedBrandId, selectedCategoryId);
    });

    // Initial load of suppliers, brands, categories, and all items when the page is ready
    loadSuppliers();
    loadBrands();
    loadCategories();
    loadFilteredItems(); // Load all items initially
});
