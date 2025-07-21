document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msgDiv = document.getElementById('loginMsg');
    msgDiv.textContent = '';
    msgDiv.className = 'mt-3 text-center';
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            msgDiv.textContent = 'Login successful!';
            msgDiv.classList.add('text-success');
            // Forward to /dashboard after a successful login
            window.location.href = '/dashboard';
        } else {
            const errorText = await response.text();
            msgDiv.textContent = errorText || 'Login failed!';
            msgDiv.classList.add('text-danger');
        }
    } catch (err) {
        msgDiv.textContent = 'Network error!';
        msgDiv.classList.add('text-danger');
    }
});
