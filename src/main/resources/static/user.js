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
                            <label>Username</label>
                            <input type="text" class="form-control" name="username" value="${user ? user.username : ''}" required>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Email</label>
                            <input type="email" class="form-control" name="email" value="${user ? user.email : ''}" required>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Status</label>
                            <select class="form-control" name="status">${statusOptions}</select>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Employee</label>
                            <select class="form-control" name="employee_id" id="userEmployeeSelect"></select>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label>Password</label>
                            <input type="password" class="form-control" name="password" ${user ? '' : 'required'}>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success">${user ? 'Update' : 'Add'} User</button>
                </form>
            `;
            $('#userFormContainer').html(formHtml);
            loadEmployeeOptions(user ? user.employee_id : null);
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
    // TODO: AJAX call to save user
    alert('User save not implemented.');
    var modalEl = document.getElementById('userFormModal');
    var modal = bootstrap.Modal.getInstance(modalEl);
    if(modal) modal.hide();
    loadUsers();
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
                            <td>${u.email || ''}</td>
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
                    $('#userTableBody').html('<tr><td colspan="6">Failed to load user statuses.</td></tr>');
                }
            });
        },
        error: function() {
            $('#userTableBody').html('<tr><td colspan="6">Failed to load users.</td></tr>');
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
    // TODO: AJAX call to fetch employees
    var employees = [
        {id:1, fullname:'John Doe'},
        {id:2, fullname:'Jane Smith'}
    ];
    var options = employees.map(function(e) {
        return `<option value='${e.id}' ${selectedId == e.id ? 'selected' : ''}>${e.fullname}</option>`;
    }).join('');
    $('#userEmployeeSelect').html(options);
}

// Load users when user tab is shown
$(document).on('shown.bs.tab', '#user-tab', function() {
    loadUsers();
});
