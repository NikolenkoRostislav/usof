const Comment = require("../../domain/entities/comment");
const { transactional } = require("../../infra/db/uow");
const { AppError, Kind } = require("../../domain/errors");

async function create(userId, postId, content) {
    return await transactional(_create)(userId, postId, content);
}

async function _create(uow, userId, postId, content) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }
    if (post.status !== "active") {
        throw new AppError(Kind.PermissionDenied, "Cannot comment on this post");
    }

    const comment = new Comment({
        authorId: userId,
        postId,
        content
    });

    const commentsRepo = uow.comments();
    await commentsRepo.save(comment);
    return comment;
}

async function getById(commentId) {
    return await transactional(_getById)(commentId);
}

async function _getById(uow, commentId) {
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment || comment.status === "inactive") {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    return comment;
}

async function getByPostId(postId) {
    return await transactional(_getByPostId)(postId);
}

async function _getByPostId(uow, postId) {
    const postsRepo = uow.posts();
    const post = await postsRepo.findById(postId);

    if (!post) {
        throw new AppError(Kind.NotFound, "Post not found");
    }

    const commentsRepo = uow.comments();
    const comments = await commentsRepo.findByPostId(postId);
    return comments.filter(c => c.status === "active");
}

async function update(commentId, userId, updates) {
    return await transactional(_update)(commentId, userId, updates);
}

async function _update(uow, commentId, userId, updates) {
    const commentsRepo = uow.comments();
    const comment = await commentsRepo.findById(commentId);

    if (!comment) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    if (updates.content !== undefined && comment.authorId !== userId) {
        throw new AppError(Kind.PermissionDenied, "You cannot modify this comment");
    }

    if (updates.content !== undefined) {
        comment.content = updates.content;
    }

    if (updates.status !== undefined && user.role !== "admin") {
        throw new AppError(Kind.PermissionDenied, "You cannot modify this comment's visibility");
    }

    if (updates.status !== undefined) {
        comment.status = updates.status;
    }

    await commentsRepo.save(comment);
    return comment;
}

async function deleteComment(commentId, userId) {
    return await transactional(_deleteComment)(commentId, userId);
}

async function _deleteComment(uow, commentId, userId) {
    const commentsRepo = uow.comments();
    const usersRepo = uow.users();
    const comment = await commentsRepo.findById(commentId);
    const user = await usersRepo.findById(userId);

    if (!comment) {
        throw new AppError(Kind.NotFound, "Comment not found");
    }

    if (!user) {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this comment");
    }

    if (comment.authorId !== userId && user.role !== "admin") {
        throw new AppError(Kind.PermissionDenied, "You cannot delete this comment");
    }

    await commentsRepo.delete(commentId);
}

module.exports = {
    create,
    getById,
    getByPostId,
    update,
    deleteComment
};
