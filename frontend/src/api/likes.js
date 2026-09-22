import { api } from './api.js';

export function postByPostId(post_id, type) {
    return api.post(`/posts/${post_id}/likes`, { type });
}

export function deleteByPostId(post_id) {
    return api.delete(`/posts/${post_id}/likes`);
}

export function getByPostId(post_id) {
    return api.get(`/posts/${post_id}/likes`);
}

export function postByCommentId(comment_id, type) {
    return api.post(`/comments/${comment_id}/likes`, { type });
}

export function deleteByCommentId(comment_id) {
    return api.delete(`/comments/${comment_id}/likes`);
}

export function getByCommentId(comment_id) {
    return api.get(`/comments/${comment_id}/likes`);
}

export function deleteById(id) {
    return api.delete(`/likes/${id}`);
}
