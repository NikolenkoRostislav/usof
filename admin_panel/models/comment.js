import { api } from './api.js';

export async function getComments(postId = '') {
    const url = postId
        ? `/posts/${postId}/comments`
        : '/comments';

    const data = await api.get(url);
    return data.comments || [];
}

export function updateCommentStatus(id, status) {
    return api.patch(`/comments/${id}`, {
        status
    });
}

export function deleteComment(id) {
    return api.delete(`/comments/${id}`);
}