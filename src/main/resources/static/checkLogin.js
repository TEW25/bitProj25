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

