import { api } from './api.js';

export function post(post_id, content) {
    return api.post(`/posts/${post_id}/comments`, { content });
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

export function patchById(id, content, status) {
    return api.patch(`/comments/${id}`, { content, status });
}