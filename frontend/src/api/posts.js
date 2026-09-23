import { api } from './api.js';

export function get(params = {}) {
    const query = new URLSearchParams();

    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.categories?.length) query.set('categories', params.categories.join(','));
    if (params.authorId) query.set('authorId', params.authorId);
    if (params.title) query.set('title', params.title);
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (params.page !== undefined) query.set('page', params.page);

    const queryString = query.toString();

    return api.get(`/posts${queryString ? `?${queryString}` : ''}`);
}

export function getById(id) {
    return api.get(`/posts/${id}`);
}

export function deleteById(id) {
    return api.delete(`/posts/${id}`);
}

export function patchById(id, title, content, status, categories) {
    return api.patch(`/posts/${id}`, { title, content, status, categories });
}

export function post(title, content, categories) {
    return api.post(`/posts`, { title, content, categories });
}

export function getByCategoryId(id, params = {}) {
    const query = new URLSearchParams();

    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.page !== undefined) query.set('page', params.page);

    const queryString = query.toString();

    return api.get(`/categories/${id}/posts${queryString ? `?${queryString}` : ''}`);
}
