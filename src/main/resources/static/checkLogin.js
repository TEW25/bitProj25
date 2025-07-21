// Redirect to login page if not logged in
async function checkLogin() {
    try {
        const response = await fetch('/api/auth/status');
        if (!response.ok) {
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        // If designation_id is 2, redirect to /inventory and block /employee
        if (data.designation_id === 2) {
            if (window.location.pathname.startsWith('/employee')) {
                window.location.href = '/inventory';
                return;
            }
        } else if (data.designation_id !== 1) {
            // Only redirect to /sales if not already on the sales page
            if (!window.location.pathname.startsWith('/sales')) {
                window.location.href = '/sales';
            }
            // If already on /sales, do nothing (allow access)
            return;
        }
    } catch (e) {
        window.location.href = '/login';
    }
}

