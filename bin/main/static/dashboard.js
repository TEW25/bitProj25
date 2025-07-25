document.addEventListener('DOMContentLoaded', function() {
    // Sidebar collapse/expand for mobile
    const sidebar = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    function openSidebar() {
        sidebar.classList.add('ds-sidebar-open');
        sidebarOverlay.classList.add('ds-sidebar-overlay-active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebar.classList.remove('ds-sidebar-open');
        sidebarOverlay.classList.remove('ds-sidebar-overlay-active');
        document.body.style.overflow = '';
    }
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            openSidebar();
        });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            closeSidebar();
        });
    }
    // Close sidebar on resize to large screens
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            closeSidebar();
        }
    });
    // Fetch KPIs
    fetch('/api/dashboard/kpis')
        .then(response => response.json())
        .then(data => {
            document.getElementById('kpi-total-revenue').textContent = (data.totalRevenue ? data.totalRevenue + ' LKR' : '-');
            document.getElementById('kpi-number-orders').textContent = data.numberOfOrders ?? '-';
            document.getElementById('kpi-aov').textContent = (data.averageOrderValue ? Math.floor(data.averageOrderValue) + ' LKR' : '-');
            document.getElementById('kpi-low-stock').textContent = data.lowStockItems ?? '-';
        })
        .catch(() => {
            document.getElementById('kpi-total-revenue').textContent = 'Error';
            document.getElementById('kpi-number-orders').textContent = 'Error';
            document.getElementById('kpi-aov').textContent = 'Error';
            document.getElementById('kpi-low-stock').textContent = 'Error';
        });

    // Low Stock Table
    fetch('/api/dashboard/low-stock-table')
        .then(response => response.json())
        .then(data => {
            let wrapper = document.getElementById('low-stock-table-wrapper');
            wrapper.innerHTML = '';
            // Add heading above the table
            let heading = document.createElement('h2');
            heading.className = 'ds-chart-title';
            heading.style.textAlign = 'center';
            heading.style.color = '#4a4a4a';
            heading.style.fontSize = '20px';
            heading.style.fontWeight = 'bold';
            heading.style.paddingTop = '10px';
            heading.style.paddingBottom = '10px';
            heading.textContent = 'Items Below Reorder Point';
            wrapper.appendChild(heading);
            // Wrap table in a styled container for consistency
            let container = document.createElement('div');
            container.className = 'ds-chart-container';
            let table = document.createElement('table');
            table.className = 'table table-striped table-bordered table-low-stock';
            let thead = document.createElement('thead');
            thead.innerHTML = '<tr><th>Inventory Code</th><th>Item Code</th><th>Item Name</th><th>Available Qty</th><th>ROP</th></tr>';
            table.appendChild(thead);
            let tbody = document.createElement('tbody');
            data.slice(0, 4).forEach(row => {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td>${row.inventorycode}</td><td>${row.itemcode}</td><td>${row.itemname}</td><td>${row.availableqty}</td><td>${row.rop}</td>`;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            container.appendChild(table);
            wrapper.appendChild(container);
        });

    // Sales Over Time Chart
    fetch('/api/dashboard/sales-over-time')
        .then(response => response.json())
        .then(data => {
            const chartElem = document.getElementById('sales-over-time-chart');
            // Wrap canvas in a container for border/shadow
            if (!chartElem.parentElement.classList.contains('ds-chart-container')) {
                const container = document.createElement('div');
                container.className = 'ds-chart-container ds-chart-fixed-height';
                chartElem.parentNode.insertBefore(container, chartElem);
                container.appendChild(chartElem);
            } else {
                chartElem.parentElement.classList.add('ds-chart-fixed-height');
            }
            const ctx2 = chartElem.getContext('2d');
            const labels2 = data.map(row => row.date);
            const totals2 = data.map(row => row.total);
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: labels2,
                    datasets: [{
                        label: 'Sales',
                        data: totals2,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Sales Over Time',
                            align: 'center',
                            color: '#4a4a4a',
                            font: { size: 20, weight: 'bold' },
                            padding: { top: 10, bottom: 10 }
                        }
                    },
                    layout: {
                        padding: { top: 10 }
                    }
                }
            });
        });

    // Top Ordered Items Bar Chart
    fetch('/api/dashboard/top-ordered-items?limit=10')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(row => row.itemname);
            const quantities = data.map(row => row.quantity);
            const ctx = document.getElementById('top-ordered-items');
            // Multi-color palette
            const colors = [
                'rgba(255, 99, 132,0.9)',
                'rgba(54, 162, 235,0.9)',
                'rgba(255, 206, 86,0.9)',
                'rgba(75, 192, 192,0.9)',
                'rgba(153, 102, 255,0.9)',
                'rgba(255, 159, 64,0.9)',
                'rgba(255, 99, 71,0.9)',
                'rgba(0, 200, 83,0.9)',
                'rgba(255, 87, 34,0.9)',
                'rgba(63, 81, 181,0.9)'
            ];
            // If <ul>, replace with <div class="ds-chart-container"><canvas></canvas></div>
            if (ctx.tagName === 'UL') {
                const container = document.createElement('div');
                container.className = 'ds-chart-container ds-chart-fixed-height';
                const canvas = document.createElement('canvas');
                canvas.id = 'top-ordered-items-chart';
                container.appendChild(canvas);
                ctx.parentNode.replaceChild(container, ctx);
                const chartCtx = canvas.getContext('2d');
                new Chart(chartCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Quantity',
                            data: quantities,
                            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                            borderColor: labels.map((_, i) => colors[i % colors.length].replace('0.7', '1')),
                            borderWidth: 1,
                            barPercentage: 0.8,
                            categoryPercentage: 0.8
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: 'Top Ordered Items',
                                align: 'center',
                                color: '#4a4a4a',
                                font: { size: 20, weight: 'bold' },
                                padding: { top: 10, bottom: 10 }
                            }
                        },
                        layout: {
                            padding: { top: 10 }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: {
                                    autoSkip: false,
                                    color: '#222'
                                },
                                maxBarThickness: 28,
                                title: {
                                    display: false
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Quantity',
                                    color: '#222',
                                    font: { weight: 'bold', size: 14 }
                                },
                                ticks: {
                                    color: '#222'
                                }
                            }
                        }
                    }
                });
            }
        });

    // Revenue Breakdown Pie Chart (by category)
    fetch('/api/dashboard/revenue-breakdown?type=category')
        .then(response => response.json())
        .then(data => {
            const chartElem2 = document.getElementById('revenue-breakdown-chart');
            // Wrap canvas in a container for border/shadow
            if (!chartElem2.parentElement.classList.contains('ds-chart-container')) {
                const container = document.createElement('div');
                container.className = 'ds-chart-container ds-chart-fixed-height';
                chartElem2.parentNode.insertBefore(container, chartElem2);
                container.appendChild(chartElem2);
            } else {
                chartElem2.parentElement.classList.add('ds-chart-fixed-height');
            }
            const ctx3 = chartElem2.getContext('2d');
            const labels3 = data.map(row => row.label);
            const values3 = data.map(row => row.value);
            new Chart(ctx3, {
                type: 'pie',
                data: {
                    labels: labels3,
                    datasets: [{
                        data: values3,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: {
                            display: true,
                            text: 'Revenue Breakdown',
                            align: 'center',
                            color: '#4a4a4a',
                            font: { size: 20, weight: 'bold' },
                            padding: { top: 10, bottom: 10 }
                        }
                    },
                    layout: {
                        padding: { top: 10 }
                    }
                }
            });
        });
});
