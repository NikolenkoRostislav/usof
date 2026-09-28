import { api } from './api.js';

export function post(post_id, content, quoteId) {
    return api.post(`/posts/${post_id}/comments`, { content, quoteId });
}

export function getByPostId(post_id) {
    return api.get(`/posts/${post_id}/comments`);
}

export function getById(id) {
    return api.get(`/comments/${id}`);
}

export function deleteById(id) {
    return api.delete(`/comments/${id}`);
}

export function patchById(id, data) {
    return api.patch(`/comments/${id}`, data);
}