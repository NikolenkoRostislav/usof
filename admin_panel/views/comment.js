import { escapeHtml } from './common.js';

export function getPostIdFilter() {
    return document.getElementById('commentPostIdFilter')?.value.trim() || '';
}

export function renderComments(comments) {
    const container = document.getElementById('commentsList');

    if (comments.length === 0) {
        container.innerHTML = '<div class="no-data">No comments found</div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Author ID</th>
                    <th>Content</th>
                    <th>Post ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${comments.map(comment => {
        const status = comment.status || 'active';
        const newStatus = status === 'active' ? 'inactive' : 'active';

        const buttonLabel = status === 'active' ? 'Mark Inactive' : 'Mark Active';

        return `
                <tr>
                    <td>${escapeHtml(comment.id)}</td>
                    <td>${escapeHtml(comment.authorId)}</td>
                    <td>${escapeHtml(comment.content || '')}</td>
                    <td>${escapeHtml(comment.postId)}</td>
                    <td>${escapeHtml(status)}</td>
                    <td class="action-buttons">
                        <button
                            class="btn-small btn-edit"
                            onclick="toggleCommentStatus(
                                '${comment.id}',
                                '${newStatus}'
                            )">
                            ${buttonLabel}
                        </button>
                        <button
                            class="btn-small btn-delete"
                            onclick="deleteComment('${comment.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
        `;
    }).join('')}
            </tbody>
        </table>
    `;
}

export function renderCommentsError(message) {
    document.getElementById('commentsList').innerHTML =
        `<div class="error-message">${escapeHtml(message)}</div>`;
}