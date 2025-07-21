// sales.js - Handles cart management and item search for the New Sale page


// Add event listener to close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.position-relative')) {
        document.querySelectorAll('.item-search-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

// --- Sales Records History Logic ---

let loggedInUserId = null;
let loggedInUserDesignationId = null;
document.addEventListener('DOMContentLoaded', function () {
    // Fetch logged-in user id first
    fetch('/api/auth/status')
        .then(res => {
            if (!res.ok) throw new Error('Not logged in');
            return res.json();
        })
        .then(data => {
            loggedInUserId = data.user_id;
            loggedInUserDesignationId = data.designation_id;
            console.log('[Sales] Logged-in user ID:', loggedInUserId, 'Designation ID:', loggedInUserDesignationId);
            // Set salesHistoryDate to today
            const salesHistoryDateInput = document.getElementById('salesHistoryDate');
            if (salesHistoryDateInput) {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const todayStr = `${yyyy}-${mm}-${dd}`;
                salesHistoryDateInput.value = todayStr;
                loadSalesRecords(todayStr);
                document.getElementById('filterSalesHistoryBtn').addEventListener('click', function () {
                    loadSalesRecords(salesHistoryDateInput.value);
                });
            }
        })
        .catch(() => {
            // fallback: redirect to login or show error
            window.location.href = '/login';
        });
});

function loadSalesRecords(dateStr) {
    const container = document.getElementById('salesRecordsContainer');
    container.innerHTML = '<div>Loading sales records...</div>';
    // Safeguard: ensure loggedInUserId is a valid number
    if (!loggedInUserId || isNaN(Number(loggedInUserId))) {
        container.innerHTML = '<div class="text-danger">User not found or invalid user ID.</div>';
        console.error('[Sales] Invalid or missing loggedInUserId:', loggedInUserId);
        return;
    }
    console.log(`[Sales] Fetching sales records for employeeId=${loggedInUserId} and date=${dateStr}`);
    fetch(`/api/sales?date=${dateStr}&employeeId=${loggedInUserId}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch sales records');
            return response.json();
        })
        .then(sales => {
            if (!sales || sales.length === 0) {
                container.innerHTML = '<div class="text-muted">No sales records found for this date.</div>';
                return;
            }
            // Sort sales by added_datetime descending (newest first)
            sales.sort((a, b) => {
                const dateA = new Date(a.added_datetime);
                const dateB = new Date(b.added_datetime);
                return dateB - dateA;
            });
            let html = `<div class="card shadow-sm mb-0"><div class="card-body p-0">
                <div class="table-responsive">
                <table class="table table-bordered table-hover table-striped align-middle mb-0" style="table-layout:fixed;width:100%"><thead class="table-light sticky-top"><tr>
                <th style="width:10%">Sales #</th>
                <th style="width:22%">Date</th>
                <th style="width:16%">Total</th>
                <th style="width:16%">Paid</th>
                <th style="width:16%">Balance</th>
                <th style="width:16%">Discount</th>
                <th style="width:8%">Payment</th>
            </tr></thead><tbody>`;
            sales.forEach((sale, idx) => {
                function showZero(val) {
                    if (val === 0 || val === "0" || val === 0.00 || val === "0.00") return "0.00";
                    if (val === null || val === undefined || val === "") return "";
                    return val;
                }
                html += `<tr class="sales-record-row" data-sale-idx="${idx}" style="cursor:pointer;">
                    <td>${sale.salesnumber || ''}</td>
                    <td>${sale.added_datetime ? formatDateTime(sale.added_datetime) : ''}</td>
                    <td>${showZero(sale.total_amount)}</td>
                    <td>${showZero(sale.paid_amount)}</td>
                    <td>${showZero(sale.balanceAmount !== undefined ? sale.balanceAmount : sale.balance_amount)}</td>
                    <td>${showZero(sale.discount)}</td>
                    <td>${sale.paymentType || ''}</td>
                </tr>`;
            });
            html += '</tbody></table></div></div></div>';
            container.innerHTML = html;

            // Add click event for refund popup
            container.querySelectorAll('.sales-record-row').forEach(row => {
                row.addEventListener('click', function() {
                    const idx = this.dataset.saleIdx;
                    const sale = sales[idx];
                    // Fetch sale details from backend for accuracy
                    fetch(`/api/sales/${sale.id}`)
                        .then(res => res.json())
                        .then(saleDetails => {
                            openRefundModal(saleDetails);
                        })
                        .catch(() => {
                            // fallback to local sale if fetch fails
                            openRefundModal(sale);
                        });
                });
            });
        })
        .catch(err => {
            container.innerHTML = `<div class="text-danger">Error loading sales records.</div>`;
        });
}

function openRefundModal(sale) {
    let empNum = sale.employee && sale.employee.employee_number ? sale.employee.employee_number : '';
    let dateStr = sale.added_datetime ? new Date(sale.added_datetime).toLocaleString() : '';
    let itemsHtml = '';
    if (sale.items && sale.items.length > 0) {
        itemsHtml = `<table class="table table-bordered" style="table-layout:fixed;width:100%"><thead><tr>
            <th style="width:40%">Item Name</th>
            <th style="width:20%">Sales Price</th>
            <th style="width:20%">Qty Sold</th>
            <th style="width:20%">Refund Qty</th>
        </tr></thead><tbody>`;
        sale.items.forEach((item, idx) => {
            itemsHtml += `<tr>
                <td style="word-break:break-word;">${item.item ? (item.item.itemname || item.item.name || '') : ''}</td>
                <td>${item.sales_price}</td>
                <td>${item.quantity}</td>
                <td><input type="number" class="form-control refund-qty" min="0" max="${item.quantity}" data-item-idx="${idx}" value=""></td>
            </tr>`;
        });
        itemsHtml += '</tbody></table>';
    } else {
        itemsHtml = '<div>No items found for this sale.</div>';
    }
    let html = `
        <div class="mb-2"><strong>Sales Number:</strong> ${sale.salesnumber || ''}</div>
        <div class="mb-2"><strong>Date:</strong> ${dateStr}</div>
        <div class="mb-2"><strong>Added By:</strong> ${empNum}</div>
        <hr>
        <h5>Refund Items</h5>
        ${itemsHtml}
        <div class="form-group mt-3">
            <label for="refundPaidBack">Paid Back Amount</label>
            <input type="number" class="form-control" id="refundPaidBack" min="0" value="">
        </div>
    `;
    document.getElementById('refundModalBody').innerHTML = html;
    // Show modal (Bootstrap 4)
    $('#refundModal').modal('show');
    // Disable refund button if designation_id is not 1 or 2
    const refundBtn = document.getElementById('saveRefundBtn');
    if (loggedInUserDesignationId !== 1 && loggedInUserDesignationId !== 2) {
        refundBtn.disabled = true;
        refundBtn.title = 'You do not have permission to perform refunds.';
    } else {
        refundBtn.disabled = false;
        refundBtn.title = '';
    }
    // Save button handler (no backend, just close)
    refundBtn.onclick = function() {
        // Collect refund data
        const refundData = {
            saleId: sale.id,
            items: [],
            paidBack: 0
        };
        // Collect refund quantities for each item
        const refundInputs = document.querySelectorAll('.refund-qty');
        refundInputs.forEach((input, idx) => {
            const qty = parseFloat(input.value) || 0;
            if (qty > 0) {
                refundData.items.push({
                    itemId: sale.items[idx].item ? sale.items[idx].item.id : null,
                    refundQty: qty,
                    salesPrice: sale.items[idx].sales_price
                });
            }
        });
        // Collect paid back amount
        const paidBackInput = document.getElementById('refundPaidBack');
        refundData.paidBack = parseFloat(paidBackInput.value) || 0;

        // Validation: at least one item and paidBack > 0
        if (refundData.items.length === 0) {
            alert('Please enter a refund quantity for at least one item.');
            return;
        }
        if (refundData.paidBack <= 0) {
            alert('Paid Back Amount must be greater than 0.');
            return;
        }

        // Send refund data to backend
        fetch('/api/sales/refunds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refundData)
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to save refund');
            return res.json();
        })
        .then(data => {
            alert('Refund saved successfully!');
            $('#refundModal').modal('hide');
        })
        .catch(err => {
            alert('Error saving refund: ' + err.message);
        });
    };
}

function formatDateTime(dtStr) {
    if (!dtStr) return '';
    const d = new Date(dtStr);
    if (isNaN(d)) return dtStr;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}