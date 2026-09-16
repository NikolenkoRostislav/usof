import * as likeModel from '../models/like.js';
import * as likeView from '../views/like.js';

export async function loadLikes() {
    try {
        const {
            postId,
            commentId
        } = likeView.getFilters();

        const [
            postLikes,
            commentLikes
        ] = await Promise.all([
            likeModel.getPostLikes(postId),
            likeModel.getCommentLikes(commentId)
        ]);

        likeView.renderPostLikes(postLikes);
        likeView.renderCommentLikes(commentLikes);
    } catch (error) {
        likeView.renderError(error.message);
    }
}

export async function deleteLike(likeId) {
    if (!confirm('Are you sure?')) {
        return;
    }

    try {
        await likeModel.deleteLike(likeId);

        await loadLikes();
    } catch (error) {
        alert(`Failed to delete like: ${error.message}`);
    }
}