$(document).ready(function() {
    // Function to load categories into the table
    function loadCategories() {
        $.ajax({
            url: '/api/categories',
            method: 'GET',
            success: function(data) {
                $('#categoryTableBody').empty(); // Clear existing rows
                data.forEach(function(category) {
                    $('#categoryTableBody').append(
                        '<tr>' +
                        '<td>' + category.id + '</td>' +
                        '<td>' + category.name + '</td>' +
                        '<td>' +
                        '<button class="btn btn-sm btn-warning edit-btn" data-id="' + category.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-btn" data-id="' + category.id + '">Delete</button>' +
                        '</td>' +
                        '</tr>'
                    );
                });
            },
            error: function(error) {
                console.error('Error loading categories:', error);
                $('#categoryTableBody').html('<tr><td colspan="3">Error loading categories.</td></tr>');
            }
        });
    }

    // Load categories when the page is ready
    loadCategories();

    // Handle Add Category button click
    $('#addCategoryBtn').click(function() {
        $('#categoryModalLabel').text('Add Category');
        $('#categoryForm')[0].reset(); // Clear the form
        $('#categoryId').val(''); // Clear the hidden ID field
        $('#categoryModal').modal('show');
    });

    // Handle form submission (Add/Edit Category)
    $('#categoryForm').submit(function(event) {
        event.preventDefault();

        const categoryId = $('#categoryId').val();
        const categoryName = $('#categoryName').val();

        if (!categoryName) {
            alert('Category Name is required.');
            return;
        }

        const categoryData = {
            name: categoryName
        };

        let url = '/api/categories';
        let method = 'POST';

        if (categoryId) {
            // If categoryId exists, it's an edit operation
            url = '/api/categories/' + categoryId;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(categoryData),
            success: function(response) {
                $('#categoryModal').modal('hide');
                loadCategories(); // Reload the table
            },
            error: function(error) {
                console.error('Error saving category:', error);
                alert('Error saving category.'); // Basic error handling
            }
        });
    });

    // Handle Edit button click (using event delegation)
    $('#categoryTableBody').on('click', '.edit-btn', function() {
        const categoryId = $(this).data('id');
        $('#categoryModalLabel').text('Edit Category');

        $.ajax({
            url: '/api/categories/' + categoryId,
            method: 'GET',
            success: function(category) {
                $('#categoryId').val(category.id);
                $('#categoryName').val(category.name);
                $('#categoryModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching category details:', error);
                alert('Error fetching category details.');
            }
        });
    });

    // Handle Delete button click (using event delegation)
    $('#categoryTableBody').on('click', '.delete-btn', function() {
        const categoryId = $(this).data('id');

        if (confirm('Are you sure you want to delete this category?')) {
            $.ajax({
                url: '/api/categories/' + categoryId,
                method: 'DELETE',
                success: function(response) {
                    loadCategories(); // Reload the table
                },
                error: function(error) {
                    console.error('Error deleting category:', error);
                    alert('Error deleting category.');
                }
            });
        }
    });
});
