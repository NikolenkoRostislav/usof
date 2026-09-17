import { escapeHtml } from './common.js';

export function getCreateFormData() {
    return {
        email: document.getElementById('newUserEmail').value.trim(),
        password: document.getElementById('newUserPassword').value.trim(),
        login: document.getElementById('newUserLogin').value.trim(),
        fullName: document.getElementById('newUserFullName').value.trim(),
        role: document.getElementById('newUserRole')?.value || 'user'
    };
}

export function clearCreateForm() {
    document.getElementById('newUserEmail').value = '';
    document.getElementById('newUserPassword').value = '';
    document.getElementById('newUserLogin').value = '';
    document.getElementById('newUserFullName').value = '';

    const role = document.getElementById('newUserRole');

    if (role) {
        role.value = 'user';
    }
}

export function renderUsers(users) {
    const container = document.getElementById('usersList');

    if (users.length === 0) {
        container.innerHTML = '<div class="no-data">No users found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Login</th>
                    <th>Full Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                <tr>
                    <td>${escapeHtml(user.login)}</td>
                    <td>${escapeHtml(user.fullName || '')}</td>
                    <td>${escapeHtml(user.role)}</td>
                    <td class="action-buttons">
                        <button
                            class="btn-small btn-edit"
                            onclick="openEditUserModal('${user.id}')">
                            Edit
                        </button>
                        <button
                            class="btn-small btn-delete"
                            onclick="deleteUser('${user.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export function renderUsersError(message) {
    document.getElementById('usersList').innerHTML =
        `<div class="error-message">${escapeHtml(message)}</div>`;
}

export function getEditFormData() {
    return {
        id: document.getElementById('editUserId').value,
        login: document.getElementById('editUserLogin').value.trim(),
        fullName: document.getElementById('editUserFullName').value.trim()
    };
}

export function showEditModal(user) {
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserLogin').value = user.login;
    document.getElementById('editUserFullName').value = user.fullName || '';
    document.getElementById('editUserModal').style.display = 'block';
}

export function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
}