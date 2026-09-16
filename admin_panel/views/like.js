import { escapeHtml } from './common.js';

export function getFilters() {
    return {
        postId: document.getElementById('postIdFilter')?.value.trim() || '',
        commentId: document.getElementById('commentIdFilter')?.value.trim() || ''
    };
}

export function renderPostLikes(likes) {
    const container = document.getElementById('postLikesList');

    document.getElementById('postLikesCount').textContent =
        `(${likes.length})`;

    if (likes.length === 0) {
        container.innerHTML =
            '<div class="no-data">No post likes found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Post ID</th>
                    <th>Author ID</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${likes.map(like => `
                <tr>
                    <td>${escapeHtml(like.id)}</td>
                    <td>${escapeHtml(like.postId)}</td>
                    <td>${escapeHtml(like.authorId)}</td>
                    <td>${escapeHtml(like.type || 'like')}</td>
                    <td class="action-buttons">
                        <button
                            class="btn-small btn-delete"
                            onclick="deleteLike('${like.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export function renderCommentLikes(likes) {
    const container = document.getElementById('commentLikesList');

    document.getElementById('commentLikesCount').textContent =
        `(${likes.length})`;

    if (likes.length === 0) {
        container.innerHTML =
            '<div class="no-data">No comment likes found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Comment ID</th>
                    <th>Author ID</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${likes.map(like => `
                <tr>
                    <td>${escapeHtml(like.id)}</td>
                    <td>${escapeHtml(like.commentId)}</td>
                    <td>${escapeHtml(like.authorId)}</td>
                    <td>${escapeHtml(like.type || 'like')}</td>
                    <td class="action-buttons">
                        <button
                            class="btn-small btn-delete"
                            onclick="deleteLike('${like.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
`;
}

export function renderError(message) {
    const html =
        `<div class="error-message">${escapeHtml(message)}</div>`;

    document.getElementById('postLikesList').innerHTML = html;
    document.getElementById('commentLikesList').innerHTML = html;
}