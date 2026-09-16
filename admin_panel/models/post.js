import { api } from './api.js';

export async function getPosts() {
    const data = await api.get('/posts');
    return data.posts || [];
}

export function getPost(id) {
    return api.get(`/posts/${id}`);
}

export function createPost(title, content, categories) {
    return api.post('/posts', {
        title,
        content,
        categories
    });
}

export function updatePost(id, status, categories) {
    return api.patch(`/posts/${id}`, {
        status,
        categories
    });
}

export function deletePost(id) {
    return api.delete(`/posts/${id}`);
}

export async function getPostLikes(id) {
    const data = await api.get(`/posts/${id}/likes`);
    return data.likes || [];
}