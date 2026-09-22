import { api } from './api.js';

export function register(login, password, password_confirmation, email, fullName) {
    return api.post('/auth/register', { login, password, password_confirmation, email, fullName });
}

export function confirmRegistration(email, confirm_token) {
    return api.post('/auth/confirm-register', { email, confirm_token });
}

export function login(login, password) {
    return api.post('/auth/login', { login, password });
}

export function logout() {
    return api.post('/auth/logout');
}

export function resetPassword(email, new_password) {
    return api.post('/auth/password-reset', { email, new_password });
}

export function confirmPasswordReset(email, confirm_token) {
    return api.post('/auth/confirm-password-reset', { email, confirm_token });
}