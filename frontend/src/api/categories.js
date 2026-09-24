import { api } from './api.js';

export function getAll() {
    return api.get(`/categories`);
}

export function getById(id) {
    return api.get(`/categories/${id}`);
}