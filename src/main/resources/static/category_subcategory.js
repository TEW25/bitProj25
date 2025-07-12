$(document).ready(function() {
    // Function to load categories into the table
    function loadCategories() {
        $.ajax({
            url: '/api/categories',
            method: 'GET',
            success: function(data) {
                $('#categoryTableBody').empty(); // Clear existing rows
                $('#filterCategory').empty(); // Clear filter dropdown
                $('#subcategoryCategorySelect').empty(); // Clear subcategory modal dropdown

                $('#filterCategory').append($('<option>', { value: '', text: 'All Categories' })); // Add default filter option

                data.forEach(function(category) {
                    $('#categoryTableBody').append(
                        '<tr>' +
                        '<td>' + category.id + '</td>' +
                        '<td>' + category.name + '</td>' +
                        '<td>' +
                        '<button class="btn btn-sm btn-warning edit-category-btn" data-id="' + category.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-category-btn" data-id="' + category.id + '">Delete</button>' +
                        '</td>' +
                        '</tr>'
                    );
                    $('#filterCategory').append($('<option>', { value: category.id, text: category.name })); // Populate filter dropdown
                    $('#subcategoryCategorySelect').append($('<option>', { value: category.id, text: category.name })); // Populate subcategory modal dropdown
                });
            },
            error: function(error) {
                console.error('Error loading categories:', error);
                $('#categoryTableBody').html('<tr><td colspan="3">Error loading categories.</td></tr>');
            }
        });
    }

    // Function to load subcategories into the table
    function loadSubcategories(categoryId) {
        let url = '/api/subcategories';
        if (categoryId) {
            url = '/api/subcategories/byCategory/' + categoryId;
        }

        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                $('#subcategoryTableBody').empty(); // Clear existing rows
                data.forEach(function(subcategory) {
                    $('#subcategoryTableBody').append(
                        '<tr>' +
                        '<td>' + subcategory.id + '</td>' +
                        '<td>' + subcategory.name + '</td>' +
                        '<td>' + (subcategory.category ? subcategory.category.name : '') + '</td>' +
                        '<td>' +
                        '<button class="btn btn-sm btn-warning edit-subcategory-btn" data-id="' + subcategory.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-subcategory-btn" data-id="' + subcategory.id + '">Delete</button>' +
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
                        '<button class="btn btn-sm btn-warning edit-brand-btn" data-id="' + brand.id + '">Edit</button> ' +
                        '<button class="btn btn-sm btn-danger delete-brand-btn" data-id="' + brand.id + '">Delete</button>' +
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

    // Load categories and subcategories when the page is ready
    loadCategories();
    loadSubcategories(); // Load all subcategories initially
    loadBrands(); // Load brands when the page is ready

    // Handle Category filter change
    $('#filterCategory').change(function() {
        const categoryId = $(this).val();
        loadSubcategories(categoryId);
    });

    // Handle Add Category button click
    $('#addCategoryBtn').click(function() {
        $('#categoryModalLabel').text('Add Category');
        $('#categoryForm')[0].reset(); // Clear the form
        $('#categoryId').val(''); // Clear the hidden ID field
        // Clear custom validity for category name input
        $('#categoryName')[0].setCustomValidity('');
        $('#categoryModal').modal('show');
    });

    // Add input event listener to clear custom validity on typing for category name
    $('#categoryName').on('input', function() {
        this.setCustomValidity('');
    });

    // Handle Add Subcategory button click
    $('#addSubcategoryBtn').click(function() {
        $('#subcategoryModalLabel').text('Add Subcategory');
        $('#subcategoryForm')[0].reset(); // Clear the form
        $('#subcategoryId').val(''); // Clear the hidden ID field
        // Clear custom validity for subcategory name input
        $('#subcategoryName')[0].setCustomValidity('');
        $('#subcategoryModal').modal('show');
    });

    // Add input event listener to clear custom validity on typing for subcategory name
    $('#subcategoryName').on('input', function() {
        this.setCustomValidity('');
    });

    // Handle Add Brand button click
    $('#addBrandBtn').click(function() {
        $('#brandModalLabel').text('Add Brand');
        $('#brandForm')[0].reset(); // Clear the form
        $('#brandId').val(''); // Clear the hidden ID field
        // Clear custom validity for brand name input
        $('#brandName')[0].setCustomValidity('');
        $('#brandModal').modal('show');
    });

    // Add input event listener to clear custom validity on typing for brand name
    $('#brandName').on('input', function() {
        this.setCustomValidity('');
    });

    // Handle Category form submission (Add/Edit Category)
    $('#categoryForm').submit(function(event) {
        // Do not prevent default here initially to allow browser's native validation tooltips

        const categoryId = $('#categoryId').val();
        const categoryNameInput = $('#categoryName')[0]; // Get the DOM element
        const categoryName = categoryNameInput.value.trim(); // Trim whitespace

        // Clear previous custom validity message
        categoryNameInput.setCustomValidity('');

        let isValid = true;

        // Frontend validation for Category Name
        if (!categoryName) {
            categoryNameInput.setCustomValidity('Category Name is required.');
            isValid = false;
        } else {
            // Category Name validation: 3 to 20 characters, alphanumeric and spaces
            const namePattern = /^[a-zA-Z0-9 ]{3,20}$/;
            if (!namePattern.test(categoryName)) {
                categoryNameInput.setCustomValidity('Category Name must be between 3 and 20 characters and contain only alphanumeric characters or spaces.');
                isValid = false;
            }
        }

        if (!isValid) {
            // If frontend validation fails, the browser will show tooltips.
            // Prevent AJAX submission.
            event.preventDefault(); // Prevent default submission if validation fails
            return;
        }

        // If frontend validation passes, proceed with AJAX submission
        event.preventDefault(); // Prevent default submission for AJAX

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
                loadCategories(); // Reload the category table and dropdowns
                loadSubcategories(); // Reload subcategory table (in case categories were deleted/added)
            },
            error: function(error) {
                console.error('Error saving category:', error);
                alert('Error saving category.'); // Basic error handling
            }
        });
    });

     // Handle Subcategory form submission (Add/Edit Subcategory)
    $('#subcategoryForm').submit(function(event) {
        // Do not prevent default here initially to allow browser's native validation tooltips

        const subcategoryId = $('#subcategoryId').val();
        const subcategoryNameInput = $('#subcategoryName')[0]; // Get the DOM element
        const categoryId = $('#subcategoryCategorySelect').val();

        // Clear previous custom validity message
        subcategoryNameInput.setCustomValidity('');

        let isValid = true;

        // Frontend validation for Subcategory Name
        if (!subcategoryNameInput.value.trim()) { // Use value from input element directly
            subcategoryNameInput.setCustomValidity('Subcategory Name is required.');
            isValid = false;
        } else {
             // Subcategory Name validation: 3 to 20 characters, alphanumeric and spaces
            const namePattern = /^[a-zA-Z0-9 ]{3,20}$/;
            if (!namePattern.test(subcategoryNameInput.value.trim())) { // Use value from input element directly
                subcategoryNameInput.setCustomValidity('Subcategory Name must be between 3 and 20 characters and contain only alphanumeric characters or spaces.');
                isValid = false;
            }
        }

        if (!categoryId) {
            // Note: setCustomValidity on select elements might not be universally supported or styled well.
            // A text error below the select might be a more reliable approach for the category dropdown.
            // For now, we'll keep the alert for the category selection.
            alert('Category is required.');
            isValid = false;
        }

        if (!isValid) {
            // If frontend validation fails, the browser will show tooltips.
            // Prevent AJAX submission.
            event.preventDefault(); // Prevent default submission if validation fails
            return;
        }

        // If frontend validation passes, proceed with AJAX submission
        event.preventDefault(); // Prevent default submission for AJAX

        const subcategoryData = {
            name: subcategoryNameInput.value.trim(), // Use value from input element directly
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
                loadSubcategories($('#filterCategory').val()); // Reload subcategories with current filter
            },
            error: function(error) {
                console.error('Error saving subcategory:', error);
                alert('Error saving subcategory.'); // Basic error handling
            }
        });
    });

    // Handle Brand form submission (Add/Edit Brand)
    $('#brandForm').submit(function(event) {
        // Remove the initial event.preventDefault() to allow native validation on first click
        // event.preventDefault();

        const brandId = $('#brandId').val();
        const brandNameInput = $('#brandName')[0]; // Get the DOM element
        const brandName = brandNameInput.value.trim(); // Trim whitespace

        // Clear previous custom validity message
        brandNameInput.setCustomValidity('');

        let isValid = true;

        // Frontend validation for Brand Name
        if (!brandName) {
            brandNameInput.setCustomValidity('Brand Name is required.');
            isValid = false;
        } else {
            // Brand Name validation: 3 to 20 characters, alphanumeric and spaces
            const namePattern = /^[a-zA-Z0-9 ]{3,20}$/;
            if (!namePattern.test(brandName)) {
                brandNameInput.setCustomValidity('Brand Name must be between 3 and 20 characters and contain only alphanumeric characters or spaces.');
                isValid = false;
            }
        }

        if (!isValid) {
            // If frontend validation fails, the browser will show tooltips.
            // Prevent AJAX submission.
            event.preventDefault(); // Prevent default submission if validation fails
            return;
        }

        // If frontend validation passes, proceed with AJAX submission
        event.preventDefault(); // Prevent default submission for AJAX

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

    // Handle Edit Category button click (using event delegation)
    $('#categoryTableBody').on('click', '.edit-category-btn', function() {
        const categoryId = $(this).data('id');
        $('#categoryModalLabel').text('Edit Category');

        // Clear custom validity for category name input
        $('#categoryName')[0].setCustomValidity('');

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

    // Handle Edit Subcategory button click (using event delegation)
    $('#subcategoryTableBody').on('click', '.edit-subcategory-btn', function() {
        const subcategoryId = $(this).data('id');
        $('#subcategoryModalLabel').text('Edit Subcategory');

        // Clear custom validity for subcategory name input
        $('#subcategoryName')[0].setCustomValidity('');

        $.ajax({
            url: '/api/subcategories/' + subcategoryId,
            method: 'GET',
            success: function(subcategory) {
                $('#subcategoryId').val(subcategory.id);
                $('#subcategoryName').val(subcategory.name);
                $('#subcategoryCategorySelect').val(subcategory.category ? subcategory.category.id : '');
                $('#subcategoryModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching subcategory details:', error);
                alert('Error fetching subcategory details.');
            }
        });
    });

    // Handle Edit Brand button click (using event delegation)
    $('#brandTableBody').on('click', '.edit-brand-btn', function() {
        const brandId = $(this).data('id');
        $('#brandModalLabel').text('Edit Brand');

        // Clear previous custom validity for brand name input
        $('#brandName')[0].setCustomValidity('');

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

    // Handle Delete Category button click (using event delegation)
    $('#categoryTableBody').on('click', '.delete-category-btn', function() {
        const categoryId = $(this).data('id');

        if (confirm('Are you sure you want to delete this category? This will also delete associated subcategories.')) {
            $.ajax({
                url: '/api/categories/' + categoryId,
                method: 'DELETE',
                success: function(response) {
                    loadCategories(); // Reload categories
                    loadSubcategories(); // Reload subcategories
                },
                error: function(error) {
                    console.error('Error deleting category:', error);
                    alert('Error deleting category.');
                }
            });
        }
    });

    // Handle Delete Subcategory button click (using event delegation)
    $('#subcategoryTableBody').on('click', '.delete-subcategory-btn', function() {
        const subcategoryId = $(this).data('id');

        if (confirm('Are you sure you want to delete this subcategory?')) {
            $.ajax({
                url: '/api/subcategories/' + subcategoryId,
                method: 'DELETE',
                success: function(response) {
                    loadSubcategories($('#filterCategory').val()); // Reload subcategories with current filter
                },
                error: function(error) {
                    console.error('Error deleting subcategory:', error);
                    alert('Error deleting subcategory.');
                }
            });
        }
    });

    // Handle Delete Brand button click (using event delegation)
    $('#brandTableBody').on('click', '.delete-brand-btn', function() {
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
