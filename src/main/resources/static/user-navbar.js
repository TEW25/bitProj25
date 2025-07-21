// User info and logout logic for navbar
async function updateNavbarUser() {
    try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
            const data = await response.json();
            if (data.fullname) {
                document.getElementById('navbar-username').textContent = data.fullname;
            }
        } else {
            document.getElementById('navbar-username').textContent = 'User';
        }
    } catch (e) {
        document.getElementById('navbar-username').textContent = 'User';
    }
}

// Logout handler
function setupLogoutBtn() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            // Change the request method to GET to match the server-side endpoint
            await fetch('/api/auth/logout', { method: 'GET' });
            window.location.href = '/login';
        });
    }
}

// Dropdown logic for user area
function setupUserDropdown() {
    const userArea = document.getElementById('navbar-user-area');
    const dropdown = document.getElementById('logout-dropdown');
    if (!userArea || !dropdown) return;
    let isOpen = false;
    function openDropdown() {
        dropdown.style.display = 'block';
        isOpen = true;
    }
    function closeDropdown() {
        dropdown.style.display = 'none';
        isOpen = false;
    }
    userArea.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !userArea.contains(e.target) && !dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
}

// Run on nav load
if (document.getElementById('navbar-username')) {
    updateNavbarUser();
    setupLogoutBtn();
    setupUserDropdown();
}
