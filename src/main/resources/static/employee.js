// employee.js
// Handles employee management tab actions: load, add, edit, delete employees


$(document).on('click', '#addEmployeeBtn', function() {
    showEmployeeForm();
});

function showEmployeeForm(employee) {
    var formHtml = `
        <form id="employeeForm">
            <input type="hidden" name="id" value="${employee ? employee.id : ''}">
            <div class="row">
                <div class="col-md-6 mb-2">
                    <label>Employee Number</label>
                    <input type="text" class="form-control" name="employee_number" value="${employee ? employee.employee_number : ''}" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label>Full Name</label>
                    <input type="text" class="form-control" name="fullname" value="${employee ? employee.fullname : ''}" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label>NIC</label>
                    <input type="text" class="form-control" name="nic" value="${employee ? employee.nic : ''}" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label>Gender</label>
                    <select class="form-control" name="gender">
                        <option value="Male" ${employee && employee.gender == 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${employee && employee.gender == 'Female' ? 'selected' : ''}>Female</option>
                    </select>
                </div>
                <div class="col-md-6 mb-2">
                    <label>DOB</label>
                    <input type="date" class="form-control" name="dob" value="${employee ? employee.dob : ''}" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label>Mobile Number</label>
                    <input type="text" class="form-control" name="mobilenumber" value="${employee ? employee.mobilenumber : ''}" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label>Email</label>
                    <input type="email" class="form-control" name="email" value="${employee ? employee.email : ''}" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label>Designation</label>
                    <select class="form-control" name="designation_id" id="employeeDesignationSelect"></select>
                </div>
                <div class="col-md-6 mb-2">
                    <label>Status</label>
                    <select class="form-control" name="employeestatus_id" id="employeeStatusSelect"></select>
                </div>
            </div>
            <button type="submit" class="btn btn-success">${employee ? 'Update' : 'Add'} Employee</button>
        </form>
    `;
    $('#employeeFormContainer').html(formHtml);
    loadDesignationOptions(employee ? employee.designation_id : null);
    loadStatusOptions(employee ? employee.employeestatus_id : null);
    var modal = new bootstrap.Modal(document.getElementById('employeeFormModal'));
    modal.show();
}


// No cancel button needed, modal close button is used

$(document).on('submit', '#employeeForm', function(e) {
    e.preventDefault();
    var formData = {};
    var errors = [];
    $('#employeeForm').serializeArray().forEach(function(item) {
        formData[item.name] = item.value.trim();
    });

    // Employee Number: required, alphanumeric, length 2-20
    if (!formData.employee_number || !/^[a-zA-Z0-9\-]{2,20}$/.test(formData.employee_number)) {
        errors.push('Employee Number is required (2-20 chars, alphanumeric or dash).');
    }
    // Full Name: required, letters and spaces, 2-50 chars
    if (!formData.fullname || !/^[a-zA-Z\s]{2,50}$/.test(formData.fullname)) {
        errors.push('Full Name is required (2-50 letters).');
    }
    // NIC: required, 10-12 chars, alphanumeric
    if (!formData.nic || !/^[a-zA-Z0-9]{10,12}$/.test(formData.nic)) {
        errors.push('NIC is required (10-12 alphanumeric characters).');
    }
    // Gender: required, must be Male or Female
    if (!formData.gender || !['Male','Female'].includes(formData.gender)) {
        errors.push('Gender is required.');
    }
    // DOB: required, must be a valid date, age 18-65
    if (!formData.dob) {
        errors.push('Date of Birth is required.');
    } else {
        var dob = new Date(formData.dob);
        var today = new Date();
        var age = today.getFullYear() - dob.getFullYear();
        var m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (isNaN(dob.getTime()) || age < 18 || age > 65) {
            errors.push('DOB must be valid and age between 18 and 65.');
        }
    }
    // Mobile Number: required, 10 digits, starts with 0
    if (!formData.mobilenumber || !/^0\d{9}$/.test(formData.mobilenumber)) {
        errors.push('Mobile Number is required (10 digits, starts with 0).');
    }
    // Email: required, valid format
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.push('Valid Email is required.');
    }
    // Designation: required, must be a number
    if (!formData.designation_id || isNaN(Number(formData.designation_id))) {
        errors.push('Designation is required.');
    }
    // Status: required, must be a number
    if (!formData.employeestatus_id || isNaN(Number(formData.employeestatus_id))) {
        errors.push('Status is required.');
    }

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    var isEdit = formData.id && formData.id !== '';
    var method = isEdit ? 'PUT' : 'POST';
    var url = '/api/employees' + (isEdit ? '/' + formData.id : '');
    // Remove empty id for POST
    if (!isEdit) delete formData.id;
    $.ajax({
        url: url,
        method: method,
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function() {
            var modalEl = document.getElementById('employeeFormModal');
            var modal = bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();
            loadEmployees();
        },
        error: function(xhr) {
            alert('Failed to save employee. ' + (xhr.responseText || ''));
        }
    });
});

function loadStatusOptions(selectedId) {
    // Fetch statuses from backend
    $.ajax({
        url: '/api/employeestatus',
        method: 'GET',
        success: function(statuses) {
            var options = statuses.map(function(s) {
                return `<option value='${s.id}' ${selectedId == s.id ? 'selected' : ''}>${s.name}</option>`;
            }).join('');
            $('#employeeStatusSelect').html(options);
        },
        error: function() {
            $('#employeeStatusSelect').html('<option value="">Failed to load statuses</option>');
        }
    });
}

function loadDesignationOptions(selectedId) {
    // Fetch designations from backend
    $.ajax({
        url: '/api/designations',
        method: 'GET',
        success: function(designations) {
            var options = designations.map(function(d) {
                return `<option value='${d.id}' ${selectedId == d.id ? 'selected' : ''}>${d.name}</option>`;
            }).join('');
            $('#employeeDesignationSelect').html(options);
        },
        error: function() {
            $('#employeeDesignationSelect').html('<option value="">Failed to load designations</option>');
        }
    });
}

function loadEmployees() {
    // Fetch employees, statuses, and designations, then render table with names
    $.ajax({
        url: '/api/employees',
        method: 'GET',
        success: function(employees) {
            $.ajax({
                url: '/api/employeestatus',
                method: 'GET',
                success: function(statuses) {
                    var statusMap = {};
                    statuses.forEach(function(s) { statusMap[s.id] = s.name; });
                    $.ajax({
                        url: '/api/designations',
                        method: 'GET',
                        success: function(designations) {
                            var designationMap = {};
                            designations.forEach(function(d) { designationMap[d.id] = d.name; });
                            var rows = employees.map(function(e, i) {
                                var statusName = statusMap[e.employeestatus_id] || e.employeestatus_id || '';
                                var designationName = designationMap[e.designation_id] || e.designation_id || '';
                                return `<tr>
                                    <td>${i+1}</td>
                                    <td>${e.employee_number || ''}</td>
                                    <td>${e.fullname || ''}</td>
                                    <td>${e.nic || ''}</td>
                                    <td>${e.gender || ''}</td>
                                    <td>${e.dob || ''}</td>
                                    <td>${e.mobilenumber || ''}</td>
                                    <td>${e.email || ''}</td>
                                    <td>${designationName}</td>
                                    <td>${statusName}</td>
                                    <td>
                                        <button class='btn btn-sm btn-info' onclick='editEmployee(${e.id})'>Edit</button>
                                        <button class='btn btn-sm btn-danger' onclick='deleteEmployee(${e.id})'>Delete</button>
                                    </td>
                                </tr>`;
                            }).join('');
                            $('#employeeTableBody').html(rows);
                        },
                        error: function() {
                            $('#employeeTableBody').html('<tr><td colspan="11">Failed to load designations.</td></tr>');
                        }
                    });
                },
                error: function() {
                    $('#employeeTableBody').html('<tr><td colspan="11">Failed to load statuses.</td></tr>');
                }
            });
        },
        error: function() {
            $('#employeeTableBody').html('<tr><td colspan="11">Failed to load employees.</td></tr>');
        }
    });
}

function editEmployee(id) {
    $.ajax({
        url: '/api/employees/' + id,
        method: 'GET',
        success: function(employee) {
            showEmployeeForm(employee);
        },
        error: function() {
            alert('Failed to load employee data.');
        }
    });
}

function deleteEmployee(id) {
    if(confirm('Delete this employee?')) {
        // TODO: AJAX call to delete employee
        alert('Employee deleted (not really, demo only).');
        loadEmployees();
    }
}

// Only one definition for each function, both using AJAX
function loadDesignationOptions(selectedId) {
    $.ajax({
        url: '/api/designations',
        method: 'GET',
        success: function(designations) {
            var options = designations.map(function(d) {
                return `<option value='${d.id}' ${selectedId == d.id ? 'selected' : ''}>${d.name}</option>`;
            }).join('');
            $('#employeeDesignationSelect').html(options);
        },
        error: function() {
            $('#employeeDesignationSelect').html('<option value="">Failed to load designations</option>');
        }
    });
}

function loadStatusOptions(selectedId) {
    $.ajax({
        url: '/api/employeestatus',
        method: 'GET',
        success: function(statuses) {
            var options = statuses.map(function(s) {
                return `<option value='${s.id}' ${selectedId == s.id ? 'selected' : ''}>${s.name}</option>`;
            }).join('');
            $('#employeeStatusSelect').html(options);
        },
        error: function() {
            $('#employeeStatusSelect').html('<option value="">Failed to load statuses</option>');
        }
    });
}

// Load employees when employee tab is shown
$(document).on('shown.bs.tab', '#employee-tab', function() {
    loadEmployees();
});

// Initial load if tab is default
$(document).ready(function() {
    if($('#employeeTabPane').length) loadEmployees();
});
