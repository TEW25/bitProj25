// Redirect to login page if not logged in
async function checkLogin() {
    try {
        const response = await fetch('/api/auth/status');
        if (!response.ok) {
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        if (data.designation_id !== 1 && data.designation_id !== 2) {
            window.location.href = '/login';
            return;
        }
    } catch (e) {
        window.location.href = '/login';
    }
}

// Call checkLogin() on every protected page (not on login page)
// Example usage: add <script src="/checkLogin.js"></script> to protected pages
