$(document).ready(function() {
    // Function to load suppliers into the table
    function loadSuppliers(statusId = '', supplierName = '') {
        const params = {};
        if (statusId) {
            params.statusId = statusId;
        }
        if (supplierName) {
            params.supplierName = supplierName;
        }

        $.ajax({
            url: '/api/suppliers',
            method: 'GET',
            data: params, // Pass filter and search parameters
            success: function(data) {
                $('#supplierTableBody').empty(); // Clear existing rows
                if (data.length === 0) {
                    $('#supplierTableBody').append('<tr><td colspan="6">No suppliers found.</td></tr>');
                } else {
                    data.forEach(function(supplier) {
                        $('#supplierTableBody').append(
                            '<tr>' +
                            '<td>' + supplier.id + '</td>' +
                            '<td>' + supplier.suppliername + '</td>' +
                            '<td>' + supplier.suppliercontactno + '</td>' +
                            '<td>' + supplier.email + '</td>' +
                            '<td>' + (supplier.supplierstatus ? supplier.supplierstatus.name : '') + '</td>' +
                            '<td>' +
                            '<button class="btn btn-sm btn-warning edit-btn" data-id="' + supplier.id + '">Edit</button> ' +
                            '<button class="btn btn-sm btn-danger delete-btn" data-id="' + supplier.id + '">Delete</button>' +
                            '</td>' +
                            '</tr>'
                        );
                    });
                }
            },
            error: function(error) {
                console.error('Error loading suppliers:', error);
                $('#supplierTableBody').html('<tr><td colspan="6">Error loading suppliers.</td></tr>');
            }
        });
    }

    // Function to load dropdown options (e.g., supplier statuses)
    function loadDropdownOptions() {
        // Load Supplier Statuses for both modal and filter
        $.ajax({
            url: '/api/supplierstatuses',
            method: 'GET',
            success: function(data) {
                const statusSelectModal = $('#supplierStatus');
                const statusSelectFilter = $('#filterStatus');
                statusSelectModal.empty();
                statusSelectFilter.empty();
                statusSelectFilter.append($('<option>', { value: '', text: 'All Statuses' })); // Add 'All Statuses' option for filter
                data.forEach(function(status) {
                    statusSelectModal.append($('<option>', {
                        value: status.id,
                        text: status.name
                    }));
                    statusSelectFilter.append($('<option>', {
                        value: status.id,
                        text: status.name
                    }));
                });
            },
            error: function(error) {
                console.error('Error loading supplier statuses:', error);
            }
        });
    }

    // Load suppliers and dropdown options when the page is ready
    loadSuppliers();
    loadDropdownOptions();

    // Handle Add Supplier button click
    $('#addSupplierBtn').click(function() {
        $('#supplierModalLabel').text('Add Supplier');
        $('#supplierForm')[0].reset(); // Clear the form
        $('#supplierId').val(''); // Clear the hidden ID field
        $('#supplierModal').modal('show');
    });

    // Handle form submission (Add/Edit Supplier)
    $('#supplierForm').submit(function(event) {
        event.preventDefault();

        const supplierId = $('#supplierId').val();
        const supplierData = {
            suppliername: $('#supplierName').val(),
            suppliercontactno: $('#supplierContactNo').val(),
            email: $('#supplierEmail').val(),
            supplierstatus: { id: parseInt($('#supplierStatus').val()) }
        };

        let url = '/api/suppliers';
        let method = 'POST';

        if (supplierId) {
            // If supplierId exists, it's an edit operation
            url = '/api/suppliers/' + supplierId;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(supplierData),
            success: function(response) {
                $('#supplierModal').modal('hide');
                loadSuppliers(); // Reload the table
            },
            error: function(error) {
                console.error('Error saving supplier:', error);
                alert('Error saving supplier.'); // Basic error handling
            }
        });
    });

    // Handle Edit button click (using event delegation)
    $('#supplierTableBody').on('click', '.edit-btn', function() {
        const supplierId = $(this).data('id');
        $('#supplierModalLabel').text('Edit Supplier');

        $.ajax({
            url: '/api/suppliers/' + supplierId,
            method: 'GET',
            success: function(supplier) {
                $('#supplierId').val(supplier.id);
                $('#supplierName').val(supplier.suppliername);
                $('#supplierContactNo').val(supplier.suppliercontactno);
                $('#supplierEmail').val(supplier.email);
                $('#supplierStatus').val(supplier.supplierstatus ? supplier.supplierstatus.id : '');
                $('#supplierModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching supplier details:', error);
                alert('Error fetching supplier details.');
            }
        });
    });

    // Handle Delete button click (using event delegation)
    $('#supplierTableBody').on('click', '.delete-btn', function() {
        const supplierId = $(this).data('id');

        if (confirm('Are you sure you want to delete this supplier?')) {
            $.ajax({
                url: '/api/suppliers/' + supplierId,
                method: 'DELETE',
                success: function(response) {
                    loadSuppliers(); // Reload the table
                },
                error: function(error) {
                    console.error('Error deleting supplier:', error);
                    alert('Error deleting supplier.');
                }
            });
        }
    });

    // Handle Apply Filter/Search button click
    $('#applyFilterBtn').click(function() {
        const statusId = $('#filterStatus').val();
        const supplierName = $('#searchName').val();
        loadSuppliers(statusId, supplierName);
    });
});