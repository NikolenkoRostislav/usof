import * as userModel from '../models/user.js';
import * as userView from '../views/user.js';
import { showMessage } from '../views/common.js';

export async function loadUsers() {
    try {
        const users = await userModel.getUsers();

        userView.renderUsers(users);
    } catch (error) {
        userView.renderUsersError(error.message);
    }
}

export async function createUser() {
    const user = userView.getCreateFormData();

    if (
        !user.email ||
        !user.password ||
        !user.login ||
        !user.fullName
    ) {
        alert('All fields are required');
        return;
    }

    try {
        await userModel.createUser(user);

        userView.clearCreateForm();

        showMessage(
            'usersSuccess',
            'User created successfully'
        );

        await loadUsers();
    } catch (error) {
        alert(
            `Failed to create user: ${error.message}`
        );
    }
}

export async function openEditUserModal(userId) {
    try {
        const user =
            await userModel.getUser(userId);

        userView.showEditModal(user);
    } catch (error) {
        alert(
            `Error loading user details: ${error.message}`
        );
    }
}

export function closeEditUserModal() {
    userView.closeEditModal();
}

export async function updateUser() {
    const {
        id,
        login,
        fullName
    } = userView.getEditFormData();

    if (!login || !fullName) {
        alert('Login and full name are required');
        return;
    }

    try {
        await userModel.updateUser(
            id,
            login,
            fullName
        );

        userView.closeEditModal();

        showMessage(
            'usersSuccess',
            'User updated successfully'
        );

        await loadUsers();
    } catch (error) {
        alert(
            `Failed to update user: ${error.message}`
        );
    }
}

export async function deleteUser(userId) {
    if (!confirm(
        'Are you sure you want to delete this user? This cannot be undone.'
    )) {
        return;
    }

    try {
        await userModel.deleteUser(userId);

        showMessage(
            'usersSuccess',
            'User deleted successfully'
        );

        await loadUsers();
    } catch (error) {
        alert(
            `Failed to delete user: ${error.message}`
        );
    }
}