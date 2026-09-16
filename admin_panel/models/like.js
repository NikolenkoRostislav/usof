import { api } from './api.js';

export async function getPostLikes(postId = '') {
    const url = postId
        ? `/posts/${postId}/likes`
        : '/posts/likes';

    const data = await api.get(url);
    return data.likes || [];
}

export async function getCommentLikes(commentId = '') {
    const url = commentId
        ? `/comments/${commentId}/likes`
        : '/comments/likes';

    const data = await api.get(url);
    return data.likes || [];
}

export function deleteLike(id) {
    return api.delete(`/likes/${id}`);
}