$(document).ready(function() {
    // Function to load suppliers into the table with pagination
    function loadSuppliers(statusId = '', supplierName = '', page = 0, size = 10) {
        lastStatusId = statusId;
        lastSupplierName = supplierName;
        currentPage = page;
        pageSize = size;
        const params = {
            page: page,
            size: size
        };
        if (statusId) {
            params.statusId = statusId;
        }
        if (supplierName) {
            params.supplierName = supplierName;
        }

        $.ajax({
            url: '/api/suppliers',
            method: 'GET',
            data: params, // Pass filter, search, and pagination parameters
            success: function(data) {
                // data is a Page object: { content, totalPages, number, size, totalElements }
                $('#supplierTableBody').empty(); // Clear existing rows
                if (!data.content || data.content.length === 0) {
                    $('#supplierTableBody').append('<tr><td colspan="6">No suppliers found.</td></tr>');
                } else {
                    data.content.forEach(function(supplier) {
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
                // Update pagination controls
                totalPages = data.totalPages;
                renderPaginationControls(data.number, data.totalPages, data.totalElements);
            },
            error: function(error) {
                console.error('Error loading suppliers:', error);
                $('#supplierTableBody').html('<tr><td colspan="6">Error loading suppliers.</td></tr>');
                $('#paginationControls').hide();
            }
        });
    }

    // Function to render Bootstrap-styled pagination controls
    function renderPaginationControls(page, totalPages, totalElements) {
        let container = $('#paginationControls');
        if (container.length === 0) {
            // Create container if not exists
            $('.card.shadow-sm').after('<div id="paginationControls" class="d-flex justify-content-center my-3"></div>');
            container = $('#paginationControls');
        }
        if (totalPages > 1 || totalElements > pageSize) {
            let html = `
                <nav aria-label="Supplier pagination">
                  <ul class="pagination">
                    <li class="page-item ${page === 0 ? 'disabled' : ''}">
                      <button class="page-link" id="prevPageBtn">Previous</button>
                    </li>
                    <li class="page-item disabled">
                      <span class="page-link" id="pageInfo">Page ${page + 1} of ${totalPages} (${totalElements} suppliers)</span>
                    </li>
                    <li class="page-item ${page >= totalPages - 1 ? 'disabled' : ''}">
                      <button class="page-link" id="nextPageBtn">Next</button>
                    </li>
                  </ul>
                </nav>
            `;
            container.html(html);
            // Attach event listeners
            $('#prevPageBtn').off('click').on('click', function() {
                if (currentPage > 0) {
                    loadSuppliers(lastStatusId, lastSupplierName, currentPage - 1, pageSize);
                }
            });
            $('#nextPageBtn').off('click').on('click', function() {
                if (currentPage < totalPages - 1) {
                    loadSuppliers(lastStatusId, lastSupplierName, currentPage + 1, pageSize);
                }
            });
            container.show();
        } else {
            container.hide();
        }
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

    // Function to clear all validation error messages (only clears email error now)
    function clearErrors() {
        $('#supplierEmailError').text('');
    }

    // Handle Add Supplier button click
    $('#addSupplierBtn').click(function() {
        $('#supplierModalLabel').text('Add Supplier');
        $('#supplierForm')[0].reset(); // Clear the form
        $('#supplierId').val(''); // Clear the hidden ID field
        clearErrors(); // Clear previous errors
        // Clear custom validity for name and contact number inputs
        $('#supplierName')[0].setCustomValidity('');
        $('#supplierContactNo')[0].setCustomValidity('');
        $('#supplierModal').modal('show');
    });

    // Add input event listeners to clear custom validity on typing
    $('#supplierName').on('input', function() {
        this.setCustomValidity('');
    });

    $('#supplierContactNo').on('input', function() {
        this.setCustomValidity('');
    });

    // Handle form submission (Add/Edit Supplier)
    $('#supplierForm').submit(function(event) {
        // Do not prevent default here initially to allow browser's native validation tooltips

        clearErrors(); // Clear previous email error

        const supplierId = $('#supplierId').val();
        const supplierNameInput = $('#supplierName')[0]; // Get the DOM element
        const supplierContactNoInput = $('#supplierContactNo')[0]; // Get the DOM element
        const supplierEmail = $('#supplierEmail').val().trim(); // Trim whitespace
        const supplierStatus = $('#supplierStatus').val();

        // Clear previous custom validity messages
        supplierNameInput.setCustomValidity('');
        supplierContactNoInput.setCustomValidity('');

        const supplierName = supplierNameInput.value.trim();
        const supplierContactNo = supplierContactNoInput.value.trim();

        let isValid = true;

        // Frontend validation for Supplier Name
        if (!supplierName) {
            supplierNameInput.setCustomValidity('Supplier Name is required.');
            isValid = false;
        } else {
            // Supplier Name validation: 4 to 30 characters, allow alphanumeric, spaces, and symbols
            const namePattern = /^[\w\s!@#$%^&*()\-_=+\[\]{};:'",.<>/?|`~]{4,30}$/;
            if (!namePattern.test(supplierName)) {
                supplierNameInput.setCustomValidity('Supplier Name must be between 4 and 30 characters and can contain letters, numbers, spaces, and symbols.');
                isValid = false;
            }
        }

        // Frontend validation for Supplier Contact Number
        if (!supplierContactNo) {
            supplierContactNoInput.setCustomValidity('Supplier Contact Number is required.');
            isValid = false;
        } else {
            const phonePattern = /^[0-9+]+$/;
            if (!phonePattern.test(supplierContactNo)) {
                supplierContactNoInput.setCustomValidity('Supplier Contact Number must contain only numeric characters or plus (+) sign.');
                isValid = false;
            }
        }

        // Frontend validation for Email (required and must be valid format)
        if (!supplierEmail) {
            $('#supplierEmailError').text('Email is required.');
            isValid = false;
        } else if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(supplierEmail)) {
            $('#supplierEmailError').text('Please enter a valid email address.');
            isValid = false;
        }

        if (!isValid) {
            // If frontend validation fails, the browser will show tooltips.
            // Prevent AJAX submission.
            event.preventDefault();
            return;
        }

        // If frontend validation passes, proceed with AJAX submission
        event.preventDefault(); // Prevent default submission again for AJAX

        const supplierData = {
            suppliername: supplierName,
            suppliercontactno: supplierContactNo,
            email: supplierEmail,
            supplierstatus: { id: parseInt(supplierStatus) }
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
            error: function(xhr, status, error) {
                console.error('Error saving supplier:', error);
                if (xhr.status === 409) {
                    $('#supplierEmailError').text('Email already exists. Please use a different email.'); // Display error below email field
                } else {
                    alert('Error saving supplier.'); // Keep alert for other errors
                }
            }
        });
    });

    // Handle Edit button click (using event delegation)
    $('#supplierTableBody').on('click', '.edit-btn', function() {
        const supplierId = $(this).data('id');
        $('#supplierModalLabel').text('Edit Supplier');

        // Clear previous errors when opening edit modal
        clearErrors();
        // Clear custom validity for name and contact number inputs
        $('#supplierName')[0].setCustomValidity('');
        $('#supplierContactNo')[0].setCustomValidity('');

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