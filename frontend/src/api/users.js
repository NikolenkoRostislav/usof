import { api } from './api.js';

export function getById(id) {
    return api.get(`/users/${id}`);
}

export function deleteById(id) {
    return api.delete(`/users/${id}`);
}

export function patchById(id, login, email, fullName) {
    return api.patch(`/users/${id}`, { login, email, fullName });
}


export function getMe() {
    return api.get('/users/me');
}

// todo: add avatar endoints