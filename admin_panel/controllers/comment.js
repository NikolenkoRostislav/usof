import * as commentModel from '../models/comment.js';
import * as commentView from '../views/comment.js';

export async function loadComments() {
    try {
        const postId =
            commentView.getPostIdFilter();

        const comments =
            await commentModel.getComments(postId);

        commentView.renderComments(comments);
    } catch (error) {
        commentView.renderCommentsError(error.message);
    }
}

export async function toggleCommentStatus(
    commentId,
    newStatus
) {
    try {
        await commentModel.updateCommentStatus(
            commentId,
            newStatus
        );

        await loadComments();
    } catch (error) {
        alert(
            `Failed to update comment status: ${error.message}`
        );
    }
}

export async function deleteComment(commentId) {
    if (!confirm(
        'Are you sure you want to delete this comment?'
    )) {
        return;
    }

    try {
        await commentModel.deleteComment(commentId);

        await loadComments();
    } catch (error) {
        alert(
            `Failed to delete comment: ${error.message}`
        );
    }
}