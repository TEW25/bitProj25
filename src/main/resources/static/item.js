console.log('item.js loaded');

$(document).ready(function() {
    // Function to load items into the table
    function loadItems(brandId, statusId, searchTerm) {
        let url = '/api/items';
        const params = new URLSearchParams();

        if (brandId) {
            params.append('brandId', brandId);
        }
        if (statusId) {
            params.append('statusId', statusId);
        }
        if (searchTerm) {
            params.append('searchTerm', searchTerm);
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }

        console.log('Loading items with URL:', url);

        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                console.log('Items data received:', data);
                $('#itemTableBody').empty(); // Clear existing rows
                data.forEach(function(item) {
                    $('#itemTableBody').append(
                        '<tr>' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.itemcode + '</td>' +
                        '<td>' + item.itemname + '</td>' +
                        '<td>' + (item.itemsize !== null ? item.itemsize : '') + '</td>' + // Handle potential nulls
                        '<td>' + (item.rop !== null ? item.rop : '') + '</td>' + // Handle potential nulls
                        '<td>' + (item.roq !== null ? item.roq : '') + '</td>' + // Handle potential nulls
                        '<td>' + (item.salesprice !== null ? item.salesprice : '') + '</td>' + // Handle potential nulls
                        '<td>' + (item.purchaseprice !== null ? item.purchaseprice : '') + '</td>' + // Handle potential nulls
                        '<td>' + (item.itemstatus ? item.itemstatus.name : '') + '</td>' +
                        '<td>' + (item.brand ? item.brand.name : '') + '</td>' +
                        '<td>' + (item.subcategory && item.subcategory.category ? item.subcategory.category.name : '') + '</td>' + // Display Category name
                        '<td>' + (item.subcategory ? item.subcategory.name : '') + '</td>' +
                        '<td>' +
                        '<button class="btn btn-sm btn-warning edit-btn" data-id="' + item.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-btn" data-id="' + item.id + '">Delete</button>' +
                        '</td>' +
                        '</tr>'
                    );
                });
            },
            error: function(error) {
                console.error('Error loading items:', error);
                $('#itemTableBody').html('<tr><td colspan="13">Error loading items.</td></tr>');
            }
        });
    }

    // Function to load dropdown options
    function loadDropdownOptions() {
        // Load Item Statuses
        $.ajax({
            url: '/api/itemstatuses',
            method: 'GET',
            success: function(data) {
                console.log('Item Statuses data received:', data);
                const itemStatusSelect = $('#itemStatus');
                const filterStatusSelect = $('#filterStatus');
                itemStatusSelect.empty();
                filterStatusSelect.empty();
                filterStatusSelect.append($('<option>', { value: '', text: 'All Statuses' })); // Add a default option
                console.log('Populating filterStatusSelect...');
                data.forEach(function(status) {
                    itemStatusSelect.append($('<option>', {
                        value: status.id,
                        text: status.name
                    }));
                    filterStatusSelect.append($('<option>', {
                        value: status.id,
                        text: status.name
                    }));
                });
                console.log('Finished populating filterStatusSelect.');
            },
            error: function(error) {
                console.error('Error loading item statuses:', error);
            }
        });

        // Load Brands
        $.ajax({
            url: '/api/brands',
            method: 'GET',
            success: function(data) {
                console.log('Brands data received:', data);
                const brandSelect = $('#itemBrand');
                const filterBrandSelect = $('#filterBrand');
                brandSelect.empty();
                filterBrandSelect.empty();
                 brandSelect.append($('<option>', { value: '', text: 'Select Brand' })); // Add a default option
                 filterBrandSelect.append($('<option>', { value: '', text: 'All Brands' })); // Add a default option
                console.log('Populating filterBrandSelect...');
                data.forEach(function(brand) {
                    brandSelect.append($('<option>', {
                        value: brand.id,
                        text: brand.name
                    }));
                    filterBrandSelect.append($('<option>', {
                        value: brand.id,
                        text: brand.name
                    }));
                });
                console.log('Finished populating filterBrandSelect.');
            },
            error: function(error) {
                console.error('Error loading brands:', error);
            }
        });

        // Load Categories
        $.ajax({
            url: '/api/categories',
            method: 'GET',
            success: function(data) {
                const categorySelect = $('#itemCategory');
                categorySelect.empty();
                categorySelect.append($('<option>', { value: '', text: 'Select Category' })); // Add a default option
                data.forEach(function(category) {
                    categorySelect.append($('<option>', {
                        value: category.id,
                        text: category.name
                    }));
                });
            },
            error: function(error) {
                console.error('Error loading categories:', error);
            }
        });

         // Load Subcategories based on selected Category
        $('#itemCategory').change(function() {
            const categoryId = $(this).val();
            const subcategorySelect = $('#itemSubcategory');
            subcategorySelect.empty();
            subcategorySelect.append($('<option>', { value: '', text: 'Select Subcategory' })); // Add a default option

            if (categoryId) {
                $.ajax({
                    url: '/api/subcategories/byCategory/' + categoryId,
                    method: 'GET',
                    success: function(data) {
                        data.forEach(function(subcategory) {
                            subcategorySelect.append($('<option>', {
                                value: subcategory.id,
                                text: subcategory.name
                            }));
                        });
                    },
                    error: function(error) {
                        console.error('Error loading subcategories:', error);
                    }
                });
            }
        });
    }

    // Load items and dropdown options when the page is ready
    loadItems();
    loadDropdownOptions();

    // Handle Add Item button click
    $('#addItemBtn').click(function() {
        $('#itemModalLabel').text('Add Item');
        $('#itemForm')[0].reset(); // Clear the form
        $('#itemId').val(''); // Clear the hidden ID field
        $('#itemModal').modal('show');
    });

    // Handle form submission (Add/Edit Item)
    $('#itemForm').submit(function(event) {
        event.preventDefault();

        // Basic form validation
        const itemCode = $('#itemCode').val();
        const itemName = $('#itemName').val();
        const itemSize = $('#itemSize').val();
        const itemRop = $('#itemRop').val();
        const itemRoq = $('#itemRoq').val();
        const itemSalesPrice = $('#itemSalesPrice').val();
        const itemPurchasePrice = $('#itemPurchasePrice').val();
        const itemStatus = $('#itemStatus').val();
        const itemBrand = $('#itemBrand').val();
        const itemCategory = $('#itemCategory').val();
        const itemSubcategory = $('#itemSubcategory').val();

        if (!itemCode || !itemName || !itemSalesPrice || !itemPurchasePrice || !itemStatus || !itemBrand || !itemCategory || !itemSubcategory) {
            alert('Please fill in all required fields.');
            return;
        }

        // Specific validation rules
        if (!/^[A-Za-z]{3}[0-9]{4}$/.test(itemCode)) {
             alert('Item Code must start with 3 letters followed by 4 digits (e.g., ITM0001).');
             return;
        }

        const salesPrice = parseFloat(itemSalesPrice);
        if (isNaN(salesPrice) || salesPrice <= 0) {
            alert('Sales Price must be a positive number.');
            return;
        }

        const purchasePrice = parseFloat(itemPurchasePrice);
        if (isNaN(purchasePrice) || purchasePrice <= 0) {
            alert('Purchase Price must be a positive number.');
            return;
        }

        if (itemRop !== '') {
            const rop = parseInt(itemRop);
            if (isNaN(rop) || rop < 0) {
                alert('ROP must be a non-negative integer.');
                return;
            }
        }

         if (itemRoq !== '') {
            const roq = parseInt(itemRoq);
            if (isNaN(roq) || roq < 0) {
                alert('ROQ must be a non-negative integer.');
                return;
            }
        }

        const itemId = $('#itemId').val();
        const itemData = {
            itemcode: itemCode,
            itemname: itemName,
            itemsize: itemSize ? parseFloat(itemSize) : null, // Convert to float, handle empty
            rop: itemRop ? parseInt(itemRop) : null, // Convert to int, handle empty
            roq: itemRoq ? parseInt(itemRoq) : null, // Convert to int, handle empty
            salesprice: salesPrice, // Use validated value
            purchaseprice: purchasePrice, // Use validated value
            itemstatus: { id: parseInt(itemStatus) },
            brand: { id: parseInt(itemBrand) },
            subcategory: { id: parseInt(itemSubcategory) }
        };

        let url = '/api/items';
        let method = 'POST';

        if (itemId) {
            // If itemId exists, it's an edit operation
            url = '/api/items/' + itemId;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(itemData),
            success: function(response) {
                $('#itemModal').modal('hide');
                loadItems(); // Reload the table
            },
            error: function(error) {
                console.error('Error saving item:', error);
                alert('Error saving item.'); // Basic error handling
            }
        });
    });

    // Handle Edit button click (using event delegation)
    $('#itemTableBody').on('click', '.edit-btn', function() {
        const itemId = $(this).data('id');
        $('#itemModalLabel').text('Edit Item');

        $.ajax({
            url: '/api/items/' + itemId,
            method: 'GET',
            success: function(item) {
                $('#itemId').val(item.id);
                $('#itemCode').val(item.itemcode);
                $('#itemName').val(item.itemname);
                $('#itemSize').val(item.itemsize);
                $('#itemRop').val(item.rop);
                $('#itemRoq').val(item.roq);
                $('#itemSalesPrice').val(item.salesprice);
                $('#itemPurchasePrice').val(item.purchaseprice);
                $('#itemStatus').val(item.itemstatus ? item.itemstatus.id : '');
                $('#itemBrand').val(item.brand ? item.brand.id : '');

                // Load subcategories for the item's category and then set the subcategory dropdown
                if (item.subcategory && item.subcategory.category) {
                     $('#itemCategory').val(item.subcategory.category.id);
                     const categoryId = item.subcategory.category.id;
                     const subcategorySelect = $('#itemSubcategory');
                     subcategorySelect.empty();
                     subcategorySelect.append($('<option>', { value: '', text: 'Select Subcategory' })); // Add a default option

                     $.ajax({
                        url: '/api/subcategories/byCategory/' + categoryId,
                        method: 'GET',
                        success: function(data) {
                            data.forEach(function(subcategory) {
                                subcategorySelect.append($('<option>', {
                                    value: subcategory.id,
                                    text: subcategory.name
                                }));
                            });
                             // Now set the item's subcategory
                            $('#itemSubcategory').val(item.subcategory.id);
                        },
                        error: function(error) {
                            console.error('Error loading subcategories for edit:', error);
                        }
                    });
                } else {
                     $('#itemCategory').val('');
                     $('#itemSubcategory').empty();
                     $('#itemSubcategory').append($('<option>', { value: '', text: 'Select Subcategory' }));
                }

                $('#itemModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching item details:', error);
                alert('Error fetching item details.');
            }
        });
    });

    // Handle Delete button click (using event delegation)
    $('#itemTableBody').on('click', '.delete-btn', function() {
        const itemId = $(this).data('id');

        if (confirm('Are you sure you want to delete this item?')) {
            $.ajax({
                url: '/api/items/' + itemId,
                method: 'DELETE',
                success: function(response) {
                    loadItems(); // Reload the table
                },
                error: function(error) {
                    console.error('Error deleting item:', error);
                    alert('Error deleting item.');
                }
            });
        }
    });

    // Handle Apply Filter/Search button click
    $('#applyFilterBtn').click(function() {
        const brandId = $('#filterBrand').val();
        const statusId = $('#filterStatus').val();
        const searchTerm = $('#searchItem').val();
        loadItems(brandId, statusId, searchTerm);
    });
});