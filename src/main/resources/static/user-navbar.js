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

// Run on nav load
if (document.getElementById('navbar-username')) {
    updateNavbarUser();
    setupLogoutBtn();
}
