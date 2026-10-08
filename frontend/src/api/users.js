import { api, API_URL } from './api.js';

export function getById(id) {
    return api.get(`/users/${id}`);
}

export function deleteById(id) {
    return api.delete(`/users/${id}`);
}

export function patchById(id, login, fullName) {
    return api.patch(`/users/${id}`, { login, fullName });
}

export function getMe() {
    return api.get('/users/me');
}

export function deleteAvatarById(id) {
    return api.delete(`/users/${id}/avatar`);
}

export async function getAvatarById(id) {
    const blob = await api.getBlob(`/users/${id}/avatar`);
    return URL.createObjectURL(blob);
}

export function updateAvatar(id, file) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${API_URL}/users/${id}/avatar`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData
    });
}
