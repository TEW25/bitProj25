$(document).ready(function() {
    // Function to load subcategories into the table
    function loadSubcategories() {
        $.ajax({
            url: '/api/subcategories',
            method: 'GET',
            success: function(data) {
                $('#subcategoryTableBody').empty(); // Clear existing rows
                data.forEach(function(subcategory) {
                    $('#subcategoryTableBody').append(
                        '<tr>' +
                        '<td>' + subcategory.id + '</td>' +
                        '<td>' + subcategory.name + '</td>' +
                        '<td>' + (subcategory.category ? subcategory.category.name : '') + '</td>' + // Display Category name
                        '<td>' +
                        '<button class="btn btn-sm btn-warning edit-btn" data-id="' + subcategory.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-btn" data-id="' + subcategory.id + '">Delete</button>' +
                        '</td>' +
                        '</tr>'
                    );
                });
            },
            error: function(error) {
                console.error('Error loading subcategories:', error);
                $('#subcategoryTableBody').html('<tr><td colspan="4">Error loading subcategories.</td></tr>');
            }
        });
    }

    // Function to load categories into the dropdown for subcategory form
    function loadCategoriesForDropdown() {
        $.ajax({
            url: '/api/categories',
            method: 'GET',
            success: function(data) {
                const categorySelect = $('#categorySelect');
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
                console.error('Error loading categories for dropdown:', error);
            }
        });
    }

    // Load subcategories and categories for dropdown when the page is ready
    loadSubcategories();
    loadCategoriesForDropdown();

    // Handle Add Subcategory button click
    $('#addSubcategoryBtn').click(function() {
        $('#subcategoryModalLabel').text('Add Subcategory');
        $('#subcategoryForm')[0].reset(); // Clear the form
        $('#subcategoryId').val(''); // Clear the hidden ID field
        loadCategoriesForDropdown(); // Reload categories for dropdown
        $('#subcategoryModal').modal('show');
    });

    // Handle form submission (Add/Edit Subcategory)
    $('#subcategoryForm').submit(function(event) {
        event.preventDefault();

        const subcategoryId = $('#subcategoryId').val();
        const subcategoryName = $('#subcategoryName').val();
        const categoryId = $('#categorySelect').val();

        if (!subcategoryName || !categoryId) {
            alert('Subcategory Name and Category are required.');
            return;
        }

        const subcategoryData = {
            name: subcategoryName,
            category: { id: parseInt(categoryId) }
        };

        let url = '/api/subcategories';
        let method = 'POST';

        if (subcategoryId) {
            // If subcategoryId exists, it's an edit operation
            url = '/api/subcategories/' + subcategoryId;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(subcategoryData),
            success: function(response) {
                $('#subcategoryModal').modal('hide');
                loadSubcategories(); // Reload the table
            },
            error: function(error) {
                console.error('Error saving subcategory:', error);
                alert('Error saving subcategory.'); // Basic error handling
            }
        });
    });

    // Handle Edit button click (using event delegation)
    $('#subcategoryTableBody').on('click', '.edit-btn', function() {
        const subcategoryId = $(this).data('id');
        $('#subcategoryModalLabel').text('Edit Subcategory');

        $.ajax({
            url: '/api/subcategories/' + subcategoryId,
            method: 'GET',
            success: function(subcategory) {
                $('#subcategoryId').val(subcategory.id);
                $('#subcategoryName').val(subcategory.name);
                // Load categories for dropdown and then set the selected category
                loadCategoriesForDropdown();
                // Set a timeout to allow categories to load before setting the value
                setTimeout(function() {
                    $('#categorySelect').val(subcategory.category ? subcategory.category.id : '');
                }, 200); // Adjust timeout if necessary
                $('#subcategoryModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching subcategory details:', error);
                alert('Error fetching subcategory details.');
            }
        });
    });

    // Handle Delete button click (using event delegation)
    $('#subcategoryTableBody').on('click', '.delete-btn', function() {
        const subcategoryId = $(this).data('id');

        if (confirm('Are you sure you want to delete this subcategory?')) {
            $.ajax({
                url: '/api/subcategories/' + subcategoryId,
                method: 'DELETE',
                success: function(response) {
                    loadSubcategories(); // Reload the table
                },
                error: function(error) {
                    console.error('Error deleting subcategory:', error);
                    alert('Error deleting subcategory.');
                }
            });
        }
    });
});
