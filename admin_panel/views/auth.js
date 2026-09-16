export function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

export function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

export function getLoginFormData() {
    return {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };
}

export function resetLoginForm() {
    document.getElementById('loginForm').reset();
}

export function showLoginError(message) {
    const element = document.getElementById('loginError');

    element.textContent = message;
    element.style.display = 'block';
}

export function clearLoginError() {
    const element = document.getElementById('loginError');

    element.textContent = '';
    element.style.display = 'none';
}