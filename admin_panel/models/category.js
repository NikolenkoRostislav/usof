import { api } from './api.js';

export async function getCategories() {
    const data = await api.get('/categories');
    return data.categories || [];
}

export function getCategory(id) {
    return api.get(`/categories/${id}`);
}

export function createCategory(title, description) {
    return api.post('/categories', {
        title,
        description
    });
}

export function updateCategory(id, title, description) {
    return api.patch(`/categories/${id}`, {
        title,
        description
    });
}

export function deleteCategory(id) {
    return api.delete(`/categories/${id}`);
}