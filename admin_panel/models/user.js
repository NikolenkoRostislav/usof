import { api } from './api.js';

export async function getUsers() {
    const data = await api.get('/users');
    return data.users || [];
}

export function getUser(id) {
    return api.get(`/users/${id}`);
}

export function createUser(user) {
    return api.post('/users', user);
}

export function updateUser(id, login, fullName) {
    return api.patch(`/users/${id}`, {
        login,
        fullName
    });
}

export function deleteUser(id) {
    return api.delete(`/users/${id}`);
}