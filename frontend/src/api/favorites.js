import { api } from './api.js';

export function getAll() {
    return api.get(`/favorites`);
}

export function checkByPostId(post_id) {
    return api.get(`/favorites/${post_id}`);
}

export function deleteByPostId(post_id) {
    return api.delete(`/favorites/${post_id}`);
}

export function postByPostId(post_id) {
    return api.post(`/favorites/${post_id}`);
}
