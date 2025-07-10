// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const inventoryForm = document.getElementById('inventoryForm');
    const inventoryModal = document.getElementById('inventoryModal');
    const addInventoryBtn = document.getElementById('addInventoryBtn');

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
        const name = document.getElementById('inventoryName').value.trim();
        const quantity = document.getElementById('inventoryQuantity').value;
        const price = document.getElementById('inventoryPrice').value;
        const status = document.getElementById('inventoryStatus').value;

        // Basic Validation
        if (name === '') {
            alert('Item Name is required.');
            return;
        }

        if (quantity === '' || isNaN(quantity) || parseInt(quantity) < 0) {
            alert('Valid Quantity is required and must be a non-negative number.');
            return;
        }

        if (price === '' || isNaN(price) || parseFloat(price) < 0) {
            alert('Valid Price is required and must be a non-negative number.');
            return;
        }

        if (status === '') {
             alert('Status is required.');
             return;
        }

        // If validation passes, you would typically send the data to the server
        // For now, let's just log the data and close the modal
        const inventoryItem = {
            id: id,
            name: name,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            status: status
        };

        console.log('Submitting:', inventoryItem);

        // Here you would add code to send the data to your backend API
        // For example, using fetch or XMLHttpRequest

        $(inventoryModal).modal('hide'); // Use jQuery to hide the modal

        // After successful submission (and backend processing), you would typically refresh the inventory table
        // fetchInventoryItems(); // Call a function to refresh the table
    });

    // TODO: Add function to fetch and display inventory items
    // TODO: Add function to populate status dropdown
    // TODO: Add function to handle edit button clicks (populate modal with item data)
    // TODO: Add function to handle delete button clicks

    // Initial load of inventory items (when the page loads)
    // fetchInventoryItems(); // Call this function on page load
});
