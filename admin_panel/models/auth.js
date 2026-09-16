import { api } from './api.js';

export async function checkSession() {
    try {
        await api.get('/users/me');
        return true;
    } catch {
        return false;
    }
}

export function login(login, password) {
    return api.post('/auth/login', {
        login,
        password
    });
}

export function logout() {
    return api.post('/auth/logout');
}