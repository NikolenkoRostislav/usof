import { api } from './api.js';

export function getById(id) {
    return api.get(`/categories/${id}`);
}