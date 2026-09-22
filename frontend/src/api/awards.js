import { api } from './api.js';

export function postByPostId(post_id, award_id) {
    return api.post(`/posts/${post_id}/awards`, { award_id });
}

export function getByPostId(post_id) {
    return api.get(`/posts/${post_id}/awards`);
}

export function getOwned() {
    return api.get(`/awards/me`);
}
