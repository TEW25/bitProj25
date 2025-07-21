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
    // TODO: AJAX call to fetch users
    // Example static data:
    $.ajax({
        url: '/api/users',
        method: 'GET',
        success: function(users) {
            // Fetch user statuses for mapping
            $.ajax({
                url: '/api/userstatus',
                method: 'GET',
                success: function(statuses) {
                    var statusMap = {};
                    statuses.forEach(function(s) { statusMap[s.id] = s.name; });
                    var rows = users.map(function(u, i) {
                        var statusName = statusMap[u.status] || u.status || '';
                        return `<tr>
                            <td>${i+1}</td>
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
                },
                error: function() {
                    $('#userTableBody').html('<tr><td colspan="5">Failed to load user statuses.</td></tr>');
                }
            });
        },
        error: function() {
            $('#userTableBody').html('<tr><td colspan="5">Failed to load users.</td></tr>');
        }
    });
}

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
        // TODO: AJAX call to delete user
        alert('User deleted (not really, demo only).');
        loadUsers();
    }
}

function loadEmployeeOptions(selectedId) {
    // AJAX call to fetch employees from backend
    $.ajax({
        url: '/api/employees',
        method: 'GET',
        success: function(employees) {
            var options = employees.map(function(e) {
                return `<option value='${e.id}' ${selectedId == e.id ? 'selected' : ''}>${e.fullname}</option>`;
            }).join('');
            $('#userEmployeeSelect').html(options);
        },
        error: function() {
            $('#userEmployeeSelect').html('<option value="">Failed to load employees</option>');
        }
    });
}

// Load users when user tab is shown
$(document).on('shown.bs.tab', '#user-tab', function() {
    loadUsers();
});
