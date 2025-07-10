$(document).ready(function() {
    // Function to load brands into the table
    function loadBrands() {
        $.ajax({
            url: '/api/brands',
            method: 'GET',
            success: function(data) {
                $('#brandTableBody').empty(); // Clear existing rows
                data.forEach(function(brand) {
                    $('#brandTableBody').append(
                        '<tr>' +
                        '<td>' + brand.id + '</td>' +
                        '<td>' + brand.name + '</td>' +
                        '<td>' +
                        '<button class="btn btn-sm btn-warning edit-btn" data-id="' + brand.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-btn" data-id="' + brand.id + '">Delete</button>' +
                        '</td>' +
                        '</tr>'
                    );
                });
            },
            error: function(error) {
                console.error('Error loading brands:', error);
                $('#brandTableBody').html('<tr><td colspan="3">Error loading brands.</td></tr>');
            }
        });
    }

    // Load brands when the page is ready
    loadBrands();

    // Handle Add Brand button click
    $('#addBrandBtn').click(function() {
        $('#brandModalLabel').text('Add Brand');
        $('#brandForm')[0].reset(); // Clear the form
        $('#brandId').val(''); // Clear the hidden ID field
        $('#brandModal').modal('show');
    });

    // Handle form submission (Add/Edit Brand)
    $('#brandForm').submit(function(event) {
        event.preventDefault();

        const brandId = $('#brandId').val();
        const brandName = $('#brandName').val();

        if (!brandName) {
            alert('Brand Name is required.');
            return;
        }

        const brandData = {
            name: brandName
        };

        let url = '/api/brands';
        let method = 'POST';

        if (brandId) {
            // If brandId exists, it's an edit operation
            url = '/api/brands/' + brandId;
            method = 'PUT';
        }

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(brandData),
            success: function(response) {
                $('#brandModal').modal('hide');
                loadBrands(); // Reload the table
            },
            error: function(error) {
                console.error('Error saving brand:', error);
                alert('Error saving brand.'); // Basic error handling
            }
        });
    });

    // Handle Edit button click (using event delegation)
    $('#brandTableBody').on('click', '.edit-btn', function() {
        const brandId = $(this).data('id');
        $('#brandModalLabel').text('Edit Brand');

        $.ajax({
            url: '/api/brands/' + brandId,
            method: 'GET',
            success: function(brand) {
                $('#brandId').val(brand.id);
                $('#brandName').val(brand.name);
                $('#brandModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching brand details:', error);
                alert('Error fetching brand details.');
            }
        });
    });

    // Handle Delete button click (using event delegation)
    $('#brandTableBody').on('click', '.delete-btn', function() {
        const brandId = $(this).data('id');

        if (confirm('Are you sure you want to delete this brand?')) {
            $.ajax({
                url: '/api/brands/' + brandId,
                method: 'DELETE',
                success: function(response) {
                    loadBrands(); // Reload the table
                },
                error: function(error) {
                    console.error('Error deleting brand:', error);
                    alert('Error deleting brand.');
                }
            });
        }
    });
});
