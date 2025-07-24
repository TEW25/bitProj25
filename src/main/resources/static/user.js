// user.js
// Handles user management tab actions: load, add, edit, delete users

$(document).on('click', '#addUserBtn', function() {
    showUserForm();
});

function showUserForm(user) {
    // Fetch user statuses and then render form
    $.ajax({
        url: '/api/userstatus',
        method: 'GET',
        success: function(statuses) {
            var statusOptions = statuses.map(function(s) {
                return `<option value="${s.id}" ${user && user.status == s.id ? 'selected' : ''}>${s.name}</option>`;
            }).join('');
            var formHtml = `
                <form id="userForm">
                    <input type="hidden" name="id" value="${user ? user.id : ''}">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label>Username <span style='color:red'>*</span></label>
                            <input type="text" class="form-control" name="username" value="${user ? user.username : ''}" required>
                        </div>
                        <!-- Email field removed -->
                        <div class="col-md-6 mb-2">
                            <label>Status <span style='color:red'>*</span></label>
                            <select class="form-control" name="status">${statusOptions}</select>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Employee <span style='color:red'>*</span></label>
                            <select class="form-control" name="employee_id" id="userEmployeeSelect"></select>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Password <span style='color:red'>*</span></label>
                            <input type="password" class="form-control" name="password" id="passwordField" ${user ? '' : 'required'}>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Confirm Password <span style='color:red'>*</span></label>
                            <input type="password" class="form-control" name="confirm_password" id="confirmPasswordField" ${user ? '' : 'required'}>
                        </div>
                    </div>
                    <div id="passwordMismatchMsg" class="text-danger mb-2" style="display:none;">Passwords do not match.</div>
                    <button type="submit" class="btn btn-success">${user ? 'Update' : 'Add'} User</button>
                </form>
            `;
            $('#userFormContainer').html(formHtml);
            // Determine selected employee id for edit
            var selectedEmployeeId = null;
            if (user) {
                if (user.employee_id) {
                    selectedEmployeeId = user.employee_id;
                } else if (user.employee && user.employee.id) {
                    selectedEmployeeId = user.employee.id;
                }
            }
            loadEmployeeOptions(selectedEmployeeId);
            var modal = new bootstrap.Modal(document.getElementById('userFormModal'));
            modal.show();
        },
        error: function() {
            $('#userFormContainer').html('<div class="alert alert-danger">Failed to load user statuses.</div>');
        }
    });
}


// No cancel button needed, modal close button is used

$(document).on('submit', '#userForm', function(e) {
    e.preventDefault();
    var formData = {};
    $('#userForm').serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
    });
    // Password confirmation check (only if password is being set)
    var password = $('#passwordField').val();
    var confirmPassword = $('#confirmPasswordField').val();
    var isEdit = formData.id && formData.id !== '';
    if ((password || confirmPassword) && password !== confirmPassword) {
        $('#passwordMismatchMsg').show();
        return;
    } else {
        $('#passwordMismatchMsg').hide();
    }
    var method = isEdit ? 'PUT' : 'POST';
    var url = '/api/users' + (isEdit ? '/' + formData.id : '');
    // Remove empty id for POST
    if (!isEdit) delete formData.id;
    // Convert status to number if needed
    if (formData.status) formData.status = parseInt(formData.status);
    // Attach employee as object for backend compatibility
    if (formData.employee_id) {
        formData.employee = { id: parseInt(formData.employee_id) };
        delete formData.employee_id;
    }
    // Don't send empty password on update
    if (isEdit && !formData.password) delete formData.password;
    // Remove confirm_password before sending
    delete formData.confirm_password;
    $.ajax({
        url: url,
        method: method,
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function() {
            var modalEl = document.getElementById('userFormModal');
            var modal = bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();
            loadUsers();
        },
        error: function(xhr) {
            alert('Failed to save user. ' + (xhr.responseText || ''));
        }
    });
});

function loadUsers() {
    // Pagination state
    if (typeof window.userCurrentPage === 'undefined') window.userCurrentPage = 0;
    if (typeof window.userPageSize === 'undefined') window.userPageSize = 10;
    var page = window.userCurrentPage;
    var size = window.userPageSize;
    $.ajax({
        url: `/api/users?page=${page}&size=${size}`,
        method: 'GET',
        success: function(data) {
            // Fetch user statuses for mapping
            $.ajax({
                url: '/api/userstatus',
                method: 'GET',
                success: function(statuses) {
                    var statusMap = {};
                    statuses.forEach(function(s) { statusMap[s.id] = s.name; });
                    var rows = data.content.map(function(u, i) {
                        var statusName = statusMap[u.status] || u.status || '';
                        return `<tr>
                            <td>${(page * size) + i + 1}</td>
                            <td>${u.username || ''}</td>
                            <td>${statusName}</td>
                            <td>${u.employee && u.employee.fullname ? u.employee.fullname : ''}</td>
                            <td>
                                <button class='btn btn-sm btn-info' onclick='editUser(${u.id})'>Edit</button>
                                <button class='btn btn-sm btn-danger' onclick='deleteUser(${u.id})'>Delete</button>
                            </td>
                        </tr>`;
                    }).join('');
                    $('#userTableBody').html(rows);
                    renderUserPaginationBar(data);
                },
                error: function() {
                    $('#userTableBody').html('<tr><td colspan="5">Failed to load user statuses.</td></tr>');
                }
            });
        },
        error: function() {
            $('#userTableBody').html('<tr><td colspan="5">Failed to load users.</td></tr>');
            $('#userPaginationBar').empty();
        }
    });
}

// Render Bootstrap pagination bar for users
function renderUserPaginationBar(pageData) {
    const paginationBar = $('#userPaginationBar');
    paginationBar.empty();
    if (!pageData || pageData.totalPages <= 1) return;
    var currentPage = pageData.number;
    var totalPages = pageData.totalPages;
    // Previous button
    paginationBar.append('<li class="page-item' + (pageData.first ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage - 1) + '">Previous</a></li>');
    // Page numbers (show up to 5 pages around current)
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, currentPage + 2);
    if (currentPage < 2) end = Math.min(4, totalPages - 1);
    if (currentPage > totalPages - 3) start = Math.max(0, totalPages - 5);
    for (let i = start; i <= end; i++) {
        paginationBar.append('<li class="page-item' + (i === currentPage ? ' active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + (i + 1) + '</a></li>');
    }
    // Next button
    paginationBar.append('<li class="page-item' + (pageData.last ? ' disabled' : '') + '"><a class="page-link" href="#" data-page="' + (currentPage + 1) + '">Next</a></li>');
}

// Handle pagination bar click
$(document).on('click', '#userPaginationBar a.page-link', function(e) {
    e.preventDefault();
    var page = parseInt($(this).data('page'));
    if (!isNaN(page) && page >= 0 && page !== window.userCurrentPage) {
        window.userCurrentPage = page;
        loadUsers();
    }
});


function editUser(id) {
    // TODO: AJAX call to get user by id
    $.ajax({
        url: '/api/users/' + id,
        method: 'GET',
        success: function(user) {
            showUserForm(user);
        },
        error: function() {
            alert('Failed to load user data.');
        }
    });
}

function deleteUser(id) {
    if(confirm('Delete this user?')) {
        $.ajax({
            url: '/api/users/' + id,
            method: 'DELETE',
            success: function() {
                loadUsers();
            },
            error: function(xhr) {
                alert('Failed to delete user. ' + (xhr.responseText || ''));
            }
        });
    }
}

function loadEmployeeOptions(selectedId) {
    // Support pagination for employee dropdown
    var employeePage = 0;
    var employeeSize = 30;
    function fetchEmployees(page) {
        $.ajax({
            url: `/api/employees?page=${page}&size=${employeeSize}`,
            method: 'GET',
            success: function(data) {
                var employees = data.content || [];
                var options = employees.map(function(e) {
                    return `<option value='${e.id}' ${selectedId == e.id ? 'selected' : ''}>${e.fullname}</option>`;
                }).join('');
                // If first page, set options; else, append
                if (page === 0) {
                    $('#userEmployeeSelect').html(options);
                } else {
                    $('#userEmployeeSelect').append(options);
                }
                // Add Load More button if more pages
                if (!data.last) {
                    if ($('#loadMoreEmployeeBtn').length === 0) {
                        $('#userEmployeeSelect').after('<button type="button" class="btn btn-link" id="loadMoreEmployeeBtn">Load More</button>');
                    }
                    $('#loadMoreEmployeeBtn').off('click').on('click', function() {
                        employeePage++;
                        fetchEmployees(employeePage);
                    });
                } else {
                    $('#loadMoreEmployeeBtn').remove();
                }
            },
            error: function() {
                $('#userEmployeeSelect').html('<option value="">Failed to load employees</option>');
                $('#loadMoreEmployeeBtn').remove();
            }
        });
    }
    // Initial fetch
    fetchEmployees(employeePage);
}

// Load users when user tab is shown
$(document).on('shown.bs.tab', '#user-tab', function() {
    loadUsers();
});
