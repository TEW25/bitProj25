document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/dashboard/kpis')
        .then(response => response.json())
        .then(data => {
            document.getElementById('kpi-total-revenue').textContent = data.totalRevenue ?? '-';
            document.getElementById('kpi-number-orders').textContent = data.numberOfOrders ?? '-';
            document.getElementById('kpi-aov').textContent = data.averageOrderValue ?? '-';
            document.getElementById('kpi-low-stock').textContent = data.lowStockItems ?? '-';
        })
        .catch(() => {
            document.getElementById('kpi-total-revenue').textContent = 'Error';
            document.getElementById('kpi-number-orders').textContent = 'Error';
            document.getElementById('kpi-aov').textContent = 'Error';
            document.getElementById('kpi-low-stock').textContent = 'Error';
        });

    // Placeholder for future: fetch and render charts/lists for other dashboard sections
});
